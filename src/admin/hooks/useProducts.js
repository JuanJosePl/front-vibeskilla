import { useState, useEffect } from "react";
import { useAdmin } from "./useAdmin";

export const useProducts = () => {
  const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useAdmin();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [initialized, setInitialized] = useState(false);

  const fetchProducts = async (params = {}) => {
    try {
      const response = await getProducts(params);
      console.log("📨 Products response:", response);

      // Manejar diferentes estructuras de respuesta
      const productsData = response.data || response.products || response;
      const paginationData = response.pagination || response.meta || {};

      setProducts(Array.isArray(productsData) ? productsData : []);
      setPagination(paginationData);
      setInitialized(true);

      return response;
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setProducts([]);
      setInitialized(true);
      throw err;
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      console.log("🔄 Creando producto:", productData);
      const response = await createProduct(productData);
      console.log("✅ Producto creado exitosamente");
      await fetchProducts(); // Refrescar la lista
      return response;
    } catch (err) {
      console.error("❌ Error creando producto:", err);
      throw err;
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const response = await updateProduct(id, productData);
      await fetchProducts(); // Refrescar la lista
      return response;
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      await fetchProducts(); // Refrescar la lista
      return response;
    } catch (err) {
      throw err;
    }
  };

  // Cargar productos solo una vez al inicializar
  useEffect(() => {
    if (!initialized) {
      fetchProducts();
    }
  }, [initialized]);

  return {
    products,
    loading,
    error,
    pagination,
    initialized,
    fetchProducts,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
  };
};
