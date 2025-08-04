"use client"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { Twitter, Github, Dribbble } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-black/20 text-white py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Icons.logo className="h-8 w-8 text-white" />
            <span className="text-xl font-semibold">Nexaris Media</span>
          </Link>
          <p className="text-gray-400">
            Your command center to run and scale every business you own, powered by built-in AI.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <Link href="#features" className="text-gray-400 hover:text-white" prefetch={false}>
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-gray-400 hover:text-white" prefetch={false}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-gray-400 hover:text-white" prefetch={false}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-1">
            <li>
              <Link href="#" className="text-gray-400 hover:text-white" prefetch={false}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white" prefetch={false}>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Follow Us</h4>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-white" prefetch={false}>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white" prefetch={false}>
              <Github className="h-6 w-6" />
            </Link>
             <Link href="#" className="text-gray-400 hover:text-white" prefetch={false}>
              <Dribbble className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Nexaris Media. All rights reserved.
      </div>
    </footer>
  )
}
