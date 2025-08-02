"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Edit, Trash2 } from "lucide-react"
import type { OfferTemplate } from "@/lib/types"

interface OfferTemplateCardProps {
  template: OfferTemplate
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function OfferTemplateCard({ template, onView, onEdit, onDelete }: OfferTemplateCardProps) {
  return (
    <Card className="glassmorphic flex flex-col group cursor-pointer hover:bg-muted/50 transition-colors" onClick={onView}>
      <CardHeader>
        <CardTitle>{template.templateName}</CardTitle>
        <CardDescription>Offer Template</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Offer Title</h4>
            <p>{template.offerTitle}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Offer Price</h4>
            <p>${template.offerPrice}/mo</p>
        </div>
        {template.offerFeatures.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  {template.offerFeatures.slice(0,3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500"/>
                        <span>{feature}</span>
                    </li>
                  ))}
                  {template.offerFeatures.length > 3 && (
                    <li className="text-xs">...and {template.offerFeatures.length - 3} more</li>
                  )}
                </ul>
            </div>
        )}
        
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
