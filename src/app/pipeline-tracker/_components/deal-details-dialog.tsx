
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Deal } from "@/lib/types"

interface DealDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: Deal | null
}

export function DealDetailsDialog({ open, onOpenChange, deal }: DealDetailsDialogProps) {
  if (!deal) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{deal.title}</DialogTitle>
          <DialogDescription>
            {deal.clientName || "No client specified"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Value</p>
            <p className="text-xl font-semibold">${deal.value.toLocaleString()}</p>
          </div>
          {deal.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
