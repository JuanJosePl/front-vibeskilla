export const products = [
  {
    id: 1,
    name: "Mini Compresor Portátil 150 PSI",
    description:
      "Este compacto y potente compresor es tu aliado perfecto para mantener la presión adecuada en tus neumáticos y balones.",
    price: 115000,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compresor.jpg-QHlV3eJwTGSO5J4oDcq8gxJG660um3.jpeg",
    category: "herramientas",
    features: [
      "Presión máxima de 150 PSI para un inflado eficiente",
      "Batería recargable de 2000 mAh para uso inalámbrico",
      "Pantalla digital para monitorear la presión con precisión",
      "Luz LED incorporada para uso en condiciones de poca luz",
      "Incluye múltiples boquillas para adaptarse a diferentes válvulas",
    ],
    uses: ["Balones de fútbol, baloncesto y más", "Bicicletas y motocicletas", "Neumáticos de automóviles"],
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Parlante Grande AIBIMY Bluetooth",
    description:
      "Disfruta de un sonido envolvente con bajos profundos y agudos nítidos, ideal para tus reuniones y eventos.",
    price: 265000,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sonido.jpg-T3aq1JtdGkdBfyJy4lWUqArV3eBh5O.jpeg",
    category: "audio",
    features: [
      "Conectividad Bluetooth para una transmisión inalámbrica sin complicaciones",
      "Diseño robusto y portátil, perfecto para llevar a cualquier lugar",
      "Batería de larga duración para horas continuas de música",
      "Luces LED integradas que animan el ambiente",
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: 'Parlante para Niña "Headset Music" con Orejitas',
    description:
      "Diseño encantador con orejitas brillantes y sonido de alta fidelidad para una experiencia musical envolvente.",
    price: 88000,
    image: "/parlante-rosa-con-orejitas-de-gato-brillantes-para.jpg",
    category: "audio",
    features: [
      "Diseño encantador con orejitas brillantes",
      "Sonido de alta fidelidad para una experiencia musical envolvente",
      "Batería de larga duración para horas de diversión",
      "Compatible con dispositivos Bluetooth y entrada auxiliar",
      "Ideal para regalar y alegrar cualquier ocasión",
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: "Audífonos Inalámbricos para Niños con Luces LED RGB",
    description: "Sonido HI-FI de alta resolución con súper bass y luces RGB que brillan al ritmo de la música.",
    price: 70000,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/audifono.jpg-vIYmIjCxxX67wpzNIijo4SZ7hiYKDv.jpeg",
    category: "audio",
    features: [
      "Sonido HI-FI de alta resolución",
      "Súper Bass para una experiencia envolvente",
      "Luces RGB que brillan al ritmo de la música",
      "Batería de larga duración para horas de diversión",
      "Diseño cómodo y ajustable para los más pequeños",
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 5,
    name: "Proyector Astronauta Pequeño",
    description:
      "Crea un ambiente galáctico con luces de nebulosa y estrellas. Proyección personalizada con control remoto.",
    price: 78000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/astronautaa.jpg-P2cYbL3MsiOBQFWIJrUol1H0SPS4m6.jpeg",
    category: "iluminacion",
    features: [
      "Crea un ambiente galáctico con luces de nebulosa y estrellas",
      "Proyección personalizada",
      "Control remoto para ajustar colores y brillo",
      "Temporizador de apagado automático para noches tranquilas",
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 6,
    name: "AirPods Pro Inalámbricos",
    description: "Audífonos inalámbricos de alta calidad con cancelación de ruido y sonido premium.",
    price: 180000,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aiirpod.jpg-Gsx9XYdhAr6IdRYF8y37UcUBDpDqJL.jpeg",
    category: "audio",
    features: [
      "Cancelación activa de ruido",
      "Sonido de alta fidelidad",
      "Batería de larga duración",
      "Resistente al agua y sudor",
      "Estuche de carga inalámbrica",
    ],
    inStock: true,
    featured: true,
  },
]

export const categories = [
  { id: "audio", name: "Audio", icon: "🎵" },
  { id: "herramientas", name: "Herramientas", icon: "🔧" },
  { id: "iluminacion", name: "Iluminación", icon: "💡" },
  { id: "celulares", name: "Celulares", icon: "📱" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
]

export function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getProductsByCategory(category) {
  return products.filter((product) => product.category === category)
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured)
}

export function getProductById(id) {
  return products.find((product) => product.id === Number.parseInt(id))
}
