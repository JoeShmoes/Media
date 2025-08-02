import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Lightbulb, Youtube, GitBranch, Settings, Shapes, Sparkles, Download, Send } from "lucide-react";

const coreFeatures = [
    {
        icon: <Network className="w-8 h-8 text-primary" />,
        title: "Business Universe Map",
        description: "A visual map of your entire business landscape. See how your ventures connect and create a powerful flywheel.",
    },
    {
        icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
        title: "Offer Labs",
        description: "Visually break down new service ideas, from mind maps of different pricing tiers to flowcharts of your delivery process.",
    },
    {
        icon: <Youtube className="w-8 h-8 text-red-500" />,
        title: "YouTube Series Web",
        description: "Group content ideas by theme and map out their evolution. Attach notes, thumbnails, or script snippets.",
    },
    {
        icon: <GitBranch className="w-8 h-8 text-green-500" />,
        title: "Outreach & Funnel Flows",
        description: "Visualize different outreach sequences and marketing funnels with branching logic for every scenario.",
    },
    {
        icon: <Settings className="w-8 h-8 text-gray-500" />,
        title: "System Mapping",
        description: "Build your backend workflows visually to identify inefficiencies and opportunities for automation.",
    },
    {
        icon: <Shapes className="w-8 h-8 text-indigo-500" />,
        title: "Creative Zone",
        description: "A freeform space for random ideas, moodboards, screenshots, and quotes. Let your brain flow without limits.",
    },
];

const bonusFeatures = [
    {
        icon: <Sparkles className="w-5 h-5" />,
        title: "AI Assist",
        description: "Ask AI to analyze your board and give suggestions."
    },
    {
        icon: <Download className="w-5 h-5" />,
        title: "Export to PDF/PNG",
        description: "Turn any board into a shareable or printable file."
    },
     {
        icon: <Send className="w-5 h-5" />,
        title: "Task Sync",
        description: "Convert board items into actionable tasks in the Tasks room."
    },
]

export default function MindspacePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Mindspace" />
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-lg text-muted-foreground">
          Think of Mindspace as your strategic whiteboard headquarters—a creative playground where ideas are captured, expanded, and systemized visually. It's where vision becomes structure.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
        {coreFeatures.map((feature) => (
          <Card key={feature.title} className="glassmorphic text-center">
            <CardHeader className="items-center">
              {feature.icon}
              <CardTitle className="mt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="pt-12">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <p className="text-muted-foreground">Everything you need for visual strategy.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
             {bonusFeatures.map((feature) => (
                <Card key={feature.title} className="glassmorphic">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                           {feature.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

       <div className="pt-12 text-center">
         <h2 className="text-2xl font-bold">When to Use Mindspace?</h2>
         <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Use it when you're building something new, when you're stuck and need to see things differently, or when you want to zoom out and realign with your vision.
         </p>
          <Button className="mt-6">Enter Mindspace</Button>
      </div>

    </div>
  );
}
