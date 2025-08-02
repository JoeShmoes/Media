
"use client"

import * as React from "react"
import type { SummarizeTranscriptOutput } from "@/ai/flows/summarize-transcript"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, ListChecks, Target } from "lucide-react"

interface MeetingSummaryDisplayProps {
    summary: SummarizeTranscriptOutput;
}

export function MeetingSummaryDisplay({ summary }: MeetingSummaryDisplayProps) {
    return (
        <Card className="glassmorphic mt-8">
            <CardHeader>
                <CardTitle>{summary.title}</CardTitle>
                <CardDescription>Here is the AI-generated summary of your meeting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><Target className="mr-2 text-blue-400"/> Key Decisions</h3>
                     <ul className="space-y-2">
                       {summary.keyDecisions.map((item, index) => (
                           <li key={index} className="text-muted-foreground bg-muted/50 p-3 rounded-md">{item}</li>
                       ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><ListChecks className="mr-2 text-purple-400"/> Action Items</h3>
                    <ul className="space-y-2">
                       {summary.actionItems.map((item, index) => (
                           <li key={index} className="text-muted-foreground bg-muted/50 p-3 rounded-md">{item}</li>
                       ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><AlertTriangle className="mr-2 text-yellow-400"/> Concerns Raised</h3>
                    <ul className="space-y-2">
                       {summary.concerns.map((item, index) => (
                           <li key={index} className="text-muted-foreground bg-muted/50 p-3 rounded-md">{item}</li>
                       ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
