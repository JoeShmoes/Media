"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-transparent backdrop-blur-md sticky top-0 z-50">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <Icons.logo className="h-6 w-6 text-white" />
        <span className="sr-only">Nexaris Media</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Features
        </Link>
        <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Pricing
        </Link>
        <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Contact
        </Link>
        <Button asChild>
            <Link href="/dashboard">Go to App</Link>
        </Button>
      </nav>
    </header>
  )
}
