
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


const formSchema = z.object({
  balance: z.coerce.number().min(0, "Balance must be a positive number"),
})

type FormValues = z.infer<typeof formSchema>

interface InitialBalanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (balance: number) => void
}

export function InitialBalanceDialog({ open, onOpenChange, onSave }: InitialBalanceDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 0,
    },
  })

  const onSubmit = (data: FormValues) => {
    onSave(data.balance)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to the Finance Room!</DialogTitle>
          <DialogDescription>
            To get started, please enter your current bank balance. This will be your starting point for tracking your finances.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" step="0.01" placeholder="0.00" className="pl-6" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Get Started</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
