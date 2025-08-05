
"use client"

import * as React from "react"
import { Bot, User, Send, Loader2, Edit, Trash2 } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Markdown from "react-markdown"

import type { ChatSession, ChatMessage, Project, Deal, Task, Offer, Persona, Goal, Note, Client, Transaction, TaskGroup } from "@/lib/types"
import { getBusinessAdvice, type GetBusinessAdviceInput } from "@/ai/flows/get-business-advice"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSettings } from "@/hooks/use-settings"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command"
import { navLinks } from "@/components/layout/app-shell"


const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})
type ChatFormValues = z.infer<typeof chatSchema>

interface AiRoomChatProps {
  session: ChatSession,
  onMessagesChange: (messages: ChatMessage[], newTitle?: string) => void;
  onRegenerateResponse: (messageIndex: number, allData: Omit<GetBusinessAdviceInput, 'question' | 'storedConversations' | 'businessContext'>) => void;
  onDeleteMessage: (messageIndex: number) => void;
}

export function AiRoomChat({ session, onMessagesChange, onRegenerateResponse, onDeleteMessage }: AiRoomChatProps) {
  const { toast } = useToast()
  const { settings } = useSettings()
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState("");

  // Mention menu state
  const [mentionMenuOpen, setMentionMenuOpen] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  })
  
  // Data states for AI context
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [personas, setPersonas] = React.useState<Persona[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    // Load all necessary data from local storage
    const loadData = () => {
        try {
            const savedProjects = localStorage.getItem("projects");
            if(savedProjects) setProjects(Object.values(JSON.parse(savedProjects)).flat() as Project[]);
            
            const savedDeals = localStorage.getItem("deals");
            if(savedDeals) setDeals(JSON.parse(savedDeals));

            const savedTasks = localStorage.getItem("tasks");
             if(savedTasks) {
                const board: {groups: TaskGroup[]} = JSON.parse(savedTasks);
                setTasks(board.groups.flatMap(g => g.tasks));
            }
            
            const savedOffers = localStorage.getItem("offers");
            if(savedOffers) setOffers(JSON.parse(savedOffers));

            const savedPersonas = localStorage.getItem("brandPersonas");
            if(savedPersonas) setPersonas(JSON.parse(savedPersonas));

            const savedGoals = localStorage.getItem("cortex-goals");
            if(savedGoals) setGoals(JSON.parse(savedGoals));

            const savedNotes = localStorage.getItem("notes");
            if(savedNotes) setNotes(JSON.parse(savedNotes));
            
            const savedClients = localStorage.getItem("clients");
            if(savedClients) setClients(JSON.parse(savedClients));

            const savedTransactions = localStorage.getItem("transactions");
            if(savedTransactions) setTransactions(JSON.parse(savedTransactions));

        } catch (error) {
            console.error("Failed to load data for AI context", error);
        }
    }
    loadData();
  }, []);
  
  const allDataContext = {
    projects, deals, tasks, offers, personas, goals, notes, clients, transactions
  }


  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [session.messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const caretPosition = e.target.selectionStart;
    const textBeforeCaret = value.substring(0, caretPosition);
    const atMatch = textBeforeCaret.match(/@(\w*)$/);
    
    if (atMatch) {
      setMentionMenuOpen(true);
      setMentionQuery(atMatch[1]);
    } else {
      setMentionMenuOpen(false);
    }
     form.setValue("message", value);
  };
  
  const handleMentionSelect = (roomName: string) => {
    const message = form.getValues("message");
    const caretPosition = textareaRef.current?.selectionStart || message.length;
    const textBeforeCaret = message.substring(0, caretPosition);
    const atMatch = textBeforeCaret.match(/@(\w*)$/);

    if (atMatch) {
        const atIndex = atMatch.index || 0;
        const newText = 
            message.substring(0, atIndex) +
            `@${roomName} ` +
            message.substring(caretPosition);
        
        form.setValue("message", newText);
        setMentionMenuOpen(false);
        
        setTimeout(() => {
             textareaRef.current?.focus();
             const newCaretPosition = atIndex + roomName.length + 2;
             textareaRef.current?.setSelectionRange(newCaretPosition, newCaretPosition);
        }, 0);
    }
  }

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
        storedConversations,
        ...allDataContext
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

  const handleStartEdit = (index: number) => {
      setEditingIndex(index);
      setEditingText(session.messages[index].content);
  }

  const handleCancelEdit = () => {
      setEditingIndex(null);
      setEditingText("");
  }

  const handleSaveEdit = async () => {
      if (editingIndex === null) return;
      
      const updatedMessages = [...session.messages];
      updatedMessages[editingIndex].content = editingText;

      onMessagesChange(updatedMessages);
      setEditingIndex(null);
      setEditingText("");
      
      // Regenerate AI response
      await onRegenerateResponse(editingIndex, allDataContext);
  }


  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        {session.messages.length === 0 ? (
            <div className="text-center">
                <Icons.logo className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-2 text-xl font-semibold">Nexaris Media AI</h2>
                <p className="text-muted-foreground">Ask me anything about your business. Try typing @ to reference a room.</p>
            </div>
        ) : (
            session.messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-4 mb-8 group", message.role === "user" ? "justify-end" : "justify-start")}>
                   {message.role === 'assistant' && (
                       <Avatar className="h-8 w-8">
                           <AvatarFallback>
                                <Icons.logo className="h-5 w-5"/>
                           </AvatarFallback>
                       </Avatar>
                   )}
                   <div className="max-w-2xl">
                    {editingIndex === index ? (
                        <div className="space-y-2 w-full">
                            <Textarea 
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full"
                                rows={4}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                      <div className={cn("p-4 rounded-lg", message.role === 'assistant' ? "bg-muted" : "bg-primary text-black")}>
                         <Markdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</Markdown>
                      </div>
                    )}
                   </div>
                    {message.role === 'user' && (
                        <div className="flex items-center gap-2">
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEdit(index)}><Edit className="h-4 w-4"/></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                            <AlertDialogDescription>This will delete the message and the AI's response. This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDeleteMessage(index)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </div>
                           <Avatar className="h-8 w-8">
                               <AvatarImage src={settings.userAvatar || undefined} />
                               <AvatarFallback><User /></AvatarFallback>
                           </Avatar>
                        </div>
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
                <Popover open={mentionMenuOpen} onOpenChange={setMentionMenuOpen}>
                    <PopoverTrigger asChild>
                        <Textarea
                          {...form.register("message")}
                          ref={textareaRef}
                          placeholder="Message Nexaris AI... (try @Projects or @Deals)"
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)();
                              }
                          }}
                          rows={1}
                          className="w-full resize-none rounded-2xl border border-input bg-background p-3 pr-20 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isLoading}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                          <CommandInput placeholder="Search rooms..." value={mentionQuery} onValueChange={setMentionQuery} />
                           <CommandList>
                            <CommandGroup>
                               {navLinks.filter(l => l.label.toLowerCase().includes(mentionQuery.toLowerCase())).map(link => (
                                   <CommandItem key={link.href} value={link.label} onSelect={() => handleMentionSelect(link.label.replace(' ', ''))}>
                                       <link.icon className="mr-2 h-4 w-4"/>
                                       <span>{link.label}</span>
                                   </CommandItem>
                               ))}
                            </CommandGroup>
                           </CommandList>
                      </Command>
                    </PopoverContent>
                </Popover>

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
