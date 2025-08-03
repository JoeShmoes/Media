
"use client";

import * as React from "react";
import { Plus, Edit, Trash2, CheckCircle, Circle, MoreVertical, ChevronRight, Save } from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import { format } from "date-fns"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const taskSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  renew: z.union([z.literal("Never"), z.literal("Everyday"), z.array(z.string())]).default("Never"),
  notifications: z.boolean().default(false),
  completed: z.boolean().default(false),
  dueDate: z.string().optional(),
});

const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Group name is required"),
  tasks: z.array(taskSchema),
});


const boardSchema = z.object({
  groups: z.array(groupSchema),
});

type FormValues = z.infer<typeof boardSchema>;

export function TasksBoard() {
    const [boardData, setBoardData] = React.useState<FormValues | null>(null);
    const [isMounted, setIsMounted] = React.useState(false);
    const { toast } = useToast();

    // Load initial data from localStorage
    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
                const board = JSON.parse(savedTasks);
                if (board && board.groups && Array.isArray(board.groups)) {
                    setBoardData(board);
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to load tasks from local storage", error);
        }
        // Set default data if nothing in storage or data is invalid
        setBoardData({ groups: [{ id: "default", name: "Default", tasks: [] }] });
    }, []);

    // Debounce and save data to localStorage
    const [debouncedBoardData] = useDebounce(boardData, 1000);
    React.useEffect(() => {
        if (isMounted && debouncedBoardData) {
            try {
                localStorage.setItem("tasks", JSON.stringify(debouncedBoardData));
            } catch (error) {
                console.error("Failed to save tasks to local storage", error);
                toast({
                    variant: "destructive",
                    title: "Error Saving Tasks",
                    description: "There was an issue auto-saving your tasks.",
                })
            }
        }
    }, [debouncedBoardData, isMounted, toast]);

    if (!isMounted || !boardData) {
        return null; // Or a loading spinner
    }

    return <TaskBoardForm boardData={boardData} setBoardData={setBoardData} />;
}


