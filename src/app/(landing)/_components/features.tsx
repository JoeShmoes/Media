"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Bot, Send, BookOpen, BarChart3, Film, Brain, Target, Link } from "lucide-react"

const features = [
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description: "Get a bird's eye view of your entire business on a single, customizable dashboard.",
  },
  {
    icon: Bot,
    title: "AI-Powered Task Management",
    description: "Automate task creation, prioritization, and tracking with our intelligent assistant.",
  },
  {
    icon: Send,
    title: "Outreach Automation",
    description: "Generate personalized outreach campaigns and track their performance effortlessly.",
  },
  {
    icon: BookOpen,
    title: "SOP & Template Generators",
    description: "Create, store, and reuse standard operating procedures and templates for any task.",
  },
  {
    icon: BarChart3,
    title: "KPI Tracking & Audits",
    description: "Set your key performance indicators and let the AI generate insightful audit reports.",
  },
  {
    icon: Film,
    title: "Content Creation Studio",
    description: "From script writing to image generation, streamline your entire content workflow.",
  },
  {
    icon: Brain,
    title: "Mindspace Room for Clarity",
    description: "A free-form canvas to brainstorm, mind map, and connect your ideas visually.",
  },
  {
    icon: Target,
    title: "Cortex Room for Deep Focus",
    description: "Link high-level goals to projects and tasks to ensure your work stays aligned with your vision.",
  },
  {
    icon: Link,
    title: "Seamless Integrations",
    description: "Connect with your favorite tools like Miro, Make.com, and more to create a single source of truth.",
  },
]

export function Features() {
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">A Feature for Everything You Do</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Nexaris Media is packed with powerful tools to help you manage every aspect of your business.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="glassmorphic border-gray-700 hover:border-gray-500 transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/20 text-primary p-3 rounded-full">
                    <feature.icon />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
