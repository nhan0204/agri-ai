import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-green-800 font-medium tracking-wider">FEATURES</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
            Four features of Fermy
            <br />
            proven by tradition and science
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By combining traditional fermentation techniques from Amami Oshima with the latest research findings, we
            have created a more effective and delicious fermented drink.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GbYQwUVU7qAINjv4Z5H8OlhqsoT3sK.png"
              alt="Electron microscope image of lactic acid bacteria"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Patented Fermentation Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Our unique low-temperature fermentation process maximizes the activation of beneficial lactic acid
                bacteria. Based on scientific research, we have achieved the optimal fermentation environment for
                improving gut health.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Contains over 10 billion live lactic acid bacteria",
                "Patented low-temperature fermentation method",
                "Confirmed gut health improvement effects",
                "Joint research with research institutions",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-800 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NyQbxH7hgpo48PWQccxxwnvpUSE8fI.png"
                alt="Fermy drinking experience"
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Easy-to-drink taste</h4>
            <p className="text-gray-600">
              With a subtle sweetness and refreshing aftertaste, we've created a gentle flavor that's easy to continue
              daily.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uvTlVqL6zdl3rxG3ValUpgRBIBKT0z.png"
                alt="Nature of Amami Oshima"
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Carefully selected ingredients</h4>
            <p className="text-gray-600">
              We use ingredients nurtured by Amami Oshima's rich nature. No additives or sugar are used.
            </p>
          </div>

          <div className="relative lg:col-span-1 md:col-span-2 lg:mt-0 md:mt-8">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fmxw27mFWpKqjlfYZppsqTfJsFNryU.png"
                alt="Sunset view of Amami Oshima"
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Traditional wisdom</h4>
            <p className="text-gray-600">
              We apply fermentation techniques and wisdom that have been passed down through generations to modern
              times.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
