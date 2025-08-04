
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Header } from "../(landing)/_components/header";
import { Footer } from "../(landing)/_components/footer";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <motion.section
          className="container mx-auto px-4 py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Get In Touch</h1>
            <p className="text-muted-foreground text-center mb-12">
              Have a question or want to work with us? Drop us a line.
            </p>
            <div className="bg-white/5 p-8 rounded-lg glassmorphic border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help?" required rows={5} />
                </div>
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
