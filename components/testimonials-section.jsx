import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "María González",
    location: "Barranquilla",
    rating: 5,
    comment:
      "Excelente servicio y productos de calidad. Los audífonos que compré suenan increíbles y llegaron súper rápido.",
    avatar: "/diverse-woman-avatar.png",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "Soledad",
    rating: 5,
    comment: "El compresor portátil me salvó en una emergencia. Funciona perfecto y la batería dura mucho tiempo.",
    avatar: "/man-avatar.png",
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    location: "Barranquilla",
    rating: 5,
    comment: "Mi hija ama el parlante con orejitas de gato. La calidad del sonido es excelente y el diseño es hermoso.",
    avatar: "/woman-avatar-2.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Miles de clientes satisfechos confían en KillaVibes para sus necesidades tecnológicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="animate-slide-in-up bg-card border-border"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary/20 mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 text-pretty">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}