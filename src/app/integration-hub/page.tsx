import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Code, Zap, Calendar, Mail, KanbanSquare, GanttChartSquare, Book } from "lucide-react";

export default function IntegrationHubPage() {
    const projectManagementIntegrations = [
        { name: "Notion", icon: <Book/>, href: "https://notion.so" },
        { name: "Trello", icon: <KanbanSquare/>, href: "https://trello.com" },
        { name: "ClickUp", icon: <GanttChartSquare/>, href: "https://clickup.com" },
        { name: "Asana", icon: <KanbanSquare/>, href: "https://asana.com" },
    ]
    
    const communicationIntegrations = [
        { name: "Gmail", icon: <Mail/>, href: "https://gmail.com" },
        { name: "Google Calendar", icon: <Calendar/>, href: "https://calendar.google.com" },
        { name: "Slack", icon: <MessageCircle/>, href: "https://slack.com" },
        { name: "Discord", icon: <MessageCircle/>, href: "https://discord.com" },
    ]

    const automationIntegrations = [
        { name: "Zapier / Webhooks", icon: <Zap/>, href: "https://zapier.com" },
        { name: "Make.com", icon: <Zap/>, href: "https://make.com" },
        { name: "API Playground", icon: <Code/>, href: "#" }, // Placeholder link
    ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Integration Hub" />
      <p className="text-muted-foreground">
        Connect and sync with external tools for real-time updates.
      </p>
       <div className="space-y-8">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Sync tasks and notes bidirectionally with your favorite tools.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projectManagementIntegrations.map(int => (
                    <Button variant="outline" key={int.name} className="justify-between" asChild>
                        <a href={int.href} target="_blank" rel="noopener noreferrer">
                           {int.name} {int.icon}
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
         <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Communication & Scheduling</CardTitle>
                <CardDescription>Generate email follow-ups and sync events with your calendar.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {communicationIntegrations.map(int => (
                    <Button variant="outline" key={int.name} className="justify-between" asChild>
                        <a href={int.href} target="_blank" rel="noopener noreferrer">
                           {int.name} {int.icon}
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Custom Automations</CardTitle>
                <CardDescription>Create custom workflows with webhooks and the API playground.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {automationIntegrations.map(int => (
                    <Button variant="outline" key={int.name} className="justify-between" asChild>
                         <a href={int.href} target="_blank" rel="noopener noreferrer">
                           {int.name} {int.icon}
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
