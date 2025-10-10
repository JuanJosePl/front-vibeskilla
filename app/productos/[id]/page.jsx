import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Clock,
  Minus,
  Plus,
} from "lucide-react";
import { PageLayout } from "../../../components/page-layout";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useCart } from "../../../hooks/use-cart";
import { useAuth } from "../../../src/contexts/AuthContext";
import { useToast } from "../../../hooks/use-toast";
import { productService } from "../../../src/services/productService";
import { formatPrice } from "../../../lib/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductBySlug(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError("Producto no encontrado");
        }
      } catch (err) {
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        type: "warning",
      });
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(product, 1);
      }

      toast({
        title: "Producto agregado",
        description: `${product.name} se agregó al carrito.`,
        type: "success",
      });
    } catch (error) {
      // El error ya se maneja en el hook useCart
    }
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      slug: product.slug,
    });

    toast({
      title: isInWishlist(product._id)
        ? "Eliminado de favoritos"
        : "Agregado a favoritos",
      description: isInWishlist(product._id)
        ? `${product.name} se eliminó de tu lista de deseos.`
        : `${product.name} se agregó a tu lista de deseos.`,
      type: "success",
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 bg-muted rounded-md"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link to="/productos">
            <Button>Volver a productos</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const isAvailable =
    product.status === "active" &&
    product.isPublished &&
    (product.stock > 0 || product.allowBackorder);

  const images = product.images || [];
  const mainImage = images[selectedImage] || images[0];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            to="/productos"
            className="hover:text-primary transition-colors"
          >
            Productos
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Back Button */}
        <Link
          to="/productos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative">
              <img
                src={mainImage?.url || "/placeholder-product.jpg"}
                alt={mainImage?.altText || product.name}
                className="w-full h-full object-cover"
              />
              {product.comparePrice && product.comparePrice > product.price && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  -
                  {Math.round((1 - product.price / product.comparePrice) * 100)}
                  %
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary scale-105"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder-product.jpg"}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.isFeatured && (
                  <Badge className="bg-primary">Destacado</Badge>
                )}
                {product.status === "active" && (
                  <Badge className="bg-green-500">Disponible</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
                {product.name}
              </h1>

              <p className="text-lg text-muted-foreground text-pretty mb-4">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <>
                      <span className="text-xl line-through text-muted-foreground">
                        {formatPrice(product.comparePrice)}
                      </span>
                      <Badge className="bg-red-500">
                        Ahorra{" "}
                        {Math.round(
                          (1 - product.price / product.comparePrice) * 100
                        )}
                        %
                      </Badge>
                    </>
                  )}
              </div>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-sm text-orange-500">
                  ¡Solo {product.stock} disponibles en stock!
                </p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Cantidad:</label>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!isAvailable}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || !isAuthenticated}
                  className="flex-1 btn-primary py-3 text-base"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {!isAuthenticated
                    ? "Inicia sesión"
                    : !isAvailable
                    ? "Agotado"
                    : "Agregar al carrito"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-3"
                  onClick={handleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${
                      isInWishlist(product._id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  Favoritos
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Envío Gratis</p>
                  <p className="text-xs text-muted-foreground">
                    Barranquilla y Soledad
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Garantía</p>
                  <p className="text-xs text-muted-foreground">12 meses</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Soporte 24/7</p>
                  <p className="text-xs text-muted-foreground">
                    Atención garantizada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Descripción del Producto</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Características principales:
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
