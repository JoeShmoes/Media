
"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import type { Note } from "@/lib/types"
import { NotesList } from "./_components/notes-list"
import { NoteEditor } from "./_components/note-editor"
import { Button } from "@/components/ui/button"

export default function NotesPage() {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [activeNote, setActiveNote] = React.useState<Note | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    try {
      const savedNotes = localStorage.getItem("notes")
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        setNotes(parsedNotes)
      }
    } catch (error) {
      console.error("Failed to load notes from local storage", error)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("notes", JSON.stringify(notes))
      } catch (error) {
        console.error("Failed to save notes to local storage", error)
      }
    }
  }, [notes, isMounted])

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  }

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "New Note",
      content: "Start writing your note here...",
      createdAt: new Date().toISOString(),
      color: "bg-card"
    }
    const newNotes = [newNote, ...notes];
    setNotes(newNotes)
    handleSelectNote(newNote);
  }

  const deleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes)
    if (activeNote?.id === id) {
      setActiveNote(null)
      setIsEditorOpen(false);
    }
  }

  const updateNote = (id: string, updatedData: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const newNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updatedData, updatedAt: new Date().toISOString() } : note
    )
    setNotes(newNotes)
    if (activeNote?.id === id) {
      setActiveNote(newNotes.find(n => n.id === id) || null);
    }
  }

  if (!isMounted) return null

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
       <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-2xl font-bold">Notes</h1>
                <p className="text-muted-foreground">Your personal space for ideas and thoughts.</p>
            </div>
            <Button onClick={addNote}>
            <Plus className="mr-2" /> New Note
            </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NotesList
            notes={notes}
            onSelectNote={handleSelectNote}
        />
      </div>

       <NoteEditor 
            note={activeNote} 
            onUpdate={updateNote} 
            onDelete={deleteNote}
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
        />
    </div>
  )
}
