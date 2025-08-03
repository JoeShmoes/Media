
"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { AiRoomChat } from "./_components/ai-room-chat"
import { ChatSidebar } from "./_components/chat-sidebar"
import type { ChatMessage, ChatSession, Project, Deal, TaskGroup } from "@/lib/types"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AiRoomPage() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const { toast } = useToast()
  
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

  React.useEffect(() => {
    setIsMounted(true)
    try {
      const savedSessions = localStorage.getItem("chatSessions")
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      } else {
        const newSessionId = `chat-${Date.now()}`
        const newSession: ChatSession = {
          id: newSessionId,
          title: "New Chat",
          messages: [{ role: "assistant", content: "Hello! I'm your custom-trained AI business advisor. How can I help you scale today?" }],
          createdAt: new Date().toISOString(),
        }
        setSessions([newSession])
        setActiveSessionId(newSession.id)
      }
    } catch (error) {
      console.error("Failed to load sessions from local storage", error)
    }
  }, [])
  
  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("chatSessions", JSON.stringify(sessions))
      } catch (error) {
         console.error("Failed to save sessions to local storage", error)
      }
    }
  }, [sessions, isMounted])

  const handleNewChat = () => {
    const newSessionId = `chat-${Date.now()}`
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [{ role: "assistant", content: "Hello! I'm your custom-trained AI business advisor. How can I help you scale today?" }],
      createdAt: new Date().toISOString(),
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSessionId)
  }

  const handleSelectChat = (sessionId: string) => {
    setActiveSessionId(sessionId)
  }

  const handleDeleteChat = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions.length > 1 ? sessions.filter(s => s.id !== sessionId)[0].id : null)
    }
  }

  const handleUpdateSession = (sessionId: string, messages: ChatMessage[]) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          const userMessages = messages.filter(m => m.role === 'user');
          const newTitle = userMessages.length === 1 ? messages.find(m => m.role === 'user')?.content.substring(0, 25) + '...' : s.title;
          return { ...s, messages, title: newTitle ?? s.title };
        }
        return s;
      })
    )
  }
  
  const handleDeleteMessage = (sessionId: string, messageIndex: number) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          const newMessages = [...s.messages];
          if(newMessages[messageIndex].role === 'user' && newMessages[messageIndex + 1]?.role === 'assistant') {
            newMessages.splice(messageIndex, 2);
          } else {
            newMessages.splice(messageIndex, 1);
          }
          return { ...s, messages: newMessages };
        }
        return s;
      })
    );
  }

  const handleEditMessage = async (sessionId: string, messageIndex: number, newContent: string) => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const updatedMessages = session.messages.slice(0, messageIndex + 1);
      updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent };
      
      handleUpdateSession(sessionId, updatedMessages);
      
      try {
        const result = await getBusinessAdvice({
            question: newContent,
            businessContext: "The user runs multiple businesses: SEO, website creation, outreach campaigns, and social content. They are a young, hungry entrepreneur.",
            storedConversations: JSON.stringify(updatedMessages.slice(-5)),
            projects,
            deals,
            tasks,
        });
        const assistantMessage: ChatMessage = { role: "assistant", content: result.advice };
        handleUpdateSession(sessionId, [...updatedMessages, assistantMessage]);
      } catch (error) {
        console.error("Error getting advice after edit:", error);
        toast({
            variant: "destructive",
            title: "Error Getting Advice",
            description: "There was an issue getting a new response. Please try again.",
        });
        handleUpdateSession(sessionId, session.messages);
      }
  };


  const activeSession = sessions.find(s => s.id === activeSessionId)
  
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-0"
        )}
      >
        <div className={cn("h-full", isSidebarOpen ? "w-72" : "w-0 overflow-hidden")}>
           <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
          <header className="flex items-center gap-4 p-4 border-b">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                <PanelLeft />
                <span className="sr-only">Toggle sidebar</span>
             </Button>
          </header>
          <div className="flex-1 overflow-hidden">
            <AiRoomChat
              session={activeSession ?? null}
              onUpdateSession={handleUpdateSession}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
            />
          </div>
      </div>
    </div>
  )
}
