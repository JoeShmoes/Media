"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import type { OfferTemplate } from "@/lib/types"
import { PlusCircle, Trash2 } from "lucide-react"

const featureSchema = z.object({ value: z.string().min(1, "Feature cannot be empty")})

const templateSchema = z.object({
  id: z.string().optional(),
  templateName: z.string().min(1, "Template name is required"),
  offerTitle: z.string().min(1, "Offer title is required"),
  offerDescription: z.string().min(1, "Offer description is required"),
  offerPrice: z.coerce.number().min(0, "Price must be a positive number"),
  offerFeatures: z.array(featureSchema),
})

type FormValues = z.infer<typeof templateSchema>

interface OfferTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: OfferTemplate | null
  onSave: (templateData: Omit<OfferTemplate, 'id'> & {id?: string}) => void
}

export function OfferTemplateDialog({ open, onOpenChange, template, onSave }: OfferTemplateDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
        id: "",
        templateName: "",
        offerTitle: "",
        offerDescription: "",
        offerPrice: 0,
        offerFeatures: [],
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offerFeatures"
  });
  
  React.useEffect(() => {
    if (template) {
      form.reset({
          ...template,
          offerFeatures: template.offerFeatures.map(f => ({ value: f })),
      })
    } else {
      form.reset({
        id: undefined,
        templateName: "",
        offerTitle: "",
        offerDescription: "",
        offerPrice: 0,
        offerFeatures: [{value: ""}],
      })
    }
  }, [template, open, form])

  const onSubmit = (data: FormValues) => {
    onSave({
        ...data,
        offerFeatures: data.offerFeatures.map(f => f.value),
    })
    onOpenChange(false)
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Offer Template" : "Create New Offer Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the details for your offer template." : "Define a reusable template for your offers."}
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
                    <Input placeholder="e.g., Standard Web Design Package" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr/>
            <h3 className="text-lg font-semibold">Offer Details</h3>
            <FormField
              control={form.control}
              name="offerTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ultimate SEO Package" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="offerDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A complete solution for ranking on Google." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="offerPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Price (per month)</FormLabel>
                   <FormControl>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" step="1" placeholder="500" className="pl-6" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
                <FormLabel>Offer Features</FormLabel>
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`offerFeatures.${index}.value`}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                     <FormControl>
                                        <Input placeholder={`Feature ${index + 1}`} {...field} />
                                     </FormControl>
                                     <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                     </Button>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ value: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
            </div>
            <DialogFooter>
              <Button type="submit">Save Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
