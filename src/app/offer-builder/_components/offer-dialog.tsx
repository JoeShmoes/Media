
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
import type { Offer, OfferFeature } from "@/lib/types"
import { PlusCircle, Trash2, Bot, Loader2 } from "lucide-react"
import { generateOffer } from "@/ai/flows/generate-offer"
import { useToast } from "@/hooks/use-toast"

const featureSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Feature name is required"),
})

const offerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Offer title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  features: z.array(featureSchema),
})

type FormValues = z.infer<typeof offerSchema>

interface OfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: Offer | null
  onSave: (offerData: FormValues) => void
}

export function OfferDialog({ open, onOpenChange, offer, onSave }: OfferDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
        id: "",
        title: "",
        description: "",
        price: 0,
        features: []
    }
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "features"
  });
  
  React.useEffect(() => {
    if (offer) {
      form.reset(offer)
    } else {
      form.reset({
        id: undefined,
        title: "",
        description: "",
        price: 0,
        features: [{id: `feature-${Date.now()}`, name: ""}],
      })
    }
  }, [offer, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  const handleAiAssist = async () => {
    setIsGenerating(true);
    try {
        const productInfo = prompt("What product or service are you selling?");
        const targetAudience = prompt("Who is your target audience?");
        if (!productInfo || !targetAudience) {
          setIsGenerating(false);
          return;
        }

        const result = await generateOffer({ productInfo, targetAudience });
        form.setValue("title", result.title);
        form.setValue("description", result.description);
        form.setValue("price", result.price);
        replace(result.features.map(f => ({ id: `feature-${Date.now()}-${f.substring(0,5)}`, name: f })));

    } catch (e) {
        toast({
            variant: "destructive",
            title: "Error Generating Offer",
            description: "There was an issue generating the offer. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
          <DialogDescription>
            {offer ? "Update the details for your offer." : "Define the details for your new offer."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A complete solution for ranking on Google." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (per month)</FormLabel>
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
                <FormLabel>Offer Stack (Features)</FormLabel>
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`features.${index}.name`}
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
                    onClick={() => append({ id: `feature-${Date.now()}`, name: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
            </div>
            
            <DialogFooter className="gap-2 sm:justify-between">
                <Button type="button" variant="outline" onClick={handleAiAssist} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
                    AI Assist
                </Button>
              <Button type="submit">Save Offer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
