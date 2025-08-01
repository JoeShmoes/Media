"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { AiRoomChat } from "./_components/ai-room-chat"
import { ChatSidebar } from "./_components/chat-sidebar"
import type { ChatMessage, ChatSession } from "@/lib/types"
import { getBusinessAdvice } from "@/ai/flows/get-business-advice"
import { useToast } from "@/hooks/use-toast"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function AiRoomPage() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setIsMounted(true)
    try {
      const savedSessions = localStorage.getItem("chatSessions")
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      } else {
        // Create a default session if none exist
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
          // If this is the first user message, set the title
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
          // If a user message is deleted, delete the assistant message after it as well
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

      // Update the user message and remove subsequent messages
      const updatedMessages = session.messages.slice(0, messageIndex + 1);
      updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newContent };
      
      handleUpdateSession(sessionId, updatedMessages);
      
      try {
        const result = await getBusinessAdvice({
            question: newContent,
            businessContext: "The user runs multiple businesses: SEO, website creation, outreach campaigns, and social content. They are a young, hungry entrepreneur.",
            storedConversations: JSON.stringify(updatedMessages.slice(-5)),
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
        // Restore previous state on error
        handleUpdateSession(sessionId, session.messages);
      }
  };


  const activeSession = sessions.find(s => s.id === activeSessionId)
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full flex-1">
          <AiRoomChat
            session={activeSession ?? null}
            onUpdateSession={handleUpdateSession}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
