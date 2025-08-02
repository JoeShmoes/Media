
"use client"

import * as React from "react"
import { ClipboardList, StickyNote, FileText, Book, GitCompareArrows } from "lucide-react"

import type { DocumentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AutoDocsSidebarProps {
  activeService: DocumentType;
  onSelectService: (service: DocumentType) => void;
}

const services: { type: DocumentType, icon: React.ReactElement, label: string }[] = [
    { type: "Meeting Summary", icon: <ClipboardList className="h-4 w-4" />, label: "Summarize Transcript" },
    { type: "Call Note", icon: <StickyNote className="h-4 w-4" />, label: "Create Call Note" },
    { type: "Content Brief", icon: <FileText className="h-4 w-4" />, label: "Create Content Brief" },
    { type: "SOP", icon: <Book className="h-4 w-4" />, label: "Generate SOP" },
    { type: "Version Comparison", icon: <GitCompareArrows className="h-4 w-4" />, label: "Compare Documents" },
]


export function AutoDocsSidebar({ activeService, onSelectService }: AutoDocsSidebarProps) {
  return (
    <div className="h-full flex flex-col p-2 bg-background border-r">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Services</h2>
      </div>
      <ScrollArea className="flex-1 -mx-2">
        <div className="px-2 py-2 space-y-1">
          {services.map((service) => (
            <Button
                key={service.type}
                variant={activeService === service.type ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectService(service.type)}
            >
                {service.icon}
                <span className="ml-2">{service.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
