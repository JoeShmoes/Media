
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
import { Textarea } from "@/components/ui/textarea"
import type { TaskTemplate } from "@/lib/types"

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(1, "Template name is required"),
  taskName: z.string().min(1, "Task name is required"),
  taskDescription: z.string().optional(),
})

type FormValues = z.infer<typeof templateSchema>

interface TaskTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: TaskTemplate | null
  onSave: (templateData: FormValues) => void
}

export function TaskTemplateDialog({ open, onOpenChange, template, onSave }: TaskTemplateDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
        id: "",
        templateName: "",
        taskName: "",
        taskDescription: "",
    }
  })
  
  React.useEffect(() => {
    if (template) {
      form.reset(template)
    } else {
      form.reset({
        id: undefined,
        templateName: "",
        taskName: "",
        taskDescription: "",
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
          <DialogTitle>{template ? "Edit Template" : "Create New Task Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the details for your template." : "Define a reusable template for your common tasks."}
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
                    <Input placeholder="e.g., Weekly Client Report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr/>
            <h3 className="text-lg font-semibold">Task Details</h3>
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Generate and send weekly report for [Client Name]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add details or sub-steps for the task..." {...field} />
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
