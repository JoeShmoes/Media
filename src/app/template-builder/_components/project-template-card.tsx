
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { ProjectTemplate } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ProjectTemplateCardProps {
  template: ProjectTemplate
  onEdit: () => void
  onDelete: () => void
}

export function ProjectTemplateCard({ template, onEdit, onDelete }: ProjectTemplateCardProps) {
  return (
    <Card className="glassmorphic flex flex-col group">
      <CardHeader>
        <CardTitle>{template.templateName}</CardTitle>
        <CardDescription>Project Template</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Project Title</h4>
            <p>{template.projectTitle}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-muted-foreground">Service</h4>
            <Badge variant="outline">{template.projectService}</Badge>
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
