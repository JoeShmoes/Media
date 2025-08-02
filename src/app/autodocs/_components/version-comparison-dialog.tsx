
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
import type { CompareVersionsOutput } from "@/ai/flows/compare-versions"
import { compareVersions } from "@/ai/flows/compare-versions"
import { useToast } from "@/hooks/use-toast"

const comparisonSchema = z.object({
  originalText: z.string().min(1, "Original text cannot be empty."),
  revisedText: z.string().min(1, "Revised text cannot be empty."),
})

type FormValues = z.infer<typeof comparisonSchema>

interface VersionComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComparisonGenerated: (result: CompareVersionsOutput) => void
}

export function VersionComparisonDialog({ open, onOpenChange, onComparisonGenerated }: VersionComparisonDialogProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      originalText: "",
      revisedText: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const result = await compareVersions(data)
      onComparisonGenerated(result)
      onOpenChange(false)
      form.reset()
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Comparison",
        description: "There was an issue generating the comparison. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Document Versions</DialogTitle>
          <DialogDescription>
            Paste the two versions of the text below to see a summary and a detailed diff of the changes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="originalText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Text (Version 1)</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="Paste the original text here..." 
                            {...field}
                            rows={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="revisedText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revised Text (Version 2)</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="Paste the revised text here..." 
                            {...field}
                            rows={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Compare Versions
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
