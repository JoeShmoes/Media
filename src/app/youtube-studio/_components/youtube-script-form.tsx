"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy, Image as ImageIcon, Volume2, Loader2, PlayCircle, Video, Download, CheckCircle, Circle } from "lucide-react"

import {
  generateYouTubeScript,
  type GenerateYouTubeScriptOutput,
} from "@/ai/flows/generate-youtube-script"
import { generateYoutubeImages } from "@/ai/flows/generate-youtube-images"
import { generateYoutubeAudio } from "@/ai/flows/generate-youtube-audio"
import { generateYoutubeVideo } from "@/ai/flows/generate-youtube-video"
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

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
})

type FormValues = z.infer<typeof formSchema>

type GeneratedImages = { [paragraphIndex: number]: string[] };

type GenerationState = "idle" | "script" | "images" | "audio" | "video" | "done" | "error";
type GenerationStatus = {
    script: GenerationState;
    images: GenerationState;
    audio: GenerationState;
    video: GenerationState;
}

const GenerationTracker = ({ status }: { status: GenerationStatus }) => {
    const steps = [
        { key: "script" as keyof GenerationStatus, label: "Script" },
        { key: "images" as keyof GenerationStatus, label: "Images" },
        { key: "audio" as keyof GenerationStatus, label: "Voiceover" },
        { key: "video" as keyof GenerationStatus, label: "Video" },
    ]

    const getIcon = (stepStatus: GenerationState) => {
        switch (stepStatus) {
            case "idle":
                return <Circle className="h-5 w-5 text-muted-foreground" />;
            case "script":
            case "images":
            case "audio":
            case "video":
                return <Loader2 className="h-5 w-5 animate-spin" />;
            case "done":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "error":
                return <Circle className="h-5 w-5 text-destructive" />; // Replace with a more suitable error icon if available
            default:
                return <Circle className="h-5 w-5 text-muted-foreground" />;
        }
    }

    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={step.key} className="flex items-center gap-4">
                    {getIcon(status[step.key])}
                    <span className="font-medium">{step.label}</span>
                </div>
            ))}
        </div>
    )
}


export function YoutubeScriptForm() {
  const [generatedScript, setGeneratedScript] = React.useState<GenerateYouTubeScriptOutput | null>(null)
  const [generatedImages, setGeneratedImages] = React.useState<GeneratedImages>({})
  const [generatedAudio, setGeneratedAudio] = React.useState<string | null>(null)
  const [generatedVideo, setGeneratedVideo] = React.useState<string | null>(null)

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationStatus, setGenerationStatus] = React.useState<GenerationStatus>({
      script: 'idle',
      images: 'idle',
      audio: 'idle',
      video: 'idle',
  });
  
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
  
  const handleGenerateAll = async (data: FormValues) => {
    setIsGenerating(true);
    setGeneratedScript(null);
    setGeneratedImages({});
    setGeneratedAudio(null);
    setGeneratedVideo(null);
    setGenerationStatus({ script: 'script', images: 'idle', audio: 'idle', video: 'idle' });

    try {
        // 1. Generate Script
        const scriptResult = await generateYouTubeScript(data);
        setGeneratedScript(scriptResult);
        setGenerationStatus(prev => ({ ...prev, script: 'done', images: 'images' }));
        const paragraphs = scriptResult.script.split('\n').filter(p => p.trim().length > 0);

        // 2. Generate Images
        const imagePromises = paragraphs.map(p => generateYoutubeImages({ paragraph: p }));
        const imageResults = await Promise.all(imagePromises);
        const newImages = imageResults.reduce((acc, result, index) => {
            acc[index] = result.images;
            return acc;
        }, {} as GeneratedImages);
        setGeneratedImages(newImages);
        setGenerationStatus(prev => ({ ...prev, images: 'done', audio: 'audio' }));

        // 3. Generate Audio
        const audioResult = await generateYoutubeAudio({ script: scriptResult.script });
        setGeneratedAudio(audioResult.audio);
        setGenerationStatus(prev => ({ ...prev, audio: 'done', video: 'video' }));

        // 4. Generate Video
        const allImages = Object.values(newImages).flat();
        const videoResult = await generateYoutubeVideo({
            script: scriptResult.script,
            audio: audioResult.audio,
            images: allImages,
        });
        setGeneratedVideo(videoResult.video);
        setGenerationStatus(prev => ({ ...prev, video: 'done' }));

    } catch (error) {
        console.error(error);
        const currentStep = Object.keys(generationStatus).find(k => generationStatus[k as keyof GenerationStatus] === 'images' || generationStatus[k as keyof GenerationStatus] === 'audio' || generationStatus[k as keyof GenerationStatus] === 'video' || generationStatus[k as keyof GenerationStatus] === 'script' )
        setGenerationStatus(prev => ({ ...prev, [currentStep || 'script']: 'error' }));
        toast({
            variant: "destructive",
            title: `Error During ${currentStep || 'Generation'}`,
            description: "There was an issue generating media. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  }


  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <Card className="glassmorphic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateAll)}>
              <CardHeader>
                <CardTitle>Video Idea</CardTitle>
                <CardDescription>
                  Enter your video topic to generate a full script and all media assets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="topic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A day in the life of a solo entrepreneur" {...field} disabled={isGenerating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Bot />}
                  {isGenerating ? "Generating Media..." : "Generate Media Assets"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {isGenerating && (
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Generation Progress</CardTitle>
                    <CardDescription>The AI is creating your assets. Please wait.</CardDescription>
                </CardHeader>
                <CardContent>
                   <GenerationTracker status={generationStatus} />
                </CardContent>
             </Card>
        )}

        {(generatedAudio || generatedVideo) && (
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Generated Media</CardTitle>
                </CardHeader>
                 {generatedAudio && (
                     <CardContent>
                        <div className="w-full space-y-2">
                            <h4 className="font-medium flex items-center"><PlayCircle className="mr-2"/> Generated Voiceover</h4>
                            <audio controls src={generatedAudio} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </CardContent>
                )}
                 {generatedVideo && (
                    <CardContent>
                         <div className="w-full space-y-2">
                            <h4 className="font-medium flex items-center"><Video className="mr-2"/> Final Video</h4>
                            <video controls src={generatedVideo} className="w-full rounded-md" />
                             <Button asChild className="mt-2 w-full">
                                <a href={generatedVideo} download="youtube-video.mp4">
                                    <Download className="mr-2" /> Download Video
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                 )}
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
          {generationStatus.script === 'script' && !generatedScript ? (
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
                      <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-10">
                        {generatedScript[key]}
                      </p>
                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8" onClick={() => handleCopy(generatedScript[key])}>
                        <Copy className="h-4 w-4" />
                      </Button>
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
                             <p className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/50 pr-10">
                                {paragraph}
                             </p>
                             <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8" onClick={() => handleCopy(paragraph)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-2">
                           {generationStatus.images === 'images' && !generatedImages[index] ? (
                             <div className="flex justify-center items-center h-32">
                                <Loader2 className="animate-spin text-primary" />
                             </div>
                           ) : generatedImages[index] ? (
                                <ImageSlideshow images={generatedImages[index]} />
                           ) : (
                                <div className="flex justify-center items-center h-32 bg-muted/50 rounded-md">
                                    <p className="text-muted-foreground text-sm">Waiting for images...</p>
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
