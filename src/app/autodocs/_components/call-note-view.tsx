
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { GenerateCallNoteOutput } from "@/ai/flows/generate-call-note"
import { generateCallNote } from "@/ai/flows/generate-call-note"
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CallNoteDisplay } from "./call-note-display"

const callNoteSchema = z.object({
  clientName: z.string().optional(),
  rawNotes: z.string().min(10, "Please provide at least a few bullet points."),
})

type FormValues = z.infer<typeof callNoteSchema>

export function CallNoteView() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [note, setNote] = React.useState<GenerateCallNoteOutput | null>(null);
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
    setNote(null);
    try {
      const result = await generateCallNote(data)
      setNote(result);
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
    <div className="space-y-6">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Call Note Generator</CardTitle>
                <CardDescription>Enter a few bullet points from your call, and the AI will create a professional summary.</CardDescription>
            </CardHeader>
            <CardContent>
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
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                            Generate Note
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      
        {note && <CallNoteDisplay note={note} />}
    </div>
  )
}
