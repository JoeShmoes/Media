
"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import type { Note } from "@/lib/types"
import { cn } from "@/lib/utils"

interface NotesListProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
}

export function NotesList({ notes, onSelectNote }: NotesListProps) {
    
  if (notes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
        <p className="text-lg font-semibold">You have no notes yet.</p>
        <p className="mt-2">Click "New Note" to create one.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={cn(
            "w-full text-left p-4 rounded-lg transition-colors h-48 flex flex-col",
            note.color || 'bg-muted/50',
            "hover:ring-2 hover:ring-primary"
          )}
        >
          <h3 className="font-semibold truncate text-card-foreground">{note.title || "Untitled Note"}</h3>
          <p className="text-sm text-card-foreground/70 truncate line-clamp-3 flex-1 py-2">
            {note.content || "No content"}
          </p>
          <p
            className={cn(
              "text-xs mt-auto text-card-foreground/60"
            )}
          >
            {formatDistanceToNow(new Date(note.updatedAt || note.createdAt), {
              addSuffix: true,
            })}
          </p>
        </button>
      ))}
    </div>
  )
}
