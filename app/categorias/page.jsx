// pages/categories-page.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "../../components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import  categoryService  from "../../src/services/categoryService";
import { useScrollToTop } from "../../hooks/use-scroll-to-top";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategoriesWithCount();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="text-center">
                  <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Mejorado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <span className="text-3xl">📁</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nuestras Categorías
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explora nuestra amplia gama de productos tecnológicos organizados por categorías. 
            Encuentra exactamente lo que necesitas.
          </p>
        </div>

        {/* Categories Grid Mejorado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category._id} 
              to={`/categorias/${category.slug || category._id}`}
              className="block group"
            >
              <Card
                className="h-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-2 group-hover:border-primary/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="relative">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                      {category.icon || '📦'}
                    </div>
                    {category.productCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                        {category.productCount}
                      </div>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300 text-xl">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground text-sm">
                    {category.productCount === 0 
                      ? 'Próximamente' 
                      : `${category.productCount} producto${category.productCount !== 1 ? 's' : ''} disponible${category.productCount !== 1 ? 's' : ''}`
                    }
                  </p>
                  {category.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </CardContent>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📂</div>
            <h3 className="text-2xl font-semibold mb-4">Categorías en preparación</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Estamos organizando nuestras categorías para ofrecerte la mejor experiencia de compra.
            </p>
            <Link to="/productos">
              <button className="btn-primary px-6 py-3 rounded-lg font-semibold">
                Explorar Todos los Productos
              </button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
}