
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
import { Textarea } from "@/components/ui/textarea"
import { type GenerateOfferOutput } from "@/lib/types"
import { Bot, Loader2 } from "lucide-react"
import { generateOffer } from "@/ai/flows/generate-offer"
import { useToast } from "@/hooks/use-toast"

const aiAssistSchema = z.object({
  productInfo: z.string().min(10, "Please provide more detail about the product or service."),
  targetAudience: z.string().min(10, "Please provide more detail about the target audience."),
})

type FormValues = z.infer<typeof aiAssistSchema>

interface AiAssistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOfferGenerated: (offer: GenerateOfferOutput) => void
}

export function AiAssistDialog({ open, onOpenChange, onOfferGenerated }: AiAssistDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(aiAssistSchema),
    defaultValues: {
        productInfo: "",
        targetAudience: "",
    }
  })
  
  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    try {
        const result = await generateOffer(data);
        onOfferGenerated(result);
        form.reset();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Offer Assistant</DialogTitle>
          <DialogDescription>
            Answer a couple of questions and the AI will generate a compelling offer for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What product or service are you selling?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A subscription service for unlimited graphic design requests." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is your target audience?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Early-stage startups that need a lot of design work but can't afford a full-time designer." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                 {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
                Generate Offer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
