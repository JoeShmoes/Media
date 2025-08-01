
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
import type { DesignAsset } from "@/lib/types"

const assetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Asset name is required"),
  type: z.enum(["Logo", "Font", "Color", "Mockup", "Other"]),
  fileUrl: z.string().min(1, "File URL or path is required"),
})

type FormValues = z.infer<typeof assetSchema>

interface DesignAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: DesignAsset | null
  onSave: (assetData: FormValues) => void
}

export function DesignAssetDialog({ open, onOpenChange, asset, onSave }: DesignAssetDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
        id: "",
        name: "",
        type: "Logo",
        fileUrl: ""
    }
  })
  
  React.useEffect(() => {
    if (asset) {
      form.reset(asset)
    } else {
      form.reset({
        id: undefined,
        name: "",
        type: "Logo",
        fileUrl: "",
      })
    }
  }, [asset, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Design Asset" : "Add Design Asset"}</DialogTitle>
          <DialogDescription>
            {asset ? "Update the details for this asset." : "Enter the details for the new asset."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Company Logo" {...field} />
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
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Logo">Logo</SelectItem>
                      <SelectItem value="Font">Font</SelectItem>
                      <SelectItem value="Color">Color</SelectItem>
                      <SelectItem value="Mockup">Mockup</SelectItem>
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
                    <Input placeholder="e.g., /assets/logo.svg or https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
