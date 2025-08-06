
"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react";
import { ChatSidebar } from "./_components/chat-sidebar"
import { AiRoomChat } from "./_components/ai-room-chat"
import type { ChatSession, ChatMessage, GetBusinessAdviceInput } from "@/lib/types"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function AiRoomPage() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = React.useState<ChatSession | null>(null);
  const [user] = useAuthState(auth);
  const { toast } = useToast()
  const { settings } = useSettings()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // For now, let's use some dummy data and localStorage
  React.useEffect(() => {
    if (!user) return;
    try {
      const savedSessions = localStorage.getItem(`chatSessions_${user.uid}`);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        if(parsed.length > 0 && !activeSession) {
          setActiveSession(parsed[0]);
        }
      } else {
         // Create a default session if none exist
         const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: "New Chat",
            createdAt: new Date().toISOString(),
            messages: [],
         };
         setSessions([newSession]);
         setActiveSession(newSession);
      }
    } catch (error) {
      console.error("Failed to load chat sessions", error);
    }
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
     try {
        if (sessions.length > 0) {
            localStorage.setItem(`chatSessions_${user.uid}`, JSON.stringify(sessions));
        } else {
            localStorage.removeItem(`chatSessions_${user.uid}`);
        }
     } catch (error) {
         console.error("Failed to save chat sessions", error);
     }
  }, [sessions, user]);


  const handleNewChat = () => {
    const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: "New Chat",
        createdAt: new Date().toISOString(),
        messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
  }
  
  const handleUpdateSession = (sessionId: string, updatedMessages: ChatMessage[], newTitle?: string) => {
      setSessions(prev => prev.map(session => {
          if(session.id === sessionId) {
              const title = newTitle && session.title === "New Chat" ? newTitle : session.title;
              return { ...session, messages: updatedMessages, title };
          }
          return session;
      }));
       // Also update the active session if it's the one being changed
      if (activeSession?.id === sessionId) {
          setActiveSession(prev => {
              if (!prev) return null;
              const title = newTitle && prev.title === "New Chat" ? newTitle : prev.title;
              return {...prev, messages: updatedMessages, title };
          });
      }
  }

  const handleDeleteMessage = (messageIndex: number) => {
    if (!activeSession) return;
    
    const newMessages = [...activeSession.messages];
    // We delete the user message and the following AI response
    newMessages.splice(messageIndex, 2);
    
    handleUpdateSession(activeSession.id, newMessages);
  }

  const handleRegenerateResponse = async (messageIndex: number, allData: Omit<GetBusinessAdviceInput, 'question' | 'storedConversations' | 'businessContext'>) => {
    if (!activeSession) return;
    
    const newMessages = activeSession.messages.slice(0, messageIndex + 1);
    
    const userMessage = newMessages[messageIndex];
    if (userMessage.role !== 'user') return;
    
    handleUpdateSession(activeSession.id, newMessages);

    try {
      const storedConversations = newMessages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join("\n");
      
      const result = await getBusinessAdvice({
        question: userMessage.content,
        businessContext: settings.tagline,
        storedConversations,
        ...allData
      })
      
      const assistantMessage: ChatMessage = { role: "assistant", content: result.advice }
      
      handleUpdateSession(activeSession.id, [...newMessages, assistantMessage]);

    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "There was an issue getting a response from the AI.",
      })
      // Revert to messages before regeneration attempt
      handleUpdateSession(activeSession.id, activeSession.messages);
    }
  };
  
  const handleDeleteSession = (sessionId: string) => {
    let newActiveSession = activeSession;
    if (activeSession?.id === sessionId) {
        const currentIndex = sessions.findIndex(s => s.id === sessionId);
        if (sessions.length > 1) {
            newActiveSession = sessions[currentIndex === 0 ? 1 : currentIndex - 1];
        } else {
            newActiveSession = null;
        }
    }
    
    const newSessions = sessions.filter(s => s.id !== sessionId);

    if(newSessions.length === 0) {
        // If no sessions left, create a new one
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: "New Chat",
            createdAt: new Date().toISOString(),
            messages: [],
        };
        setSessions([newSession]);
        setActiveSession(newSession);
    } else {
        setSessions(newSessions);
        setActiveSession(newActiveSession);
    }
  }


  return (
    <div className="flex h-[calc(100vh-theme(height.14))]">
      <div
        className={cn(
          "hidden md:flex flex-col bg-muted/50 border-r transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-0"
        )}
      >
        <div className={cn("h-full", isSidebarOpen ? "w-72" : "w-0 overflow-hidden")}>
         <ChatSidebar 
            sessions={sessions}
            activeSession={activeSession}
            onSelectSession={setActiveSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
         />
        </div>
       </div>
       <div className="flex-1 flex flex-col relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 z-10"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            {activeSession ? (
                <AiRoomChat 
                    key={activeSession.id}
                    session={activeSession}
                    onMessagesChange={(messages, newTitle) => handleUpdateSession(activeSession.id, messages, newTitle)}
                    onRegenerateResponse={handleRegenerateResponse}
                    onDeleteMessage={handleDeleteMessage}
                />
            ) : (
                 <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <p>Select a chat or start a new one.</p>
                </div>
            )}
       </div>
    </div>
  )
}
