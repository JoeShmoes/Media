
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IntegrationCategory, Integration } from "@/lib/types"

const integrationSchema = z.object({
  name: z.string().min(1, "App name is required"),
  href: z.string().url("Please enter a valid URL."),
  category: z.enum(["Project Management", "Communication & Scheduling", "Custom Automations"]),
})

type FormValues = z.infer<typeof integrationSchema>

interface AddIntegrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<Integration, "icon">) => void
}

export function AddIntegrationDialog({ open, onOpenChange, onSave }: AddIntegrationDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      name: "",
      href: "",
      category: "Custom Automations",
    },
  })

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
          <DialogDescription>
            Enter the details for the new application you want to connect.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Awesome App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Project Management">Project Management</SelectItem>
                      <SelectItem value="Communication & Scheduling">Communication & Scheduling</SelectItem>
                      <SelectItem value="Custom Automations">Custom Automations</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Integration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
