import * as React from "react"
import { cn } from "@/lib/utils"

export const PageHeader = React.memo(function PageHeader({
  title,
  children,
  className,
}: {
  title: string
  children?: React.ReactNode,
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-3 items-center mb-6", className)}>
      <div className="col-start-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 justify-self-end">{children}</div>
    </div>
  )
})
