
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
import type { LegalDocument } from "@/lib/types"

const docSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Document name is required"),
  type: z.enum(["Contract", "NDA", "Template", "Other"]),
  fileUrl: z.string().min(1, "File URL or path is required"),
})

type FormValues = z.infer<typeof docSchema>

interface LegalDocDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doc: LegalDocument | null
  onSave: (docData: FormValues) => void
}

export function LegalDocDialog({ open, onOpenChange, doc, onSave }: LegalDocDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(docSchema),
    defaultValues: {
        id: "",
        name: "",
        type: "Contract",
        fileUrl: ""
    }
  })
  
  React.useEffect(() => {
    if (doc) {
      form.reset(doc)
    } else {
      form.reset({
        id: undefined,
        name: "",
        type: "Contract",
        fileUrl: "",
      })
    }
  }, [doc, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doc ? "Edit Legal Document" : "Add Legal Document"}</DialogTitle>
          <DialogDescription>
            {doc ? "Update the details for this document." : "Enter the details for the new document."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Client Services Agreement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="NDA">NDA</SelectItem>
                      <SelectItem value="Template">Template</SelectItem>
                       <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL / Path</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., /docs/contract.pdf or https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Document</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
