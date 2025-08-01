"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, User } from "lucide-react"

import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

const formSchema = z.object({
  question: z.string().min(1, "Message is required"),
})
type FormValues = z.infer<typeof formSchema>

export function AiRoomChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your custom-trained AI business advisor. How can I help you scale today?",
    },
  ])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  })

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth',
            });
        }
    }
  }, [messages])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    const userMessage: ChatMessage = { role: "user", content: data.question }
    setMessages((prev) => [...prev, userMessage])
    form.reset()

    try {
      const result = await getBusinessAdvice({
        question: data.question,
        businessContext: "The user runs multiple businesses: SEO, website creation, outreach campaigns, and social content. They are a young, hungry entrepreneur.",
        storedConversations: JSON.stringify(messages.slice(-5)), // Send last 5 messages as context
      })
      const assistantMessage: ChatMessage = { role: "assistant", content: result.advice }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "There was an issue getting a response. Please try again.",
      })
      setMessages((prev) => prev.slice(0, -1)) // Remove user message on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex-1 flex flex-col glassmorphic h-full">
      <CardContent className="flex-1 p-2 md:p-4 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-2 md:p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground p-1.5">
                    <Icons.logo className="w-full h-full" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-sm md:max-w-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src="https://placehold.co/40x40.png" alt="@fozan" data-ai-hint="man portrait"/>
                     <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8 bg-primary text-primary-foreground p-1.5">
                    <Icons.logo className="w-full h-full" />
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <Skeleton className="h-4 w-12" />
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 md:p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ask 'How do I scale this?'..." {...field} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  )
}
