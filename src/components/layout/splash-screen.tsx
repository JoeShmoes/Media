"use client"
import * as React from "react"
import { Icons } from "../icons"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) 

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
            <Icons.logo className="w-16 h-16 text-primary animate-pulse"/>
            <p className="text-muted-foreground">Loading your Command Center...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
