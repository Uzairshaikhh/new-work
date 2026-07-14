import "@/index.css";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import FloatingDock from "@/components/FloatingDock";
import AnnouncementBar from "@/components/AnnouncementBar";
import ScrollProgress from "@/components/ScrollProgress";
import PopupManager from "@/components/PopupManager";

// Lazy-load all non-home pages so the initial bundle only contains what's needed for the landing page
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("@/pages/TermsAndConditions"));
const AllProducts = lazy(() => import("@/pages/AllProducts"));

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminSliders = lazy(() => import("@/pages/admin/AdminSliders"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminSubcategories = lazy(() => import("@/pages/admin/AdminSubcategories"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminFAQs = lazy(() => import("@/pages/admin/AdminFAQs"));
const AdminGallery = lazy(() => import("@/pages/admin/AdminGallery"));

const Gallery = lazy(() => import("@/pages/Gallery"));
const Corporate = lazy(() => import("@/pages/Corporate"));
const Collections = lazy(() => import("@/pages/Collections"));
const CollectionView = lazy(() => import("@/pages/CollectionView"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminCollections = lazy(() => import("@/pages/admin/AdminCollections"));
const AdminPopup = lazy(() => import("@/pages/admin/AdminPopup"));
const AdminCallbacks = lazy(() => import("@/pages/admin/AdminCallbacks"));
const AdminCorporate = lazy(() => import("@/pages/admin/AdminCorporate"));

const CorporateCategoryPage = lazy(() => import("@/pages/CorporateCategoryPage"));

const AdminLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37] animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const GlobalUI = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;
  return (
    <>
      <ScrollProgress />
      <AnnouncementBar />
      <FloatingDock />
      <PopupManager />
    </>
  );
};


function App() {
  return (
    <div className="App bg-[#0a0a0d] min-h-screen text-white">
      <AuthProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0e0e0e",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#ffffff",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
            },
          }}
        />
        <BrowserRouter>
          <ScrollToTop />
          <GlobalUI />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Suspense fallback={null}><AllProducts /></Suspense>} />
            <Route path="/about-us" element={<Suspense fallback={null}><AboutUs /></Suspense>} />
            <Route path="/privacy-policy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />
            <Route path="/terms-and-conditions" element={<Suspense fallback={null}><TermsAndConditions /></Suspense>} />
            <Route path="/category/:id" element={<Suspense fallback={null}><CategoryPage /></Suspense>} />
            <Route path="/product/:id" element={<Suspense fallback={null}><ProductDetail /></Suspense>} />
            <Route path="/gallery" element={<Suspense fallback={null}><Gallery /></Suspense>} />
            <Route path="/corporate" element={<Suspense fallback={null}><Corporate /></Suspense>} />
            <Route path="/corporate/:slug" element={<Suspense fallback={null}><CorporateCategoryPage /></Suspense>} />
            <Route path="/collections" element={<Suspense fallback={null}><Collections /></Suspense>} />
            <Route path="/collections/:id" element={<Suspense fallback={null}><CollectionView /></Suspense>} />
            <Route path="/admin-x9k2l-secret">
              <Route index element={<Suspense fallback={<AdminLoader />}><AdminLogin /></Suspense>} />
              <Route element={<Suspense fallback={<AdminLoader />}><AdminLayout /></Suspense>}>
                <Route path="dashboard" element={<Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense>} />
                <Route path="sliders" element={<Suspense fallback={<AdminLoader />}><AdminSliders /></Suspense>} />
                <Route path="categories" element={<Suspense fallback={<AdminLoader />}><AdminCategories /></Suspense>} />
                <Route path="subcategories" element={<Suspense fallback={<AdminLoader />}><AdminSubcategories /></Suspense>} />
                <Route path="products" element={<Suspense fallback={<AdminLoader />}><AdminProducts /></Suspense>} />
                <Route path="faqs" element={<Suspense fallback={<AdminLoader />}><AdminFAQs /></Suspense>} />
                <Route path="gallery" element={<Suspense fallback={<AdminLoader />}><AdminGallery /></Suspense>} />
                <Route path="collections" element={<Suspense fallback={<AdminLoader />}><AdminCollections /></Suspense>} />
                <Route path="popup" element={<Suspense fallback={<AdminLoader />}><AdminPopup /></Suspense>} />
                <Route path="callbacks" element={<Suspense fallback={<AdminLoader />}><AdminCallbacks /></Suspense>} />
                <Route path="corporate" element={<Suspense fallback={<AdminLoader />}><AdminCorporate /></Suspense>} />
                <Route path="settings" element={<Suspense fallback={<AdminLoader />}><AdminSettings /></Suspense>} />
              </Route>
            </Route>
            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
