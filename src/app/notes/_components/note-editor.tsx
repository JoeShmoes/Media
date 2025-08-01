"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { format } from "date-fns"

import type { Note } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note.title)
  const [content, setContent] = React.useState(note.content)

  const [debouncedTitle] = useDebounce(title, 500)
  const [debouncedContent] = useDebounce(content, 500)

  React.useEffect(() => {
    if (debouncedTitle !== note.title) {
      onUpdate(note.id, { title: debouncedTitle })
    }
  }, [debouncedTitle, note.id, note.title, onUpdate])

  React.useEffect(() => {
    if (debouncedContent !== note.content) {
      onUpdate(note.id, { content: debouncedContent })
    }
  }, [debouncedContent, note.id, note.content, onUpdate])

  const lastUpdated = format(
    new Date(note.updatedAt || note.createdAt),
    "MMMM d, yyyy 'at' h:mm a"
  )

  return (
    <div className="h-full flex flex-col glassmorphic rounded-lg p-4">
      <div className="p-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 !p-0"
          placeholder="Note Title"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated}
        </p>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-none text-base"
        placeholder="Start writing..."
      />
    </div>
  )
}
