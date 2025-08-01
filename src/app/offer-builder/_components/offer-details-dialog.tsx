
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Offer } from "@/lib/types"

interface OfferDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: Offer | null
}

export function OfferDetailsDialog({ open, onOpenChange, offer }: OfferDetailsDialogProps) {
  const { toast } = useToast()

  if (!offer) return null

  const handleCopyOffer = () => {
    const offerText = `
**${offer.title}**

**Description:**
${offer.description}

**Price:**
$${offer.price}/mo

**Features:**
${offer.features.map(f => `- ${f.name}`).join("\n")}
    `.trim()

    navigator.clipboard.writeText(offerText)
    toast({
      title: "Offer Copied!",
      description: "The offer details have been copied to your clipboard.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{offer.title}</DialogTitle>
          <DialogDescription>{offer.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="text-4xl font-bold">${offer.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
             <div>
                <h4 className="font-semibold mb-2">What's included:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {offer.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                        <span>{feature.name}</span>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCopyOffer}>
            <Copy className="mr-2" />
            Copy Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
