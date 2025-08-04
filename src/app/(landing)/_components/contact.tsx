"use client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import React from "react"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

export function Contact() {
    const [isLoading, setIsLoading] = React.useState(false)
    const { toast } = useToast()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })
    
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Message Sent!",
                description: "Thanks for reaching out. We'll get back to you soon.",
            })
            form.reset()
        }, 1500)
    }

  return (
    <section id="contact" className="w-full py-20 md:py-32 bg-black/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Get in Touch</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </div>
        <div className="mt-12 max-w-xl mx-auto">
          <Card className="glassmorphic p-8">
            <CardContent className="p-0">
               <Form {...form}>
                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                         <FormItem><FormControl><Input placeholder="Your Name" {...field} className="bg-gray-800 border-gray-700 text-white"/></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormControl><Input type="email" placeholder="Your Email" {...field} className="bg-gray-800 border-gray-700 text-white"/></FormControl><FormMessage/></FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem><FormControl><Textarea placeholder="Your Message" rows={5} {...field} className="bg-gray-800 border-gray-700 text-white"/></FormControl><FormMessage/></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
