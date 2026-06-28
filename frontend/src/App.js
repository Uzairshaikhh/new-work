import "@/index.css";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import AboutUs from "@/pages/AboutUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminSliders = lazy(() => import("@/pages/admin/AdminSliders"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminSubcategories = lazy(() => import("@/pages/admin/AdminSubcategories"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin-x9k2l-secret">
              <Route index element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
              <Route element={<Suspense fallback={null}><AdminLayout /></Suspense>}>
                <Route path="dashboard" element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
                <Route path="sliders" element={<Suspense fallback={null}><AdminSliders /></Suspense>} />
                <Route path="categories" element={<Suspense fallback={null}><AdminCategories /></Suspense>} />
                <Route path="subcategories" element={<Suspense fallback={null}><AdminSubcategories /></Suspense>} />
                <Route path="products" element={<Suspense fallback={null}><AdminProducts /></Suspense>} />
                <Route path="settings" element={<Suspense fallback={null}><AdminSettings /></Suspense>} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
