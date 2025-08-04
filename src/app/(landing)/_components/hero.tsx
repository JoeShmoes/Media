"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Hero() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto text-center px-4 md:px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
          Run Your Entire Business. All in One Place.
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
          Nexaris Media is your command center — manage clients, projects, outreach, finances, content, and more —
          powered by built-in AI.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard" prefetch={false}>
              Start Using Nexaris Media
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
            <Link href="#features" prefetch={false}>
              Explore Features
            </Link>
          </Button>
        </div>
        <div className="mt-12">
            <Card className="glassmorphic mx-auto max-w-4xl h-96 flex items-center justify-center">
                 <p className="text-muted-foreground">[Animated App Preview Mockup]</p>
            </Card>
        </div>
      </div>
    </section>
  )
}
