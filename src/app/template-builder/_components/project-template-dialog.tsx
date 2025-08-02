
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
  DialogDescription,
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
import type { ProjectTemplate } from "@/lib/types"

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(1, "Template name is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  projectService: z.string().min(1, "Service is required"),
})

type FormValues = z.infer<typeof templateSchema>

interface ProjectTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ProjectTemplate | null
  onSave: (templateData: FormValues) => void
}

export function ProjectTemplateDialog({ open, onOpenChange, template, onSave }: ProjectTemplateDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
        id: "",
        templateName: "",
        projectTitle: "",
        projectService: "",
    }
  })
  
  React.useEffect(() => {
    if (template) {
      form.reset(template)
    } else {
      form.reset({
        id: undefined,
        templateName: "",
        projectTitle: "",
        projectService: "",
      })
    }
  }, [template, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{template ? "Edit Project Template" : "Create New Project Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the details for your template." : "Define a reusable template for your common projects."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Standard SEO Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr/>
            <h3 className="text-lg font-semibold">Project Details</h3>
            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SEO for [Client Name]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="projectService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SEO, Website, Ads" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
