"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, All-Inclusive Pricing</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            One plan. All features. No hidden fees. Get started instantly.
          </p>
        </div>
        <div className="mt-12 max-w-md mx-auto">
          <Card className="glassmorphic border-primary/50 shadow-primary/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white">Pro Plan</CardTitle>
              <CardDescription>Everything you need to run and scale your business.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-5xl font-bold text-white">$49<span className="text-xl font-normal text-gray-300">/month</span></p>
              <ul className="mt-8 space-y-4 text-left">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Access to all rooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited projects & clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Full AI capabilities</span>
                </li>
                 <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>All integrations included</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" asChild>
                <Link href="/dashboard" prefetch={false}>
                  Get Started Instantly
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
