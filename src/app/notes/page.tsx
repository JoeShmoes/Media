"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { PageHeader } from "@/components/page-header"
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
       <div className="p-4 md:p-8 md:pb-4 pt-6">
            <PageHeader title="Notes">
                <Button onClick={addNote}>
                    <Plus className="mr-2" /> New Note
                </Button>
            </PageHeader>
            <p className="text-muted-foreground -mt-4">
                Create and manage your notes. They are saved automatically.
            </p>
        </div>
      <div className="flex-1 grid md:grid-cols-[300px_1fr] gap-6 p-4 md:p-8 pt-0">
        <div className="h-full overflow-y-auto">
          <NotesList
            notes={notes}
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onDeleteNote={deleteNote}
          />
        </div>
        <div className="h-full overflow-y-auto">
          {activeNote ? (
            <NoteEditor key={activeNote.id} note={activeNote} onUpdate={updateNote} />
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              <p>Select a note to view or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
