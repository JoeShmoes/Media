
"use client"

import * as React from "react"
import { useDebounce } from "use-debounce"
import { Bot } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BrandVoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { BrandVoiceAiDialog } from "./brand-voice-ai-dialog"

interface BrandVoiceFormProps {
  value: BrandVoice
  onChange: (value: BrandVoice) => void
}

export function BrandVoiceForm({ value, onChange }: BrandVoiceFormProps) {
  const [voice, setVoice] = React.useState(value)
  const [debouncedVoice] = useDebounce(voice, 500)
  const [isAiDialogOpen, setIsAiDialogOpen] = React.useState(false);

  React.useEffect(() => {
    onChange(debouncedVoice)
  }, [debouncedVoice, onChange])

  React.useEffect(() => {
    setVoice(value)
  }, [value])

  const handleChange = (field: keyof BrandVoice, fieldValue: string) => {
    setVoice(prev => ({ ...prev, [field]: fieldValue }))
  }

  const handleAiGenerated = (generatedVoice: BrandVoice) => {
    setVoice(generatedVoice);
    onChange(generatedVoice);
    setIsAiDialogOpen(false);
  }

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Bot /> Brand Voice & Tone</CardTitle>
            <CardDescription>Define how the AI should sound when representing your brand.</CardDescription>
          </div>
           <Button variant="outline" size="sm" onClick={() => setIsAiDialogOpen(true)}>
             <Bot className="mr-2 h-4 w-4"/> AI Assist
           </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Textarea
              id="tone"
              placeholder="e.g., Confident, direct, and slightly informal."
              value={voice.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Writing Style</Label>
            <Textarea
              id="style"
              placeholder="e.g., Use short sentences. Avoid jargon. Address the reader directly."
              value={voice.style}
              onChange={(e) => handleChange('style', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examples">Good Examples</Label>
            <Textarea
              id="examples"
              placeholder="e.g., Paste in examples of writing that perfectly capture your brand's voice."
              value={voice.examples}
              onChange={(e) => handleChange('examples', e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>
      <BrandVoiceAiDialog 
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        onBrandVoiceGenerated={handleAiGenerated}
      />
    </>
  )
}
