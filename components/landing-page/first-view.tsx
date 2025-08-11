import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function FirstView() {
  return (
    <section className="min-h-screen pt-24 relative overflow-hidden bg-gradient-to-b from-orange-50 to-green-50">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-transparent" />

      <div className="container mx-auto px-4 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-block bg-green-800/10 px-4 py-2 rounded-full">
              <span className="text-green-800 font-medium tracking-wider text-sm">
                A new concept guided by Amami Oshima tradition
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900">
              <span className="block">With the power of traditional fermentation,</span>
              <span className="block text-green-800">Beautiful and healthy</span>
              <span className="block">from within your body.</span>
            </h1>

            <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl space-y-4">
              <p>
                An innovative wellness drink that combines the traditional fermented beverage 'Miki' from Amami Oshima
                with nutritious goat milk.
              </p>
              <p>Fermy, born from 100% organic ingredients, supports your healthy daily life.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-800 hover:bg-green-900 text-white px-8 rounded-full">
                View Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white rounded-full bg-transparent"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8" role="region" aria-label="Product statistics">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">96%</div>
                <div className="text-sm text-gray-600 leading-snug">feel the benefits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">100%</div>
                <div className="text-sm text-gray-600 leading-snug">organic ingredients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">89%</div>
                <div className="text-sm text-gray-600 leading-snug">repeat rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NbQp5FxeGuiKOmwMpVkqvFO28tXwIY.png"
                alt="Fermy fermented drink bottle - health beverage made with traditional Amami Oshima technology"
                fill
                className="object-contain transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            {/* Decorative elements */}
            <div
              className="absolute top-1/4 -right-1/4 w-72 h-72 bg-green-800/5 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-1/4 -left-1/4 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"
              aria-hidden="true"
            />

            {/* Product badges */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-green-800 font-medium text-sm">Patented Process</span>
            </div>
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-green-800 font-medium text-sm">No Additives • Sugar-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" aria-hidden="true">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-600">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-green-800 to-transparent" />
        </div>
      </div>
    </section>
  )
}
