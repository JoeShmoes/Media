
"use client";

import * as React from "react";
import { Plus, Edit, Trash2, CheckCircle, Circle, MoreVertical, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { GroupActions } from "./group-actions";
import type { Task, TaskGroup } from "@/lib/types";
import { cn } from "@/lib/utils";


interface TaskListProps {
    groups: TaskGroup[];
    onUpdateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>, newGroupId?: string) => void;
    onToggleTask: (taskId: string) => void;
    onRemoveTask: (taskId: string) => void;
    onRenameGroup: (groupId: string, newName: string) => void;
    onRemoveGroup: (groupId: string) => void;
}

export function TaskList({ groups, onUpdateTask, onToggleTask, onRemoveTask, onRenameGroup, onRemoveGroup }: TaskListProps) {
    return (
        <div className="space-y-6">
            {groups.map((group, groupIdx) => {
            const sortedTasks = [...group.tasks].sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                return 0;
            });
            return (
                <Collapsible key={group.id} defaultOpen className="group/collapsible">
                <Card className="glassmorphic">
                    <div className="flex items-center pr-4">
                        <CollapsibleTrigger asChild>
                            <div className="flex flex-1 items-center gap-2 p-4 cursor-pointer">
                                <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                <CardTitle>{group.name}</CardTitle>
                            </div>
                        </CollapsibleTrigger>
                    {group.id !== "default" && (
                        <GroupActions 
                            onRename={(name) => onRenameGroup(group.id, name)} 
                            onDelete={() => onRemoveGroup(group.id)} 
                        />
                    )}
                    </div>
                    <CollapsibleContent>
                        <CardContent className="space-y-3">
                            {sortedTasks.map((task) => (
                                <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors group/task">
                                    <Button variant="ghost" size="icon" onClick={() => onToggleTask(task.id)}>
                                        {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                    </Button>
                                    <div className="flex-1 ml-2">
                                        <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                                            {task.name}
                                        </p>
                                        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                                    </div>
                                    <TaskActions 
                                        task={task}
                                        groups={groups}
                                        currentGroupId={group.id}
                                        onUpdateTask={onUpdateTask}
                                        onRemoveTask={onRemoveTask} 
                                    />
                                </div>
                            ))}
                            {group.tasks.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No tasks yet.</p>
                            )}
                        </CardContent>
                    </CollapsibleContent>
                </Card>
                </Collapsible>
            )
            })}
      </div>
    );
}


function TaskActions({ task, groups, currentGroupId, onUpdateTask, onRemoveTask }: { task: Task, groups: TaskGroup[], currentGroupId: string, onUpdateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>, newGroupId?: string) => void, onRemoveTask: (taskId: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/task:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <EditTaskDialog
                    task={task}
                    groups={groups}
                    currentGroupId={currentGroupId}
                    onUpdateTask={(data, newGroupId) => onUpdateTask(task.id, data, newGroupId)}
                    trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                    }
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRemoveTask(task.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
