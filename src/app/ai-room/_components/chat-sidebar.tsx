
"use client"

import * as React from "react"
import { Plus, MessageSquare, Trash2 } from "lucide-react"

import type { ChatSession } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
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

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
  onDeleteSession: (sessionId: string) => void
}

export function ChatSidebar({ sessions, activeSession, onSelectSession, onNewChat, onDeleteSession }: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-4 py-2 space-y-1">
          {sessions.map((session) => (
             <div key={session.id} className="relative group">
                <button
                    onClick={() => onSelectSession(session)}
                    className={cn(
                        "w-full text-left p-2 rounded-md transition-colors text-sm truncate",
                        activeSession?.id === session.id
                        ? "bg-primary/20"
                        : "hover:bg-primary/10"
                    )}
                    >
                    <MessageSquare className="inline h-4 w-4 mr-2" />
                    {session.title}
                </button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 -translate-y-1/2 right-1 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                            >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this chat session. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteSession(session.id)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
