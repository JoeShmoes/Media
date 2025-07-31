import * as React from "react"

export function PageHeader({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
