import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Code, Zap, Calendar, Mail } from "lucide-react";

export default function IntegrationHubPage() {
    const integrations = [
        { name: "Notion", icon: <ArrowRight/> },
        { name: "Trello", icon: <ArrowRight/> },
        { name: "ClickUp", icon: <ArrowRight/> },
        { name: "Asana", icon: <ArrowRight/> },
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
                {integrations.map(int => (
                    <Button variant="outline" key={int.name} className="justify-between">
                        {int.name} <ArrowRight/>
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
                <Button variant="outline" className="justify-between">Gmail <Mail/></Button>
                <Button variant="outline" className="justify-between">Google Calendar <Calendar/></Button>
                <Button variant="outline" className="justify-between">Slack <MessageCircle/></Button>
                <Button variant="outline" className="justify-between">Discord <MessageCircle/></Button>
            </CardContent>
        </Card>
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Custom Automations</CardTitle>
                <CardDescription>Create custom workflows with webhooks and the API playground.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-between">Zapier / Webhooks <Zap/></Button>
                <Button variant="outline" className="justify-between">API Playground <Code/></Button>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
