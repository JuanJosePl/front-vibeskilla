import { Routes, Route } from "react-router-dom"
import { CartProvider } from "../hooks/use-cart.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import Header from "../components/header"
import Footer from "../components/footer"
import HomePage from "../app/page"
import ProductsPage from "../app/productos/page"
import ProductDetailPage from "../app/productos/[id]/page"
import CartPage from "../app/carrito/page"
import CheckoutPage from "../app/checkout/page"
import ContactPage from "../app/contacto/page"
import AboutPage from "../app/sobre-nosotros/page"
import OffersPage from "../app/ofertas/page"
import CategoriesPage from "../app/categorias/page"
import WarrantyPage from "../app/garantia/page"
import ReturnsPage from "../app/devoluciones/page"
import ShippingPage from "../app/envios/page"
import WishlistPage from "../app/lista-deseos/page"
import LoginPage from "../app/auth/login/page" // Nueva página
import RegisterPage from "../app/auth/register/page" // Nueva página
import ProfilePage from "../app/auth/profile/page" // Nueva página
import OrdersPage from "../app/auth/orders/page" // Nueva página
import NotFoundPage from "../app/not-found"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
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
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App