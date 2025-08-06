
"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import type { Note } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

interface NotesListProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
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

export function NotesList({ notes, onSelectNote, onDelete, onUpdate }: NotesListProps) {
    
  if (notes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
        <p className="text-lg font-semibold">You have no notes yet.</p>
        <p className="mt-2">Click "New Note" to create one.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {notes.map((note) => (
        <div key={note.id} className="group relative">
            <button
            onClick={() => onSelectNote(note)}
            className={cn(
                "w-full text-left p-4 rounded-lg h-48 flex flex-col transition-all duration-200 ease-in-out",
                note.color || 'bg-muted/50',
                "hover:scale-105"
            )}
            >
                <h3 className="font-semibold truncate text-card-foreground">{note.title || "Untitled Note"}</h3>
                <p className="text-sm text-card-foreground/70 truncate line-clamp-3 flex-1 py-2">
                    {note.content || "No content"}
                </p>
                <p className={cn("text-xs mt-auto text-card-foreground/60")}>
                    {formatDistanceToNow(new Date(note.updatedAt || note.createdAt), { addSuffix: true })}
                </p>
            </button>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuSub>
                             <DropdownMenuSubTrigger>
                                <Palette className="mr-2 h-4 w-4" />
                                <span>Change Color</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <div className="flex gap-2 p-2">
                                        {noteColors.map(color => (
                                             <button 
                                                key={color.name} 
                                                aria-label={color.name}
                                                className={cn("h-6 w-6 rounded-full border", color.value)}
                                                onClick={() => onUpdate(note.id, { color: color.value })}
                                            />
                                        ))}
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      ))}
    </div>
  )
}
