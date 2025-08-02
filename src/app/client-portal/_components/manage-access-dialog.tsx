
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Client, ClientResource } from "@/lib/types"

const accessSchema = z.object({
  resourceId: z.string().min(1, "Please select a resource."),
  clientIds: z.array(z.string()).default([]),
})

type FormValues = z.infer<typeof accessSchema>

interface ManageAccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resources: ClientResource[]
  clients: Client[]
  onSave: (resourceId: string, clientIds: string[]) => void
}

export function ManageAccessDialog({ open, onOpenChange, resources, clients, onSave }: ManageAccessDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
        resourceId: "",
        clientIds: [],
    }
  })
  
  const selectedResourceId = form.watch("resourceId")

  React.useEffect(() => {
    if (selectedResourceId) {
      const resource = resources.find(r => r.id === selectedResourceId);
      if (resource) {
        form.setValue("clientIds", resource.clientIds);
      }
    } else {
        form.setValue("clientIds", []);
    }
  }, [selectedResourceId, resources, form])


  const onSubmit = (data: FormValues) => {
    onSave(data.resourceId, data.clientIds)
    onOpenChange(false)
    form.reset()
  }

  const activeClients = clients.filter(c => c.status === 'Active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Client Access</DialogTitle>
          <DialogDescription>
            Control which clients can see a specific resource.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Resource</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resource to manage..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resources.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedResourceId && (
                <FormField
                    control={form.control}
                    name="clientIds"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Grant Access To</FormLabel>
                            </div>
                            <div className="space-y-2">
                                {activeClients.map((client) => (
                                <FormField
                                    key={client.id}
                                    control={form.control}
                                    name="clientIds"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                        key={client.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(client.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), client.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) => value !== client.id
                                                        )
                                                        )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {client.name}
                                        </FormLabel>
                                        </FormItem>
                                    )
                                    }}
                                />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
             {selectedResourceId && activeClients.length === 0 && (
                <p className="text-sm text-center text-muted-foreground pt-4">You have no active clients to grant access to.</p>
             )}
            <DialogFooter>
              <Button type="submit" disabled={!selectedResourceId}>Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
