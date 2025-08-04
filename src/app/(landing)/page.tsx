
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrainCircuit, KanbanSquare, SendHorizonal, CircleDollarSign, PenSquare, Youtube, Check } from "lucide-react";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import * as React from "react";
import { Label } from "@/components/ui/label";

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI Room",
    description: "Your custom-trained AI business advisor for strategic insights.",
  },
  {
    icon: <KanbanSquare className="h-8 w-8 text-primary" />,
    title: "Project Board",
    description: "Kanban-style task management to keep your projects on track.",
  },
  {
    icon: <SendHorizonal className="h-8 w-8 text-primary" />,
    title: "AI Outreach Engine",
    description: "Generate high-converting cold outreach copy in seconds.",
  },
  {
    icon: <CircleDollarSign className="h-8 w-8 text-primary" />,
    title: "Finance Room",
    description: "Track your revenue, expenses, and profitability with ease.",
  },
  {
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    title: "Content Scheduler",
    description: "Plan and auto-generate your social media content calendar.",
  },
  {
    icon: <Youtube className="h-8 w-8 text-primary" />,
    title: "YouTube Studio",
    description: "A full creative suite to generate video scripts and media assets.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Run Your Entire Business. All in One Place.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Nexaris Media is your command center — manage clients, projects, outreach, finances, content, and more — powered by built-in AI.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" passHref>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">Start Using Nexaris Media</Button>
            </Link>
             <Link href="#features" passHref>
              <Button size="lg" variant="outline">Explore Features</Button>
            </Link>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="container mx-auto px-4 py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need to Scale</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 p-6 rounded-lg glassmorphic border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* How It Works Section */}
        <motion.section
          className="container mx-auto px-4 py-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Get Started in Seconds</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/50 text-primary font-bold text-2xl mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                    <p className="text-muted-foreground">Create your account instantly. No credit card required.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/50 text-primary font-bold text-2xl mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-2">Connect Your Data</h3>
                    <p className="text-muted-foreground">Start by adding your first client, project, or financial transaction.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/50 text-primary font-bold text-2xl mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-2">Leverage AI</h3>
                    <p className="text-muted-foreground">Use the AI Room and other tools to automate tasks and get insights.</p>
                </div>
            </div>
        </motion.section>
        
        {/* Pricing Section */}
        <motion.section
            id="pricing"
            className="container mx-auto px-4 py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, All-Inclusive Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">One plan. Every feature. No hidden fees. The app is live and ready for you—no waitlist, no demo required.</p>
            
            <div className="flex justify-center">
                <div className="bg-white/5 p-8 rounded-lg glassmorphic border border-white/10 w-full max-w-md">
                    <h3 className="text-2xl font-semibold text-center mb-2">The All-In-One Plan</h3>
                     <p className="text-center text-muted-foreground mb-6">Everything you need to run and scale your business.</p>
                    <div className="text-center mb-6">
                        <span className="text-5xl font-bold">Free</span>
                        <span className="text-muted-foreground">/ forever</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        {["All Rooms & Features Included", "Unlimited AI Usage", "Priority Support", "Regular Updates"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>{item}</span>
                           </li>
                        ))}
                    </ul>
                    <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200" asChild>
                        <Link href="/dashboard">Get Started Instantly</Link>
                    </Button>
                </div>
            </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
