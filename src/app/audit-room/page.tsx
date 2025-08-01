import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function AuditRoomPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Audit Room" />
      <p className="text-muted-foreground">
        Analyze weekly/monthly output and identify bottlenecks.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Task Completion Analysis</CardTitle>
            <CardDescription>View your productivity by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
            <BarChart className="w-16 h-16 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Project Audit Log</CardTitle>
            <CardDescription>Track what moved forward and what stalled.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <LineChart className="w-16 h-16 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Time Audit</CardTitle>
            <CardDescription>Compare your calendar vs. real-time behavior.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <PieChart className="w-16 h-16 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Habit Audit</CardTitle>
            <CardDescription>Analyze streaks, missed days, and routine impact.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
            <LineChart className="w-16 h-16 text-muted-foreground" />
          </CardContent>
        </Card>
         <Card className="glassmorphic md:col-span-2">
          <CardHeader>
            <CardTitle>Custom KPI Reports</CardTitle>
            <CardDescription>Define and track your own metrics like leads/day or conversions.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <p className="text-muted-foreground">Define your custom reports here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
