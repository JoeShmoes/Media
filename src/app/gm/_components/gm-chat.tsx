"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { format } from "date-fns"

import type { GmMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

const formSchema = z.object({
  message: z.string().min(1, "Message is required").max(140, "Message is too long"),
})
type FormValues = z.infer<typeof formSchema>

// Mock user data - in a real app, this would come from an auth provider
const currentUser = {
    name: "Fozan Shazad",
    avatar: "https://placehold.co/40x40.png"
}

export function GmChat() {
  const [messages, setMessages] = React.useState<GmMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSending, setIsSending] = React.useState(false)
  const { toast } = useToast()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  })

  React.useEffect(() => {
    const q = query(collection(db, "gm-messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: GmMessage[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as GmMessage);
      });
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        toast({
            variant: "destructive",
            title: "Error fetching messages",
            description: "Could not load messages. Please try again later.",
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


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
    setIsSending(true)
    try {
        await addDoc(collection(db, "gm-messages"), {
            text: data.message,
            createdAt: serverTimestamp(),
            user: currentUser,
        });
        form.reset()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "There was an issue sending your message. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="flex-1 flex flex-col glassmorphic h-full">
      <CardContent className="flex-1 p-2 md:p-4 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 p-2 md:p-4">
            {isLoading && (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-8 w-48" />
                        </div>
                    </div>
                ))}
              </div>
            )}
            {!isLoading && messages.map((message) => (
              <div key={message.id} className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={message.user.avatar} alt={message.user.name} data-ai-hint="man portrait"/>
                    <AvatarFallback>
                        <Icons.user className="h-5 w-5"/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <p className="font-semibold">{message.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {message.createdAt ? format(message.createdAt.toDate(), 'p') : 'sending...'}
                        </p>
                    </div>
                    <p className="text-foreground/90">{message.text}</p>
                </div>
              </div>
            ))}
             {!isLoading && messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12 col-span-full">
                    <p>No messages yet. Be the first to say GM!</p>
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
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Say GM..." {...field} disabled={isSending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  )
}
