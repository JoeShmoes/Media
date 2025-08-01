"use client"
import * as React from "react"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Set loading to false immediately
    setIsLoading(false)
  }, [])

  // Render children directly without a loading screen
  return <>{children}</>
}
