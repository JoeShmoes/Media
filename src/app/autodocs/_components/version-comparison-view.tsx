
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { CompareVersionsOutput } from "@/ai/flows/compare-versions"
import { compareVersions } from "@/ai/flows/compare-versions"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VersionComparisonDisplay } from "./version-comparison-display"
import { Input } from "@/components/ui/input"

const comparisonSchema = z.object({
  originalText: z.string().min(1, "Original text cannot be empty."),
  revisedText: z.string().min(1, "Revised text cannot be empty."),
})

type FormValues = z.infer<typeof comparisonSchema>

export function VersionComparisonView() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [result, setResult] = React.useState<CompareVersionsOutput | null>(null);
  const { toast } = useToast()
  const originalFileInputRef = React.useRef<HTMLInputElement>(null);
  const revisedFileInputRef = React.useRef<HTMLInputElement>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      originalText: "",
      revisedText: "",
    },
  })
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'originalText' | 'revisedText') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue(fieldName, text);
      };
      reader.readAsText(file);
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    setResult(null);
    try {
      const generatedResult = await compareVersions(data)
      setResult(generatedResult);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error Generating Comparison",
        description: "There was an issue generating the comparison. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Compare Document Versions</CardTitle>
                <CardDescription>Paste the two versions of the text below to see a summary and a detailed diff of the changes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                        control={form.control}
                        name="originalText"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Original Text (Version 1)</FormLabel>
                                <Button type="button" variant="outline" size="sm" onClick={() => originalFileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                                </Button>
                                <Input 
                                type="file" 
                                ref={originalFileInputRef} 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, 'originalText')}
                                accept=".txt"
                                />
                            </div>
                            <FormControl>
                                <Textarea 
                                    placeholder="Paste the original text here..." 
                                    {...field}
                                    rows={15}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="revisedText"
                        render={({ field }) => (
                            <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Revised Text (Version 2)</FormLabel>
                                 <Button type="button" variant="outline" size="sm" onClick={() => revisedFileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload File
                                 </Button>
                                 <Input 
                                    type="file" 
                                    ref={revisedFileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => handleFileChange(e, 'revisedText')}
                                    accept=".txt"
                                />
                            </div>
                            <FormControl>
                                <Textarea 
                                    placeholder="Paste the revised text here..." 
                                    {...field}
                                    rows={15}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button type="submit" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        Compare Versions
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
        
        {result && <VersionComparisonDisplay result={result} />}
    </div>
  )
}
