import * as React from "react"
import { LandingHeader } from "./_components/header";
import { LandingFooter } from "./_components/footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <LandingHeader/>
        <main className="flex-1">
            {children}
        </main>
        <LandingFooter/>
    </div>
  )
}
