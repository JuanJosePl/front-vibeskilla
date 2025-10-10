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
} from "lucide-react";
import { Button } from "./ui/button";
import { getFeaturedProducts } from "../lib/products";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = getFeaturedProducts().slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 theme-transition">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-full w-fit">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  KillaVibes Premium
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-balance">
                Tecnología que <span className="gradient-text">vibra</span>{" "}
                contigo
              </h1>

              <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                Descubre los mejores productos tecnológicos en Barranquilla.
                Audífonos, parlantes, compresores y más con envíos gratis y
                garantía total.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/productos">
                <Button size="lg" className="btn-primary group">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="/ofertas">
                <Button size="lg" variant="outline" className="group">
                  Ver Ofertas
                  <Sparkles className="ml-2 h-4 w-4 text-primary" />
                </Button>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {[
                {
                  icon: Truck,
                  title: "Envío Gratis",
                  desc: "Barranquilla y Soledad",
                },
                {
                  icon: Shield,
                  title: "Garantizado",
                  desc: "Productos originales",
                },
                { icon: Clock, title: "24/7", desc: "Atención al cliente" },
                { icon: Zap, title: "Vibra Killa", desc: "Únete a nosotros" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-2 p-3 rounded-xl bg-card/50 border border-border/50 hover-lift"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {feature.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Carousel */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl carousel-container">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 scale-100"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-full scale-95"
                      : "opacity-0 translate-x-full scale-95"
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-sm opacity-90 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          ${product.price.toLocaleString()} COP
                        </span>
                        <a href={`/productos/${product.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-full"
                          >
                            Ver Detalles
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect hover:bg-primary/20 backdrop-blur-sm text-foreground"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-primary w-8"
                      : "bg-white/50 w-2 hover:w-4"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 animate-float backdrop-blur-sm" />
            <div
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/20 animate-float backdrop-blur-sm"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
