
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Code, Zap, Calendar, Mail, KanbanSquare, GanttChartSquare, Book, Plus, Link as LinkIcon } from "lucide-react";
import type { Integration, IntegrationCategory } from "@/lib/types";
import { AddIntegrationDialog } from "./_components/add-integration-dialog";

const defaultIntegrations: { [key in IntegrationCategory]: Integration[] } = {
    "Project Management": [
        { name: "Notion", icon: <Book/>, href: "https://notion.so" },
        { name: "Trello", icon: <KanbanSquare/>, href: "https://trello.com" },
        { name: "ClickUp", icon: <GanttChartSquare/>, href: "https://clickup.com" },
        { name: "Asana", icon: <KanbanSquare/>, href: "https://asana.com" },
    ],
    "Communication & Scheduling": [
        { name: "Gmail", icon: <Mail/>, href: "https://gmail.com" },
        { name: "Google Calendar", icon: <Calendar/>, href: "https://calendar.google.com" },
        { name: "Slack", icon: <MessageCircle/>, href: "https://slack.com" },
        { name: "Discord", icon: <MessageCircle/>, href: "https://discord.com" },
    ],
    "Custom Automations": [
        { name: "Zapier / Webhooks", icon: <Zap/>, href: "https://zapier.com" },
        { name: "Make.com", icon: <Zap/>, href: "https://make.com" },
        { name: "API Playground", icon: <Code/>, href: "#" },
    ]
};


export default function IntegrationHubPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [integrations, setIntegrations] = React.useState(defaultIntegrations);

    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedIntegrations = localStorage.getItem("customIntegrations");
            if (savedIntegrations) {
                const customIntegrations: Omit<Integration, 'icon'>[] = JSON.parse(savedIntegrations);
                const newIntegrations = {...defaultIntegrations};
                customIntegrations.forEach(int => {
                    if (newIntegrations[int.category]) {
                        newIntegrations[int.category].push({ ...int, icon: <LinkIcon/> });
                    }
                });
                setIntegrations(newIntegrations);
            }
        } catch (error) {
            console.error("Failed to load custom integrations", error);
        }
    }, []);

    const handleSaveIntegration = (data: Omit<Integration, "icon">) => {
        const newIntegration = { ...data, icon: <LinkIcon /> };
        setIntegrations(prev => {
            const newInts = {...prev};
            newInts[data.category] = [...newInts[data.category], newIntegration];
            return newInts;
        });
        
        // Save to localStorage
        try {
            const saved = localStorage.getItem("customIntegrations");
            const existing = saved ? JSON.parse(saved) : [];
            localStorage.setItem("customIntegrations", JSON.stringify([...existing, data]));
        } catch (error) {
            console.error("Failed to save custom integration", error);
        }
    };
    
    if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Integration Hub">
          <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2"/> Add Integration</Button>
      </PageHeader>
      
      <AddIntegrationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveIntegration}
      />

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
                {integrations["Project Management"].map(int => (
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
                 {integrations["Communication & Scheduling"].map(int => (
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
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {integrations["Custom Automations"].map(int => (
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
