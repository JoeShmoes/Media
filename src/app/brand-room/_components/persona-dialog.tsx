
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import type { Persona } from "@/lib/types"
import { PlusCircle, Trash2 } from "lucide-react"

const personaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Persona name is required"),
  avatar: z.string().url("Please enter a valid image URL."),
  bio: z.string().min(1, "Bio is required"),
  goals: z.array(z.object({ value: z.string().min(1, "Goal cannot be empty")})).min(1, "At least one goal is required."),
  painPoints: z.array(z.object({ value: z.string().min(1, "Pain point cannot be empty")})).min(1, "At least one pain point is required."),
})

type FormValues = z.infer<typeof personaSchema>

interface PersonaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  persona: Persona | null
  onSave: (personaData: Omit<Persona, 'id'> & { id?: string }) => void
}

export function PersonaDialog({ open, onOpenChange, persona, onSave }: PersonaDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      id: "",
      name: "",
      avatar: "",
      bio: "",
      goals: [{ value: "" }],
      painPoints: [{ value: "" }],
    },
  })

  const { fields: goals, append: appendGoal, remove: removeGoal } = useFieldArray({
    control: form.control,
    name: "goals",
  })
  const { fields: painPoints, append: appendPainPoint, remove: removePainPoint } = useFieldArray({
    control: form.control,
    name: "painPoints",
  })

  React.useEffect(() => {
    if (persona) {
      form.reset({
        ...persona,
        goals: persona.goals.map(g => ({ value: g })),
        painPoints: persona.painPoints.map(p => ({ value: p })),
      })
    } else {
      form.reset({
        id: undefined,
        name: "",
        avatar: "",
        bio: "",
        goals: [{ value: "" }],
        painPoints: [{ value: "" }],
      })
    }
  }, [persona, open, form])

  const onSubmit = (data: FormValues) => {
    const finalData = {
        ...data,
        goals: data.goals.map(g => g.value),
        painPoints: data.painPoints.map(p => p.value),
    }
    onSave(finalData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{persona ? "Edit Persona" : "Create New Persona"}</DialogTitle>
          <DialogDescription>
            {persona ? "Update the details for this persona." : "Define a new target audience persona."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Startup Steve" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input placeholder="https://placehold.co/40x40.png" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea placeholder="Describe this persona in a few sentences..." {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Goals</FormLabel>
              {goals.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`goals.${index}.value`}
                  render={({ field }) => (
                    <FormItem><div className="flex items-center gap-2">
                      <FormControl><Input placeholder={`Goal ${index + 1}`} {...field} /></FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeGoal(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div><FormMessage /></FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendGoal({ value: "" })}><PlusCircle className="mr-2" /> Add Goal</Button>
            </div>
            <div className="space-y-2">
              <FormLabel>Pain Points</FormLabel>
              {painPoints.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`painPoints.${index}.value`}
                  render={({ field }) => (
                    <FormItem><div className="flex items-center gap-2">
                      <FormControl><Input placeholder={`Pain Point ${index + 1}`} {...field} /></FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removePainPoint(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div><FormMessage /></FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendPainPoint({ value: "" })}><PlusCircle className="mr-2" /> Add Pain Point</Button>
            </div>
            <DialogFooter>
              <Button type="submit">Save Persona</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
