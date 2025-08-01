"use client"
import * as React from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 0) // 0 seconds delay
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
          <div className="relative">
            <Icons.logo
              className={cn(
                "w-24 h-24 text-white animate-in zoom-in-50 duration-500",
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-background/20 transition-all duration-300",
                "animate-in fade-in-0 slide-in-from-top-full duration-500 delay-200 fill-mode-both"
              )}
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              }}
            />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  )
}
