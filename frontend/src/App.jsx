import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import useThemeStore from "./store/useThemeStore";
import useAuthStore from "./store/useAuthStore";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CartSidebar from "./components/common/CartSidebar";
import LiveChatButton from "./components/common/LiveChatButton";
import ScrollToTopButton, { RouteScrollToTop } from "./components/common/ScrollToTop";

// Eagerly loaded pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy-loaded pages (code splitting for performance)
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));

// Full-screen page loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl animate-bounce">🌾</div>
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading FarmSphere...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

// Public layout (navbar + footer)
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
      <LiveChatButton />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  const { initTheme } = useThemeStore();
  const { refreshUser, token } = useAuthStore();

  // Initialize theme on mount
  useEffect(() => { initTheme(); }, []);

  // Refresh user session if token exists
  useEffect(() => {
    if (token) refreshUser();
  }, []);

  return (
    <>
      <RouteScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* ── Auth Routes ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected Routes ── */}
          <Route path="/checkout" element={
            <PublicLayout>
              <CheckoutPage />
            </PublicLayout>
          } />

          {/* ── Admin Routes ── */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
