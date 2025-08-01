
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Edit, Trash2 } from "lucide-react"
import { type Offer } from "@/lib/types"

interface OfferCardProps {
  offer: Offer
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function OfferCard({ offer, onView, onEdit, onDelete }: OfferCardProps) {
  return (
    <Card className="glassmorphic flex flex-col group cursor-pointer hover:bg-muted/50 transition-colors" onClick={onView}>
      <CardHeader>
        <CardTitle>{offer.title}</CardTitle>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-3xl font-bold">${offer.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
        <div className="space-y-2">
          <h4 className="font-semibold">What's included:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {offer.features.map((feature) => (
              <li key={feature.id} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{feature.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
