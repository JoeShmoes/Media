
"use client";

import * as React from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { signInWithGoogle } from "@/lib/auth";

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/50 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-white" />
          <span className="font-bold text-lg">Nexaris Media</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
           <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={signInWithGoogle}>
            Log In
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200" onClick={signInWithGoogle}>
            Sign Up
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
