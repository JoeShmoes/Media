
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { GenerateContentBriefOutput } from "@/ai/flows/generate-content-brief"
import { generateContentBrief } from "@/ai/flows/generate-content-brief"
import { useToast } from "@/hooks/use-toast"

const briefSchema = z.object({
  topic: z.string().min(5, "Please provide a more detailed topic."),
  type: z.enum(['Blog Post', 'Video Script', 'Social Media Post']),
})

type FormValues = z.infer<typeof briefSchema>

interface ContentBriefDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBriefGenerated: (brief: GenerateContentBriefOutput) => void
}

export function ContentBriefDialog({ open, onOpenChange, onBriefGenerated }: ContentBriefDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
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
    try {
      const result = await generateContentBrief(data)
      onBriefGenerated(result)
      onOpenChange(false)
      form.reset()
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Content Brief Creator</DialogTitle>
          <DialogDescription>
            Provide a topic and content type, and the AI will generate a structured brief for you.
          </DialogDescription>
        </DialogHeader>
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
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Brief
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
