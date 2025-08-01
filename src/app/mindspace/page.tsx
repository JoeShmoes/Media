import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Palette, Tags, Waypoints } from "lucide-react";

export default function MindspacePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Mindspace" />
      <p className="text-muted-foreground">
        A visual thinking canvas for your ideas and their connections.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic lg:col-span-3">
          <CardHeader>
            <CardTitle>Mind Map Canvas</CardTitle>
            <CardDescription>Drag and connect your ideas visually. Start with a central node.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-72 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Mind map area</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Assist</CardTitle>
            <CardDescription>Auto-expand or rearrange your thought trees.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Expand Selection</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Tags /> Tag & Color Code</CardTitle>
            <CardDescription>Organize with themes, topics, and urgency.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full flex items-center gap-2">
                <Palette /> Assign Color
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Waypoints /> Modes</CardTitle>
            <CardDescription>Switch between Brainstorm, Plan, and Strategy modes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Switch to Plan Mode</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
