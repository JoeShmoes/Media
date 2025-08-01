
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Project, ProjectBoardColumn } from "@/lib/types"

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Project title is required"),
  service: z.string().min(1, "Service is required"),
  status: z.enum(["discovery", "planning", "building", "launch"]),
  deadline: z.string().optional(),
  link: z.string().optional(),
})

type FormValues = z.infer<typeof projectSchema>

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSave: (projectData: FormValues) => void
}

export function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        id: undefined,
        title: "",
        service: "",
        status: "discovery",
        deadline: "",
        link: "",
    }
  })
  
  React.useEffect(() => {
    if (project) {
      form.reset(project)
    } else {
      form.reset({
        id: undefined,
        title: "",
        service: "",
        status: "discovery",
        deadline: "",
        link: "",
      })
    }
  }, [project, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }
  
  const columnTitles: Record<ProjectBoardColumn, string> = {
    discovery: "Discovery",
    planning: "Planning",
    building: "Building",
    launch: "Launch",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update the details for your project." : "Enter the details for the new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Synergy Corp Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Website, SEO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(columnTitles) as ProjectBoardColumn[]).map(status => (
                        <SelectItem key={status} value={status}>
                          {columnTitles[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 days, Tomorrow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., framer.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
