
"use client"

import * as React from "react"
import type { CompareVersionsOutput } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Scale, FileDiff } from "lucide-react"

interface VersionComparisonDisplayProps {
    result: CompareVersionsOutput;
}

const diffColors = {
    added: "bg-green-500/20 text-green-200",
    removed: "bg-red-500/20 text-red-200 line-through",
    unchanged: "text-muted-foreground",
}

export function VersionComparisonDisplay({ result }: VersionComparisonDisplayProps) {
    return (
        <Card className="glassmorphic mt-8">
            <CardHeader>
                <CardTitle>Comparison Result</CardTitle>
                <CardDescription>Here is the AI-generated analysis of the two versions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-2"><Scale className="mr-2 text-blue-400"/> Change Summary</h3>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">{result.summary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-2"><FileDiff className="mr-2 text-purple-400"/> Detailed Diff</h3>
                    <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap font-mono text-sm">
                        {result.diff.map((change, index) => (
                           <span key={index} className={`${diffColors[change.type]}`}>
                               {change.text}
                           </span>
                       ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
