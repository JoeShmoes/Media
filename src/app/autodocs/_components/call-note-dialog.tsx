
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { GenerateCallNoteOutput } from "@/ai/flows/generate-call-note"
import { generateCallNote } from "@/ai/flows/generate-call-note"
import { useToast } from "@/hooks/use-toast"

const callNoteSchema = z.object({
  clientName: z.string().optional(),
  rawNotes: z.string().min(10, "Please provide at least a few bullet points."),
})

type FormValues = z.infer<typeof callNoteSchema>

interface CallNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteGenerated: (note: GenerateCallNoteOutput) => void
}

export function CallNoteDialog({ open, onOpenChange, onNoteGenerated }: CallNoteDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(callNoteSchema),
    defaultValues: {
      clientName: "",
      rawNotes: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await generateCallNote(data)
      onNoteGenerated(result)
      onOpenChange(false)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Note",
        description: "There was an issue generating the call note. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call Note Generator</DialogTitle>
          <DialogDescription>
            Enter a few bullet points from your call, and the AI will create a professional summary.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Innovate Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rawNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raw Notes / Bullet Points</FormLabel>
                   <FormControl>
                    <Textarea 
                        placeholder="- client wants a trial&#x0a;- also needs FB ads&#x0a;- follow up next week" 
                        {...field}
                        rows={5}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Note
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
