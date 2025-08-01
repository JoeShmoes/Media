
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Domain } from "@/lib/types"

const domainSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Domain name is required"),
  provider: z.string().min(1, "Provider is required"),
  expires: z.date({ required_error: "An expiration date is required." }),
})

type FormValues = z.infer<typeof domainSchema>

interface DomainDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  domain: Domain | null
  onSave: (domainData: Omit<FormValues, 'expires'> & { expires: string }) => void
}

export function DomainDialog({ open, onOpenChange, domain, onSave }: DomainDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
        id: "",
        name: "",
        provider: "",
        expires: new Date()
    }
  })
  
  React.useEffect(() => {
    if (domain) {
      form.reset({
        ...domain,
        expires: new Date(domain.expires)
      })
    } else {
      form.reset({
        id: undefined,
        name: "",
        provider: "",
        expires: new Date(),
      })
    }
  }, [domain, open, form])

  const onSubmit = (data: FormValues) => {
    onSave({ ...data, expires: data.expires.toISOString().split('T')[0] })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{domain ? "Edit Domain" : "Add New Domain"}</DialogTitle>
          <DialogDescription>
            {domain ? "Update the details for this domain." : "Enter the details for the new domain."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GoDaddy, Namecheap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expires"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Domain</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
