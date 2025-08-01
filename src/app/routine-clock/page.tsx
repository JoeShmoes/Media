import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, SlidersHorizontal, BarChart2, Calendar } from "lucide-react";

export default function RoutineClockPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Routine Clock">
        <Button><PlusCircle className="mr-2"/> New Routine Block</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Design and track your daily rhythm.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic lg:col-span-3">
          <CardHeader>
            <CardTitle>Visual Daily Planner</CardTitle>
            <CardDescription>Color-coded blocks and time tracking for your day.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-72 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Daily schedule area</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SlidersHorizontal /> Live Overlay Mode</CardTitle>
            <CardDescription>See your current routine overlay in the sidebar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Enable Overlay</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><BarChart2 /> Streak Tracker</CardTitle>
            <CardDescription>Track your consistency over time with visual charts.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-32 bg-muted/30 rounded-md">
             <p className="text-muted-foreground">Streak visualization</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar /> Routine Builder</CardTitle>
            <CardDescription>Drag-and-drop blocks (Morning, Work, Breaks).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Build New Routine</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
