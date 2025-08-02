
"use client"

import * as React from "react"
import type { GenerateCallNoteOutput } from "@/ai/flows/generate-call-note"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ClipboardList, Mail, Rocket } from "lucide-react"

interface CallNoteDisplayProps {
    note: GenerateCallNoteOutput;
}

export function CallNoteDisplay({ note }: CallNoteDisplayProps) {
    return (
        <Card className="glassmorphic mt-8">
            <CardHeader>
                <CardTitle>Generated Call Note</CardTitle>
                <CardDescription>Here is the AI-generated summary of your call.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><ClipboardList className="mr-2 text-blue-400"/> Summary</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{note.summary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><Rocket className="mr-2 text-purple-400"/> Next Actions</h3>
                    <ul className="space-y-2">
                       {note.nextActions.map((action, index) => (
                           <li key={index} className="text-muted-foreground bg-muted/50 p-3 rounded-md">{action}</li>
                       ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><Mail className="mr-2 text-green-500"/> Email Draft</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{note.emailDraft}</p>
                </div>
            </CardContent>
        </Card>
    )
}
