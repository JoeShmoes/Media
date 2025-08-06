
"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { format } from "date-fns"
import { Palette, MoreVertical, Trash2 } from "lucide-react"

import type { Note } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { cn } from "@/lib/utils"

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void;
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

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note.title)
  const [content, setContent] = React.useState(note.content)

  const [debouncedTitle] = useDebounce(title, 500)
  const [debouncedContent] = useDebounce(content, 500)

  React.useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);
  

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

  const handleColorChange = (color: string) => {
    onUpdate(note.id, { color });
  }

  return (
    <div className={cn("h-full flex flex-col rounded-lg p-4", note.color || "bg-card")}>
      <div className="flex items-center justify-between p-2">
         <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/> Delete Note
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this note. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(note.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
         </div>
      </div>
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
    </div>
  )
}
