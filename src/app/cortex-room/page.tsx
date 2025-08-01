import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Target, Link, Gauge } from "lucide-react";

export default function CortexRoomPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Cortex Room">
        <Button><PlusCircle className="mr-2"/> Add New Goal</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        The interface for linking your goals to your strategy and tasks.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target /> Top-Level Goals</CardTitle>
            <CardDescription>Define your annual, quarterly, or weekly objectives.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Increase Q3 revenue by 20%</li>
                <li>- Launch new website by August 1st</li>
                <li>- Onboard 5 new clients this month</li>
             </ul>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link /> Tactical Mapping</CardTitle>
            <CardDescription>Assign goals to specific projects and tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Link to Project</Button>
          </CardContent>
        </Card>
         <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Progress Lines</CardTitle>
            <CardDescription>Visually show alignment between actions and goals.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-32 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Progress visualization area</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gauge /> Focus Score</CardTitle>
            <CardDescription>How well your current tasks match stated goals.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <p className="text-6xl font-bold text-green-400">88%</p>
            <p className="text-sm text-muted-foreground mt-2">Highly Aligned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
