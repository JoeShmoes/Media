"use client"
import * as React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Bot, Clipboard, Copy } from "lucide-react"

import {
  generateOutreachCopy,
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
  outreachType: z.enum(["DM", "Email", "Phone"]),
  productDescription: z.string().min(10, "Product description must be at least 10 characters"),
})

export function OutreachForm() {
  const [generatedCopy, setGeneratedCopy] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leadName: "",
      leadData: "",
      outreachType: "Email",
      productDescription: "An all-in-one AI command hub to run and scale businesses.",
    },
  })

  const onSubmit: SubmitHandler<GenerateOutreachCopyInput> = async (data) => {
    setIsLoading(true)
    setGeneratedCopy("")
    try {
      const result = await generateOutreachCopy(data)
      setGeneratedCopy(result.copy)
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCopy)
    toast({
      title: "Copied to clipboard!",
      description: "The outreach copy has been copied.",
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="glassmorphic">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Copy"}
                <Bot />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Generated Copy</CardTitle>
          <CardDescription>
            The AI-generated copy will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            generatedCopy || "Your generated copy will be displayed here."
          )}
        </CardContent>
        {generatedCopy && !isLoading && (
          <CardFooter>
            <Button variant="outline" onClick={handleCopy}>
              <Copy />
              Copy to Clipboard
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
