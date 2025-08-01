
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Deal, DealStatus } from "@/lib/types"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const dealSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Deal title is required"),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  clientName: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["leads", "needs-analysis", "proposal", "negotiation", "closed-won", "closed-lost"]),
})

type FormValues = z.infer<typeof dealSchema>

const statusTitles: Record<DealStatus, string> = {
  leads: "New Lead",
  "needs-analysis": "Needs Analysis",
  proposal: "Proposal",
  negotiation: "Negotiation",
  "closed-won": "Closed-Won",
  "closed-lost": "Closed-Lost",
};

interface DealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: Deal | null
  onSave: (dealData: FormValues) => void
}

export function DealDialog({ open, onOpenChange, deal, onSave }: DealDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      id: undefined,
      title: "",
      value: 0,
      clientName: "",
      notes: "",
      status: "leads",
    },
  })

  React.useEffect(() => {
    if (deal) {
      form.reset(deal)
    } else {
      form.reset({
        id: undefined,
        title: "",
        value: 0,
        clientName: "",
        notes: "",
        status: "leads",
      })
    }
  }, [deal, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{deal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
          <DialogDescription>
            {deal ? "Update the details for this deal." : "Enter the details for a new deal in your pipeline."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Synergy Corp Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input type="number" step="100" placeholder="5,000" className="pl-6" {...field} />
                        </div>
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(Object.keys(statusTitles) as DealStatus[]).map(status => (
                            <SelectItem key={status} value={status}>
                              {statusTitles[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Innovate Inc." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any relevant notes about the deal..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Deal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
