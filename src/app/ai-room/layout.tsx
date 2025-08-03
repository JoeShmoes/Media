
import * as React from "react";

export default function AiRoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-theme(space.14))] bg-muted/40">
      {children}
    </div>
  )
}
