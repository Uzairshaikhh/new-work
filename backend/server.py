from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import logging
import uuid
import bcrypt
import jwt
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional

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

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
JWT_ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

storage_key: Optional[str] = None


def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not available")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    if resp.status_code == 403:
        # Re-init and retry once
        global storage_key
        storage_key = None
        key = init_storage()
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60,
    )
    if resp.status_code == 403:
        global storage_key
        storage_key = None
        key = init_storage()
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key}, timeout=60,
        )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


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
    featured: bool = False
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
async def upload_file(file: UploadFile = File(...), admin=Depends(get_current_admin)):
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
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    # Public URL via our proxy endpoint
    return {"url": f"/api/files/{result['path']}", "path": result["path"]}


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


# ---------- Admin: Stats ----------

@api_router.get("/admin/stats")
async def stats(admin=Depends(get_current_admin)):
    return {
        "categories": await db.categories.count_documents({}),
        "subcategories": await db.subcategories.count_documents({}),
        "products": await db.products.count_documents({}),
        "sliders": await db.sliders.count_documents({}),
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

    # Init storage in background (non-blocking)
    try:
        init_storage()
    except Exception as e:
        logger.warning(f"Storage init at startup failed (will retry on demand): {e}")

    # Indexes
    await db.admins.create_index("username", unique=True)
    await db.categories.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.sliders.create_index("id", unique=True)

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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
