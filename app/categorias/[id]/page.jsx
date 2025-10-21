// pages/category-detail-page.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { PageLayout } from "../components/page-layout";
import { ProductCard } from "../components/product-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { categoryService } from "../services/categoryService";
import { useScrollToTop } from "../hooks/use-scroll-to-top";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sort: 'name',
    search: ''
  });

  useScrollToTop();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Determinar si el parámetro es un slug o ID
        let categoryResponse;
        if (id.length === 24) { // Asumiendo que los IDs de MongoDB tienen 24 caracteres
          categoryResponse = await categoryService.getCategoryById(id);
        } else {
          categoryResponse = await categoryService.getCategoryBySlug(id);
        }

        if (categoryResponse.success) {
          setCategory(categoryResponse.data);
          
          // Obtener productos de la categoría
          const productsResponse = await categoryService.getProductsByCategory(
            categoryResponse.data._id, 
            filters
          );
          
          if (productsResponse.success) {
            setProducts(productsResponse.data);
          } else {
            setProducts([]);
          }
        } else {
          setError("Categoría no encontrada");
        }
      } catch (err) {
        setError("Error al cargar la categoría");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id, filters]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !category) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">📂</div>
          <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La categoría que buscas no existe o ha sido removida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/categorias">
              <Button className="btn-primary">Volver a categorías</Button>
            </Link>
            <Link to="/productos">
              <Button variant="outline">Explorar productos</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/categorias" className="hover:text-primary transition-colors">
            Categorías
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">
            {category.name}
          </span>
        </div>

        {/* Back Button */}
        <Link
          to="/categorias"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a categorías
        </Link>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">
            {category.icon || '📦'}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-4">
              {category.description}
            </p>
          )}
          <Badge variant="secondary" className="text-sm">
            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Mostrando {products.length} productos
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center space-x-2"
            >
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-2"
            >
              <List className="h-4 w-4" />
              <span>Lista</span>
            </Button>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                variant={viewMode}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-semibold mb-4">
              No hay productos en esta categoría
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Pronto agregaremos productos a esta categoría. 
              Mientras tanto, puedes explorar nuestras otras categorías.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categorias">
                <Button className="btn-primary">
                  Explorar otras categorías
                </Button>
              </Link>
              <Link to="/productos">
                <Button variant="outline">
                  Ver todos los productos
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}