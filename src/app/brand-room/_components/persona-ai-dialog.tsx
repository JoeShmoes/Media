
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
import type { GeneratePersonaOutput } from "@/ai/flows/generate-persona"
import { generatePersona } from "@/ai/flows/generate-persona"
import { useToast } from "@/hooks/use-toast"

const aiSchema = z.object({
  audienceDescription: z.string().min(10, "Please provide a more detailed description."),
})

type FormValues = z.infer<typeof aiSchema>

interface PersonaAiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPersonaGenerated: (persona: GeneratePersonaOutput) => void
}

export function PersonaAiDialog({ open, onOpenChange, onPersonaGenerated }: PersonaAiDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(aiSchema),
    defaultValues: {
      audienceDescription: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await generatePersona(data)
      onPersonaGenerated(result)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Persona",
        description: "There was an issue generating the persona. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Persona Assistant</DialogTitle>
          <DialogDescription>
            Describe your target audience, and the AI will generate a customer persona for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="audienceDescription"
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
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Persona
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
