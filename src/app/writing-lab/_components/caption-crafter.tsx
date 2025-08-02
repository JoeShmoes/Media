"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy, Loader2 } from "lucide-react"

import {
  generateContentCaptions,
  type GenerateContentCaptionsOutput,
} from "@/ai/flows/generate-content-captions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  keywords: z.string().min(2, "Keywords are required"),
  tone: z.string().min(2, "Tone is required"),
  platform: z.enum(["Instagram", "TikTok", "X"]),
})

type FormValues = z.infer<typeof formSchema>

export function CaptionCrafter() {
  const [generatedContent, setGeneratedContent] = React.useState<GenerateContentCaptionsOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "The power of AI in business",
      keywords: "AI, entrepreneurship, scaling, business tools",
      tone: "Informative",
      platform: "Instagram",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    setGeneratedContent(null)
    try {
      const result = await generateContentCaptions(data)
      setGeneratedContent(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Generating Content",
        description: "There was an issue generating content. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="glassmorphic">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Caption Details</CardTitle>
              <CardDescription>
                Provide details for the caption you want to generate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., How to scale a startup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="keywords" render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., startup, growth, marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Funny, Serious, Informative" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="platform" render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="X">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {isLoading ? "Generating..." : "Generate Caption"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>
            The AI-generated content will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : generatedContent ? (
            <Accordion type="multiple" defaultValue={['caption', 'hook', 'cta', 'hashtags']} className="w-full">
              {(Object.keys(generatedContent) as Array<keyof typeof generatedContent>).map((key) => (
                <AccordionItem value={key} key={key}>
                  <AccordionTrigger className="capitalize">{key}</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-10">
                        {generatedContent[key]}
                      </p>
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8" onClick={() => handleCopy(generatedContent[key])}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-12">Your generated content will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
