
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { GenerateSopOutput } from "@/ai/flows/generate-sop"
import { generateSop } from "@/ai/flows/generate-sop"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SopDisplay } from "./sop-display"

const sopSchema = z.object({
  topic: z.string().min(10, "Please provide a more detailed topic for the SOP."),
})

type FormValues = z.infer<typeof sopSchema>

export function SopView() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [sop, setSop] = React.useState<GenerateSopOutput | null>(null);
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(sopSchema),
    defaultValues: {
      topic: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    setSop(null);
    try {
      const result = await generateSop(data)
      setSop(result);
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
    <div className="space-y-6">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>SOP Generator</CardTitle>
                <CardDescription>Describe the process you want to document, and the AI will create a detailed Standard Operating Procedure.</CardDescription>
            </CardHeader>
            <CardContent>
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
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                            Generate SOP
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      
        {sop && <SopDisplay sop={sop} />}
    </div>
  )
}
