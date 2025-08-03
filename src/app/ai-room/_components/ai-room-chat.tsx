
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, User, Bot, Edit, Trash2, Copy, Plus, MoreVertical, X, Save, Briefcase, ListTodo, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"

import type { ChatMessage, ChatSession, Project, Deal, TaskGroup } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { View } from "lucide-react"

const formSchema = z.object({
  question: z.string().min(1, "Message is required"),
})
type FormValues = z.infer<typeof formSchema>

interface AiRoomChatProps {
  session: ChatSession | null
  onUpdateSession: (sessionId: string, messages: ChatMessage[]) => void
  onDeleteMessage: (sessionId: string, messageIndex: number) => void
  onEditMessage: (sessionId: string, messageIndex: number, newContent: string) => Promise<void>
}

const mentionableRooms = [
    { name: "Projects", icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { name: "Deals", icon: <View className="mr-2 h-4 w-4" /> },
    { name: "Tasks", icon: <ListTodo className="mr-2 h-4 w-4" /> }
];

export function AiRoomChat({ session, onUpdateSession, onDeleteMessage, onEditMessage }: AiRoomChatProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [editingMessage, setEditingMessage] = React.useState<{ index: number; content: string } | null>(null)
  const [showMentionMenu, setShowMentionMenu] = React.useState(false);
  const { toast } = useToast()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  
  // State to hold data from other rooms
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [tasks, setTasks] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load data from localStorage when the component mounts
    try {
      const savedProjects = localStorage.getItem("projects");
      if (savedProjects) setProjects(Object.values(JSON.parse(savedProjects)).flat() as Project[]);

      const savedDeals = localStorage.getItem("deals");
      if (savedDeals) setDeals(JSON.parse(savedDeals));

      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
         const taskBoard: {groups: TaskGroup[]} = JSON.parse(savedTasks);
         setTasks(taskBoard.groups.flatMap(g => g.tasks));
      }
    } catch (error) {
      console.error("Failed to load room data from local storage", error);
    }
  }, []);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  })
  
  const messages = session?.messages ?? []

  React.useEffect(() => {
    // This timeout ensures that the DOM has updated before we try to scroll
    setTimeout(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({
                    top: viewport.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }
    }, 100)
  }, [messages.length])
  
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'question' && type === 'change') {
        const text = value.question || '';
        const lastChar = text.slice(-1);
        setShowMentionMenu(lastChar === '@');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const generateResponse = async (userMessageContent: string, currentMessages: ChatMessage[]) => {
    setIsLoading(true)
    try {
      const result = await getBusinessAdvice({
        question: userMessageContent,
        businessContext: "The user runs multiple businesses: SEO, website creation, outreach campaigns, and social content. They are a young, hungry entrepreneur.",
        storedConversations: JSON.stringify(currentMessages.slice(-5)),
        projects,
        deals,
        tasks
      })

      const formattedAdvice = result.advice
        .replace(/\n\s*\*/g, '\n\n*') 
        .replace(/\n\s*(\d+\.)/g, '\n\n$1'); 


      const assistantMessage: ChatMessage = { role: "assistant", content: formattedAdvice }
      onUpdateSession(session!.id, [...currentMessages, assistantMessage])
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "There was an issue getting a response. Please try again.",
      })
      onUpdateSession(session!.id, currentMessages.slice(0, -1));
    } finally {
      setIsLoading(false)
    }
  }
  
  const sendQuery = async (query: string) => {
    if (!session || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: query };
    const newMessages = [...messages, userMessage];
    onUpdateSession(session.id, newMessages);
    form.reset();
    await generateResponse(query, newMessages);
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await sendQuery(data.question);
  }

  const handleContinue = async () => {
    if (!session) return
    const lastAiMessage = messages.findLast(m => m.role === 'assistant')
    if (!lastAiMessage) return

    const continuePrompt = `Please continue and elaborate on your previous point: "${lastAiMessage.content}"`
    const userMessage: ChatMessage = { role: "user", content: `(Continue generating...)` }
    const newMessages = [...messages, userMessage]
    onUpdateSession(session.id, newMessages)
    await generateResponse(continuePrompt, newMessages)
  }

  const handleStartEdit = (index: number, content: string) => {
    setEditingMessage({ index, content })
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
  }

  const handleSaveEdit = async () => {
    if (editingMessage && session) {
      setIsLoading(true);
      await onEditMessage(session.id, editingMessage.index, editingMessage.content);
      setEditingMessage(null);
      setIsLoading(false);
    }
  }
  
  const handleMentionSelect = (roomName: string) => {
    const currentQuery = form.getValues('question');
    form.setValue('question', `${currentQuery.slice(0,-1)}@${roomName} `);
    setShowMentionMenu(false);
    form.setFocus('question');
  }

  if (!session) {
    return (
      <div className="flex-1 flex justify-center items-center h-full text-muted-foreground">
        <p>Select a chat or start a new one.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 p-4">
            {messages.map((message, index) => (
            <div key={index}>
                {editingMessage?.index === index ? (
                    <div className="flex items-end gap-2">
                        <Textarea
                            value={editingMessage.content}
                            onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                            className="flex-1 resize-none"
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <Button size="icon" onClick={handleSaveEdit} disabled={isLoading}><Save className="w-4 h-4"/></Button>
                            <Button size="icon" variant="ghost" onClick={handleCancelEdit}><X className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                        "flex items-start gap-3 group",
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
                            "rounded-lg p-3 max-w-sm md:max-w-xl relative",
                            message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                        >
                        <ReactMarkdown className="prose prose-sm dark:prose-invert prose-p:my-0 break-words">
                            {message.content}
                        </ReactMarkdown>

                        </div>
                        {message.role === "user" && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEdit(index, message.content)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                        <AlertDialogDescription>This will delete the message and the AI's response. This action cannot be undone.</AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDeleteMessage(session.id, index)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://placehold.co/40x40.png" alt="@fozan" data-ai-hint="man portrait"/>
                                    <AvatarFallback>FS</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        {message.role === "assistant" && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 self-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleContinue}>
                                <Plus className="w-4 h-4"/>
                            </Button>
                        )}
                    </div>
                )}
            </div>
            ))}
            {isLoading && (
            <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground p-1.5">
                    <Icons.logo className="w-full h-full" />
                </Avatar>
                <div className="rounded-lg p-3 bg-muted flex items-center gap-1">
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-0" />
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-150" />
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse delay-300" />
                </div>
            </div>
            )}
        </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
                <Popover open={showMentionMenu} onOpenChange={setShowMentionMenu}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading} onClick={() => form.setValue('question', `${form.getValues('question')}@`)}>
                            <Sparkles className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="start">
                       {mentionableRooms.map(room => (
                            <Button
                                key={room.name}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleMentionSelect(room.name)}
                            >
                                {room.icon} {room.name}
                            </Button>
                       ))}
                    </PopoverContent>
                </Popover>
                <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormControl>
                        <Input placeholder="Ask 'How do I scale this?' or type @..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
                </Button>
            </form>
            </Form>
        </div>
    </div>
  )
}
