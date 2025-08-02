
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
import type { SummarizeTranscriptOutput } from "@/ai/flows/summarize-transcript"
import { summarizeTranscript } from "@/ai/flows/summarize-transcript"
import { useToast } from "@/hooks/use-toast"

const summarySchema = z.object({
  clientName: z.string().optional(),
  transcript: z.string().min(50, "Please provide a more substantial transcript."),
})

type FormValues = z.infer<typeof summarySchema>

interface MeetingSummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSummaryGenerated: (summary: SummarizeTranscriptOutput) => void
}

export function MeetingSummaryDialog({ open, onOpenChange, onSummaryGenerated }: MeetingSummaryDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      clientName: "",
      transcript: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await summarizeTranscript(data)
      onSummaryGenerated(result)
      onOpenChange(false)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Summary",
        description: "There was an issue generating the meeting summary. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Meeting Summary</DialogTitle>
          <DialogDescription>
            Paste the full transcript of your meeting below, and the AI will extract the key points.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client or Project Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Project Phoenix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transcript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Transcript</FormLabel>
                   <FormControl>
                    <Textarea 
                        placeholder="Paste the full meeting transcript here..." 
                        {...field}
                        rows={10}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Summary
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
