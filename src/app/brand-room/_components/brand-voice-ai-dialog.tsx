
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2 } from "lucide-react"

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
import type { BrandVoice } from "@/lib/types"
import { generateBrandVoice } from "@/ai/flows/generate-brand-voice"
import { useToast } from "@/hooks/use-toast"

const aiSchema = z.object({
  businessDescription: z.string().min(10, "Please provide a more detailed description."),
})

type FormValues = z.infer<typeof aiSchema>

interface BrandVoiceAiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBrandVoiceGenerated: (voice: BrandVoice) => void
}

export function BrandVoiceAiDialog({ open, onOpenChange, onBrandVoiceGenerated }: BrandVoiceAiDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(aiSchema),
    defaultValues: {
      businessDescription: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await generateBrandVoice(data)
      onBrandVoiceGenerated(result)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Brand Voice",
        description: "There was an issue generating the brand voice. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Brand Voice Assistant</DialogTitle>
          <DialogDescription>
            Describe your business, and the AI will generate a brand voice profile for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What does your business do?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., We're a digital agency that builds web apps for early-stage startups." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Voice
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
