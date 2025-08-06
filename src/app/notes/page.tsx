
"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import type { Note } from "@/lib/types"
import { NotesList } from "./_components/notes-list"
import { NoteEditor } from "./_components/note-editor"
import { Button } from "@/components/ui/button"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

export default function NotesPage() {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [activeNote, setActiveNote] = React.useState<Note | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const [user] = useAuthState(auth);

  // Load from local storage on mount
  React.useEffect(() => {
    setIsMounted(true)
    if (!user) return;
    try {
      const savedNotes = localStorage.getItem(`notes_${user.uid}`)
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        setNotes(parsedNotes)
      }
    } catch (error) {
      console.error("Failed to load notes from local storage", error)
    }
  }, [user])

  // Save to local storage on change
  React.useEffect(() => {
    if (isMounted && user) {
      try {
        localStorage.setItem(`notes_${user.uid}`, JSON.stringify(notes))
      } catch (error) {
        console.error("Failed to save notes to local storage", error)
      }
    }
  }, [notes, isMounted, user])

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
      updatedAt: new Date().toISOString(),
      color: "bg-card"
    }
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setActiveNote(newNote);
    setIsEditorOpen(true);
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter((note) => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null)
      setIsEditorOpen(false);
    }
  }

  const updateNote = (id: string, updatedData: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes(prev => {
        const newNotes = prev.map((note) =>
            note.id === id ? { ...note, ...updatedData, updatedAt: new Date().toISOString() } : note
        );
         if (activeNote?.id === id) {
            setActiveNote(newNotes.find(n => n.id === id) || null);
        }
        return newNotes.sort((a,b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    });
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
            onDelete={deleteNote}
            onUpdate={updateNote}
        />
      </div>

       <NoteEditor 
            note={activeNote} 
            onUpdate={updateNote} 
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
        />
    </div>
  )
}
