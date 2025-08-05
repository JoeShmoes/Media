
"use client"

import * as React from "react";
import { List, Kanban, GanttChartSquare, Loader2 } from "lucide-react";

import { useSettings } from "@/hooks/use-settings";
import { TaskList } from "./_components/task-list";
import { TaskBoard } from "./_components/task-board";
import { AddTaskDialog } from "./_components/add-task-dialog";
import { AddGroupDialog } from "./_components/add-group-dialog";
import type { Task, TaskGroup } from "@/lib/types";
import { GanttChart } from "./_components/gantt-chart";
import { PageHeader } from "@/components/page-header";

export default function TasksPage() {
  const { settings } = useSettings();
  const [isMounted, setIsMounted] = React.useState(false);
  const [board, setBoard] = React.useState<{ groups: TaskGroup[] }>({ groups: [] });
  const [viewLoading, setViewLoading] = React.useState(false);
  const previousView = React.useRef(settings.tasksDefaultView);


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
  
  React.useEffect(() => {
    if (previousView.current !== settings.tasksDefaultView) {
      setViewLoading(true);
      const timer = setTimeout(() => {
        setViewLoading(false);
        previousView.current = settings.tasksDefaultView;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [settings.tasksDefaultView]);

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

  const renderContent = () => {
    switch (settings.tasksDefaultView) {
      case "list":
        return (
          <TaskList
            groups={board.groups}
            onUpdateTask={handleUpdateTask}
            onToggleTask={handleToggleTask}
            onRemoveTask={handleRemoveTask}
            onRenameGroup={handleRenameGroup}
            onRemoveGroup={handleRemoveGroup}
          />
        );
      case "board":
        return (
          <TaskBoard
            groups={board.groups}
            onUpdateTask={handleUpdateTask}
            onToggleTask={handleToggleTask}
            onRemoveTask={handleRemoveTask}
            onRenameGroup={handleRenameGroup}
            onRemoveGroup={handleRemoveGroup}
          />
        );
      case "gantt":
        return <GanttChart tasks={allTasks} />;
      default:
        return (
           <TaskList
            groups={board.groups}
            onUpdateTask={handleUpdateTask}
            onToggleTask={handleToggleTask}
            onRemoveTask={handleRemoveTask}
            onRenameGroup={handleRenameGroup}
            onRemoveGroup={handleRemoveGroup}
          />
        );
    }
  };

  const pageTitles = {
    list: { title: "List View", description: "A simple, compact view of your tasks." },
    board: { title: "Board View", description: "A Kanban-style board to visualize your workflow." },
    gantt: { title: "Gantt View", description: "A timeline view to track project schedules." },
  }

  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full flex flex-col">
       <PageHeader
        title={pageTitles[settings.tasksDefaultView]?.title || "Tasks"}
        description={pageTitles[settings.tasksDefaultView]?.description}
      >
        <AddTaskDialog onAddTask={handleAddTask} groups={board.groups} />
        <AddGroupDialog onAddGroup={handleAddGroup} />
      </PageHeader>
      
      <div className="flex-1 overflow-y-auto">
        {viewLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-semibold">{pageTitles[settings.tasksDefaultView].title}</h3>
                <p className="text-sm text-muted-foreground">{pageTitles[settings.tasksDefaultView].description}</p>
            </div>
        ) : renderContent()}
      </div>
    </div>
  )
}
