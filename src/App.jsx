// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "../hooks/use-cart.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import '../styles/animations.css'
import Header from "../components/header";
import Footer from "../components/footer";

// Páginas públicas
import HomePage from "../app/page";
import ProductsPage from "../app/productos/page";
import ProductDetailPage from "../app/productos/[id]/page";
import CartPage from "../app/carrito/page";
import CheckoutPage from "../app/checkout/page";
import ContactPage from "../app/contacto/page";
import AboutPage from "../app/sobre-nosotros/page";
import OffersPage from "../app/ofertas/page";
import CategoriesPage from "../app/categorias/page";
import WarrantyPage from "../app/garantia/page";
import ReturnsPage from "../app/devoluciones/page";
import ShippingPage from "../app/envios/page";
import WishlistPage from "../app/lista-deseos/page";
import LoginPage from "../app/auth/login/page";
import RegisterPage from "../app/auth/register/page";
import ProfilePage from "../app/auth/profile/page";
import OrdersPage from "../app/auth/orders/page";
import NotFoundPage from "../app/not-found";

// Admin
import AdminLayout from "./admin/components/layout/AdminLayout";
import ProtectedRoute from "./admin/components/layout/ProtectedRoute";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";
import Settings from "./admin/pages/Settings";
import CreateProduct from "./admin/pages/Products/Create";
import EditProduct from "./admin/pages/Products/Edit";
import CreateCategory from "./admin/pages/Categories/Create";
import EditCategory from "./admin/pages/Categories/Edit";
import OrderDetails from "./admin/pages/Orders/Details";
import EditUser from "./admin/pages/Users/Edit";
import AdminNavbar from "./admin/components/layout/Navbar";

// Scroll handler component
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll suave al top en cada cambio de ruta
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]);

  return null;
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "admin" || user?.role === "moderator";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col theme-transition">
      {/* Componente de scroll automático */}
      <ScrollToTop />
      
      {/* Mostrar header público si no es ruta admin */}
      {!isAdminRoute && <Header />}

      {/* Mostrar navbar admin solo si es ruta admin y el usuario tiene rol */}
      {isAdminRoute && isAdmin && <AdminNavbar />}

      <main className="flex-1">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/productos/:id" element={<ProductDetailPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/ofertas" element={<OffersPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/garantia" element={<WarrantyPage />} />
          <Route path="/devoluciones" element={<ReturnsPage />} />
          <Route path="/envios" element={<ShippingPage />} />

          {/* Auth */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Páginas protegidas */}
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/lista-deseos" element={<WishlistPage />} />
          <Route path="/auth/profile" element={<ProfilePage />} />
          <Route path="/auth/orders" element={<OrdersPage />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer solo si no estás en admin */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}