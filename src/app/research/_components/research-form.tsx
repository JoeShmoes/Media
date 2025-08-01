"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, User, BookOpen, Search, Send, Loader2 } from "lucide-react"
import { useDebounce } from 'use-debounce';

import { cn } from "@/lib/utils"
import { performResearch, searchWikipedia, getWikipediaSummaryForClient, PerformResearchInput } from "@/ai/flows/perform-research"
import type { WikipediaSearchResult } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const searchSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
})
type SearchFormValues = z.infer<typeof searchSchema>

const questionSchema = z.object({
  question: z.string().min(2, "Question is required"),
});
type QuestionFormValues = z.infer<typeof questionSchema>;


export function ResearchForm() {
  const [searchResults, setSearchResults] = React.useState<WikipediaSearchResult[] | null>(null)
  const [selectedArticle, setSelectedArticle] = React.useState<WikipediaSearchResult | null>(null)
  const [hoveredArticle, setHoveredArticle] = React.useState<WikipediaSearchResult | null>(null)
  const [previewContent, setPreviewContent] = React.useState<string | null>(null)
  const [researchResult, setResearchResult] = React.useState<{ summary: string, answer: string } | null>(null)
  const [isSearching, setIsSearching] = React.useState(false)
  const [isResearching, setIsResearching] = React.useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  const { toast } = useToast()

  const [debouncedHoveredArticle] = useDebounce(hoveredArticle, 300);

  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { topic: "" },
  })

  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: "" },
  });

  React.useEffect(() => {
    if (debouncedHoveredArticle) {
      const fetchPreview = async () => {
        setIsPreviewLoading(true);
        try {
          const summary = await getWikipediaSummaryForClient({ topic: debouncedHoveredArticle.title });
          setPreviewContent(summary);
        } catch (error) {
          setPreviewContent("Could not load preview.");
        } finally {
          setIsPreviewLoading(false);
        }
      };
      fetchPreview();
    } else {
      setPreviewContent(null);
    }
  }, [debouncedHoveredArticle]);


  const onSearchSubmit: SubmitHandler<SearchFormValues> = async (data) => {
    setIsSearching(true)
    setSearchResults(null)
    setSelectedArticle(null)
    setResearchResult(null)
    setHoveredArticle(null)
    setPreviewContent(null);

    try {
      const results = await searchWikipedia(data)
      setSearchResults(results)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Searching Wikipedia",
        description: "There was an issue searching. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const onQuestionSubmit: SubmitHandler<QuestionFormValues> = async (data) => {
    if (!selectedArticle) return;
    
    setIsResearching(true)
    setResearchResult(null)

    try {
        const input: PerformResearchInput = {
            topic: selectedArticle.title,
            question: data.question
        }
      const result = await performResearch(input)
      setResearchResult(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Performing Research",
        description: "There was an issue getting a response. Please try again.",
      })
    } finally {
      setIsResearching(false)
      questionForm.reset();
    }
  }
  
  const handleSelectArticle = (article: WikipediaSearchResult) => {
    setSelectedArticle(article)
    setResearchResult(null)
    questionForm.reset();
  }
  
  const handleReset = () => {
    searchForm.reset();
    questionForm.reset();
    setSearchResults(null);
    setSelectedArticle(null);
    setResearchResult(null);
  }

  if (selectedArticle) {
     return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Selected Article</span>
                        <Button variant="link" onClick={() => setSelectedArticle(null)}>Change</Button>
                    </CardTitle>
                    <CardDescription>{selectedArticle.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4">{selectedArticle.description}</p>
                </CardContent>
                <CardFooter>
                    <Form {...questionForm}>
                        <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)} className="w-full space-y-4">
                            <FormField
                                control={questionForm.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ask a question about this article</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="e.g., What were the main reasons for its fall?" {...field} disabled={isResearching} />
                                                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isResearching}>
                                                    {isResearching ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardFooter>
            </Card>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Research Results</CardTitle>
                    <CardDescription>The AI-powered research findings will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isResearching && (
                        <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                        </div>
                    )}
                    {researchResult && (
                        <div>
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2 flex items-center"><BookOpen className="mr-2 h-5 w-5"/> Wikipedia Summary</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap text-sm">{researchResult.summary}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center"><Bot className="mr-2 h-5 w-5"/> AI-Enhanced Answer</h3>
                            <p className="text-foreground whitespace-pre-wrap text-sm">{researchResult.answer}</p>
                        </div>
                        </div>
                    )}
                    {!isResearching && !researchResult && (
                        <div className="text-center text-muted-foreground py-12">Ask a question to begin your research.</div>
                    )}
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
        <Card className="glassmorphic">
            <CardHeader>
            <CardTitle>Research Topic</CardTitle>
            <CardDescription>Enter a topic to find relevant articles on Wikipedia.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...searchForm}>
                <form onSubmit={searchForm.handleSubmit(onSearchSubmit)}>
                <FormField
                    control={searchForm.control}
                    name="topic"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="e.g., The Roman Empire" {...field} disabled={isSearching} />
                                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isSearching}>
                                    {isSearching ? <Loader2 className="animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                    </FormItem>
                    )}
                />
                </form>
            </Form>
            <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Results</h3>
                {isSearching && (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                )}
                {searchResults && searchResults.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                        {searchResults.map(article => (
                            <button 
                                key={article.pageid} 
                                onClick={() => handleSelectArticle(article)} 
                                onMouseEnter={() => setHoveredArticle(article)}
                                onMouseLeave={() => setHoveredArticle(null)}
                                className="text-left p-3 rounded-md hover:bg-muted transition-colors border border-transparent focus-visible:border-primary focus-visible:outline-none"
                            >
                                <p className="font-medium">{article.title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                            </button>
                        ))}
                    </div>
                )}
                {!isSearching && !searchResults && (
                    <div className="text-center text-muted-foreground py-12">
                    Your search results will appear here.
                    </div>
                )}
                {!isSearching && searchResults?.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                    No articles found for this topic.
                    </div>
                )}
            </div>
            </CardContent>
      </Card>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Article Preview</CardTitle>
          <CardDescription>Hover over an article to see its summary.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPreviewLoading && (
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          )}
          {!isPreviewLoading && previewContent ? (
            <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                    <h3 className="font-semibold">{debouncedHoveredArticle?.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{previewContent}</p>
                </div>
            </ScrollArea>
          ) : !isPreviewLoading && (
             <div className="text-center text-muted-foreground py-24">
              Hover over an article to see a preview here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
