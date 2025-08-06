
"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2 } from "lucide-react"

import type { Note } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface NotesListProps {
  notes: Note[]
  activeNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export function NotesList({ notes, activeNote, onSelectNote, onDeleteNote }: NotesListProps) {
    
  if (notes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>You have no notes yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="group relative">
            <button
              onClick={() => onSelectNote(note)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                note.color || 'bg-muted/50',
                activeNote?.id === note.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-muted"
              )}
            >
              <h3 className="font-semibold truncate text-card-foreground">{note.title}</h3>
              <p className="text-sm text-card-foreground/70 truncate line-clamp-2 h-10">
                {note.content}
              </p>
              <p
                className={cn(
                  "text-xs mt-2 text-card-foreground/60"
                )}
              >
                {formatDistanceToNow(new Date(note.updatedAt || note.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the note. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteNote(note.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
