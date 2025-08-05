
"use client"

import * as React from "react"
import { Bot, User, Send, Loader2, Plus, Sparkles } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Markdown from "react-markdown"
import TextareaAutosize from 'react-textarea-autosize';

import type { ChatSession, ChatMessage } from "@/lib/types"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "@/hooks/use-settings"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})
type ChatFormValues = z.infer<typeof chatSchema>

interface AiRoomChatProps {
  session: ChatSession,
  onMessagesChange: (messages: ChatMessage[], newTitle?: string) => void;
}

export function AiRoomChat({ session, onMessagesChange }: AiRoomChatProps) {
  const { toast } = useToast()
  const { settings } = useSettings()
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  })
  
  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [session.messages]);
  

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    const userMessage: ChatMessage = { role: "user", content: data.message }
    const newMessages = [...session.messages, userMessage]
    onMessagesChange(newMessages);
    form.reset()
    setIsLoading(true)

    try {
      const storedConversations = newMessages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join("\n");
      
      const result = await getBusinessAdvice({
        question: data.message,
        businessContext: settings.tagline,
        storedConversations
      })
      
      const assistantMessage: ChatMessage = { role: "assistant", content: result.advice }
      let finalMessages = [...newMessages, assistantMessage];
      let newTitle;

      if(session.messages.length === 0) {
        // This is the first message pair, let's set a title
        const titleResult = await getBusinessAdvice({ question: `Give a very short, 3-4 word title for this conversation: User: "${data.message}" Assistant: "${result.advice}"`, businessContext: "", storedConversations: ""});
        newTitle = titleResult.advice.replace(/"/g, ''); // remove quotes from title
      }
      
      onMessagesChange(finalMessages, newTitle);

    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "There was an issue getting a response from the AI.",
      })
      // remove the user's message if the API call fails
      onMessagesChange(session.messages);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        {session.messages.length === 0 ? (
            <div className="text-center">
                <Icons.logo className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-2 text-xl font-semibold">Nexaris Media AI</h2>
                <p className="text-muted-foreground">Ask me anything about your business.</p>
            </div>
        ) : (
            session.messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-4 mb-8", message.role === "user" ? "justify-end" : "justify-start")}>
                   {message.role === 'assistant' && (
                       <Avatar className="h-8 w-8">
                           <AvatarFallback>
                                <Icons.logo className="h-5 w-5"/>
                           </AvatarFallback>
                       </Avatar>
                   )}
                   <div className="max-w-2xl">
                      <div className={cn("p-4 rounded-lg", message.role === 'assistant' ? "bg-muted" : "bg-primary text-black")}>
                         <Markdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</Markdown>
                      </div>
                   </div>
                    {message.role === 'user' && (
                       <Avatar className="h-8 w-8">
                           <AvatarImage src={settings.userAvatar || undefined} />
                           <AvatarFallback><User /></AvatarFallback>
                       </Avatar>
                   )}
                </div>
            ))
        )}
        {isLoading && (
             <div className="flex items-start gap-4">
               <Avatar className="h-8 w-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>
               <div className="p-4 rounded-lg bg-muted flex items-center">
                   <Loader2 className="h-5 w-5 animate-spin" />
               </div>
            </div>
        )}
        </div>
      </ScrollArea>
      <div className="px-4 py-4 bg-background border-t">
        <div className="max-w-4xl mx-auto">
             <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative"
            >
              <div className="relative flex w-full items-center">
                <TextareaAutosize
                  placeholder="Message Nexaris AI..."
                  {...form.register("message")}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                      }
                  }}
                  rows={1}
                  maxRows={5}
                  className="w-full resize-none rounded-2xl border border-input bg-background p-3 pr-20 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="absolute right-3" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
        </div>
      </div>
    </div>
  )
}
