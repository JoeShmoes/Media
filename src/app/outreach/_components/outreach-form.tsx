
"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Copy, Loader2 } from "lucide-react"

import {
  generateOutreachCopy,
  type GenerateOutreachCopyOutput,
  type GenerateOutreachCopyInput,
} from "@/ai/flows/generate-outreach-copy"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  leadName: z.string().min(2, "Lead name is required"),
  leadData: z.string().min(10, "Lead data must be at least 10 characters"),
  userContext: z.string().optional(),
  outreachType: z.enum(["DM", "Email", "Phone", "Follow Up"]),
  productDescription: z.string().min(10, "Product description must be at least 10 characters"),
  length: z.enum(["Short", "Long"]),
})

export function OutreachForm() {
  const [generatedCopy, setGeneratedCopy] = React.useState<GenerateOutreachCopyOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadName: "",
      leadData: "",
      userContext: "I am the founder of Nexaris Media, an AI-powered agency that helps businesses scale with intelligent automation and content creation.",
      outreachType: "Email",
      productDescription: "An all-in-one AI command hub to run and scale businesses.",
      length: "Long",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setIsLoading(true)
    setGeneratedCopy(null)
    try {
       const input: GenerateOutreachCopyInput = {
        ...data,
        userName: "Fozan", // In a real app, this would come from user data
      };
      const result = await generateOutreachCopy(input)
      setGeneratedCopy(result)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error Generating Copy",
        description: "There was an issue generating the outreach copy. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
              <CardDescription>
                Provide information about the lead to generate personalized copy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="leadName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., CEO at Innovate Inc, interested in scaling operations..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="userContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe yourself, your company, or your role..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="outreachType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outreach Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an outreach type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="DM">Direct Message (DM)</SelectItem>
                            <SelectItem value="Phone">Phone Call Script</SelectItem>
                            <SelectItem value="Follow Up">Follow Up</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Short">Short</SelectItem>
                            <SelectItem value="Long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product or service..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <Bot />}
                {isLoading ? "Generating..." : "Generate Copy"}
              </Button>
            </CardFooter>
        </Card>
        <Card className="glassmorphic sticky top-24">
          <CardHeader>
            <CardTitle>Generated Copy</CardTitle>
            <CardDescription>
              The AI-generated copy will appear here. Review and copy when ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-6 w-1/3 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            
            {!isLoading && !generatedCopy && (
               <div className="text-center text-muted-foreground py-12">
                Your generated copy will be displayed here.
              </div>
            )}

            {generatedCopy?.subject && (
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <FormLabel>Subject</FormLabel>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(generatedCopy.subject!)}>
                          <Copy className="h-4 w-4"/>
                      </Button>
                  </div>
                  <p className="text-sm font-medium bg-muted/50 p-3 rounded-md">{generatedCopy.subject}</p>
              </div>
            )}
            {generatedCopy?.body && (
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <FormLabel>{form.getValues('outreachType')} Body</FormLabel>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(generatedCopy.body)}>
                          <Copy className="h-4 w-4"/>
                      </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap font-mono bg-muted/50 p-3 rounded-md leading-relaxed min-h-[150px]">
                      {generatedCopy.body}
                  </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </form>
    </Form>
  )
}
