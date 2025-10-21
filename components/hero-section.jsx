
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Truck,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { useScrollToTop } from "../hooks/use-scroll-to-top";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-64 bg-muted rounded-full mx-auto"></div>
          <div className="h-4 w-96 bg-muted rounded-full mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 theme-transition">
      {/* Background elements mejorados */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-background/50 to-background"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content mejorado */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  KillaVibes Premium
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight">
                Tecnología que{" "}
                <span className="gradient-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  vibra
                </span>{" "}
                contigo
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                Descubre los mejores productos tecnológicos en Barranquilla. 
                Audífonos, parlantes, compresores y más con envíos gratis y 
                garantía total. Calidad que sientes, servicio que mereces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/productos">
                <Button size="lg" className="btn-primary group px-8 py-3 text-base">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/ofertas">
                <Button size="lg" variant="outline" className="group px-8 py-3 text-base border-2">
                  <Tag className="mr-2 h-4 w-4" />
                  Ver Ofertas
                  <Sparkles className="ml-2 h-4 w-4 text-primary" />
                </Button>
              </Link>
            </div>

            {/* Features mejoradas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {[
                {
                  icon: Truck,
                  title: "Envío Gratis",
                  desc: "Barranquilla y Soledad",
                  color: "text-blue-500",
                },
                {
                  icon: Shield,
                  title: "Garantizado",
                  desc: "Productos originales",
                  color: "text-green-500",
                },
                { 
                  icon: Clock, 
                  title: "24/7", 
                  desc: "Atención al cliente",
                  color: "text-orange-500",
                },
                { 
                  icon: Zap, 
                  title: "Vibra Killa", 
                  desc: "Únete a nosotros",
                  color: "text-purple-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-card/50 border border-border/50 hover-lift backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {feature.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Carousel Mejorado */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl carousel-container group">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-full scale-95 z-0"
                      : "opacity-0 translate-x-full scale-95 z-0"
                  }`}
                >
                  <div className="relative h-full group">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Product Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {product.isFeatured && (
                          <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded-full text-xs">
                            <Star className="h-3 w-3" />
                            Destacado
                          </div>
                        )}
                        {product.comparePrice > product.price && (
                          <div className="bg-red-500 px-2 py-1 rounded-full text-xs font-semibold">
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm opacity-90 mb-4 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-2xl font-bold">
                            ${product.price.toLocaleString()} COP
                          </span>
                          {product.comparePrice > product.price && (
                            <span className="text-sm line-through opacity-70 block">
                              ${product.comparePrice.toLocaleString()} COP
                            </span>
                          )}
                        </div>
                        <Link to={`/productos/${product.slug}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                          >
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls Mejorados */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground border-0 shadow-lg z-20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground border-0 shadow-lg z-20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Carousel Indicators Mejorados */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? "bg-primary w-8 shadow-lg"
                      : "bg-white/50 w-2 hover:w-4 hover:bg-white/70"
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            {/* Floating Elements Mejorados */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 animate-float backdrop-blur-sm border border-primary/30" />
            <div
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/20 animate-float backdrop-blur-sm border border-accent/30"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}// components/hero-section.jsx
"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Truck,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { productService } from "../services/productService";
import { useScrollToTop } from "../hooks/use-scroll-to-top";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-64 bg-muted rounded-full mx-auto"></div>
          <div className="h-4 w-96 bg-muted rounded-full mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 theme-transition">
      {/* Background elements mejorados */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent via-background/50 to-background"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content mejorado */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  KillaVibes Premium
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-balance leading-tight">
                Tecnología que{" "}
                <span className="gradient-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  vibra
                </span>{" "}
                contigo
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                Descubre los mejores productos tecnológicos en Barranquilla. 
                Audífonos, parlantes, compresores y más con envíos gratis y 
                garantía total. Calidad que sientes, servicio que mereces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/productos">
                <Button size="lg" className="btn-primary group px-8 py-3 text-base">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/ofertas">
                <Button size="lg" variant="outline" className="group px-8 py-3 text-base border-2">
                  <Tag className="mr-2 h-4 w-4" />
                  Ver Ofertas
                  <Sparkles className="ml-2 h-4 w-4 text-primary" />
                </Button>
              </Link>
            </div>

            {/* Features mejoradas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {[
                {
                  icon: Truck,
                  title: "Envío Gratis",
                  desc: "Barranquilla y Soledad",
                  color: "text-blue-500",
                },
                {
                  icon: Shield,
                  title: "Garantizado",
                  desc: "Productos originales",
                  color: "text-green-500",
                },
                { 
                  icon: Clock, 
                  title: "24/7", 
                  desc: "Atención al cliente",
                  color: "text-orange-500",
                },
                { 
                  icon: Zap, 
                  title: "Vibra Killa", 
                  desc: "Únete a nosotros",
                  color: "text-purple-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-card/50 border border-border/50 hover-lift backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {feature.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Carousel Mejorado */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl carousel-container group">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-full scale-95 z-0"
                      : "opacity-0 translate-x-full scale-95 z-0"
                  }`}
                >
                  <div className="relative h-full group">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Product Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {product.isFeatured && (
                          <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded-full text-xs">
                            <Star className="h-3 w-3" />
                            Destacado
                          </div>
                        )}
                        {product.comparePrice > product.price && (
                          <div className="bg-red-500 px-2 py-1 rounded-full text-xs font-semibold">
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-sm opacity-90 mb-4 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-2xl font-bold">
                            ${product.price.toLocaleString()} COP
                          </span>
                          {product.comparePrice > product.price && (
                            <span className="text-sm line-through opacity-70 block">
                              ${product.comparePrice.toLocaleString()} COP
                            </span>
                          )}
                        </div>
                        <Link to={`/productos/${product.slug}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                          >
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls Mejorados */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground border-0 shadow-lg z-20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground border-0 shadow-lg z-20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Carousel Indicators Mejorados */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? "bg-primary w-8 shadow-lg"
                      : "bg-white/50 w-2 hover:w-4 hover:bg-white/70"
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            {/* Floating Elements Mejorados */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 animate-float backdrop-blur-sm border border-primary/30" />
            <div
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/20 animate-float backdrop-blur-sm border border-accent/30"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}