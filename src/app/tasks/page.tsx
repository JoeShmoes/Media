
"use client"

import * as React from "react";
import { List, Kanban, GanttChartSquare } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskList } from "./_components/task-list";
import { TaskBoard } from "./_components/task-board";
import { AddTaskDialog } from "./_components/add-task-dialog";
import { AddGroupDialog } from "./_components/add-group-dialog";
import type { Task, TaskGroup } from "@/lib/types";
import { GanttChart } from "./_components/gantt-chart";

export default function TasksPage() {
  const { settings, setSetting } = useSettings();
  const [isMounted, setIsMounted] = React.useState(false);
  const [board, setBoard] = React.useState<{ groups: TaskGroup[] }>({ groups: [] });

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (parsed && Array.isArray(parsed.groups)) {
            setBoard(parsed);
            return;
        }
      }
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
    setBoard({ groups: [{ id: "default", name: "My Tasks", tasks: [] }] });
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(board));
    }
  }, [board, isMounted]);

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>, targetGroupId: string) => {
    setBoard(prev => {
        const newGroups = [...prev.groups];
        const targetGroupIndex = newGroups.findIndex(g => g.id === targetGroupId);
        if (targetGroupIndex === -1) return prev;
        
        const newTask: Task = { ...task, id: `task-${Date.now()}`, completed: false };
        newGroups[targetGroupIndex].tasks.unshift(newTask);
        return { groups: newGroups };
    });
  }

  const handleUpdateTask = (taskId: string, data: Partial<Omit<Task, 'id'>>, newGroupId?: string) => {
     setBoard(prev => {
        const newGroups = [...prev.groups];
        let taskToMove: Task | undefined;
        let sourceGroupIndex = -1;
        let sourceTaskIndex = -1;

        for (let i = 0; i < newGroups.length; i++) {
            const taskIndex = newGroups[i].tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                sourceGroupIndex = i;
                sourceTaskIndex = taskIndex;
                break;
            }
        }
        
        if (sourceGroupIndex === -1) return prev;

        const updatedTask = { ...newGroups[sourceGroupIndex].tasks[sourceTaskIndex], ...data };

        if (newGroupId && newGroupId !== newGroups[sourceGroupIndex].id) {
            taskToMove = updatedTask;
            newGroups[sourceGroupIndex].tasks.splice(sourceTaskIndex, 1);
            
            const targetGroupIndex = newGroups.findIndex(g => g.id === newGroupId);
            if(targetGroupIndex !== -1) {
                newGroups[targetGroupIndex].tasks.unshift(taskToMove);
            }
        } else {
             newGroups[sourceGroupIndex].tasks[sourceTaskIndex] = updatedTask;
        }

        return { groups: newGroups };
     });
  }
  
  const handleToggleTask = (taskId: string) => {
      setBoard(prev => {
          const newGroups = prev.groups.map(group => ({
              ...group,
              tasks: group.tasks.map(task => {
                  if (task.id === taskId) {
                      return { ...task, completed: !task.completed, dueDate: !task.completed ? new Date().toISOString() : undefined };
                  }
                  return task;
              })
          }));
          return { groups: newGroups };
      });
  }

  const handleRemoveTask = (taskId: string) => {
      setBoard(prev => ({
          groups: prev.groups.map(g => ({...g, tasks: g.tasks.filter(t => t.id !== taskId)}))
      }));
  }

  const handleRenameGroup = (groupId: string, newName: string) => {
      setBoard(prev => ({
          groups: prev.groups.map(g => g.id === groupId ? {...g, name: newName } : g)
      }));
  }
  
  const handleRemoveGroup = (groupId: string) => {
      setBoard(prev => ({
          groups: prev.groups.filter(g => g.id !== groupId)
      }));
  }
  
  const handleAddGroup = (name: string) => {
    const newGroup = { id: `group-${Date.now()}`, name, tasks: [] };
    setBoard(prev => ({ groups: [...prev.groups, newGroup]}));
  }
  
  const allTasks = React.useMemo(() => board.groups.flatMap(g => g.tasks), [board.groups]);

  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full flex flex-col">
      <Tabs 
        value={settings.tasksDefaultView} 
        onValueChange={(v) => setSetting('tasksDefaultView', v as any)}
        className="flex flex-col flex-1"
      >
        <div className="flex justify-between items-center">
            <TabsList>
                <TabsTrigger value="list"><List className="mr-2 h-4 w-4"/>List</TabsTrigger>
                <TabsTrigger value="board"><Kanban className="mr-2 h-4 w-4"/>Board</TabsTrigger>
                <TabsTrigger value="gantt"><GanttChartSquare className="mr-2 h-4 w-4"/>Gantt</TabsTrigger>
            </TabsList>
             <div className="flex gap-2">
                <AddTaskDialog onAddTask={handleAddTask} groups={board.groups} />
                <AddGroupDialog onAddGroup={handleAddGroup} />
             </div>
        </div>
        <TabsContent value="list" className="mt-4 flex-1 overflow-y-auto">
            <TaskList 
                groups={board.groups}
                onUpdateTask={handleUpdateTask}
                onToggleTask={handleToggleTask}
                onRemoveTask={handleRemoveTask}
                onRenameGroup={handleRenameGroup}
                onRemoveGroup={handleRemoveGroup}
            />
        </TabsContent>
        <TabsContent value="board" className="mt-4 flex-1 overflow-hidden">
            <TaskBoard
                groups={board.groups}
                onUpdateTask={handleUpdateTask}
                onToggleTask={handleToggleTask}
                onRemoveTask={handleRemoveTask}
                onRenameGroup={handleRenameGroup}
                onRemoveGroup={handleRemoveGroup}
            />
        </TabsContent>
        <TabsContent value="gantt" className="mt-4 flex-1 overflow-hidden">
           <GanttChart tasks={allTasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
