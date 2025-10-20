import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Trash2,
  X,
  Star,
  AlertCircle,
} from "lucide-react";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useAdmin();
  const [formErrors, setFormErrors] = useState({});

  // Función de validación del formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "El nombre es requerido";
    if (!formData.description.trim())
      errors.description = "La descripción es requerida";
    if (!formData.price || formData.price <= 0)
      errors.price = "El precio debe ser mayor a 0";
    if (!formData.sku.trim()) errors.sku = "El SKU es requerido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  // Función para generar slug automáticamente
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Función para formatear SKU en uppercase
  const formatSKU = (sku) => {
    return sku.toUpperCase().replace(/\s+/g, "-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDAR EL FORMULARIO ANTES DE ENVIAR
    if (!validateForm()) {
      alert("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      // Preparar datos para enviar - CORREGIDO
      const productData = {
        ...formData,
        slug: generateSlug(formData.name),
        sku: formatSKU(formData.sku),
        price: parseFloat(formData.price) || 0,
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice)
          : undefined,
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        stock: parseInt(formData.stock) || 0,
        // ENVIAR mainCategory SOLO SI TIENE VALOR, SINO OMITIRLO
        ...(formData.mainCategory &&
          formData.mainCategory.trim() !== "" && {
            mainCategory: formData.mainCategory,
          }),
        // Asegurar que los arrays estén correctos
        categories: Array.isArray(formData.categories)
          ? formData.categories
          : [],
        images: formData.images.map((img) => ({
          url: img.url,
          altText: img.altText || "",
          isPrimary: img.isPrimary || false,
        })),
        attributes: {
          size: Array.isArray(formData.attributes.size)
            ? formData.attributes.size
            : [],
          color: Array.isArray(formData.attributes.color)
            ? formData.attributes.color
            : [],
          material: Array.isArray(formData.attributes.material)
            ? formData.attributes.material
            : [],
        },
        variants: Array.isArray(formData.variants) ? formData.variants : [],
        seo: {
          title: formData.seo.title || "",
          description: formData.seo.description || "",
          metaKeywords: Array.isArray(formData.seo.metaKeywords)
            ? formData.seo.metaKeywords
            : [],
        },
      };

      // Limpiar el objeto - eliminar campos vacíos
      Object.keys(productData).forEach((key) => {
        if (
          productData[key] === "" ||
          productData[key] === null ||
          productData[key] === undefined
        ) {
          delete productData[key];
        }
      });

      console.log("📤 Enviando producto limpio:", productData);

      await createProduct(productData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error al crear el producto: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sku") {
      // Formatear SKU automáticamente
      setFormData((prev) => ({
        ...prev,
        [name]: formatSKU(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Generar slug automáticamente cuando cambia el nombre
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        seo: {
          ...prev.seo,
          title: prev.seo.title || value,
          description: prev.seo.description || value,
        },
      }));
    }

    // Limpiar errores cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleAttributeChange = (attributeType, value) => {
    const valuesArray = value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);

    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeType]: valuesArray,
      },
    }));
  };

  const handleAddImage = () => {
    if (newImage.url.trim() && formData.images.length < 5) {
      const newImageObj = {
        url: newImage.url.trim(),
        altText: newImage.altText.trim(),
        isPrimary: formData.images.length === 0,
      };

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageObj],
      }));
      setNewImage({ url: "", altText: "" });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaKeywords: [...prev.seo.metaKeywords, newKeyword.trim()],
        },
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        metaKeywords: prev.seo.metaKeywords.filter((_, i) => i !== index),
      },
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
          <h1 className="text-3xl font-bold text-foreground">Crear Producto</h1>
          <p className="text-muted-foreground mt-2">
            Agrega un nuevo producto a tu catálogo
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      formErrors.name ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Ej: iPhone 15 Pro Max"
                  />
                  {formErrors.name && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.name.length}/100 caracteres - Slug:{" "}
                    {generateSlug(formData.name)}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-border"
                    }`}
                    placeholder="Descripción detallada del producto..."
                  />
                  {formErrors.description && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.description}
                    </div>
                  )}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      formErrors.price ? "border-red-500" : "border-border"
                    }`}
                  />
                  {formErrors.price && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.price}
                    </div>
                  )}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      formErrors.sku ? "border-red-500" : "border-border"
                    }`}
                    placeholder="SKU-001 (se convertirá a mayúsculas)"
                  />
                  {formErrors.sku && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.sku}
                    </div>
                  )}
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
                    Publicar Inmediatamente
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
                  <span>{loading ? "Creando..." : "Crear Producto"}</span>
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

export default CreateProduct;
