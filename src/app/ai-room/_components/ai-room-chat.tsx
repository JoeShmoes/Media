
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, User, Bot, Edit, Trash2, Copy, Plus, MoreVertical, X, Save, Briefcase, ListTodo, Sparkles, LayoutDashboard, Notebook, MessageSquare, Users, KanbanSquare, SendHorizonal, CircleDollarSign, Package, Archive, Palette, View, BrainCircuit, FileText, LayoutTemplate, Blocks, PenSquare, Youtube, Search, Zap, Lightbulb, GitMerge, UsersRound, MessageCircleCode, Library, BarChart, Mic, Target } from "lucide-react"
import ReactMarkdown from "react-markdown"

import type { ChatMessage, ChatSession, Project, Deal, Task, TaskGroup, Offer, BrandVoice, Persona, Goal, Note, Client, Transaction } from "@/lib/types"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    { name: "Projects", icon: <KanbanSquare className="mr-2 h-4 w-4" /> },
    { name: "Deals", icon: <View className="mr-2 h-4 w-4" /> },
    { name: "Tasks", icon: <ListTodo className="mr-2 h-4 w-4" /> },
    { name: "Offers", icon: <Package className="mr-2 h-4 w-4" /> },
    { name: "Clients", icon: <Users className="mr-2 h-4 w-4" /> },
    { name: "Finance", icon: <CircleDollarSign className="mr-2 h-4 w-4" /> },
    { name: "Notes", icon: <Notebook className="mr-2 h-4 w-4" /> },
    { name: "Personas", icon: <UsersRound className="mr-2 h-4 w-4" /> },
    { name: "Goals", icon: <Target className="mr-2 h-4 w-4" /> },
];


