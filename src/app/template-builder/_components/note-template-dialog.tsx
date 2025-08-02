
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
import type { NoteTemplate } from "@/lib/types"

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(1, "Template name is required"),
  noteTitle: z.string().min(1, "Note title is required"),
  noteContent: z.string().optional(),
})

type FormValues = z.infer<typeof templateSchema>

interface NoteTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: NoteTemplate | null
  onSave: (templateData: FormValues) => void
}

export function NoteTemplateDialog({ open, onOpenChange, template, onSave }: NoteTemplateDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
        id: "",
        templateName: "",
        noteTitle: "",
        noteContent: "",
    }
  })
  
  React.useEffect(() => {
    if (template) {
      form.reset(template)
    } else {
      form.reset({
        id: undefined,
        templateName: "",
        noteTitle: "",
        noteContent: "",
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
          <DialogTitle>{template ? "Edit Template" : "Create New Note Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the details for your template." : "Define a reusable template for your common notes."}
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
                    <Input placeholder="e.g., Client Meeting Follow-Up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr/>
            <h3 className="text-lg font-semibold">Note Details</h3>
            <FormField
              control={form.control}
              name="noteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Meeting Summary - [Client Name] - [Date]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noteContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Pre-fill the note with a structure, like headings or bullet points." {...field} />
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