function TaskBoardForm({ boardData, setBoardData }: { boardData: FormValues, setBoardData: React.Dispatch<React.SetStateAction<FormValues | null>> }) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(boardSchema),
    values: boardData, // Use values to sync form with external state
  });
  
  // This effect syncs the parent state back to the form if it changes from outside
  React.useEffect(() => {
    form.reset(boardData);
  }, [boardData, form]);

  const { fields: groups, append: appendGroup, update: updateGroup, remove: removeGroup } = useFieldArray({
    control: form.control,
    name: "groups",
  });
  
  const handleStateChange = (newGroups: TaskGroup[]) => {
      setBoardData({ groups: newGroups });
  }

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>, targetGroupId: string) => {
    const newGroups = [...groups];
    const targetGroupIndex = newGroups.findIndex(g => g.id === targetGroupId);
    if (targetGroupIndex === -1) return;
    
    const newTask: Task = { ...task, id: `task-${Date.now()}`, completed: false };
    newGroups[targetGroupIndex].tasks.push(newTask);
    handleStateChange(newGroups);
  }
  
  const handleUpdateTask = (groupIdx: number, taskIdx: number, data: Omit<Task, 'id' | 'completed'>, newGroupId?: string) => {
     const newGroups = [...groups];
     const sourceGroup = newGroups[groupIdx];
     const taskToUpdate = { ...sourceGroup.tasks[taskIdx], ...data };

     if(newGroupId && newGroupId !== sourceGroup.id) {
         // Move task
         sourceGroup.tasks.splice(taskIdx, 1);
         const targetGroupIndex = newGroups.findIndex(g => g.id === newGroupId);
         if(targetGroupIndex !== -1) {
            newGroups[targetGroupIndex].tasks.push(taskToUpdate);
         }
     } else {
        // Update task
         sourceGroup.tasks[taskIdx] = taskToUpdate;
     }
     handleStateChange(newGroups);
  }

  const handleToggleTask = (groupIdx: number, taskIdx: number) => {
    const newGroups = [...groups];
    const group = newGroups[groupIdx];
    const task = group.tasks[taskIdx];

    task.completed = !task.completed;
    task.dueDate = task.completed ? new Date().toISOString() : undefined;
    
    handleStateChange(newGroups);
  }
  
  const handleRemoveTask = (groupIdx: number, taskIdx: number) => {
    const newGroups = [...groups];
    newGroups[groupIdx].tasks.splice(taskIdx, 1);
    handleStateChange(newGroups);
  }

  const handleRenameGroup = (groupIdx: number, newName: string) => {
    const newGroups = [...groups];
    newGroups[groupIdx].name = newName;
    handleStateChange(newGroups);
  }
  
  const handleRemoveGroup = (groupIdx: number) => {
      const newGroups = groups.filter((_, i) => i !== groupIdx);
      handleStateChange(newGroups);
  }
  
  const handleAddGroup = (name: string) => {
    const newGroup = { id: `group-${Date.now()}`, name, tasks: [] };
    handleStateChange([...groups, newGroup]);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <AddTaskDialog onAddTask={handleAddTask} groups={groups} />
        <AddGroupDialog onAddGroup={handleAddGroup} />
      </div>

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
                        onRename={(newName) => handleRenameGroup(groupIdx, newName)} 
                        onDelete={() => handleRemoveGroup(groupIdx)} 
                    />
                  )}
                </div>
                <CollapsibleContent>
                    <CardContent className="space-y-3">
                        {sortedTasks.map((task, taskIdx) => {
                            const originalIndex = group.tasks.findIndex(t => t.id === task.id);
                            return (
                                <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors group/task">
                                    <Button variant="ghost" size="icon" onClick={() => handleToggleTask(groupIdx, originalIndex)}>
                                        {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-muted-foreground" />}
                                    </Button>
                                    <div className="flex-1 ml-2">
                                        <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                                            {task.name}
                                            {task.completed && <span className="ml-2 text-xs font-normal text-muted-foreground/80">* Archived</span>}
                                        </p>
                                        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                                    </div>
                                    <TaskActions 
                                        task={task}
                                        groups={groups}
                                        currentGroupId={group.id}
                                        onUpdate={(data, newGroupId) => handleUpdateTask(groupIdx, originalIndex, data, newGroupId)}
                                        onDelete={() => handleRemoveTask(groupIdx, originalIndex)} 
                                    />
                                </div>
                            )
                        })}
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
    </div>
  );
}

