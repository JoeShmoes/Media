
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Goal, Project, Task } from "@/lib/types"

const goalSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  status: z.enum(["Not Started", "In Progress", "Completed"]),
  linkedProjectIds: z.array(z.string()).optional(),
  linkedTaskIds: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof goalSchema>

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal | null
  onSave: (goalData: FormValues) => void
  projects: Project[]
  tasks: Task[]
}

export function GoalDialog({ open, onOpenChange, goal, onSave, projects, tasks }: GoalDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      status: "Not Started",
      linkedProjectIds: [],
      linkedTaskIds: [],
    }
  })
  
  React.useEffect(() => {
    if (goal) {
      form.reset(goal)
    } else {
      form.reset({
        id: undefined,
        title: "",
        description: "",
        status: "Not Started",
        linkedProjectIds: [],
        linkedTaskIds: [],
      })
    }
  }, [goal, open, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update the details for this goal." : "Define a new high-level objective."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <ScrollArea className="max-h-[70vh] p-1">
              <div className="space-y-4 pr-6">
                 <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Increase Q3 revenue by 20%" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Textarea placeholder="Add more details about this goal..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Linked Projects */}
                <FormField
                  control={form.control}
                  name="linkedProjectIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Linked Projects</FormLabel>
                       <ScrollArea className="h-32 rounded-md border p-4">
                         {projects.map((project) => (
                            <FormField
                                key={project.id}
                                control={form.control}
                                name="linkedProjectIds"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(project.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), project.id])
                                                    : field.onChange(field.value?.filter((value) => value !== project.id))
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{project.title}</FormLabel>
                                    </FormItem>
                                )}
                            />
                         ))}
                         {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects available to link.</p>}
                       </ScrollArea>
                    </FormItem>
                  )}
                />

                {/* Linked Tasks */}
                <FormField
                  control={form.control}
                  name="linkedTaskIds"
                  render={() => (
                    <FormItem>
                      <FormLabel>Linked Tasks</FormLabel>
                       <ScrollArea className="h-32 rounded-md border p-4">
                         {tasks.map((task) => (
                             <FormField
                                key={task.id}
                                control={form.control}
                                name="linkedTaskIds"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(task.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), task.id])
                                                    : field.onChange(field.value?.filter((value) => value !== task.id))
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{task.name}</FormLabel>
                                    </FormItem>
                                )}
                            />
                         ))}
                         {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks available to link.</p>}
                       </ScrollArea>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pr-6 pt-4">
              <Button type="submit">Save Goal</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
