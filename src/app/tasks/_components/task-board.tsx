
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskBoardProps {
    groups: TaskGroup[];
    onUpdateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>, newGroupId?: string) => void;
    onToggleTask: (taskId: string) => void;
    onRemoveTask: (taskId: string) => void;
    onRenameGroup: (groupId: string, newName: string) => void;
    onRemoveGroup: (groupId: string) => void;
}

export function TaskBoard({ groups, onUpdateTask, onToggleTask, onRemoveTask, onRenameGroup, onRemoveGroup }: TaskBoardProps) {
    return (
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {groups.map((group) => (
                <div key={group.id} className="w-80 shrink-0">
                    <Card className="glassmorphic h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between p-3">
                            <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
                            {group.id !== 'default' && (
                                <GroupActions
                                    onRename={(name) => onRenameGroup(group.id, name)}
                                    onDelete={() => onRemoveGroup(group.id)}
                                />
                            )}
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto px-1 py-0">
                            <div className="space-y-2 p-2">
                                {group.tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        groups={groups}
                                        currentGroupId={group.id}
                                        onUpdateTask={onUpdateTask}
                                        onToggleTask={onToggleTask}
                                        onRemoveTask={onRemoveTask}
                                    />
                                ))}
                                {group.tasks.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8 text-sm">
                                        No tasks in this group.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}

interface TaskCardProps {
    task: Task;
    groups: TaskGroup[];
    currentGroupId: string;
    onUpdateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>, newGroupId?: string) => void;
    onToggleTask: (taskId: string) => void;
    onRemoveTask: (taskId: string) => void;
}

function TaskCard({ task, groups, currentGroupId, onUpdateTask, onToggleTask, onRemoveTask }: TaskCardProps) {
    return (
        <Card className="group/task bg-card/80 hover:bg-card/90">
            <CardContent className="p-3">
                <div className="flex items-start justify-between">
                    <button className="flex-1 text-left" onClick={() => onToggleTask(task.id)}>
                        <p className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>
                            {task.name}
                        </p>
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/task:opacity-100">
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
                </div>
                {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                )}
            </CardContent>
        </Card>
    );
}
