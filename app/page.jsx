import { PageLayout } from "../components/page-layout"
import { HeroSection } from "../components/hero-section"
import { FeaturedProducts } from "../components/featured-products"
import { CategoriesSection } from "../components/categories-section"
import { TestimonialsSection } from "../components/testimonials-section"

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <TestimonialsSection />
    </PageLayout>
  )
}