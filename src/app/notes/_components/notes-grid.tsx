"use client"

import * as React from "react"
import { Plus, Trash2, Edit, Save, X } from "lucide-react"

import type { Note } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"

export function NotesGrid() {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes, isMounted])
  
  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "New Note",
      content: "Start writing your note here...",
      createdAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const updateNote = (id: string, updatedNote: Partial<Omit<Note, 'id'>>) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)))
  }
  
  if (!isMounted) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={addNote}>
          <Plus className="mr-2" /> Add Note
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
        ))}
      </div>
       {notes.length === 0 && (
          <div className="text-center text-muted-foreground py-12 col-span-full">
            <p>You have no notes yet.</p>
            <Button variant="link" onClick={addNote}>Create one now</Button>
          </div>
        )}
    </div>
  )
}

function NoteCard({ note, onUpdate, onDelete }: { note: Note; onUpdate: (id: string, data: Partial<Note>) => void; onDelete: (id: string) => void }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [title, setTitle] = React.useState(note.title)
  const [content, setContent] = React.useState(note.content)

  const handleSave = () => {
    onUpdate(note.id, { title, content })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  return (
    <Card className="glassmorphic flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        {isEditing ? (
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg font-bold" />
        ) : (
          <CardTitle className="text-lg">{note.title}</CardTitle>
        )}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave}><Save className="h-4 w-4 text-green-500" /></Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(note.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {isEditing ? (
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-full min-h-[150px] resize-none" />
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">{note.content}</p>
        )}
      </CardContent>
       <div className="p-6 pt-0 text-xs text-muted-foreground">
        Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
      </div>
    </Card>
  )
}
