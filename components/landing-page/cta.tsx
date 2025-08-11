import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-800 font-medium tracking-wider">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-6">
              Bring nature's blessings to your daily life
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Experience the charm of Fermy in your daily life. Now available at a special introductory price for
              first-time customers.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fermy 500ml</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-green-800">$4.98</span>
                  <span className="ml-2 text-gray-500 line-through">$498.80</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    500ml - About 10 days supply
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    100% organic ingredients
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Patented fermentation process
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    No additives • Sugar-free
                  </li>
                </ul>
                <Button size="lg" className="w-full bg-green-800 hover:bg-green-900 text-white">
                  Buy Now
                </Button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  ※ First-time customers 99% OFF Regular price $498.80
                </p>
              </div>
              <div className="relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NbQp5FxeGuiKOmwMpVkqvFO28tXwIY.png"
                  alt="Fermy bottle"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold py-2 px-4 rounded-full text-lg animate-pulse">
                  99% OFF First Time
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Even more savings with subscription</h3>
            <p className="text-gray-600 mb-6">
              With our monthly subscription, you can enjoy Fermy for $448.92 (10% OFF).
              <br />
              You can cancel anytime, and the discounted price applies from your second delivery onwards.
            </p>
            <Button
              variant="outline"
              className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white bg-transparent"
            >
              Learn more about subscription
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
