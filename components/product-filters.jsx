

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { categories, formatPrice } from "../lib/products"

export function ProductFilters({ filters, onFiltersChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 300000])

  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked
      ? [...(filters.categories || []), categoryId]
      : (filters.categories || []).filter((id) => id !== categoryId)

    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange)
    onFiltersChange({ ...filters, priceRange: newRange })
  }

  const clearFilters = () => {
    setPriceRange([0, 300000])
    onFiltersChange({ categories: [], priceRange: [0, 300000], inStock: false })
  }

  const hasActiveFilters =
    filters.categories?.length > 0 ||
    (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 300000)) ||
    filters.inStock

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && <span className="ml-2 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </div>

      {/* Filters Panel */}
      <div className={`${className} ${isOpen ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Filtros</CardTitle>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories?.includes(category.id) || false}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                    />
                    <Label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.icon} {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3">Rango de Precio</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={300000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <h3 className="font-semibold mb-3">Disponibilidad</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock || false}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, inStock: checked })}
                />
                <Label htmlFor="inStock" className="text-sm cursor-pointer">
                  Solo productos en stock
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
