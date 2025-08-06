
"use client"

import * as React from "react"
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
    note: Note | null;
    onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NoteEditor({ note, onUpdate, open, onOpenChange }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note?.title || "")
  const [content, setContent] = React.useState(note?.content || "")
  
  React.useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleBlur = () => {
    if (!note) return;
    if (title !== note.title || content !== note.content) {
        onUpdate(note.id, { title, content });
    }
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        // Ensure final state is saved on close
        handleBlur();
    }
    onOpenChange(isOpen);
  }

  const lastUpdated = note ? format(
    new Date(note.updatedAt || note.createdAt),
    "MMMM d, yyyy 'at' h:mm a"
  ) : ""

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={cn("sm:max-w-4xl h-[80vh] flex flex-col p-0 gap-0", note.color || "bg-card")}>
            <div className="p-4 border-b">
                 <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleBlur}
                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 !p-0 bg-transparent flex-1"
                    placeholder="Note Title"
                />
            </div>
             <div className="flex-1 flex flex-col min-h-0">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleBlur}
                    className="flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-none text-base bg-transparent !p-4"
                    placeholder="Start writing..."
                />
             </div>
             <div className="p-2 border-t mt-auto flex justify-end items-center">
                <p className="text-xs text-muted-foreground text-right">
                    Last updated: {lastUpdated}
                </p>
            </div>
        </DialogContent>
    </Dialog>
  )
}
