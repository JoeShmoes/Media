"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { OutreachTemplate } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface OutreachTemplateCardProps {
  template: OutreachTemplate
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function OutreachTemplateCard({ template, onView, onEdit, onDelete }: OutreachTemplateCardProps) {
  return (
    <Card className="glassmorphic flex flex-col group cursor-pointer hover:bg-muted/50 transition-colors" onClick={onView}>
      <CardHeader>
        <CardTitle>{template.templateName}</CardTitle>
        <CardDescription>Outreach Template</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <Badge variant="outline">{template.outreachType}</Badge>
        </div>
        {template.outreachSubject && (
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Subject</h4>
                <p className="text-sm text-muted-foreground">{template.outreachSubject}</p>
            </div>
        )}
         <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Body</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{template.outreachBody}</p>
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
