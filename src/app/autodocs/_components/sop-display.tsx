
"use client"

import * as React from "react"
import type { GenerateSopOutput } from "@/ai/flows/generate-sop"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface SopDisplayProps {
    sop: GenerateSopOutput;
}

export function SopDisplay({ sop }: SopDisplayProps) {
    return (
        <Card className="glassmorphic mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> {sop.title}</CardTitle>
                <CardDescription>The AI-generated Standard Operating Procedure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {sop.steps.map((step, index) => (
                    <div key={index}>
                        <h3 className="font-semibold text-lg mb-2">Step {index + 1}: {step.title}</h3>
                        <p className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{step.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
