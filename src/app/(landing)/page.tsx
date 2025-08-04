"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { BrainCircuit, KanbanSquare, SendHorizonal, CircleDollarSign, PenSquare, Youtube, LayoutDashboard, ListTodo } from "lucide-react";

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI Room",
    description: "Your custom-trained AI business advisor.",
  },
  {
    icon: <KanbanSquare className="h-8 w-8 text-primary" />,
    title: "Project Board",
    description: "Kanban-style task management for your projects.",
  },
  {
    icon: <SendHorizonal className="h-8 w-8 text-primary" />,
    title: "AI Outreach Engine",
    description: "Generate high-converting cold outreach copy.",
  },
  {
    icon: <CircleDollarSign className="h-8 w-8 text-primary" />,
    title: "Finance Room",
    description: "Track your revenue, expenses, and profitability.",
  },
  {
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    title: "Content Scheduler",
    description: "Plan and auto-generate social media content.",
  },
  {
    icon: <Youtube className="h-8 w-8 text-primary" />,
    title: "YouTube Studio",
    description: "A full creative suite to generate video scripts and media.",
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            The AI-Powered Command Center for Your Business
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            BizMaster AI unifies your clients, projects, finances, and content into one intelligent platform, so you can scale faster.
          </p>
          <Link href="/dashboard" passHref>
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need to Scale</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 p-6 rounded-lg glassmorphic border border-white/10">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20 text-center">
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6" />
            <p className="font-semibold">BizMaster AI</p>
          </div>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} BizMaster AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
