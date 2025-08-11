import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BrandStory() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center mb-16">
          <span className="text-green-800 font-medium tracking-wider">ABOUT FERMY</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
            Where tradition meets innovation,
            <br />a new fermentation culture is born.
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The fermented beverage "Miki" has been passed down through generations in Amami Oshima. By combining this
            wisdom with modern technology, we wanted to bring health to more people. This is how Fermy was born.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uvTlVqL6zdl3rxG3ValUpgRBIBKT0z.png"
              alt="Rich nature of Amami Oshima"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Traditional fermentation culture
              <br />
              nurtured by Amami Oshima's rich nature
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Amami Oshima, surrounded by beautiful nature as shown in the photo. The fermented beverage "Miki," which
              has supported the health of islanders since ancient times in this land blessed with a warm climate and
              rich environment, is a crystallization of the blessings of the land and the wisdom of our ancestors.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Fermy focuses on this traditional fermentation technology. Through the latest research, the health effects
              of "Miki" are being scientifically proven, and we have evolved its potential to suit modern lifestyles.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Fermy's Development Story
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🌱</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Harmony with Nature</h4>
            <p className="text-gray-600">
              Ingredient sourcing and manufacturing processes that consider Amami Oshima's natural environment
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🔬</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Scientific Approach</h4>
            <p className="text-gray-600">
              Fusion of traditional fermentation techniques with the latest research findings
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">💫</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Legacy for the Future</h4>
            <p className="text-gray-600">
              Our mission to pass on the value of traditional culture to the next generation
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
