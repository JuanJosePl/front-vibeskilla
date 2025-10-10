import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo-killavibes.svg" alt="KillaVibes" width="32" height="32" className="h-8 w-8" />
              <span className="text-lg font-bold text-primary">KillaVibes</span>
            </a>
            <p className="text-sm text-muted-foreground">⚡ Tecnología que vibra contigo</p>
            <p className="text-sm text-muted-foreground">📍 Barranquilla | Envíos 🇨🇴🚚</p>
            <p className="text-sm text-muted-foreground">📲 Atención 24/7 | Garantizado🧿</p>
            <p className="text-sm text-muted-foreground">😎 ¡Únete a la vibra Killa!</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/productos" className="text-muted-foreground hover:text-primary transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="/categorias" className="text-muted-foreground hover:text-primary transition-colors">
                  Categorías
                </a>
              </li>
              <li>
                <a href="/ofertas" className="text-muted-foreground hover:text-primary transition-colors">
                  Ofertas
                </a>
              </li>
              <li>
                <a href="/sobre-nosotros" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/envios" className="text-muted-foreground hover:text-primary transition-colors">
                  Envíos
                </a>
              </li>
              <li>
                <a href="/devoluciones" className="text-muted-foreground hover:text-primary transition-colors">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="/garantia" className="text-muted-foreground hover:text-primary transition-colors">
                  Garantía
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Barranquilla, Colombia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+573002521314" className="text-muted-foreground hover:text-primary transition-colors">
                  +57 300 252 1314
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:info@killavibes.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@killavibes.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">24/7 Atención</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 KillaVibes. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}