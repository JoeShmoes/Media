"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, User, BookOpen } from "lucide-react"

import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { performResearch } from "@/ai/flows/perform-research"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  question: z.string().min(2, "Question is required"),
})
type FormValues = z.infer<typeof formSchema>

export function ResearchForm() {
  const [researchResult, setResearchResult] = React.useState<{ summary: string, answer: string } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", question: "" },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    setResearchResult(null)

    try {
      const result = await performResearch(data)
      setResearchResult(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Performing Research",
        description: "There was an issue getting a response. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="glassmorphic">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
             <CardHeader>
              <CardTitle>Research Topic</CardTitle>
              <CardDescription>
                Enter a topic and a specific question to start your research.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Roman Empire" {...field} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., What were the main reasons for its fall?" {...field} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Researching..." : "Start Research"}
                    <Bot className="ml-2"/>
                </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Research Results</CardTitle>
          <CardDescription>
            The AI-powered research findings will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
          {researchResult && (
            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center"><BookOpen className="mr-2 h-5 w-5"/> Wikipedia Summary</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{researchResult.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center"><Bot className="mr-2 h-5 w-5"/> AI-Enhanced Answer</h3>
                <p className="text-foreground whitespace-pre-wrap">{researchResult.answer}</p>
              </div>
            </div>
          )}
           {!isLoading && !researchResult && (
            <div className="text-center text-muted-foreground py-12">
              Your research results will be displayed here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
