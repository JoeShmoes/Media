
"use client"
import { navLinks } from "@/components/layout/app-shell"
import { Card } from "@/components/ui/card"

export function Rooms() {
  return (
    <section id="rooms" className="w-full py-20 md:py-32 bg-black/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Explore the Rooms</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Each room in Nexaris Media is a dedicated workspace for a specific part of your business.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {navLinks.map((link) => (
            <Card
              key={link.href}
              className="glassmorphic p-4 flex flex-col items-center justify-center text-center space-y-2 border-gray-800 hover:border-gray-600 transition-colors"
            >
              <link.icon />
              <p className="text-sm font-medium text-white">{link.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
