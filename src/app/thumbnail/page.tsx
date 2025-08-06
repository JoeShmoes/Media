
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, Loader2, Image as ImageIcon, Send, CornerDownLeft, Download } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { generateThumbnail } from "@/ai/flows/generate-thumbnail"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const mainPromptSchema = z.object({
  prompt: z.string().min(10, "Please provide a more detailed prompt."),
})
type MainPromptFormValues = z.infer<typeof mainPromptSchema>

const iterationPromptSchema = z.object({
  prompt: z.string().min(3, "Please enter a change request."),
})
type IterationPromptFormValues = z.infer<typeof iterationPromptSchema>


export default function ThumbnailPage() {
  const [imageHistory, setImageHistory] = React.useState<string[]>([])
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isIterating, setIsIterating] = React.useState(false)
  const { toast } = useToast()

  const mainForm = useForm<MainPromptFormValues>({
    resolver: zodResolver(mainPromptSchema),
    defaultValues: {
      prompt: "A vibrant and eye-catching thumbnail for a YouTube video about 'The Secrets of Deep Sea Creatures'. It should have a mysterious tone, with a dark blue background and glowing elements. Include a silhouette of a giant squid.",
    },
  })
  
  const iterationForm = useForm<IterationPromptFormValues>({
    resolver: zodResolver(iterationPromptSchema),
    defaultValues: { prompt: "" },
  })
  
  const activeImage = activeIndex !== null ? imageHistory[activeIndex] : null;

  const handleGeneration = async ({ prompt, baseImage }: { prompt: string, baseImage?: string }) => {
    if (baseImage) {
        setIsIterating(true)
    } else {
        setIsGenerating(true)
        setImageHistory([])
        setActiveIndex(null)
    }
    try {
      const result = await generateThumbnail({ prompt, baseImage })
      setImageHistory(prev => [...prev, result.image]);
      setActiveIndex(imageHistory.length);
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Generating Thumbnail",
        description: "There was an issue generating the thumbnail. Please try again.",
      })
    } finally {
      setIsGenerating(false)
      setIsIterating(false)
    }
  }

  const onGenerateSubmit = (data: MainPromptFormValues) => {
    handleGeneration({ prompt: data.prompt });
  }
  
  const onIterateSubmit = (data: IterationPromptFormValues) => {
    if(!activeImage) return;
    handleGeneration({ prompt: data.prompt, baseImage: activeImage });
    iterationForm.reset();
  }
  
  const downloadImage = () => {
    if(!activeImage) return;
    const a = document.createElement('a');
    a.href = activeImage;
    a.download = 'thumbnail.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>AI Thumbnail Generator</CardTitle>
                    <CardDescription>Describe the thumbnail you want to create. Be as specific as possible for the best results.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...mainForm}>
                        <form onSubmit={mainForm.handleSubmit(onGenerateSubmit)} className="space-y-4">
                            <FormField
                                control={mainForm.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Prompt</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., A minimalist thumbnail for a coding tutorial..." {...field} rows={6} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isGenerating} className="w-full">
                                {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
                                {isGenerating ? "Generating..." : "Generate Thumbnail"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Generated Thumbnail</CardTitle>
                    <CardDescription>Your generated thumbnail will appear here. You can then request changes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {isGenerating ? (
                       <Skeleton className="w-full aspect-video rounded-md" />
                   ) : activeImage ? (
                       <div className="relative group">
                           <Image src={activeImage} alt="Generated Thumbnail" width={1280} height={720} className="rounded-md w-full aspect-video object-cover" />
                           {isIterating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md"><Loader2 className="animate-spin text-white h-10 w-10"/></div>}
                            <Button size="sm" onClick={downloadImage} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="mr-2 h-4 w-4"/> Download
                            </Button>
                       </div>
                   ) : (
                       <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center">
                           <ImageIcon className="h-16 w-16 text-muted-foreground" />
                       </div>
                   )}
                   
                   {imageHistory.length > 1 && (
                       <div>
                           <Label>History</Label>
                           <ScrollArea className="w-full whitespace-nowrap rounded-md">
                               <div className="flex w-max space-x-2 p-2">
                                   {imageHistory.map((image, index) => (
                                       <button key={index} onClick={() => setActiveIndex(index)} className={cn("rounded-md overflow-hidden ring-2 ring-transparent", activeIndex === index && "ring-primary")}>
                                           <Image src={image} alt={`Version ${index + 1}`} width={100} height={56} className="object-cover h-14 w-auto"/>
                                       </button>
                                   ))}
                               </div>
                               <ScrollBar orientation="horizontal" />
                           </ScrollArea>
                       </div>
                   )}

                    <Form {...iterationForm}>
                        <form onSubmit={iterationForm.handleSubmit(onIterateSubmit)}>
                             <FormField
                                control={iterationForm.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Changes</FormLabel>
                                        <FormControl>
                                             <div className="relative">
                                                <Input placeholder="e.g., Make the text bigger, change the background to red..." {...field} disabled={!activeImage || isGenerating || isIterating} />
                                                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={!activeImage || isGenerating || isIterating}>
                                                     {isIterating ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
                                                </Button>
                                             </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
            </Card>
       </div>
    </div>
  )
}
