import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Trash2, AlertCircle } from 'lucide-react';

const ProductForm = ({ product, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    stock: 0,
    trackQuantity: true,
    allowBackorder: false,
    categories: [],
    mainCategory: '',
    brand: '',
    status: 'draft',
    isFeatured: false,
    isPublished: false,
    images: [],
    attributes: {
      size: [],
      color: [],
      material: []
    },
    variants: [],
    seo: {
      title: '',
      description: '',
      metaKeywords: []
    }
  });

  const [newImage, setNewImage] = useState({ url: '', altText: '' });
  const [newAttribute, setNewAttribute] = useState({ type: 'size', value: '' });
  const [newKeyword, setNewKeyword] = useState('');
  const [newVariant, setNewVariant] = useState({
    sku: '',
    price: '',
    stock: 0,
    attributes: {
      size: '',
      color: ''
    },
    images: []
  });
  const [newVariantImage, setNewVariantImage] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleAttributeChange = (attributeType, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeType]: value.split(',').map(v => v.trim()).filter(v => v)
      }
    }));
  };

  const handleAddImage = () => {
    if (newImage.url.trim() && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { 
          url: newImage.url.trim(), 
          altText: newImage.altText.trim(),
          isPrimary: prev.images.length === 0 
        }]
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

  const handleAddVariant = () => {
    if (newVariant.sku.trim() && newVariant.price) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, {
          ...newVariant,
          sku: newVariant.sku.trim(),
          price: parseFloat(newVariant.price),
          stock: parseInt(newVariant.stock) || 0
        }]
      }));
      setNewVariant({
        sku: '',
        price: '',
        stock: 0,
        attributes: { size: '', color: '' },
        images: []
      });
    }
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleAddVariantImage = () => {
    if (newVariantImage.trim()) {
      setNewVariant(prev => ({
        ...prev,
        images: [...prev.images, newVariantImage.trim()]
      }));
      setNewVariantImage('');
    }
  };

  const handleRemoveVariantImage = (index) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const maxImages = 5;
  const remainingImages = maxImages - formData.images.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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
              placeholder="Nombre del producto (máx. 100 caracteres)"
            />
          </div>

          <div className="md:col-span-2">
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
              placeholder="Descripción breve (máx. 300 caracteres)"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {formData.shortDescription.length}/300 caracteres
            </div>
          </div>

          <div className="md:col-span-2">
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
              placeholder="Descripción detallada del producto (máx. 2000 caracteres)"
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
              placeholder="Marca del producto"
            />
          </div>

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
              placeholder="Código único del producto"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Precios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Precio de Venta *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Inventario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
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

      {/* Images */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Imágenes {formData.images.length > 0 && `(${formData.images.length}/${maxImages})`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL de la Imagen *
                </label>
                <input
                  type="text"
                  value={newImage.url}
                  onChange={(e) => setNewImage(prev => ({ ...prev, url: e.target.value }))}
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
                    onChange={(e) => setNewImage(prev => ({ ...prev, altText: e.target.value }))}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group border border-border rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(index)}
                      className={`p-2 rounded-full ${
                        image.isPrimary 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      title={image.isPrimary ? 'Imagen principal' : 'Establecer como principal'}
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                  {image.altText && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                      {image.altText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Atributos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tallas
            </label>
            <input
              type="text"
              value={formData.attributes.size.join(', ')}
              onChange={(e) => handleAttributeChange('size', e.target.value)}
              placeholder="S, M, L, XL"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Colores
            </label>
            <input
              type="text"
              value={formData.attributes.color.join(', ')}
              onChange={(e) => handleAttributeChange('color', e.target.value)}
              placeholder="Rojo, Azul, Verde"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Materiales
            </label>
            <input
              type="text"
              value={formData.attributes.material.join(', ')}
              onChange={(e) => handleAttributeChange('material', e.target.value)}
              placeholder="Algodón, Poliéster"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Variantes</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">SKU Variante</label>
              <input
                type="text"
                value={newVariant.sku}
                onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="SKU-VARIANTE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Precio</label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stock</label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddVariant}
                disabled={!newVariant.sku.trim() || !newVariant.price}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Variante
              </button>
            </div>
          </div>

          {formData.variants.length > 0 && (
            <div className="space-y-2">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{variant.sku}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      - ${variant.price} | Stock: {variant.stock}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">SEO</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título SEO
            </label>
            <input
              type="text"
              value={formData.seo.title}
              onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
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
              onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
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
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary text-primary-foreground">
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

      {/* Status */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Estado</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-outline"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;