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
import type { OutreachTemplate } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(1, "Template name is required"),
  outreachType: z.enum(["DM", "Email", "Phone", "Follow Up"]),
  outreachSubject: z.string().optional(),
  outreachBody: z.string().min(1, "Body content is required"),
})

type FormValues = z.infer<typeof templateSchema>

interface OutreachTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: OutreachTemplate | null
  onSave: (templateData: FormValues) => void
}

export function OutreachTemplateDialog({ open, onOpenChange, template, onSave }: OutreachTemplateDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
        id: "",
        templateName: "",
        outreachType: "Email",
        outreachSubject: "",
        outreachBody: "",
    }
  })
  
  React.useEffect(() => {
    if (template) {
      form.reset(template)
    } else {
      form.reset({
        id: undefined,
        templateName: "",
        outreachType: "Email",
        outreachSubject: "",
        outreachBody: "",
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
          <DialogTitle>{template ? "Edit Outreach Template" : "Create New Outreach Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the details for your template." : "Define a reusable template for your outreach messages."}
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
                    <Input placeholder="e.g., Initial Cold Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr/>
            <h3 className="text-lg font-semibold">Message Details</h3>
             <FormField
                control={form.control}
                name="outreachType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Outreach Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an outreach type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="DM">Direct Message (DM)</SelectItem>
                        <SelectItem value="Phone">Phone Call Script</SelectItem>
                        <SelectItem value="Follow Up">Follow Up</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="outreachSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Question about [Company]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outreachBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your message here. Use placeholders like [Name] or [Company]." {...field} rows={6} />
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
