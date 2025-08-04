"use client"

import { Hero } from "./(landing)/_components/hero";
import { Features } from "./(landing)/_components/features";
import { Rooms } from "./(landing)/_components/rooms";
import { Pricing } from "./(landing)/_components/pricing";
import { Contact } from "./(landing)/_components/contact";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <Hero />
                <Features />
                <Rooms />
                <Pricing />
                <Contact />
            </main>
        </div>
    )
}
