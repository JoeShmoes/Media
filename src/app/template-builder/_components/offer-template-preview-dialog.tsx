
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Check } from "lucide-react"
import type { OfferTemplate } from "@/lib/types"

interface OfferTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: OfferTemplate | null
}

export function OfferTemplatePreviewDialog({ open, onOpenChange, template }: OfferTemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{template.templateName}</DialogTitle>
          <DialogDescription>Offer Template Preview</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Offer Title</p>
                <p className="text-lg font-semibold">{template.offerTitle}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Offer Description</p>
                <p className="text-sm text-foreground">{template.offerDescription}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="text-2xl font-bold">${template.offerPrice}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
             <div>
                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Features</h4>
                <ul className="space-y-2 text-sm text-foreground">
                    {template.offerFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                        <span>{feature}</span>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
