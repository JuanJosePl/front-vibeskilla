import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useAdmin } from "../../hooks/useAdmin";
import { Plus, Search, Edit, Trash2, Package, Eye, Star } from "lucide-react";

const Products = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const { products, loading, error, pagination, fetchProducts } = useProducts();
  const { deleteProduct } = useAdmin();

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres archivar este producto?")) {
      try {
        await deleteProduct(id);
        await fetchProducts(); // Refrescar la lista después de eliminar
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  // Filtrar productos localmente basado en los filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || product.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  // Paginación local
  const paginatedProducts = filteredProducts.slice(
    (filters.page - 1) * filters.limit,
    filters.page * filters.limit
  );

  const totalPages = Math.ceil(filteredProducts.length / filters.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todos los productos de tu tienda
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o SKU..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusFilter("")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.status === ""
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-accent"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleStatusFilter("active")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.status === "active"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-background border-border hover:bg-accent"
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => handleStatusFilter("draft")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.status === "draft"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-background border-border hover:bg-accent"
              }`}
            >
              Borradores
            </button>
            <button
              onClick={() => handleStatusFilter("archived")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.status === "archived"
                  ? "bg-gray-100 text-gray-800 border-gray-200"
                  : "bg-background border-border hover:bg-accent"
              }`}
            >
              Archivados
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Producto
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      SKU
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Precio
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Estado
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {product.brand && `${product.brand} • `}
                              {product.categories?.[0]?.name || "Sin categoría"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {product.sku}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-foreground">
                            ${product.price}
                          </p>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.comparePrice}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock} unidades
                        </span>
                        {product.variants && product.variants.length > 0 && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            +{product.variants.length} variantes
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.status === "active"
                                ? "bg-green-100 text-green-800"
                                : product.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.status === "active"
                              ? "Activo"
                              : product.status === "draft"
                              ? "Borrador"
                              : "Archivado"}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="h-3 w-3 mr-1" />
                              Destacado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/productos/${product.slug || product._id}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver en tienda"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Archivar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay productos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.status
                    ? "No se encontraron productos con los filtros aplicados."
                    : "Comienza agregando tu primer producto."}
                </p>
                {!filters.search && !filters.status && (
                  <Link
                    to="/admin/products/create"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Crear Producto</span>
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-muted-foreground">
                    Página {filters.page} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={filters.page === totalPages}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;