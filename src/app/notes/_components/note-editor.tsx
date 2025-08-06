
"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { format } from "date-fns"
import { Palette, Trash2, X } from "lucide-react"

import type { Note } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { cn } from "@/lib/utils"

interface NoteEditorProps {
  note: Note | null
  onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const noteColors = [
  { name: 'Default', value: 'bg-card' },
  { name: 'Red', value: 'bg-red-900/40' },
  { name: 'Orange', value: 'bg-orange-900/40' },
  { name: 'Yellow', value: 'bg-yellow-900/40' },
  { name: 'Green', value: 'bg-green-900/40' },
  { name: 'Blue', value: 'bg-blue-900/40' },
  { name: 'Purple', value: 'bg-purple-900/40' },
];

export function NoteEditor({ note, onUpdate, onDelete, open, onOpenChange }: NoteEditorProps) {
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

  const handleColorChange = (color: string) => {
    if (note) {
      onUpdate(note.id, { color });
    }
  }

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-2xl h-[80vh] flex flex-col", note.color || "bg-card")}>
            <DialogHeader className="flex-row items-center justify-between">
                <DialogTitle className="truncate">
                    {title || "Untitled Note"}
                </DialogTitle>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon"><Palette /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto">
                            <div className="flex gap-2">
                                {noteColors.map(color => (
                                    <button 
                                        key={color.name} 
                                        aria-label={color.name}
                                        className={cn("h-8 w-8 rounded-full border", color.value)}
                                        onClick={() => handleColorChange(color.value)}
                                    />
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="text-destructive"><Trash2 /></Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete this note. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {onDelete(note.id); onOpenChange(false);}}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <DialogClose asChild>
                         <Button variant="ghost" size="icon"><X/></Button>
                    </DialogClose>
                </div>
            </DialogHeader>
             <div className="flex-1 flex flex-col min-h-0">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 !p-2 bg-transparent"
                    placeholder="Note Title"
                />
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-none text-base bg-transparent !p-2"
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
