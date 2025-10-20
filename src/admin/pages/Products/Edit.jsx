import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import {
  ArrowLeft,
  Save,
  Package,
  Upload,
  Plus,
  Trash2,
  X,
  Star,
  AlertCircle,
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProducts, updateProduct, loading } = useAdmin();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    costPrice: "",
    sku: "",
    stock: 0,
    trackQuantity: true,
    allowBackorder: false,
    categories: [],
    mainCategory: "",
    brand: "",
    status: "draft",
    isFeatured: false,
    isPublished: false,
    images: [],
    attributes: {
      size: [],
      color: [],
      material: [],
    },
    variants: [],
    seo: {
      title: "",
      description: "",
      metaKeywords: [],
    },
  });

  const [newImage, setNewImage] = useState({ url: "", altText: "" });
  const [newKeyword, setNewKeyword] = useState("");
  const [newVariant, setNewVariant] = useState({
    sku: "",
    price: "",
    stock: 0,
    attributes: {
      size: "",
      color: "",
    },
    images: [],
  });

  // Función para formatear SKU en uppercase
  const formatSKU = (sku) => {
    return sku.toUpperCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await getProducts();
      const product =
        response.data?.find((p) => p._id === id) ||
        response.find((p) => p._id === id);
      if (product) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          price: product.price || "",
          comparePrice: product.comparePrice || "",
          costPrice: product.costPrice || "",
          sku: product.sku || "",
          stock: product.stock || 0,
          trackQuantity: product.trackQuantity !== false,
          allowBackorder: product.allowBackorder || false,
          categories: product.categories || [],
          mainCategory: product.mainCategory || "",
          brand: product.brand || "",
          status: product.status || "draft",
          isFeatured: product.isFeatured || false,
          isPublished: product.isPublished || false,
          images: product.images || [],
          attributes: product.attributes || {
            size: [],
            color: [],
            material: [],
          },
          variants: product.variants || [],
          seo: product.seo || { title: "", description: "", metaKeywords: [] },
        });
      }
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Error al cargar el producto: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos para enviar
      const productData = {
        ...formData,
        sku: formatSKU(formData.sku),
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stock: parseInt(formData.stock),
        // Asegurar que los arrays estén correctos
        categories: Array.isArray(formData.categories) ? formData.categories : [],
        images: formData.images.map(img => ({
          url: img.url,
          altText: img.altText || '',
          isPrimary: img.isPrimary || false
        })),
        attributes: {
          size: Array.isArray(formData.attributes.size) ? formData.attributes.size : [],
          color: Array.isArray(formData.attributes.color) ? formData.attributes.color : [],
          material: Array.isArray(formData.attributes.material) ? formData.attributes.material : []
        },
        variants: Array.isArray(formData.variants) ? formData.variants : [],
        seo: {
          title: formData.seo.title || '',
          description: formData.seo.description || '',
          metaKeywords: Array.isArray(formData.seo.metaKeywords) ? formData.seo.metaKeywords : []
        }
      };

      console.log('📤 Actualizando producto:', productData);
      
      await updateProduct(id, productData);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'sku') {
      // Formatear SKU automáticamente
      setFormData(prev => ({
        ...prev,
        [name]: formatSKU(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleAttributeChange = (attributeType, value) => {
    const valuesArray = value.split(',')
      .map(v => v.trim())
      .filter(v => v);
    
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeType]: valuesArray
      }
    }));
  };

  const handleAddImage = () => {
    if (newImage.url.trim() && formData.images.length < 5) {
      const newImageObj = { 
        url: newImage.url.trim(), 
        altText: newImage.altText.trim(),
        isPrimary: formData.images.length === 0 
      };
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageObj]
      }));
      setNewImage({ url: '', altText: '' });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaKeywords: [...prev.seo.metaKeywords, newKeyword.trim()]
        }
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        metaKeywords: prev.seo.metaKeywords.filter((_, i) => i !== index)
      }
    }));
  };

  const maxImages = 5;
  const remainingImages = maxImages - formData.images.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Editar Producto
          </h1>
          <p className="text-muted-foreground mt-2">
            Actualiza la información del producto
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Información Básica
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: iPhone 15 Pro Max"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.name.length}/100 caracteres
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción Corta
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    maxLength={300}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Breve descripción del producto..."
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.shortDescription.length}/300 caracteres
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción Completa *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    maxLength={2000}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Descripción detallada del producto..."
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/2000 caracteres
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Apple, Samsung, etc."
                  />
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Precios
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio de Venta *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio Regular
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio de Costo
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Inventario
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="SKU-001 (se convertirá a mayúsculas)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="trackQuantity"
                    checked={formData.trackQuantity}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-foreground">
                    Controlar Inventario
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="allowBackorder"
                    checked={formData.allowBackorder}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-foreground">
                    Permitir Backorder
                  </label>
                </div>
              </div>
            </div>

            {/* Attributes Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Atributos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tallas (separar por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.size.join(", ")}
                    onChange={(e) =>
                      handleAttributeChange("size", e.target.value)
                    }
                    placeholder="S, M, L, XL"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Colores (separar por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.color.join(", ")}
                    onChange={(e) =>
                      handleAttributeChange("color", e.target.value)
                    }
                    placeholder="Rojo, Azul, Verde"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Materiales (separar por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.attributes.material.join(", ")}
                    onChange={(e) =>
                      handleAttributeChange("material", e.target.value)
                    }
                    placeholder="Algodón, Poliéster"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                SEO
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) =>
                      handleNestedChange("seo", "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Título para motores de búsqueda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) =>
                      handleNestedChange("seo", "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Descripción para motores de búsqueda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Palabras Clave
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Agregar palabra clave"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      disabled={!newKeyword.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {formData.seo.metaKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.seo.metaKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary text-primary-foreground"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="ml-2 hover:text-primary-foreground/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Estado
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estado del Producto
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="draft">Borrador</option>
                    <option value="active">Activo</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-foreground">
                    <Star className="h-4 w-4 inline mr-1" />
                    Producto Destacado
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-foreground">
                    Publicado
                  </label>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Imágenes{" "}
                {formData.images.length > 0 &&
                  `(${formData.images.length}/${maxImages})`}
              </h3>

              {formData.images.length >= maxImages && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Has alcanzado el límite máximo de {maxImages} imágenes
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {formData.images.length < maxImages && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        URL de la Imagen *
                      </label>
                      <input
                        type="text"
                        value={newImage.url}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Texto Alternativo
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newImage.altText}
                          onChange={(e) =>
                            setNewImage((prev) => ({
                              ...prev,
                              altText: e.target.value,
                            }))
                          }
                          placeholder="Descripción de la imagen"
                          className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleAddImage}
                          disabled={!newImage.url.trim()}
                          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group border border-border rounded-lg overflow-hidden"
                      >
                        <img
                          src={image.url}
                          alt={image.altText}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            className={`p-1 rounded ${
                              image.isPrimary
                                ? "bg-green-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                            title={
                              image.isPrimary
                                ? "Imagen principal"
                                : "Establecer como principal"
                            }
                          >
                            <Star className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Eliminar imagen"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        {image.isPrimary && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="w-full btn-outline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;