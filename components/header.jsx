// components/header.jsx
import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  Sparkles,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "../hooks/use-cart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, getWishlistCount } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = getWishlistCount();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/productos" },
    { name: "Categorías", href: "/categorias" },
    { name: "Ofertas", href: "/ofertas" },
    { name: "Contacto", href: "/contacto" },
    { name: "Iniciar Sesion", href: "/auth/login" },
    { name: "Registro", href: "/auth/register" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 glass-effect theme-transition">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img
                src="/logo-killavibes.svg"
                alt="KillaVibes"
                width="90"
                height="90"
                className="h-17 w-32 transition-transform duration-300 group-hover:scale-105 dark:invert dark:brightness-200"
              />
              <div className="absolute  bottom-11 -right-3">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-full hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            <ThemeToggle />


            <Link to="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center animate-bounce">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Carrito ({itemCount})</span>
              </Button>
            </Link>

            <Link to="/lista-deseos">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pink-500 text-xs text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">
                  Lista de deseos ({wishlistCount})
                </span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 animate-slide-in-up glass-effect">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}