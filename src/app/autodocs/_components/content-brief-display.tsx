
"use client"

import * as React from "react"
import type { GenerateContentBriefOutput } from "@/ai/flows/generate-content-brief"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Lightbulb, Image as ImageIcon, Search } from "lucide-react"

interface ContentBriefDisplayProps {
    brief: GenerateContentBriefOutput;
}

export function ContentBriefDisplay({ brief }: ContentBriefDisplayProps) {
    return (
        <Card className="glassmorphic mt-8">
            <CardHeader>
                <CardTitle>Generated Content Brief</CardTitle>
                <CardDescription>Here is the AI-generated brief for your content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><Lightbulb className="mr-2 text-yellow-400"/> Hook</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{brief.hook}</p>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><CheckCircle className="mr-2 text-green-500"/> Talking Points</h3>
                    <ul className="space-y-2">
                       {brief.talkingPoints.map((point, index) => (
                           <li key={index} className="text-muted-foreground bg-muted/50 p-3 rounded-md">{point}</li>
                       ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><Search className="mr-2 text-blue-400"/> Keywords</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{brief.keywords}</p>
                </div>
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><ImageIcon className="mr-2 text-purple-400"/> Visual Suggestions</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{brief.visuals}</p>
                </div>
            </CardContent>
        </Card>
    )
}
