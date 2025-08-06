
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

  React.useEffect(() => {
    setIsMounted(true)
    try {
      const savedNotes = localStorage.getItem("notes")
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        setNotes(parsedNotes)
        if (parsedNotes.length > 0) {
            setActiveNote(parsedNotes[0]);
        }
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
    setActiveNote(newNote)
  }

  const deleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes)
    if (activeNote?.id === id) {
      setActiveNote(newNotes.length > 0 ? newNotes[0] : null)
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
    <div className="flex flex-col h-full">
      <div className="flex-1 grid md:grid-cols-[300px_1fr] h-full">
        <div className="h-full flex flex-col border-r">
          <div className="p-4 flex-shrink-0">
             <Button onClick={addNote} className="w-full">
              <Plus className="mr-2" /> New Note
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <NotesList
                notes={notes}
                activeNote={activeNote}
                onSelectNote={setActiveNote}
                onDeleteNote={deleteNote}
            />
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          {activeNote ? (
            <NoteEditor 
                key={activeNote.id} 
                note={activeNote} 
                onUpdate={updateNote} 
                onDelete={deleteNote}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground flex-col text-center p-8">
              <h2 className="text-xl font-semibold">Select a note</h2>
              <p>Select a note from the list on the left, or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
