
"use client";

import { Header } from "../(landing)/_components/header";
import { Footer } from "../(landing)/_components/footer";
import { motion } from "framer-motion";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <Header />
            <main className="flex-1 py-20 mt-20">
                 <motion.div
                    className="container mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white/5 p-8 md:p-12 rounded-lg glassmorphic border border-white/10 prose prose-invert max-w-4xl mx-auto">
                        {children}
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    )
}
