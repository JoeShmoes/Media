
"use client";
import Link from "next/link";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Icons.logo className="h-8 w-8 text-white" />
              <p className="font-bold text-xl">Nexaris Media</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Your central AI command hub to run and scale every business you own.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
             <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="mailto:nexarismedia@gmail.com" className="hover:text-white">Email Us</a></li>
                 </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Nexaris Media. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
