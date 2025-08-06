
"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { format } from "date-fns"
import { Bot, Loader2 } from "lucide-react"

import type { Note } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { assistInNoteStream } from "@/ai/flows/assist-in-note"
import { cn } from "@/lib/utils"

interface AiAssistPopoverProps { 
    noteContent: string;
    onStreamStart: () => void;
    onStreamChunk: (chunk: string) => void;
    onStreamEnd: () => void;
}

function AiAssistPopover({ noteContent, onStreamStart, onStreamChunk, onStreamEnd }: AiAssistPopoverProps) {
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleAiAction = async (actionPrompt: string) => {
    setIsLoading(true);
    onStreamStart();
    try {
      const stream = await assistInNoteStream({ noteContent, prompt: actionPrompt });
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        onStreamChunk(decoder.decode(value, { stream: true }));
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Assist Failed",
        description: "There was an issue getting a response from the AI.",
      });
    } finally {
      setIsLoading(false);
      onStreamEnd();
      setPrompt("");
    }
  };

  const quickActions = ["Summarize", "Continue Writing", "Fix Grammar"];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><Bot className="mr-2 h-4 w-4" /> AI Assist</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Assistant</h4>
            <p className="text-sm text-muted-foreground">
              Ask the AI to edit or add to your note.
            </p>
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="e.g., Turn this into a blog post."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
            <Button onClick={() => handleAiAction(prompt)} disabled={isLoading || !prompt}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Submit
            </Button>
            <div className="flex flex-wrap gap-1">
              {quickActions.map(action => (
                <Button key={action} variant="outline" size="xs" onClick={() => handleAiAction(action)} disabled={isLoading}>
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
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

  const handleAiStreamStart = () => {
    setContent(""); // Clear content when AI starts
  }

  const handleAiStreamChunk = (chunk: string) => {
    setContent(prev => prev + chunk);
  }

  const handleAiStreamEnd = () => {
    // The debounced effect will handle the final save
  }

  const lastUpdated = note ? format(
    new Date(note.updatedAt || note.createdAt),
    "MMMM d, yyyy 'at' h:mm a"
  ) : ""

  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-4xl h-[80vh] flex flex-col p-0 gap-0", note.color || "bg-card")}>
            <div className="p-4 border-b">
                 <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 !p-0 bg-transparent flex-1"
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
             </div>
             <div className="p-2 border-t mt-auto flex justify-between items-center">
                <AiAssistPopover 
                    noteContent={note.content} 
                    onStreamStart={handleAiStreamStart}
                    onStreamChunk={handleAiStreamChunk}
                    onStreamEnd={handleAiStreamEnd}
                />
                <p className="text-xs text-muted-foreground text-right">
                    Last updated: {lastUpdated}
                </p>
            </div>
        </DialogContent>
    </Dialog>
  )
}
