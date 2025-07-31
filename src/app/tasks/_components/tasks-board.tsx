"use client";

import * as React from "react";
import { Plus, Edit, Trash2, CheckCircle, Circle, Bell, BellOff, Calendar } from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Task, TaskGroup, DayOfWeek } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const daysOfWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Group name is required"),
});

const taskSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  renew: z.enum(["Never", "Everyday"]).or(z.array(z.string())).default("Never"),
  notifications: z.boolean().default(false),
  completed: z.boolean().default(false),
});

const boardSchema = z.object({
  groups: z.array(groupSchema.extend({
    tasks: z.array(taskSchema),
  })),
});

type FormValues = z.infer<typeof boardSchema>;

export function TasksBoard() {
  const [isMounted, setIsMounted] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      groups: [
        { id: "default", name: "Default", tasks: [] },
      ],
    },
  });

  const { fields: groups, append: appendGroup, update: updateGroup, remove: removeGroup } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const { fields: tasks, append: appendTask, update: updateTask, remove: removeTask } = useFieldArray({
    control: form.control,
    name: `groups.0.tasks`, // Initially manages tasks for the first group
  });
  
  React.useEffect(() => setIsMounted(true), []);
  
  if (!isMounted) return null;


  const handleAddGroup = () => {
    const newId = `group-${Date.now()}`;
    appendGroup({ id: newId, name: "New Group", tasks: [] });
  };
  
  const handleAddTask = (groupIdx: number, task: Omit<Task, 'id' | 'completed'>) => {
     const currentTasks = form.getValues(`groups.${groupIdx}.tasks`);
     const newTask: Task = { ...task, id: `task-${Date.now()}`, completed: false };
     form.setValue(`groups.${groupIdx}.tasks`, [...currentTasks, newTask]);
  }

  const handleToggleTask = (groupIdx: number, taskIdx: number) => {
    const task = form.getValues(`groups.${groupIdx}.tasks.${taskIdx}`);
    form.setValue(`groups.${groupIdx}.tasks.${taskIdx}.completed`, !task.completed);
  }
  
  const handleRemoveTask = (groupIdx: number, taskIdx: number) => {
    const currentTasks = form.getValues(`groups.${groupIdx}.tasks`);
    const newTasks = currentTasks.filter((_, i) => i !== taskIdx);
    form.setValue(`groups.${groupIdx}.tasks`, newTasks);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddGroup}>
          <Plus className="mr-2" /> Add Group
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, groupIdx) => (
          <Card key={group.id} className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{group.name}</CardTitle>
              {group.id !== "default" && (
                <Button variant="ghost" size="icon" onClick={() => removeGroup(groupIdx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
                {group.tasks.map((task, taskIdx) => (
                    <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleTask(groupIdx, taskIdx)}>
                            {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                        </Button>
                        <div className="flex-1 ml-2">
                            <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.name}</p>
                            {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTask(groupIdx, taskIdx)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                 {group.tasks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No tasks yet.</p>
                )}
            </CardContent>
            <CardFooter>
                <AddTaskDialog groupIdx={groupIdx} onAddTask={handleAddTask} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddTaskDialog({ groupIdx, onAddTask }: { groupIdx: number, onAddTask: (groupIdx: number, task: Omit<Task, 'id' | 'completed'>) => void }) {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<Omit<Task, 'id' | 'completed'>>({
      defaultValues: {
          name: "",
          description: "",
          renew: "Never",
          notifications: false,
      }
  });
  
  const onSubmit = (data: Omit<Task, 'id' | 'completed'>) => {
    onAddTask(groupIdx, data);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Follow up with clients" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl><Textarea placeholder="Add more details about the task..." {...field} /></FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="renew"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Repeat</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value)} defaultValue="Never">
                               <FormControl>
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   <SelectItem value="Never">Never</SelectItem>
                                   <SelectItem value="Everyday">Everyday</SelectItem>
                               </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                 {form.watch("renew") === "Everyday" && (
                    <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map(day => (
                            <FormField
                                key={day}
                                control={form.control}
                                name="renew"
                                render={({ field }) => {
                                    const selectedDays = Array.isArray(field.value) ? field.value : [];
                                    return (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={day}
                                                checked={selectedDays.includes(day)}
                                                onCheckedChange={(checked) => {
                                                    const newDays = checked ? [...selectedDays, day] : selectedDays.filter(d => d !== day);
                                                    field.onChange(newDays);
                                                }}
                                            />
                                            <label htmlFor={day} className="text-sm font-medium">{day}</label>
                                        </div>
                                    )
                                }}
                            />
                        ))}
                    </div>
                )}
                
                <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Enable Notifications</FormLabel>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="submit">Add Task</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