export function AiRoomChat({ session, onUpdateSession, onDeleteMessage, onEditMessage }: AiRoomChatProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [editingMessage, setEditingMessage] = React.useState<{ index: number; content: string } | null>(null)
  const [showMentionMenu, setShowMentionMenu] = React.useState(false);
  const { toast } = useToast()
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // State to hold data from all rooms
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [brandVoice, setBrandVoice] = React.useState<BrandVoice | null>(null);
  const [personas, setPersonas] = React.useState<Persona[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

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
      
      const savedOffers = localStorage.getItem("offers");
      if (savedOffers) setOffers(JSON.parse(savedOffers));

      const savedBrandVoice = localStorage.getItem("brandVoice");
      if (savedBrandVoice) setBrandVoice(JSON.parse(savedBrandVoice));

      const savedPersonas = localStorage.getItem("brandPersonas");
      if (savedPersonas) setPersonas(JSON.parse(savedPersonas));

      const savedGoals = localStorage.getItem("cortex-goals");
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedClients = localStorage.getItem("clients");
      if (savedClients) setClients(JSON.parse(savedClients));
      
      const savedTransactions = localStorage.getItem("transactions");
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    } catch (error) {
      console.error("Failed to load room data from local storage", error);
    }
  }, []);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  })
  
    
    const crifohayFeatures = [
        { name: "AI Workflow Builder", prompt: "Automate the following process for me: ", icon: <Zap className="mr-2 h-4 w-4 text-yellow-500" /> },
        { name: "Idea Engine", prompt: "Generate 5 ideas for: ", icon: <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> },
        { name: "Multi-Agent Simulator", prompt: "Simulate a conversation between a customer and a support agent about: ", icon: <UsersRound className="mr-2 h-4 w-4 text-purple-500" /> },
        { name: "Task Commander", prompt: "Create a list of tasks for: ", icon: <ListTodo className="mr-2 h-4 w-4 text-green-500" /> },
        { name: "KPI Generator & Analyzer", prompt: "Generate 3 KPIs for: ", icon: <BarChart className="mr-2 h-4 w-4 text-pink-500" /> },
        { name: "Mentions", prompt: "@", icon: <MessageCircleCode className="mr-2 h-4 w-4 text-indigo-500" /> },
        { name: "Use other chats", prompt: "Based on my previous chat about [topic], what should I do next? ", icon: <GitMerge className="mr-2 h-4 w-4 text-gray-500" /> },
    ]
  
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
  
  const questionValue = form.watch('question');

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [questionValue]);


  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'question' && type === 'change') {
        const text = value.question || '';
        const lastCharIsAt = text.slice(-1) === '@';
        const atIndex = text.lastIndexOf('@');
        
        // Show menu if '@' is the last character and there are no spaces after the last '@'
        if (lastCharIsAt && text.substring(atIndex).indexOf(' ') === -1) {
             setShowMentionMenu(true);
        } else {
             setShowMentionMenu(false);
        }
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
        projects: projects.map(p => ({id: p.id, title: p.title, service: p.service, status: p.status, deadline: p.deadline, link: p.link})),
        deals: deals.map(d => ({id: d.id, title: d.title, value: d.value, status: d.status, clientName: d.clientName, notes: d.notes})),
        tasks: tasks.filter(t => !t.completed).map(t => ({id: t.id, name: t.name, completed: t.completed, dueDate: t.dueDate})),
        offers: offers.map(o => ({ id: o.id, title: o.title, price: o.price })),
        brandVoice: brandVoice || undefined,
        personas: personas.map(p => ({ id: p.id, name: p.name, bio: p.bio })),
        goals: goals.map(g => ({ id: g.id, title: g.title, status: g.status })),
        notes: notes.slice(0, 5).map(n => ({ id: n.id, title: n.title, content: n.content.substring(0, 100) })),
        clients: clients.map(c => ({ id: c.id, name: c.name, status: c.status })),
        transactions: transactions.slice(0, 10).map(t => ({ id: t.id, type: t.type, amount: t.amount, category: t.category })),
      })

      const usedFeature = crifohayFeatures.find(f => userMessageContent.startsWith(f.prompt));
      let finalAdvice = result.advice;

      if(usedFeature) {
        finalAdvice = `### ${usedFeature.name}\n\n---\n\n${result.advice}`;
      }

      const formattedAdvice = finalAdvice
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
    const atIndex = currentQuery.lastIndexOf('@');
    form.setValue('question', `${currentQuery.slice(0, atIndex)}@${roomName} `);
    setShowMentionMenu(false);
    // Timeout to allow the popover to close before focusing
    setTimeout(() => textareaRef.current?.focus(), 0);
  }
  
  const handleFeatureSelect = (feature: typeof crifohayFeatures[number]) => {
    if (feature.name === 'Mentions') {
       form.setValue('question', form.getValues('question') + '@');
    } else {
       form.setValue('question', feature.prompt);
    }
    setTimeout(() => textareaRef.current?.focus(), 0);
  }


  if (!session) {
    return (
      <div className="flex-1 flex justify-center items-center h-full text-muted-foreground">
        <p>Select a chat or start a new one.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 p-4 max-w-4xl mx-auto w-full">
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
                            ? "bg-gray-700 text-white"
                            : "bg-background"
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
        <div className="p-4 bg-transparent border-t">
          <div className="max-w-2xl mx-auto">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"><Plus className="h-4 w-4"/></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 mb-2 max-h-96 overflow-y-auto" align="start">
                        <ScrollArea className="h-full">
                            {crifohayFeatures.map(feature => (
                               <Button key={feature.name} variant="ghost" className="w-full justify-start" onClick={() => handleFeatureSelect(feature)}>
                                   {feature.icon} {feature.name}
                               </Button>
                            ))}
                        </ScrollArea>
                    </PopoverContent>
                 </Popover>
                 <Popover open={showMentionMenu} onOpenChange={setShowMentionMenu}>
                    <PopoverTrigger asChild>
                        {/* This is a dummy trigger; the popover is controlled programmatically */}
                        <div className="w-0 h-0" />
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-1 mb-2 max-h-72 overflow-y-auto" align="start">
                        <ScrollArea className="h-full">
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
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
                <FormField
                control={form.control}
                name="question"
                render={({ field }) => {
                  const { ref, ...otherFieldProps } = field;
                  return (
                    <FormItem className="flex-1">
                    <FormControl>
                        <Textarea 
                            ref={(e) => {
                                ref(e);
                                // @ts-ignore
                                textareaRef.current = e;
                            }}
                            placeholder="Ask 'How do I scale this?' or type @..." 
                            {...otherFieldProps} 
                            disabled={isLoading} 
                            className="rounded-2xl pl-12 pr-12 py-3 min-h-[52px] max-h-[200px] resize-none border-2 border-border focus-visible:ring-primary" 
                            autoComplete="off"
                            rows={1}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )
                }}
                />
                <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
            </Form>
          </div>
        </div>
    </div>
  )
}
