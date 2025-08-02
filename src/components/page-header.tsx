import * as React from "react"
import { cn } from "@/lib/utils"

export const PageHeader = React.memo(function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children?: React.ReactNode,
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center mb-6 relative", className)}>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">{children}</div>
    </div>
  )
})