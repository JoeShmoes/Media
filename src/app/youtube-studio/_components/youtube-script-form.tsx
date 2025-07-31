"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy, Image as ImageIcon, Volume2, Loader2, PlayCircle } from "lucide-react"
import Image from "next/image"

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

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
})

type FormValues = z.infer<typeof formSchema>

type GeneratedImages = { [paragraphIndex: number]: string[] };

export function YoutubeScriptForm() {
  const [generatedScript, setGeneratedScript] = React.useState<GenerateYouTubeScriptOutput | null>(null)
  const [generatedImages, setGeneratedImages] = React.useState<GeneratedImages>({})
  const [generatedAudio, setGeneratedAudio] = React.useState<string | null>(null)
  
  const [isLoadingScript, setIsLoadingScript] = React.useState(false)
  const [isLoadingImages, setIsLoadingImages] = React.useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = React.useState(false)
  const [loadingParagraph, setLoadingParagraph] = React.useState<number | null>(null)

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


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoadingScript(true)
    setGeneratedScript(null)
    setGeneratedImages({})
    setGeneratedAudio(null)
    try {
      const result = await generateYouTubeScript(data)
      setGeneratedScript(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Generating Script",
        description: "There was an issue generating the script. Please try again.",
      })
    } finally {
      setIsLoadingScript(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
    })
  }
  
  const handleGenerateImages = async (paragraph: string, index: number) => {
    setLoadingParagraph(index);
    try {
      const result = await generateYoutubeImages({ paragraph });
      setGeneratedImages(prev => ({ ...prev, [index]: result.images }));
    } catch (error) {
       console.error(error)
       toast({
        variant: "destructive",
        title: "Error Generating Images",
        description: "There was an issue generating images for the paragraph.",
      })
    } finally {
        setLoadingParagraph(null);
    }
  }
  
  const handleGenerateAllImages = async () => {
    if (!scriptParagraphs) return;
    setIsLoadingImages(true);
    for (let i = 0; i < scriptParagraphs.length; i++) {
        await handleGenerateImages(scriptParagraphs[i], i);
    }
    setIsLoadingImages(false);
  }

  const handleGenerateAudio = async () => {
    if (!generatedScript) return;
    setIsLoadingAudio(true);
    try {
        const result = await generateYoutubeAudio({ script: generatedScript.script });
        setGeneratedAudio(result.audio);
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error Generating Audio",
            description: "There was an issue generating the voiceover.",
        });
    } finally {
        setIsLoadingAudio(false);
    }
  };


  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <Card className="glassmorphic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Input placeholder="e.g., A day in the life of a solo entrepreneur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoadingScript}>
                  {isLoadingScript ? <Loader2 className="animate-spin" /> : <Bot />}
                  {isLoadingScript ? "Generating..." : "Generate Script"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {generatedScript && (
          <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>AI Media Suite</CardTitle>
                <CardDescription>Generate visuals and audio for your script.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                <Button onClick={handleGenerateAllImages} disabled={isLoadingImages || isLoadingScript}>
                    {isLoadingImages ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                    {isLoadingImages ? "Generating Images..." : "Generate All Images"}
                </Button>
                 <Button onClick={handleGenerateAudio} disabled={isLoadingAudio || isLoadingScript}>
                    {isLoadingAudio ? <Loader2 className="animate-spin" /> : <Volume2 />}
                    {isLoadingAudio ? "Generating Audio..." : "Generate Voiceover"}
                </Button>
            </CardContent>
             {generatedAudio && (
                <CardFooter>
                    <div className="w-full space-y-2">
                        <h4 className="font-medium flex items-center"><PlayCircle className="mr-2"/> Generated Voiceover</h4>
                        <audio controls src={generatedAudio} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </CardFooter>
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
          {isLoadingScript ? (
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
                <h3 className="text-lg font-semibold mb-2">Script</h3>
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
                           {loadingParagraph === index ? (
                             <div className="flex justify-center items-center h-32">
                                <Loader2 className="animate-spin text-primary" />
                             </div>
                           ) : generatedImages[index] ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {generatedImages[index].map((imgSrc, imgIdx) => (
                                        <div key={imgIdx} className="relative aspect-video rounded-md overflow-hidden">
                                           <Image src={imgSrc} alt={`Generated image for paragraph ${index + 1}, variation ${imgIdx + 1}`} layout="fill" objectFit="cover" />
                                        </div>
                                    ))}
                                </div>
                           ) : (
                                <Button size="sm" variant="outline" onClick={() => handleGenerateImages(paragraph, index)} disabled={loadingParagraph !== null}>
                                    <ImageIcon className="mr-2" /> Generate Images
                                </Button>
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
