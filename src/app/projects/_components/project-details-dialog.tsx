
"use client"

import * as React from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

const statusMap: { [key in Project['status']]: string } = {
    discovery: 'Discovery',
    planning: 'Planning',
    building: 'Building',
    launch: 'Launch'
}


export function ProjectDetailsDialog({ open, onOpenChange, project }: ProjectDetailsDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline">{project.service}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-muted-foreground">Status</p>
                <div className="col-span-3">
                    <p>{statusMap[project.status]}</p>
                </div>
            </div>
            {project.deadline && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-muted-foreground">Deadline</p>
                    <p className="col-span-3">{project.deadline}</p>
                </div>
            )}
            {project.link && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-muted-foreground">Link</p>
                    <div className="col-span-3">
                         <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            {project.link} <ExternalLink className="h-4 w-4"/>
                         </a>
                    </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
