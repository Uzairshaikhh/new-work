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

## What's Implemented (2026-02-14, redesigned 2026-02-14)
- ✅ **Complete redesign** to light B2B corporate aesthetic matching reference site (cream + navy + amber)
- ✅ Typography: Plus Jakarta Sans (bold) — no more serif headings
- ✅ Top utility bar (navy): GST Billing, Bulk Orders, Pan-India Delivery + phone/whatsapp/email
- ✅ White navbar with AG logo, primary nav, search circle, amber "Get Bulk Quote" CTA
- ✅ Hero with peach gradient bg, pill badge "India's Trusted B2B Gifting Partner", dual CTA, social proof avatars, floating "Starting from ₹80" price card
- ✅ Shop By Category with white cards + amber "View Products" CTA
- ✅ Popular Corporate Products grid (4-col) with "Popular" badges + green WhatsApp / navy Call CTAs
- ✅ Bulk pricing tier table with "Most Popular" highlighted in navy
- ✅ Customise features grid (Logo Printing / Custom Packaging / Multiple Colours / Bulk Discounts)
- ✅ How To Order 4-step section + customisation cancellation policy callout
- ✅ Trusted Clients marquee (TATA, Infosys, HDFC Bank, etc.)
- ✅ Testimonials section (3 reviews with avatars)
- ✅ Final navy CTA banner with WhatsApp + Contact buttons
- ✅ Light cream contact section with white cards + navy "View on Map" CTA
- ✅ Navy footer with 4 columns (brand, nav, services, contact)
- ✅ Light theme also applied to: Category page (peach gradient hero), Product detail (white layout with cream trust badges), Search overlay, Admin Login
- ✅ Admin panel CRUD still functional with backwards-compat CSS class aliases mapped to new amber/navy palette
- ✅ All original features preserved: auth + brute-force lockout, CRUD, file upload, search history, toasts, reorder, SEO, related products, bulk-order WhatsApp deeplink

## Admin Credentials
See `/app/memory/test_credentials.md`.

## Backlog / Next Items
- P1: Search bar functionality (currently icon-only)
- P1: Toast notifications for admin actions (sonner)
- P1: Drag-and-drop reorder for sliders
- P2: Product filters on category page
- P2: SEO meta tags per product/category
- P2: Lazy-loading for hero/product images (blur-up)
