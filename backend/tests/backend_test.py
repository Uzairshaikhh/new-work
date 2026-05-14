"""Backend API tests for Amazing Groups storefront."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://gift-customizer-hub.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_USER = "admin"
ADMIN_PASS = "AmazingGroups@2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=30)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data.get("role") == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public endpoints ----------
class TestPublic:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=20)
        assert r.status_code == 200
        assert "Amazing Groups" in r.json().get("message", "")

    def test_sliders_seeded(self):
        r = requests.get(f"{API}/sliders", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 3, f"Expected >=3 sliders, got {len(data)}"
        assert "title" in data[0] and "image_url" in data[0]

    def test_categories_seeded(self):
        r = requests.get(f"{API}/categories", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 4
        assert "id" in data[0] and "name" in data[0]

    def test_category_detail(self):
        cats = requests.get(f"{API}/categories", timeout=20).json()
        cid = cats[0]["id"]
        r = requests.get(f"{API}/categories/{cid}", timeout=20)
        assert r.status_code == 200
        assert r.json()["id"] == cid

    def test_category_products(self):
        cats = requests.get(f"{API}/categories", timeout=20).json()
        r = requests.get(f"{API}/categories/{cats[0]['id']}/products", timeout=20)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_category_not_found(self):
        r = requests.get(f"{API}/categories/nonexistent-id", timeout=20)
        assert r.status_code == 404

    def test_featured_products(self):
        r = requests.get(f"{API}/products", params={"featured": "true"}, timeout=20)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        assert all(p["featured"] is True for p in items)

    def test_all_products(self):
        r = requests.get(f"{API}/products", timeout=20)
        assert r.status_code == 200
        assert len(r.json()) >= 6

    def test_product_detail(self):
        prods = requests.get(f"{API}/products", timeout=20).json()
        pid = prods[0]["id"]
        r = requests.get(f"{API}/products/{pid}", timeout=20)
        assert r.status_code == 200
        assert r.json()["id"] == pid

    def test_product_not_found(self):
        r = requests.get(f"{API}/products/nonexistent-id", timeout=20)
        assert r.status_code == 404


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["username"] == ADMIN_USER
        assert d["role"] == "admin"
        assert isinstance(d["token"], str) and len(d["token"]) > 20

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": "wrong"}, timeout=20)
        assert r.status_code == 401

    def test_login_wrong_user(self):
        r = requests.post(f"{API}/auth/login", json={"username": "nope", "password": "x"}, timeout=20)
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USER

    def test_me_no_token(self):
        r = requests.get(f"{API}/auth/me", timeout=20)
        assert r.status_code == 401

    def test_stats_requires_auth(self):
        r = requests.get(f"{API}/admin/stats", timeout=20)
        assert r.status_code == 401

    def test_stats_with_auth(self, auth_headers):
        r = requests.get(f"{API}/admin/stats", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["categories"] >= 4 and d["products"] >= 6 and d["sliders"] >= 3


# ---------- Slider CRUD ----------
class TestSliderCRUD:
    def test_slider_crud_flow(self, auth_headers):
        payload = {"title": "TEST_Slider", "subtitle": "x", "image_url": "https://example.com/x.jpg", "cta_label": "Go", "cta_link": "#x", "order": 99}
        r = requests.post(f"{API}/admin/sliders", json=payload, headers=auth_headers, timeout=20)
        assert r.status_code == 200, r.text
        sid = r.json()["id"]

        # verify in list
        all_s = requests.get(f"{API}/sliders", timeout=20).json()
        assert any(s["id"] == sid for s in all_s)

        # update
        payload["title"] = "TEST_Slider_Updated"
        r = requests.put(f"{API}/admin/sliders/{sid}", json=payload, headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Slider_Updated"

        # delete
        r = requests.delete(f"{API}/admin/sliders/{sid}", headers=auth_headers, timeout=20)
        assert r.status_code == 200

        # 404 after delete
        r = requests.delete(f"{API}/admin/sliders/{sid}", headers=auth_headers, timeout=20)
        assert r.status_code == 404

    def test_slider_create_unauth(self):
        r = requests.post(f"{API}/admin/sliders", json={"title": "x", "image_url": "y"}, timeout=20)
        assert r.status_code == 401


# ---------- Category CRUD + Cascade ----------
class TestCategoryCRUD:
    def test_category_crud_and_cascade(self, auth_headers):
        # Create category
        r = requests.post(f"{API}/admin/categories",
                          json={"name": "TEST_Cat", "image_url": "https://example.com/c.jpg", "description": "t"},
                          headers=auth_headers, timeout=20)
        assert r.status_code == 200
        cid = r.json()["id"]

        # GET verifies persistence
        assert requests.get(f"{API}/categories/{cid}", timeout=20).status_code == 200

        # Update
        r = requests.put(f"{API}/admin/categories/{cid}",
                         json={"name": "TEST_Cat_Upd", "image_url": "https://example.com/c.jpg", "description": "t2"},
                         headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Cat_Upd"

        # Create product under this cat
        r = requests.post(f"{API}/admin/products",
                          json={"category_id": cid, "name": "TEST_Prod", "description": "d",
                                "image_url": "https://example.com/p.jpg", "images": [], "video_url": "",
                                "price": "₹100", "featured": False},
                          headers=auth_headers, timeout=20)
        assert r.status_code == 200
        pid = r.json()["id"]

        # Delete category — should cascade delete product
        r = requests.delete(f"{API}/admin/categories/{cid}", headers=auth_headers, timeout=20)
        assert r.status_code == 200

        # Product should be gone
        r = requests.get(f"{API}/products/{pid}", timeout=20)
        assert r.status_code == 404, "Cascade delete of products failed"


# ---------- Product CRUD ----------
class TestProductCRUD:
    def test_product_crud(self, auth_headers):
        cats = requests.get(f"{API}/categories", timeout=20).json()
        cid = cats[0]["id"]
        payload = {"category_id": cid, "name": "TEST_P", "description": "d",
                   "image_url": "https://example.com/p.jpg", "images": ["https://example.com/p.jpg"],
                   "video_url": "", "price": "₹999", "featured": True}
        r = requests.post(f"{API}/admin/products", json=payload, headers=auth_headers, timeout=20)
        assert r.status_code == 200
        pid = r.json()["id"]

        # GET to verify persisted
        r = requests.get(f"{API}/products/{pid}", timeout=20)
        assert r.status_code == 200
        assert r.json()["featured"] is True

        # Update
        payload["name"] = "TEST_P_Upd"
        payload["featured"] = False
        r = requests.put(f"{API}/admin/products/{pid}", json=payload, headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_P_Upd"
        assert r.json()["featured"] is False

        # Delete
        r = requests.delete(f"{API}/admin/products/{pid}", headers=auth_headers, timeout=20)
        assert r.status_code == 200
        assert requests.get(f"{API}/products/{pid}", timeout=20).status_code == 404


# ---------- File Upload ----------
class TestFileUpload:
    def test_upload_and_fetch(self, auth_headers):
        # 1x1 PNG bytes
        png = bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63f8cf00000003010100250db5750000000049454e44ae426082")
        files = {"file": ("test.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{API}/admin/upload", files=files, headers=auth_headers, timeout=60)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "url" in d and "path" in d and d["url"].startswith("/api/files/")

        # fetch
        fetch_url = f"{BASE_URL}{d['url']}"
        fr = requests.get(fetch_url, timeout=30)
        assert fr.status_code == 200, f"file fetch failed: {fr.status_code}"
        assert fr.headers.get("content-type", "").startswith("image/")
        assert len(fr.content) > 0

    def test_upload_requires_auth(self):
        files = {"file": ("t.txt", io.BytesIO(b"hi"), "text/plain")}
        r = requests.post(f"{API}/admin/upload", files=files, timeout=30)
        assert r.status_code == 401
