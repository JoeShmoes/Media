"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy } from "lucide-react"

import {
  generateYouTubeScript,
  type GenerateYouTubeScriptOutput,
} from "@/ai/flows/generate-youtube-script"
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

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
})

type FormValues = z.infer<typeof formSchema>

export function YoutubeScriptForm() {
  const [generatedScript, setGeneratedScript] = React.useState<GenerateYouTubeScriptOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "What If You Woke Up as a Blacksmith",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    setGeneratedScript(null)
    try {
      const result = await generateYouTubeScript(data)
      setGeneratedScript(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Generating Script",
        description: "There was an issue generating the script. Please try again.",
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
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="glassmorphic">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Video Idea</CardTitle>
              <CardDescription>
                Enter your video topic to generate a full script.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A day in the life of a solo entrepreneur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Script"}
                <Bot />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Generated Script</CardTitle>
          <CardDescription>
            The AI-generated script will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : generatedScript ? (
            <Accordion type="multiple" defaultValue={['title', 'hook', 'script']} className="w-full">
              {(Object.keys(generatedScript) as Array<keyof typeof generatedScript>).map((key) => (
                <AccordionItem value={key} key={key}>
                  <AccordionTrigger className="capitalize">{key}</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-10">
                        {generatedScript[key]}
                      </p>
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8" onClick={() => handleCopy(generatedScript[key])}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-12">Your generated script will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
