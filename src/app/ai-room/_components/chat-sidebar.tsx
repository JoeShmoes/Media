
"use client"

import * as React from "react"
import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import type { ChatSession } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  activeSessionId: string | null
  onNewChat: () => void
  onSelectChat: (sessionId: string) => void
  onDeleteChat: (sessionId: string) => void
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col p-2 bg-background border-r">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Chats</h2>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-2">
        <div className="px-2 py-2 space-y-1">
          {sessions.map((session) => (
            <div key={session.id} className="group relative">
              <button
                onClick={() => onSelectChat(session.id)}
                className={cn(
                  "w-full text-left p-2 rounded-md truncate text-sm transition-colors",
                  activeSessionId === session.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <p className="font-medium">{session.title}</p>
                <p
                  className={cn(
                    "text-xs",
                    activeSessionId === session.id
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                </p>
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this chat session? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteChat(session.id)}>Delete</AlertDialogAction>
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
