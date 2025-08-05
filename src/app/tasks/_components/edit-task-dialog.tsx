
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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

const daysOfWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const taskDialogSchema = z.object({
    name: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    renew: z.union([z.literal("Never"), z.literal("Everyday"), z.array(z.string())]).default("Never"),
    notifications: z.boolean().default(false),
    groupId: z.string().optional(),
})

type TaskDialogFormValues = z.infer<typeof taskDialogSchema>;


export function EditTaskDialog({ task, groups, currentGroupId, onUpdateTask, trigger }: { task: Task, groups: TaskGroup[], currentGroupId: string, onUpdateTask: (task: Omit<Task, 'id' | 'completed'>, newGroupId?: string) => void, trigger: React.ReactNode }) {
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
