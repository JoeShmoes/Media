
"use client"

import * as React from "react"
import { ChatSidebar } from "./_components/chat-sidebar"
import { AiRoomChat } from "./_components/ai-room-chat"
import type { ChatSession } from "@/lib/types"

export default function AiRoomPage() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = React.useState<ChatSession | null>(null);

  // For now, let's use some dummy data and localStorage
  React.useEffect(() => {
    try {
      const savedSessions = localStorage.getItem("chatSessions");
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
  }, []);

  React.useEffect(() => {
     try {
        localStorage.setItem("chatSessions", JSON.stringify(sessions));
     } catch (error) {
         console.error("Failed to save chat sessions", error);
     }
  }, [sessions]);


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
  
  const handleUpdateSession = (sessionId: string, updatedMessages: any[], newTitle?: string) => {
      setSessions(prev => prev.map(session => {
          if(session.id === sessionId) {
              const title = newTitle && session.title === "New Chat" ? newTitle : session.title;
              return { ...session, messages: updatedMessages, title };
          }
          return session;
      }));
       // Also update the active session if it's the one being changed
      if (activeSession?.id === sessionId) {
          setActiveSession(prev => prev ? ({...prev, messages: updatedMessages}) : null);
      }
  }
  
  const handleDeleteSession = (sessionId: string) => {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
          setActiveSession(sessions.length > 1 ? sessions[0] : null);
      }
  }


  return (
    <div className="flex h-[calc(100vh-theme(height.14))]">
       <div className="hidden md:flex flex-col w-72 bg-muted/50 border-r">
         <ChatSidebar 
            sessions={sessions}
            activeSession={activeSession}
            onSelectSession={setActiveSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
         />
       </div>
       <div className="flex-1 flex flex-col">
            {activeSession ? (
                <AiRoomChat 
                    key={activeSession.id}
                    session={activeSession}
                    onMessagesChange={(messages, newTitle) => handleUpdateSession(activeSession.id, messages, newTitle)}
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
