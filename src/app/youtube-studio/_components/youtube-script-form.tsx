
"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy, Image as ImageIcon, Volume2, Loader2, PlayCircle, Video, Download, CheckCircle, Circle, Pencil, RefreshCw } from "lucide-react"

import {
  generateYouTubeScript,
  type GenerateYouTubeScriptOutput,
} from "@/ai/flows/generate-youtube-script"
import { generateYoutubeImages } from "@/ai/flows/generate-youtube-images"
import { generateYoutubeAudio } from "@/ai/flows/generate-youtube-audio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ImageSlideshow } from "./image-slideshow"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
})

type FormValues = z.infer<typeof formSchema>

type GeneratedImages = { [paragraphIndex: number]: string[] };
type CustomPrompts = { [paragraphIndex: number]: string };
type ImageGenStatus = { [paragraphIndex: number]: 'idle' | 'loading' | 'done' | 'error' };


export function YoutubeScriptForm() {
  const [generatedScript, setGeneratedScript] = React.useState<GenerateYouTubeScriptOutput | null>(null)
  const [generatedImages, setGeneratedImages] = React.useState<GeneratedImages>({})
  const [generatedAudio, setGeneratedAudio] = React.useState<string | null>(null)
  const [customPrompts, setCustomPrompts] = React.useState<CustomPrompts>({});

  const [isScriptLoading, setIsScriptLoading] = React.useState(false);
  const [isImagesLoading, setIsImagesLoading] = React.useState(false);
  const [isAudioLoading, setIsAudioLoading] = React.useState(false);
  const [imageGenStatus, setImageGenStatus] = React.useState<ImageGenStatus>({});
  
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "What If You Woke Up as a Blacksmith",
    },
  })
  
  const scriptParagraphs = React.useMemo(() => {
    return generatedScript?.script.split('\n').filter(p => p.trim().length > 0) || []
  }, [generatedScript]);


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
    })
  }

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const downloadDataUri = (dataUri: string, filename: string) => {
     const a = document.createElement('a');
     a.href = dataUri;
     a.download = filename;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
  }

  const handleCustomPromptChange = (index: number, value: string) => {
    setCustomPrompts(prev => ({...prev, [index]: value}));
  }

  const handleGenerateScript = async (data: FormValues) => {
    setIsScriptLoading(true);
    setGeneratedScript(null);
    setGeneratedImages({});
    setGeneratedAudio(null);
    setCustomPrompts({});
    setImageGenStatus({});
    
    try {
        const scriptResult = await generateYouTubeScript(data);
        setGeneratedScript(scriptResult);
    } catch(error) {
         toast({
            variant: "destructive",
            title: "Error Generating Script",
            description: (error as Error).message || "There was an issue generating the script.",
        });
    } finally {
        setIsScriptLoading(false);
    }
  }

  const handleGenerateImages = async () => {
    if (!scriptParagraphs.length) return;
    setIsImagesLoading(true);
    
    const initialStatus: ImageGenStatus = scriptParagraphs.reduce((acc, _, index) => {
        acc[index] = 'loading';
        return acc;
    }, {} as ImageGenStatus);
    setImageGenStatus(initialStatus);

    try {
        const imagePromises = scriptParagraphs.map((p, index) => 
            generateYoutubeImages({ paragraph: p, prompt: customPrompts[index] || undefined })
                .then(result => ({ index, result, status: 'fulfilled' as const }))
                .catch(error => ({ index, error, status: 'rejected' as const }))
        );

        for (const promise of imagePromises) {
            const res = await promise;
            if (res.status === 'fulfilled') {
                setGeneratedImages(prev => ({...prev, [res.index]: res.result.images}));
                setImageGenStatus(prev => ({...prev, [res.index]: 'done'}));
            } else {
                 setImageGenStatus(prev => ({...prev, [res.index]: 'error'}));
                 toast({ variant: "destructive", title: `Error Generating Images for Scene ${res.index + 1}`});
            }
        }

    } catch (error) {
        toast({ variant: "destructive", title: "Error Generating Images", description: (error as Error).message });
    } finally {
        setIsImagesLoading(false);
    }
  }

  const handleRegenerateSceneImages = async (index: number) => {
    if (!scriptParagraphs[index]) return;
    
    setImageGenStatus(prev => ({...prev, [index]: 'loading'}));
    setGeneratedImages(prev => {
        const newImages = {...prev};
        delete newImages[index];
        return newImages;
    });

    try {
        const result = await generateYoutubeImages({ paragraph: scriptParagraphs[index], prompt: customPrompts[index] || undefined });
        setGeneratedImages(prev => ({...prev, [index]: result.images}));
        setImageGenStatus(prev => ({...prev, [index]: 'done'}));
    } catch (error) {
        setImageGenStatus(prev => ({...prev, [index]: 'error'}));
        toast({ variant: "destructive", title: `Error Regenerating Images for Scene ${index + 1}`});
    }
  }

  const handleGenerateAudio = async () => {
    if (!generatedScript) return;
    setIsAudioLoading(true);
    setGeneratedAudio(null);

    try {
        const audioResult = await generateYoutubeAudio({ script: generatedScript.script });
        setGeneratedAudio(audioResult.audio);
    } catch(error) {
        toast({ variant: "destructive", title: "Error Generating Audio", description: (error as Error).message });
    } finally {
        setIsAudioLoading(false);
    }
  }


  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <Card className="glassmorphic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateScript)}>
              <CardHeader>
                <CardTitle>Video Idea</CardTitle>
                <CardDescription>
                  Enter your video topic to generate a full script.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="topic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A day in the life of a solo entrepreneur" {...field} disabled={isScriptLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isScriptLoading} className="w-full">
                  {isScriptLoading ? <Loader2 className="animate-spin" /> : <Bot />}
                  {isScriptLoading ? "Generating Script..." : "Generate Script"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {generatedScript && (
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Generate Media</CardTitle>
                    <CardDescription>Generate images and voiceover for your script.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleGenerateImages} disabled={isImagesLoading} className="w-full">
                         {isImagesLoading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                        Generate All Images
                    </Button>
                    <Button onClick={handleGenerateAudio} disabled={isAudioLoading} className="w-full">
                        {isAudioLoading ? <Loader2 className="animate-spin" /> : <Volume2 />}
                        Generate Voiceover
                    </Button>
                </CardContent>
             </Card>
        )}

        {generatedAudio && (
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Generated Voiceover</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full space-y-2">
                        <audio controls src={generatedAudio} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                         <Button onClick={() => downloadDataUri(generatedAudio, 'voiceover.mp3')} variant="outline" className="w-full">
                            <Download className="mr-2" /> Download Voiceover
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>
            The AI-generated script and media will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScriptLoading && !generatedScript ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : generatedScript ? (
            <>
            <Accordion type="multiple" defaultValue={['title', 'hook', 'cta']} className="w-full">
              {(Object.keys(generatedScript) as Array<keyof typeof generatedScript>).filter(k => k !== 'script').map((key) => (
                <AccordionItem value={key} key={key}>
                  <AccordionTrigger className="capitalize">{key}</AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-20">
                        {generatedScript[key]}
                      </p>
                       <div className="absolute top-1 right-1 flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadTextFile(generatedScript[key], `${key}.txt`)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(generatedScript[key])}>
                            <Copy className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Separator className="my-4" />
            <div>
                <h3 className="text-lg font-semibold mb-2">Script & Scenes</h3>
                 {scriptParagraphs.map((paragraph, index) => (
                   <div key={index} className="mb-6">
                        <div className="relative">
                             <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-20">
                                {paragraph}
                             </p>
                              <div className="absolute top-1 right-1 flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadTextFile(paragraph, `scene-${index+1}_script.txt`)}>
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(paragraph)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                        </div>
                        <div className="mt-2 space-y-2">
                           <div className="flex gap-2">
                                <Textarea
                                  placeholder="Enter a custom prompt for image generation, or leave blank to use the paragraph above."
                                  value={customPrompts[index] || ""}
                                  onChange={(e) => handleCustomPromptChange(index, e.target.value)}
                                  className=""
                                  disabled={isImagesLoading}
                                />
                                 <Button 
                                    variant="outline"
                                    size="icon" 
                                    onClick={() => handleRegenerateSceneImages(index)} 
                                    disabled={isImagesLoading || imageGenStatus[index] === 'loading'}
                                >
                                    <RefreshCw className="h-4 w-4"/>
                                </Button>
                            </div>
                           {imageGenStatus[index] === 'loading' ? (
                             <div className="flex justify-center items-center h-32">
                                <Loader2 className="animate-spin text-primary" />
                             </div>
                           ) : generatedImages[index] ? (
                                <>
                                    <ImageSlideshow images={generatedImages[index]} />
                                    <Button 
                                        onClick={() => generatedImages[index].forEach((img, i) => downloadDataUri(img, `scene-${index+1}_image-${i+1}.png`))} 
                                        variant="outline" 
                                        className="w-full"
                                    >
                                        <Download className="mr-2" /> Download Images for Scene {index + 1}
                                    </Button>
                                </>
                           ) : (
                                <div className="flex justify-center items-center h-32 bg-muted/50 rounded-md">
                                    <p className="text-muted-foreground text-sm">
                                        {imageGenStatus[index] === 'error' ? 'Image generation failed.' : 'Waiting to generate images...'}
                                    </p>
                                </div>
                           )}
                        </div>
                   </div>
                ))}
            </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-12">Your generated content will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

    
