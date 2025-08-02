
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { NoteTemplate } from "@/lib/types"

interface NoteTemplateCardProps {
  template: NoteTemplate
  onEdit: () => void
  onDelete: () => void
}

export function NoteTemplateCard({ template, onEdit, onDelete }: NoteTemplateCardProps) {
  return (
    <Card className="glassmorphic flex flex-col group">
      <CardHeader>
        <CardTitle>{template.templateName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Note Title</h4>
            <p>{template.noteTitle}</p>
        </div>
        {template.noteContent && (
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Note Content</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{template.noteContent}</p>
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
