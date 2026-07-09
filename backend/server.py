from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
import bcrypt
import jwt
import mimetypes
import cloudinary
import cloudinary.uploader
from datetime import datetime, timezone, timedelta
from typing import List, Optional

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File, Response, Header, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

# ---------- Config ----------
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
ADMIN_USERNAME = os.environ['ADMIN_USERNAME']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
EMERGENT_KEY = os.environ.get('EMERGENT_LLM_KEY')
APP_NAME = os.environ.get('APP_NAME', 'amazing-groups')

cloudinary.config(
    cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
    api_key=os.environ["CLOUDINARY_API_KEY"],
    api_secret=os.environ["CLOUDINARY_API_SECRET"],
    secure=True
)

JWT_ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def init_storage():
    logger.warning("Object storage integration disabled. Uploads will use local filesystem storage.")
    return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    upload_result = cloudinary.uploader.upload(
        data,
        public_id=path,
        resource_type="auto",
        overwrite=True
    )

    return {
        "path": upload_result["public_id"],
        "url": upload_result["secure_url"]
    }


def get_object(path: str):
    raise HTTPException(
        status_code=410,
        detail="Local file storage disabled. Use Cloudinary URLs."
    )


# ---------- Auth helpers ----------

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = None
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Forbidden")
        return {"username": payload["sub"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------

class LoginInput(BaseModel):
    username: str
    password: str


class SliderIn(BaseModel):
    title: str
    highlight: Optional[str] = ""
    subtitle: Optional[str] = ""
    image_url: str
    cta_label: Optional[str] = "Explore"
    cta_link: Optional[str] = "#categories"
    order: int = 0


class CategoryIn(BaseModel):
    name: str
    slug: Optional[str] = ""
    description: Optional[str] = ""
    image_url: str
    status: Optional[str] = "active"
    sort_order: int = 0

class SubcategoryIn(BaseModel):
    category_id: str
    name: str
    slug: Optional[str] = ""
    description: Optional[str] = ""
    image_url: str
    status: Optional[str] = "active"
    sort_order: int = 0


class PriceTier(BaseModel):
    qty: str
    price: str


class Testimonial(BaseModel):
    name: str
    role: str
    avatar: str
    body: str

class SiteSettingsIn(BaseModel):
    bulk_pricing: List[PriceTier] = []

    trusted_clients_title: str = "Trusted by Businesses Across India"

    trusted_clients_brands: List[str] = [
        "TATA",
        "Infosys",
        "HDFC BANK",
        "ICICI Bank",
        "Deloitte",
        "Wipro",
    ]

    trusted_clients_stats: str = (
        "We've served 500+ companies for bulk gifting needs."
    )
    whatsapp_url: str = ""
    facebook_url: str = ""
    instagram_url: str = ""
    linkedin_url: str = ""
    youtube_url: str = ""

    testimonials: List[Testimonial] = [
        Testimonial(
        name="Rahul Mehta",
        role="Marketing Head, TechCorp",
        avatar="https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
        body="Excellent quality and on-time delivery. Our go-to partner for corporate gifting!"
        ),
        Testimonial(
            name="Priya Sharma",
            role="HR Manager, Business Mart",
            avatar="https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
            body="The customization and packaging were perfect. Highly recommended!"
        ),
        Testimonial(
            name="Amit Verma",
            role="Procurement Head, BuildMax",
            avatar="https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
            body="Great products at the best prices for bulk orders. Very satisfied!"
        ),
    ]
    announcement_bar_enabled: bool = False
    announcement_bar_text: str = ""
    announcement_bar_color: str = "gold"
    stats_clients: str = "500+"
    stats_years: str = "10+"
    stats_products: str = "1000+"
    stats_cities: str = "50+"


class FAQIn(BaseModel):
    question: str
    answer: str
    order: int = 0


class GalleryItemIn(BaseModel):
    title: str
    description: Optional[str] = ""
    image_url: str
    section: str = "general"
    order: int = 0


class AnalyticsEventIn(BaseModel):
    event_type: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    page: Optional[str] = None


class CollectionIn(BaseModel):
    title: str
    type: str = "custom"          # festival | corporate | industry | custom
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    badge: Optional[str] = ""     # e.g. "Diwali 2025", "New"
    product_ids: List[str] = []
    active: bool = True
    order: int = 0


class PopupIn(BaseModel):
    enabled: bool = False
    title: str = ""
    description: str = ""
    image_url: Optional[str] = ""
    cta_text: str = "WhatsApp Us"
    cta_url: str = ""
    delay_ms: int = 3000


class CallbackRequestIn(BaseModel):
    name: str
    phone: str
    preferred_time: Optional[str] = ""
    note: Optional[str] = ""


class ProductIn(BaseModel):
    category_id: str
    subcategory_id: Optional[str] = ""
    name: str
    slug: Optional[str] = ""
    description: str = ""
    image_url: str
    images: List[str] = []
    video_url: Optional[str] = ""
    price: Optional[str] = ""

    moq: int = 1
    bulk_pricing: List[PriceTier] = []

    featured: bool = False
    badge: Optional[str] = ""
    status: Optional[str] = "active"
    sort_order: int = 0


# ---------- Public Endpoints ----------

@api_router.get("/")
async def root():
    return {"message": "Amazing Groups API", "brand": "Amazing Groups"}


@api_router.get("/sliders")
async def list_sliders():
    items = await db.sliders.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.get("/categories")
async def list_categories():
    items = await db.categories.find({}, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(500)
    return items


@api_router.get("/categories/slug/{slug}")
async def get_category_by_slug(slug: str):
    item = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Category not found")
    return item


@api_router.get("/categories/{category_id}")
async def get_category(category_id: str):
    item = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Category not found")
    return item


@api_router.get("/categories/{category_id}/products")
async def list_category_products(category_id: str):
    items = await db.products.find({"category_id": category_id}, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(500)
    return items


@api_router.get("/subcategories")
async def list_subcategories():
    items = await db.subcategories.find({}, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(500)
    return items


@api_router.get("/subcategories/category/{category_id}")
async def list_subcategories_by_category(category_id: str):
    items = await db.subcategories.find({"category_id": category_id}, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(500)
    return items


@api_router.get("/subcategories/slug/{slug}")
async def get_subcategory_by_slug(slug: str):
    item = await db.subcategories.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return item


@api_router.get("/subcategories/{subcategory_id}")
async def get_subcategory(subcategory_id: str):
    item = await db.subcategories.find_one({"id": subcategory_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return item


@api_router.get("/subcategories/{subcategory_id}/products")
async def list_subcategory_products(subcategory_id: str):
    items = await db.products.find({"subcategory_id": subcategory_id}, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(500)
    return items


@api_router.get("/products")
async def list_products(
    featured: Optional[bool] = None,
    category_id: Optional[str] = None,
    subcategory_id: Optional[str] = None,
    limit: int = 100,
):
    q = {}
    if featured is not None:
        q["featured"] = featured
    if category_id:
        q["category_id"] = category_id
    if subcategory_id:
        q["subcategory_id"] = subcategory_id
    items = await db.products.find(q, {"_id": 0}).sort([("sort_order", 1), ("created_at", 1)]).to_list(limit)
    return items


@api_router.get("/products/slug/{slug}")
async def get_product_by_slug(slug: str):
    item = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    item = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one(
        {"key": "site_settings"},
        {"_id": 0}
    )

    if not settings:
     return {
        "bulk_pricing": [
            {"qty": "100+ pcs", "price": "₹120"},
            {"qty": "500+ pcs", "price": "₹95"},
            {"qty": "1000+ pcs", "price": "₹80"},
            {"qty": "5000+ pcs", "price": "₹65"},
        ],

        "trusted_clients_title": "Trusted by Businesses Across India",

        "trusted_clients_brands": [
            "TATA",
            "Infosys",
            "HDFC BANK",
            "ICICI Bank",
            "Deloitte",
            "Wipro",
        ],

        "trusted_clients_stats":
             "We've served 500+ companies for bulk gifting needs.",

     "whatsapp_url": "",
"facebook_url": "https://facebook.com/amazinggroups",
"instagram_url": "https://www.instagram.com/amazing_groups_/",
"linkedin_url": "https://linkedin.com/company/amazinggroups",
"youtube_url": "https://youtube.com/@amazing_groups?si=fqIoaVZJfSzqcdzY",

"testimonials": [
    {
        "name": "Rahul Mehta",
        "role": "Marketing Head, TechCorp",
        "avatar": "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
        "body": "Excellent quality and on-time delivery. Our go-to partner for corporate gifting!"
    },
    {
        "name": "Priya Sharma",
        "role": "HR Manager, Business Mart",
        "avatar": "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
        "body": "The customization and packaging were perfect. Highly recommended!"
    },
    {
        "name": "Amit Verma",
        "role": "Procurement Head, BuildMax",
        "avatar": "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
        "body": "Great products at the best prices for bulk orders. Very satisfied!"
    }
],
"announcement_bar_enabled": False,
"announcement_bar_text": "",
"announcement_bar_color": "gold",
"stats_clients": "500+",
"stats_years": "10+",
"stats_products": "1000+",
"stats_cities": "50+",
}

    return settings


@api_router.put("/admin/settings")
async def update_settings(
    payload: SiteSettingsIn,
    admin=Depends(get_current_admin)
):
    await db.settings.update_one(
        {"key": "site_settings"},
        {
            "$set": {
    "key": "site_settings",

    "bulk_pricing": [
        tier.model_dump() for tier in payload.bulk_pricing
    ],

    "trusted_clients_title": payload.trusted_clients_title,

    "trusted_clients_brands": payload.trusted_clients_brands,

    "trusted_clients_stats": payload.trusted_clients_stats,

    "whatsapp_url": payload.whatsapp_url,
"facebook_url": payload.facebook_url,
"instagram_url": payload.instagram_url,
"linkedin_url": payload.linkedin_url,
"youtube_url": payload.youtube_url,

"testimonials": [
    t.model_dump() for t in payload.testimonials
],

"announcement_bar_enabled": payload.announcement_bar_enabled,
"announcement_bar_text": payload.announcement_bar_text,
"announcement_bar_color": payload.announcement_bar_color,
"stats_clients": payload.stats_clients,
"stats_years": payload.stats_years,
"stats_products": payload.stats_products,
"stats_cities": payload.stats_cities,

}
        },
        upsert=True,
    )

    return {"ok": True}


# ---------- Auth Endpoints ----------

LOCKOUT_THRESHOLD = 5
LOCKOUT_MINUTES = 15


async def _record_failure(username: str):
    now = datetime.now(timezone.utc)
    await db.login_attempts.update_one(
        {"username": username},
        {"$push": {"failures": now.isoformat()}, "$setOnInsert": {"username": username}},
        upsert=True,
    )


async def _is_locked(username: str) -> bool:
    rec = await db.login_attempts.find_one({"username": username})
    if not rec:
        return False
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=LOCKOUT_MINUTES)
    recent = [f for f in rec.get("failures", []) if datetime.fromisoformat(f) > cutoff]
    return len(recent) >= LOCKOUT_THRESHOLD


async def _clear_failures(username: str):
    await db.login_attempts.delete_one({"username": username})


@api_router.post("/auth/login")
async def login(payload: LoginInput):
    if await _is_locked(payload.username):
        raise HTTPException(
            status_code=429,
            detail=f"Too many failed attempts. Try again in {LOCKOUT_MINUTES} minutes.",
        )
    user = await db.admins.find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await _record_failure(payload.username)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    await _clear_failures(payload.username)
    token = create_token(payload.username)
    return {"token": token, "username": payload.username, "role": "admin"}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- File Upload ----------

@api_router.post("/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    file_id = str(uuid.uuid4())
    path = f"{APP_NAME}/uploads/{file_id}.{ext}"

    data = await file.read()
    content_type = file.content_type or "application/octet-stream"

    result = put_object(path, data, content_type)

    await db.files.insert_one({
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": len(data),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {
        "url": result["url"],
        "path": result["path"]
    }

@api_router.get("/files/{path:path}")
async def get_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))

# ---------- Admin: Sliders CRUD ----------

@api_router.post("/admin/sliders")
async def create_slider(payload: SliderIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.sliders.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/sliders/{slider_id}")
async def update_slider(slider_id: str, payload: SliderIn, admin=Depends(get_current_admin)):
    res = await db.sliders.update_one({"id": slider_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Slider not found")
    item = await db.sliders.find_one({"id": slider_id}, {"_id": 0})
    return item


@api_router.delete("/admin/sliders/{slider_id}")
async def delete_slider(slider_id: str, admin=Depends(get_current_admin)):
    res = await db.sliders.delete_one({"id": slider_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Slider not found")
    return {"ok": True}


# ---------- Admin: Categories CRUD ----------

@api_router.post("/admin/categories")
async def create_category(payload: CategoryIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.categories.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/categories/{category_id}")
async def update_category(category_id: str, payload: CategoryIn, admin=Depends(get_current_admin)):
    res = await db.categories.update_one({"id": category_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    item = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return item


@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, admin=Depends(get_current_admin)):
    res = await db.categories.delete_one({"id": category_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    # cascade delete products and subcategories
    await db.products.delete_many({"category_id": category_id})
    await db.subcategories.delete_many({"category_id": category_id})
    return {"ok": True}


# ---------- Admin: Subcategories CRUD ----------

@api_router.post("/admin/subcategories")
async def create_subcategory(payload: SubcategoryIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.subcategories.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/subcategories/{subcategory_id}")
async def update_subcategory(subcategory_id: str, payload: SubcategoryIn, admin=Depends(get_current_admin)):
    res = await db.subcategories.update_one({"id": subcategory_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    item = await db.subcategories.find_one({"id": subcategory_id}, {"_id": 0})
    return item


@api_router.delete("/admin/subcategories/{subcategory_id}")
async def delete_subcategory(subcategory_id: str, admin=Depends(get_current_admin)):
    res = await db.subcategories.delete_one({"id": subcategory_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    await db.products.delete_many({"subcategory_id": subcategory_id})
    return {"ok": True}


# ---------- Admin: Products CRUD ----------

@api_router.post("/admin/products")
async def create_product(payload: ProductIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, payload: ProductIn, admin=Depends(get_current_admin)):
    res = await db.products.update_one({"id": product_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    item = await db.products.find_one({"id": product_id}, {"_id": 0})
    return item


@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(get_current_admin)):
    res = await db.products.delete_one({"id": product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}


# ---------- Public: FAQs ----------

@api_router.get("/faqs")
async def list_faqs():
    items = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


# ---------- Admin: FAQs CRUD ----------

@api_router.post("/admin/faqs")
async def create_faq(payload: FAQIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.faqs.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/faqs/{faq_id}")
async def update_faq(faq_id: str, payload: FAQIn, admin=Depends(get_current_admin)):
    res = await db.faqs.update_one({"id": faq_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    item = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    return item


@api_router.delete("/admin/faqs/{faq_id}")
async def delete_faq(faq_id: str, admin=Depends(get_current_admin)):
    res = await db.faqs.delete_one({"id": faq_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"ok": True}


# ---------- Public: Gallery ----------

@api_router.get("/gallery")
async def list_gallery(section: Optional[str] = None):
    q = {}
    if section and section != "all":
        q["section"] = section
    items = await db.gallery.find(q, {"_id": 0}).sort("order", 1).to_list(500)
    return items


# ---------- Admin: Gallery CRUD ----------

@api_router.post("/admin/gallery")
async def create_gallery_item(payload: GalleryItemIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.gallery.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/gallery/{item_id}")
async def update_gallery_item(item_id: str, payload: GalleryItemIn, admin=Depends(get_current_admin)):
    res = await db.gallery.update_one({"id": item_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    item = await db.gallery.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/admin/gallery/{item_id}")
async def delete_gallery_item(item_id: str, admin=Depends(get_current_admin)):
    res = await db.gallery.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"ok": True}


# ---------- Public: Analytics ----------

@api_router.post("/analytics/event")
async def track_event(payload: AnalyticsEventIn, request: Request):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.analytics.insert_one(doc)
    return {"ok": True}


# ---------- Admin: Analytics ----------

@api_router.get("/admin/analytics")
async def get_analytics(admin=Depends(get_current_admin)):
    by_type_cursor = db.analytics.aggregate([
        {"$group": {"_id": "$event_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ])
    by_type_raw = await by_type_cursor.to_list(20)
    by_type = {item["_id"]: item["count"] for item in by_type_raw}

    top_products_cursor = db.analytics.aggregate([
        {"$match": {"event_type": "product_view", "product_id": {"$ne": None}}},
        {"$group": {"_id": "$product_id", "name": {"$first": "$product_name"}, "views": {"$sum": 1}}},
        {"$sort": {"views": -1}},
        {"$limit": 5}
    ])
    top_products = await top_products_cursor.to_list(5)

    recent = await db.analytics.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)

    return {
        "by_type": by_type,
        "top_products": [{"product_id": p["_id"], "product_name": p["name"], "count": p["views"]} for p in top_products],
        "recent": recent,
        "total": await db.analytics.count_documents({}),
        "product_views": by_type.get("product_view", 0),
        "whatsapp_clicks": by_type.get("whatsapp_click", 0),
        "call_clicks": by_type.get("call_click", 0),
    }


# ---------- Public: Collections ----------

@api_router.get("/collections")
async def list_collections(type: Optional[str] = None):
    q = {"active": True}
    if type:
        q["type"] = type
    docs = await db.collections.find(q, {"_id": 0}).sort("order", 1).to_list(50)
    return docs


# ---------- Admin: Collections ----------

@api_router.post("/admin/collections")
async def create_collection(payload: CollectionIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.collections.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}


@api_router.put("/admin/collections/{col_id}")
async def update_collection(col_id: str, payload: CollectionIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.collections.update_one({"id": col_id}, {"$set": doc})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"ok": True}


@api_router.delete("/admin/collections/{col_id}")
async def delete_collection(col_id: str, admin=Depends(get_current_admin)):
    res = await db.collections.delete_one({"id": col_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"ok": True}


# ---------- Public: Popup ----------

@api_router.get("/popup")
async def get_popup():
    doc = await db.popup.find_one({}, {"_id": 0})
    if not doc:
        return {"enabled": False}
    return doc


# ---------- Admin: Popup ----------

@api_router.put("/admin/popup")
async def update_popup(payload: PopupIn, admin=Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.popup.update_one({}, {"$set": doc}, upsert=True)
    return {"ok": True}


# ---------- Public: Callback Request ----------

@api_router.post("/callback-request")
async def create_callback_request(payload: CallbackRequestIn):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "pending"
    await db.callback_requests.insert_one(doc)
    return {"ok": True}


# ---------- Admin: Callback Requests ----------

@api_router.get("/admin/callback-requests")
async def list_callback_requests(admin=Depends(get_current_admin)):
    docs = await db.callback_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


@api_router.put("/admin/callback-requests/{req_id}/status")
async def update_callback_status(req_id: str, status: str, admin=Depends(get_current_admin)):
    await db.callback_requests.update_one({"id": req_id}, {"$set": {"status": status}})
    return {"ok": True}


# ---------- Admin: Duplicate Product ----------

@api_router.post("/admin/products/{product_id}/duplicate")
async def duplicate_product(product_id: str, admin=Depends(get_current_admin)):
    original = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not original:
        raise HTTPException(status_code=404, detail="Product not found")
    copy = {**original}
    copy["id"] = str(uuid.uuid4())
    copy["name"] = f"Copy of {original['name']}"
    copy["slug"] = f"copy-of-{original.get('slug', product_id)}"
    copy["created_at"] = datetime.now(timezone.utc).isoformat()
    copy["featured"] = False
    await db.products.insert_one(copy)
    return {k: v for k, v in copy.items() if k != "_id"}


# ---------- Admin: Stats ----------

@api_router.get("/admin/stats")
async def stats(admin=Depends(get_current_admin)):
    return {
        "categories": await db.categories.count_documents({}),
        "subcategories": await db.subcategories.count_documents({}),
        "products": await db.products.count_documents({}),
        "sliders": await db.sliders.count_documents({}),
        "faqs": await db.faqs.count_documents({}),
        "gallery": await db.gallery.count_documents({}),
        "collections": await db.collections.count_documents({}),
        "callback_requests": await db.callback_requests.count_documents({"status": "pending"}),
    }


# ---------- Startup: seed admin + sample data ----------

SAMPLE_SLIDERS = [
    {
        "title": "Bespoke Gifts, Crafted With Intention",
        "subtitle": "Handcrafted hampers, personalised keepsakes, and corporate gifting from Mumbai.",
        "image_url": "https://images.unsplash.com/photo-1598634222670-87c5f558119c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwZGFya3xlbnwwfHx8fDE3Nzg3MzU0MDF8MA&ixlib=rb-4.1.0&q=85",
        "cta_label": "Discover Collections",
        "cta_link": "#categories",
        "order": 0,
    },
    {
        "title": "The Art of Personalisation",
        "subtitle": "From engraved timepieces to custom hampers — every detail, considered.",
        "image_url": "https://images.pexels.com/photos/19810840/pexels-photo-19810840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "cta_label": "Explore Now",
        "cta_link": "#products",
        "order": 1,
    },
    {
        "title": "Corporate Gifting, Reimagined",
        "subtitle": "Bulk orders with white-glove finishing for the brands that demand more.",
        "image_url": "https://images.unsplash.com/photo-1694481901573-a970f982ac5e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85",
        "cta_label": "Enquire",
        "cta_link": "#contact",
        "order": 2,
    },
]

SAMPLE_CATEGORIES = [
    {
        "name": "Signature Hampers",
        "description": "Curated luxury hampers for every occasion.",
        "image_url": "https://images.unsplash.com/photo-1694481901573-a970f982ac5e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85",
    },
    {
        "name": "Personalised Fragrances",
        "description": "Bespoke perfumes — your scent, your story.",
        "image_url": "https://images.unsplash.com/photo-1759794108525-94ff060da692?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBwZXJmdW1lJTIwZGFya3xlbnwwfHx8fDE3Nzg3MzU0MDF8MA&ixlib=rb-4.1.0&q=85",
    },
    {
        "name": "Engraved Timepieces",
        "description": "Heirloom watches, engraved to commemorate.",
        "image_url": "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGRhcmt8ZW58MHx8fHwxNzc4NzM1NDA1fDA&ixlib=rb-4.1.0&q=85",
    },
    {
        "name": "Corporate Gifting",
        "description": "Premium bulk gifting for brands and teams.",
        "image_url": "https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85",
    },
]

SAMPLE_PRODUCTS = [
    {"category_idx": 0, "name": "The Noir Hamper", "description": "A curated black-and-gold hamper with handpicked chocolates, fragrance and silk accents.", "image_url": "https://images.unsplash.com/photo-1694481901573-a970f982ac5e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85", "price": "₹ On Request", "featured": True},
    {"category_idx": 0, "name": "Velvet Anniversary Edit", "description": "Velvet-lined box with vintage glassware and signature scents.", "image_url": "https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85", "price": "₹ On Request", "featured": False},
    {"category_idx": 1, "name": "Eau de Minuit — Custom Blend", "description": "Personalised oud, amber and rose composition in a sculptural flacon.", "image_url": "https://images.unsplash.com/photo-1759794108525-94ff060da692?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBwZXJmdW1lJTIwZGFya3xlbnwwfHx8fDE3Nzg3MzU0MDF8MA&ixlib=rb-4.1.0&q=85", "price": "₹ On Request", "featured": True},
    {"category_idx": 2, "name": "Aurum Chronograph", "description": "Rose-gold cased chronograph with engraved caseback — choose your inscription.", "image_url": "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGRhcmt8ZW58MHx8fHwxNzc4NzM1NDA1fDA&ixlib=rb-4.1.0&q=85", "price": "₹ On Request", "featured": True},
    {"category_idx": 2, "name": "Heirloom Timepiece", "description": "Classic mechanical watch finished in brushed steel and 18k gold accents.", "image_url": "https://images.pexels.com/photos/13013041/pexels-photo-13013041.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "price": "₹ On Request", "featured": False},
    {"category_idx": 3, "name": "Boardroom Edit — 25 Pack", "description": "Elegant corporate hampers with custom branding and handwritten cards.", "image_url": "https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm94fGVufDB8fHx8MTc3ODczNTM4Nnww&ixlib=rb-4.1.0&q=85", "price": "₹ On Request", "featured": True},
]


async def verify_database_connection():
    try:
        await db.command("ping")
    except Exception as exc:
        logger.error("MongoDB connection failed at startup. Please ensure MongoDB is running and reachable at %s.", MONGO_URL)
        logger.error("MongoDB startup error: %s", exc)
        raise


@app.on_event("startup")
async def startup_event():
    # Verify MongoDB connectivity before continuing
    await verify_database_connection()

    # Indexes
    await db.admins.create_index("username", unique=True)
    await db.categories.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.sliders.create_index("id", unique=True)
    await db.settings.create_index("key", unique=True)

    # Seed admin
    existing = await db.admins.find_one({"username": ADMIN_USERNAME})
    if not existing:
        await db.admins.insert_one({
            "username": ADMIN_USERNAME,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.admins.update_one(
            {"username": ADMIN_USERNAME},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Updated admin password from env")

    # Seed sliders
    if await db.sliders.count_documents({}) == 0:
        for s in SAMPLE_SLIDERS:
            await db.sliders.insert_one({
                **s,
                "id": str(uuid.uuid4()),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        logger.info("Seeded sliders")

    # Seed categories
    cat_ids = []
    if await db.categories.count_documents({}) == 0:
        for c in SAMPLE_CATEGORIES:
            cid = str(uuid.uuid4())
            await db.categories.insert_one({
                **c,
                "id": cid,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            cat_ids.append(cid)
        logger.info("Seeded categories")
    else:
        cats = await db.categories.find({}, {"_id": 0, "id": 1}).sort("created_at", 1).to_list(100)
        cat_ids = [c["id"] for c in cats]

    # Seed products
    if await db.products.count_documents({}) == 0 and cat_ids:
        for p in SAMPLE_PRODUCTS:
            idx = min(p["category_idx"], len(cat_ids) - 1)
            await db.products.insert_one({
                "id": str(uuid.uuid4()),
                "category_id": cat_ids[idx],
                "name": p["name"],
                "description": p["description"],
                "image_url": p["image_url"],
                "images": [p["image_url"]],
                "video_url": "",
                "price": p.get("price", ""),
                "featured": p.get("featured", False),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        logger.info("Seeded products")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

@app.middleware("http")
async def cache_public_get(request: Request, call_next):
    response = await call_next(request)
    path = request.url.path
    if (
        request.method == "GET"
        and "/admin" not in path
        and "/auth" not in path
        and "/files" not in path
    ):
        # no-cache: browser must revalidate with server every time so admin
        # changes appear immediately, but the connection is still reused
        response.headers["Cache-Control"] = "no-cache"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
