# Amazing Groups — Product Requirements Document

## Original Problem Statement
Premium luxury website UI for a "Customized Gift Products" brand named **Amazing Groups**. Black & gold luxury Shopify-style theme, fully functional storefront + admin panel. React + Tailwind + MongoDB/FastAPI backend (originally requested Supabase, swapped per user choice on 2026-02).

## Tech Stack
- **Frontend**: React 19 + Tailwind + shadcn UI + embla-carousel + lucide-react
- **Backend**: FastAPI + MongoDB (Motor) + bcrypt + PyJWT
- **Storage**: Emergent Object Storage (for image/video uploads)
- **Fonts**: Cormorant Garamond (display) + Outfit (body)

## User Personas
- **Visitor**: Browses hero, categories, products, calls/WhatsApps for enquiry.
- **Admin**: Manages sliders, categories, products (CRUD + media uploads).

## Core Requirements
- Sticky blurred navbar w/ gold underline
- Hero slider (auto-play, arrows, dots) — dynamic
- Category grid — unlimited, dynamic
- Category page with product grid
- Product detail w/ image gallery + optional video + WhatsApp / Call CTAs
- Contact section with phone, email, location + map link
- Footer
- Hidden admin route `/admin-x9k2l-secret` — login + dashboard + CRUD for sliders/categories/products + file upload
- Same black/gold luxury aesthetic across storefront and admin
- Loading states + empty states

## What's Implemented (2026-02-14)
- ✅ Backend: auth (JWT), CRUD endpoints for sliders/categories/products, object-storage upload, public catalog endpoints, admin stats
- ✅ Seed admin + sample sliders/categories/products on startup
- ✅ Storefront: Home (hero slider, categories, featured), CategoryPage, ProductDetail, Contact, Footer
- ✅ Admin: Login, Sidebar layout, Dashboard, Sliders/Categories/Products CRUD with media uploader
- ✅ Auth via bearer token in localStorage
- ✅ Working luxury search overlay (live filter across products + categories)
- ✅ "Bulk Order" navbar button → WhatsApp with prefilled bulk enquiry
- ✅ "How To Order" 3-step process section + "once order placed, cannot be cancelled" policy callout

## Admin Credentials
See `/app/memory/test_credentials.md`.

## Backlog / Next Items
- P1: Search bar functionality (currently icon-only)
- P1: Toast notifications for admin actions (sonner)
- P1: Drag-and-drop reorder for sliders
- P2: Product filters on category page
- P2: SEO meta tags per product/category
- P2: Lazy-loading for hero/product images (blur-up)
