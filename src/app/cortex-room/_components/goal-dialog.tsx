
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"


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

function MultiSelectDropdown({ control, name, label, items }: { control: any, name: "linkedProjectIds" | "linkedTaskIds", label: string, items: {id: string, title: string}[]}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectedCount = control.getValues(name)?.length || 0;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <FormLabel>{label}</FormLabel>
            <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between mt-2">
                    <span>{selectedCount > 0 ? `${selectedCount} selected` : `Select ${label.toLowerCase()}...`}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <FormField
                  control={control}
                  name={name}
                  render={() => (
                    <FormItem className="mt-2">
                       <ScrollArea className="h-32 rounded-md border p-4">
                         {items.map((item) => (
                            <FormField
                                key={item.id}
                                control={control}
                                name={name}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.title}</FormLabel>
                                    </FormItem>
                                )}
                            />
                         ))}
                         {items.length === 0 && <p className="text-sm text-muted-foreground">No {label.toLowerCase()} available to link.</p>}
                       </ScrollArea>
                    </FormItem>
                  )}
                />
            </CollapsibleContent>
        </Collapsible>
    )
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
      <DialogContent className="sm:max-w-2xl">
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

                <MultiSelectDropdown 
                    control={form.control}
                    name="linkedProjectIds"
                    label="Projects"
                    items={projects.map(p => ({id: p.id, title: p.title}))}
                />
                
                 <MultiSelectDropdown 
                    control={form.control}
                    name="linkedTaskIds"
                    label="Tasks"
                    items={tasks.map(t => ({id: t.id, title: t.name}))}
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
