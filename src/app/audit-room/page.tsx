
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, PieChart, AlertTriangle } from "lucide-react";
import type { Project, ProjectBoard, Task, TaskGroup } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

export default function AuditRoomPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedProjects = localStorage.getItem("projects");
      if (savedProjects) {
        const board: ProjectBoard = JSON.parse(savedProjects);
        const allProjects = Object.values(board).flat();
        setProjects(allProjects);
      }

      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
          const board: { groups: TaskGroup[] } = JSON.parse(savedTasks);
          const allTasks = board.groups.flatMap(g => g.tasks);
          setTasks(allTasks);
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
  }, []);

  const taskAnalysis = React.useMemo(() => {
    if (tasks.length === 0) return { completed: 0, pending: 0, completionRate: 0 };
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    const completionRate = Math.round((completed / tasks.length) * 100);
    return { completed, pending, completionRate };
  }, [tasks]);
  
  const projectAnalysis = React.useMemo(() => {
    if (projects.length === 0) return { active: 0, completed: 0, stalled: 0 };
    const active = projects.filter(p => p.status !== 'launch').length;
    const completed = projects.filter(p => p.status === 'launch').length;
    // Stalled logic is a placeholder as we don't track update dates yet.
    const stalled = 0; 
    return { active, completed, stalled };
  }, [projects]);
  
  if (!isMounted) {
    return null;
  }

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
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{taskAnalysis.completionRate}% Completion Rate</span>
                <span className="text-muted-foreground">{taskAnalysis.completed} / {tasks.length} tasks</span>
              </div>
              <Progress value={taskAnalysis.completionRate} />
            </div>
            <p className="text-sm text-muted-foreground">AI Suggestion: Your completion rate is strong. Focus on knocking out the remaining {taskAnalysis.pending} tasks.</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Project Audit Log</CardTitle>
            <CardDescription>Track what moved forward and what stalled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{projectAnalysis.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectAnalysis.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                 <div>
                  <p className="text-2xl font-bold">{projectAnalysis.stalled}</p>
                  <p className="text-sm text-muted-foreground">Stalled</p>
                </div>
             </div>
             {projectAnalysis.stalled > 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="text-yellow-400 h-4 w-4"/> AI Flag: {projectAnalysis.stalled} project has stalled. Consider following up.
                </p>
             )}
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Time Audit</CardTitle>
            <CardDescription>Compare your calendar vs. real-time behavior.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <PieChart className="w-16 h-16 text-muted-foreground" />
             <p className="text-muted-foreground ml-4">Coming Soon</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Habit Audit</CardTitle>
            <CardDescription>Analyze streaks, missed days, and routine impact.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
            <LineChart className="w-16 h-16 text-muted-foreground" />
             <p className="text-muted-foreground ml-4">Coming Soon</p>
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
