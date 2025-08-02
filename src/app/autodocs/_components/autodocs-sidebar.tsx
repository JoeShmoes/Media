"use client"

import * as React from "react"
import { Plus, FileText, Trash2, StickyNote, Book, GitCompareArrows, ClipboardList } from "lucide-react"

import type { SavedDocument, DocumentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface AutoDocsSidebarProps {
  documents: SavedDocument[]
  activeDocumentId: string | null
  onSelectDocument: (id: string) => void
  onDeleteDocument: (id: string) => void
  onNewDocument: (type: DocumentType) => void
}

const docTypeIcons: Record<DocumentType, React.ReactElement> = {
  "Meeting Summary": <ClipboardList className="h-4 w-4" />,
  "Call Note": <StickyNote className="h-4 w-4" />,
  "Content Brief": <FileText className="h-4 w-4" />,
  "SOP": <Book className="h-4 w-4" />,
  "Version Comparison": <GitCompareArrows className="h-4 w-4" />,
}

export function AutoDocsSidebar({
  documents,
  activeDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onNewDocument,
}: AutoDocsSidebarProps) {

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<DocumentType, SavedDocument[]>);


  return (
    <div className="h-full flex flex-col p-2 bg-background border-r">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Documents</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNewDocument("Meeting Summary")}>Summarize Transcript</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNewDocument("Call Note")}>Create Call Note</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNewDocument("Content Brief")}>Create Content Brief</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNewDocument("SOP")}>Generate SOP</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNewDocument("Version Comparison")}>Compare Documents</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1 -mx-2">
        <div className="px-2 py-2 space-y-1">
          {Object.entries(groupedDocuments).map(([type, docs]) => (
            <div key={type} className="space-y-1">
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">{type}</h3>
              {docs.map((doc) => (
                 <div key={doc.id} className="group relative">
                  <button
                    onClick={() => onSelectDocument(doc.id)}
                    className={cn(
                      "w-full text-left p-2 rounded-md truncate text-sm transition-colors",
                      activeDocumentId === doc.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {docTypeIcons[doc.type]}
                      <span className="flex-1 truncate">{doc.title}</span>
                    </div>
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this document? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteDocument(doc.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          ))}
           {documents.length === 0 && (
            <div className="text-center text-muted-foreground p-4">
              <p>No documents yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