function AddGroupDialog({ onAddGroup }: { onAddGroup: (name: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGroup(name.trim());
      setName("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2" /> Add Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create a new group</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Group Name (e.g., Marketing)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GroupActions({ onRename, onDelete }: { onRename: (name: string) => void; onDelete: () => void }) {
  const [isRenameOpen, setIsRenameOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(name.trim());
      setName("");
      setIsRenameOpen(false);
    }
  };

  return (
     <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>This will delete the group and all its tasks. This action cannot be undone.</AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
            <DialogHeader><DialogTitle>Rename Group</DialogTitle></DialogHeader>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <DialogFooter><Button type="submit">Save Changes</Button></DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}

function TaskActions({ task, groups, currentGroupId, onUpdate, onDelete }: { task: Task, groups: TaskGroup[], currentGroupId: string, onUpdate: (data: Omit<Task, 'id' | 'completed'>, newGroupId?: string) => void, onDelete: () => void }) {
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
                    onUpdateTask={onUpdate}
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
                            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const taskDialogSchema = z.object({
    name: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    renew: z.union([z.literal("Never"), z.literal("Everyday"), z.array(z.string())]).default("Never"),
    notifications: z.boolean().default(false),
    groupId: z.string().optional(),
})

type TaskDialogFormValues = z.infer<typeof taskDialogSchema>;


function AddTaskDialog({ onAddTask, groups }: { onAddTask: (task: Omit<Task, 'id' | 'completed'>, groupId: string) => void, groups: TaskGroup[] }) {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<TaskDialogFormValues>({
      resolver: zodResolver(taskDialogSchema),
      defaultValues: {
          name: "",
          description: "",
          renew: "Never",
          notifications: false,
          groupId: "default",
      }
  });

  const renewValue = form.watch("renew");
  
  const onSubmit = (data: TaskDialogFormValues) => {
    const { groupId, ...taskData } = data;
    onAddTask(taskData, groupId || "default");
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
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
                    name="groupId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                 <SelectTrigger><SelectValue /></SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   {groups.map(group => (
                                       <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                   ))}
                               </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="renew"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Repeat</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value === 'custom' ? [] : value)} defaultValue="Never">
                               <FormControl>
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   <SelectItem value="Never">Never</SelectItem>
                                   <SelectItem value="Everyday">Everyday</SelectItem>
                                   <SelectItem value="custom">Custom...</SelectItem>
                               </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                 {Array.isArray(renewValue) && (
                     <FormField
                        control={form.control}
                        name="renew"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-4 gap-2 py-2">
                                    {daysOfWeek.map(day => {
                                        const selectedDays = Array.isArray(field.value) ? field.value : [];
                                        return (
                                            <div key={day} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={day}
                                                    checked={selectedDays.includes(day)}
                                                    onCheckedChange={(checked) => {
                                                        const currentDays = Array.isArray(field.value) ? field.value.filter(d => daysOfWeek.includes(d)) : [];
                                                        let newDays;
                                                        if (checked) {
                                                            newDays = [...currentDays, day];
                                                        } else {
                                                            newDays = currentDays.filter(d => d !== day);
                                                        }
                                                        field.onChange(newDays);
                                                    }}
                                                />
                                                <label htmlFor={day} className="text-sm font-medium leading-none">
                                                    {day.substring(0,3)}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                                <FormMessage />
                           </FormItem>
                        )}
                    />
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


function EditTaskDialog({ task, groups, currentGroupId, onUpdateTask, trigger }: { task: Task, groups: TaskGroup[], currentGroupId: string, onUpdateTask: (task: Omit<Task, 'id' | 'completed'>, newGroupId?: string) => void, trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<TaskDialogFormValues>({
      resolver: zodResolver(taskDialogSchema),
      defaultValues: {
          name: task.name,
          description: task.description,
          renew: task.renew,
          notifications: task.notifications,
          groupId: currentGroupId,
      }
  });

  const renewValue = form.watch("renew");
  
  const onSubmit = (data: TaskDialogFormValues) => {
    const { groupId, ...taskData } = data;
    onUpdateTask(taskData, groupId);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
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
                    name="groupId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                 <SelectTrigger><SelectValue /></SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   {groups.map(group => (
                                       <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                   ))}
                               </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="renew"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Repeat</FormLabel>
                            <Select 
                                onValueChange={(value) => field.onChange(value === 'custom' ? [] : value)} 
                                defaultValue={Array.isArray(field.value) ? "custom" : field.value || "Never"}
                            >
                               <FormControl>
                                 <SelectTrigger><SelectValue/></SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   <SelectItem value="Never">Never</SelectItem>
                                   <SelectItem value="Everyday">Everyday</SelectItem>
                                   <SelectItem value="custom">Custom...</SelectItem>
                               </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                 {Array.isArray(renewValue) && (
                     <FormField
                        control={form.control}
                        name="renew"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-4 gap-2 py-2">
                                    {daysOfWeek.map(day => {
                                        const selectedDays = Array.isArray(field.value) ? field.value : [];
                                        return (
                                            <div key={day} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`edit-${day}`}
                                                    checked={selectedDays.includes(day)}
                                                    onCheckedChange={(checked) => {
                                                        const currentDays = Array.isArray(field.value) ? field.value.filter(d => daysOfWeek.includes(d)) : [];
                                                        let newDays;
                                                        if (checked) {
                                                            newDays = [...currentDays, day];
                                                        } else {
                                                            newDays = currentDays.filter(d => d !== day);
                                                        }
                                                        field.onChange(newDays);
                                                    }}
                                                />
                                                <label htmlFor={`edit-${day}`} className="text-sm font-medium leading-none">
                                                    {day.substring(0,3)}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                                <FormMessage />
                           </FormItem>
                        )}
                    />
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
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    