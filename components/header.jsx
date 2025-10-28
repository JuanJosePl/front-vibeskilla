// components/Header.jsx
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Heart,
  Sparkles,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "../hooks/use-cart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const { items, getWishlistCount } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = getWishlistCount();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Categorías", href: "/categorias" },
    { name: "Ofertas", href: "/ofertas", badge: "¡HOT!" },
    { name: "Contacto", href: "/contacto" },
  ];

  // Scroll effect for header and logo animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      // Animate logo rotation based on scroll
      setLogoRotation(scrollPosition * 0.3);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
            : "bg-background/50 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group relative z-50"
            >
              <div className="relative">
                {/* Animated glow ring */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 ${
                    scrolled ? "scale-110" : "scale-100"
                  }`}
                ></div>

                {/* Logo with rotation animation */}
                <div
                  className="relative transition-transform duration-300 group-hover:scale-110"
                  style={{
                    transform: `rotate(${logoRotation % 360}deg)`,
                  }}
                >
                  <img
                    src="/logo-killavibes.svg"
                    alt="KillaVibes"
                    width={scrolled ? "120" : "120"}
                    height={scrolled ? "120" : "120"}
                    className={`transition-all duration-300 ${
                      scrolled ? "h-16 w-16" : "h-14 w-14"
                    }`}
                  />

                  {/* Sparkle effect */}
                  <Zap className="absolute -bottom-1 -right-1 h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>

              {/* Brand text */}
              <div className="hidden sm:block">
                <span
                  className={`font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-all duration-300 ${
                    scrolled ? "text-xl" : "text-2xl"
                  }`}
                  style={{ backgroundSize: "200% auto" }}
                >
                  KillaVibes
                </span>
                <div className="flex items-center space-x-1 -mt-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Tech Store
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 group"
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </span>

                  {/* Hover underline effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>

                  {/* Hover background */}
                  <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110 text-muted-foreground hover:text-primary group relative">
                <Search className="h-5 w-5" />
                <span className="absolute -inset-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
              </button>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Wishlist */}
              <Link to="/lista-deseos">
                <button className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110 text-muted-foreground hover:text-primary group">
                  <Heart className="h-5 w-5 group-hover:fill-current transition-all duration-300" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-xs text-white font-bold flex items-center justify-center animate-bounce shadow-lg">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="absolute -inset-2 bg-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                </button>
              </Link>

              {/* Cart */}
              <Link to="/carrito">
                <button className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110 text-muted-foreground hover:text-primary group">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-primary to-accent text-xs text-white font-bold flex items-center justify-center animate-bounce shadow-lg">
                      {itemCount}
                    </span>
                  )}
                  <span className="absolute -inset-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                </button>
              </Link>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-2 ml-2">
                <Link to="/auth/login">
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link to="/auth/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                    Registro
                  </button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-all duration-300 text-muted-foreground hover:text-primary ml-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar on scroll */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300"
          style={{
            width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`,
          }}
        ></div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Mobile Menu */}
          <div
            className="absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-8">
              {/* Search Bar - Mobile */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-muted/50 border border-border focus:border-primary outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2 mb-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <span className="text-foreground font-medium flex items-center space-x-2">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 -rotate-90" />
                  </Link>
                ))}
              </nav>

              {/* Theme Toggle - Mobile */}
              <div className="flex items-center justify-between px-4 py-3 mb-6 rounded-xl bg-muted/50">
                <span className="text-sm font-medium text-foreground">
                  Tema
                </span>
                <ThemeToggle />
              </div>

              {/* Auth Buttons - Mobile */}
              <div className="space-y-3">
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <button className="w-full px-6 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                    Iniciar Sesión
                  </button>
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300">
                    Crear Cuenta
                  </button>
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  🚚 Envío gratis en Barranquilla y Soledad
                </p>
                <p className="text-xs text-muted-foreground">
                  ⚡ Atención al cliente 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content jump */}
      <div className="h-20"></div>
    </>
  );
}