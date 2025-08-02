
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
import type { GenerateSopOutput } from "@/ai/flows/generate-sop"
import { generateSop } from "@/ai/flows/generate-sop"
import { useToast } from "@/hooks/use-toast"

const sopSchema = z.object({
  topic: z.string().min(10, "Please provide a more detailed topic for the SOP."),
})

type FormValues = z.infer<typeof sopSchema>

interface SopDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSopGenerated: (sop: GenerateSopOutput) => void
}

export function SopDialog({ open, onOpenChange, onSopGenerated }: SopDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(sopSchema),
    defaultValues: {
      topic: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await generateSop(data)
      onSopGenerated(result)
      onOpenChange(false)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating SOP",
        description: "There was an issue generating the SOP. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SOP Generator</DialogTitle>
          <DialogDescription>
            Describe the process you want to document, and the AI will create a detailed Standard Operating Procedure.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SOP Topic</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="e.g., How to onboard a new SEO client from contract signing to project kickoff." 
                        {...field}
                        rows={3}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate SOP
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
