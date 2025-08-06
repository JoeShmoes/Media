
"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { format } from "date-fns"

import type { Note } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"


import { cn } from "@/lib/utils"

interface NoteEditorProps {
  note: Note | null
  onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteEditor({ note, onUpdate, open, onOpenChange }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note?.title || "")
  const [content, setContent] = React.useState(note?.content || "")

  const [debouncedTitle] = useDebounce(title, 500)
  const [debouncedContent] = useDebounce(content, 500)
  
  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  React.useEffect(() => {
    if (note && debouncedTitle !== note.title) {
      onUpdate(note.id, { title: debouncedTitle })
    }
  }, [debouncedTitle, note, onUpdate])

  React.useEffect(() => {
    if (note && debouncedContent !== note.content) {
      onUpdate(note.id, { content: debouncedContent })
    }
  }, [debouncedContent, note, onUpdate])

  const lastUpdated = note ? format(
    new Date(note.updatedAt || note.createdAt),
    "MMMM d, yyyy 'at' h:mm a"
  ) : ""

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-4xl h-[80vh] flex flex-col p-0", note.color || "bg-card")}>
            <div className="flex items-center justify-between p-2 border-b">
                 <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-bold border-none shadow-none focus-visible:ring-0 !p-2 bg-transparent flex-1"
                    placeholder="Note Title"
                />
            </div>
             <div className="flex-1 flex flex-col min-h-0">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-none text-base bg-transparent !p-4"
                    placeholder="Start writing..."
                />
                 <p className="text-xs text-muted-foreground p-2 text-right">
                    Last updated: {lastUpdated}
                </p>
             </div>
        </DialogContent>
    </Dialog>
  )
}
