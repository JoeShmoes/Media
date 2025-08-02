
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { GenerateContentBriefOutput } from "@/ai/flows/generate-content-brief"
import { generateContentBrief } from "@/ai/flows/generate-content-brief"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentBriefDisplay } from "./content-brief-display"

const briefSchema = z.object({
  topic: z.string().min(5, "Please provide a more detailed topic."),
  type: z.enum(['Blog Post', 'Video Script', 'Social Media Post']),
})

type FormValues = z.infer<typeof briefSchema>

export function ContentBriefView() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [brief, setBrief] = React.useState<GenerateContentBriefOutput | null>(null);
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      topic: "",
      type: "Blog Post",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    setBrief(null);
    try {
      const result = await generateContentBrief(data)
      setBrief(result)
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Brief",
        description: "There was an issue generating the content brief. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Content Brief Creator</CardTitle>
                <CardDescription>Provide a topic and content type, and the AI will generate a structured brief for you.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Content Topic or Idea</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., The Dark History of the CIA" {...field} />
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
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Blog Post">Blog Post</SelectItem>
                                <SelectItem value="Video Script">Video Script</SelectItem>
                                <SelectItem value="Social Media Post">Social Media Post</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                            Generate Brief
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      
        {brief && <ContentBriefDisplay brief={brief} />}
    </div>
  )
}
