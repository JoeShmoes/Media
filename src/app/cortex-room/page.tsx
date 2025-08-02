
"use client"
import * as React from "react"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Target, Gauge } from "lucide-react";
import type { Goal, Project, Task, TaskGroup, ProjectBoard } from "@/lib/types";
import { GoalList } from "./_components/goal-list";
import { GoalDialog } from "./_components/goal-dialog";

export default function CortexRoomPage() {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [taskGroups, setTaskGroups] = React.useState<TaskGroup[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedGoals = localStorage.getItem("cortex-goals");
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      
      const savedProjects = localStorage.getItem("projects");
       if (savedProjects) {
        const board: ProjectBoard = JSON.parse(savedProjects);
        setProjects(Object.values(board).flat());
      }
      
      const savedTasks = localStorage.getItem("tasks");
      if(savedTasks) {
          const board = JSON.parse(savedTasks);
          setTaskGroups(board.groups);
      }

    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("cortex-goals", JSON.stringify(goals));
      } catch (error) {
        console.error("Failed to save goals to local storage", error);
      }
    }
  }, [goals, isMounted]);


  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };
  
  const handleSaveGoal = (goalData: Omit<Goal, 'id'> & {id?: string}) => {
    if (goalData.id) {
      setGoals(goals.map(g => (g.id === goalData.id ? { ...g, ...goalData } as Goal : g)));
    } else {
      const newGoal: Goal = {
        ...goalData,
        id: `goal-${Date.now()}`,
      };
      setGoals([newGoal, ...goals]);
    }
  };
  
  const allTasks = React.useMemo(() => taskGroups.flatMap(g => g.tasks.map(t => ({...t, groupId: g.id}))), [taskGroups]);

  const focusScore = React.useMemo(() => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    return Math.round((completedGoals / goals.length) * 100);
  }, [goals]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <GoalDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        goal={editingGoal} 
        onSave={handleSaveGoal}
        projects={projects}
        tasks={allTasks}
      />
      <PageHeader title="Cortex Room">
        <Button onClick={handleAddGoal}><PlusCircle className="mr-2"/> Add New Goal</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        The interface for linking your goals to your strategy and tasks.
      </p>
      <div className="grid gap-8 md:grid-cols-3">
        
        <Card className="glassmorphic md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target /> Top-Level Goals</CardTitle>
            <CardDescription>Define and track your annual, quarterly, or weekly objectives.</CardDescription>
          </CardHeader>
          <CardContent>
            <GoalList goals={goals} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="glassmorphic">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gauge /> Focus Score</CardTitle>
                <CardDescription>How much progress you've made on your goals.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <p className="text-6xl font-bold text-green-400">{focusScore}%</p>
                <p className="text-sm text-muted-foreground mt-2">Completed</p>
            </CardContent>
            </Card>
        </div>
        
      </div>
    </div>
  );
}
