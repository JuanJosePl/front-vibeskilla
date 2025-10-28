// components/ProductCard.jsx
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Zap,
  Truck,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock hooks - Replace with real implementations
const useCart = () => ({
  addItem: (product) => console.log("Add to cart:", product),
  toggleWishlist: (product) => console.log("Toggle wishlist:", product),
  isInWishlist: (id) => false,
});

const useAuth = () => ({
  isAuthenticated: true,
});

const useToast = () => ({
  toast: (options) => console.log("Toast:", options),
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

export function ProductCard({
  product,
  className = "",
  showWishlistButton = true,
  variant = "default",
}) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        type: "warning",
      });
      return;
    }

    addItem(product);
    toast({
      title: "¡Agregado!",
      description: `${product.name} se agregó al carrito.`,
      type: "success",
    });
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos a favoritos.",
        type: "warning",
      });
      return;
    }

    setIsWishlistLoading(true);
    try {
      toggleWishlist(product);
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isInWishlistState = isInWishlist(product._id || product.id);
  const discountPercentage =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : 0;

  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() <
      7 * 24 * 60 * 60 * 1000;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = !product.stock || product.stock <= 0;

  // Calculate average rating
  const averageRating = product.ratings?.length
    ? (
        product.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
        product.ratings.length
      ).toFixed(1)
    : null;

  return (
    <div
      className={`group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/productos/${product.slug || product._id || product.id}`}
        className="block"
      >
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border-2 border-border/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] backdrop-blur-sm ${
            isOutOfStock ? "opacity-70 grayscale" : ""
          } ${isHovered ? "border-primary/30 shadow-xl shadow-primary/10" : ""}`}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 transition-all duration-700 pointer-events-none"></div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col space-y-2">
            {discountPercentage > 0 && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg animate-pulse backdrop-blur-sm">
                <Zap className="h-3 w-3 fill-current" />
                <span>-{discountPercentage}%</span>
              </div>
            )}
            {product.isFeatured && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg backdrop-blur-sm">
                <Star className="h-3 w-3 fill-current" />
                <span>Destacado</span>
              </div>
            )}
            {isNew && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                <span>NUEVO</span>
              </div>
            )}
            {isLowStock && !isOutOfStock && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg animate-pulse backdrop-blur-sm">
                <TrendingUp className="h-3 w-3" />
                <span>¡Últimos {product.stock}!</span>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlistButton && (
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={handleToggleWishlist}
                disabled={isWishlistLoading}
                className={`h-10 w-10 rounded-full backdrop-blur-md border-0 shadow-lg transition-all duration-300 flex items-center justify-center ${
                  isInWishlistState
                    ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                    : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110 hover:shadow-xl"
                }`}
                title={
                  isInWishlistState ? "Quitar de favoritos" : "Agregar a favoritos"
                }
              >
                <Heart
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isInWishlistState ? "fill-current scale-110" : ""
                  } ${isHovered && !isInWishlistState ? "scale-110" : ""}`}
                />
              </button>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            {/* Loading skeleton */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-shimmer flex items-center justify-center">
                <div className="text-muted-foreground animate-pulse">
                  Cargando...
                </div>
              </div>
            )}

            {/* Product Image */}
            <img
              src={
                product.images?.[0]?.url ||
                product.image ||
                "/placeholder-product.jpg"
              }
              alt={product.name}
              className={`h-full w-full object-cover transition-all duration-700 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0"}`}
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Quick Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Truck className="h-3 w-3" />
                    <span>Envío gratis</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Shield className="h-3 w-3" />
                    <span>1 año garantía</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick View Button */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button className="px-6 py-3 bg-white text-foreground rounded-full font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center space-x-2 backdrop-blur-sm">
                <Eye className="h-5 w-5" />
                <span>Ver detalles</span>
              </button>
            </div>

            {/* Corner decoration */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3">
            {/* Category */}
            {product.category && (
              <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                {product.category}
              </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {product.shortDescription || product.description}
            </p>

            {/* Rating */}
            {averageRating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 transition-all duration-300 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {averageRating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.ratings?.length || 0})
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Savings */}
                  {discountPercentage > 0 && (
                    <div className="text-xs font-bold text-green-600 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>
                        Ahorras {formatPrice(product.comparePrice - product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !isAuthenticated}
              className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {!isAuthenticated
                  ? "Iniciar sesión"
                  : isOutOfStock
                  ? "Agotado"
                  : "Agregar al carrito"}
              </span>
            </button>

            {/* Stock Status */}
            {!isOutOfStock && product.stock > 0 && (
              <div className="text-xs text-center text-muted-foreground">
                {product.stock > 10 ? (
                  <span className="flex items-center justify-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>✓ En stock</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-1 text-orange-600 font-semibold">
                    <Zap className="h-3 w-3" />
                    <span>Solo {product.stock} disponibles</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Animated border on hover */}
          <div
            className={`absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none transition-all duration-500 ${
              isHovered
                ? "border-primary/30 shadow-inner shadow-primary/10"
                : ""
            }`}
          ></div>

          {/* Shine effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 pointer-events-none ${
              isHovered ? "translate-x-full" : ""
            }`}
            style={{ transform: isHovered ? "translateX(100%)" : "translateX(-100%)" }}
          ></div>
        </div>
      </Link>
    </div>
  );
}