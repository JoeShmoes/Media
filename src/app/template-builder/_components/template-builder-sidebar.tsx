"use client"

import * as React from "react"
import { LayoutTemplate, FileText, Package, SendHorizonal, KanbanSquare } from "lucide-react"

import type { TemplateType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TemplateBuilderSidebarProps {
  activeTemplateType: TemplateType;
  onSelectTemplateType: (type: TemplateType) => void;
}

const templateTypes: { type: TemplateType, icon: React.ReactElement, label: string }[] = [
    { type: "Task", icon: <LayoutTemplate className="h-4 w-4" />, label: "Task Templates" },
    { type: "Note", icon: <FileText className="h-4 w-4" />, label: "Note Templates" },
    { type: "Offer", icon: <Package className="h-4 w-4" />, label: "Offer Templates" },
    { type: "Outreach", icon: <SendHorizonal className="h-4 w-4" />, label: "Outreach Templates" },
    { type: "Project", icon: <KanbanSquare className="h-4 w-4" />, label: "Project Templates" },
]


export function TemplateBuilderSidebar({ activeTemplateType, onSelectTemplateType }: TemplateBuilderSidebarProps) {
  return (
    <div className="h-full flex flex-col p-2 bg-background border-r">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Template Types</h2>
      </div>
      <ScrollArea className="flex-1 -mx-2">
        <div className="px-2 py-2 space-y-1">
          {templateTypes.map((item) => (
            <Button
                key={item.type}
                variant={activeTemplateType === item.type ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectTemplateType(item.type)}
            >
                {item.icon}
                <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
