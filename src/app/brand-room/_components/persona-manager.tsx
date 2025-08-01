
"use client"

import * as React from "react"
import { Users, PlusCircle, Edit, Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Persona } from "@/lib/types"
import { PersonaDialog } from "./persona-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface PersonaManagerProps {
  personas: Persona[]
  setPersonas: React.Dispatch<React.SetStateAction<Persona[]>>
}

export function PersonaManager({ personas, setPersonas }: PersonaManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingPersona, setEditingPersona] = React.useState<Persona | null>(null)

  const handleSave = (personaData: Omit<Persona, 'id'> & { id?: string }) => {
    if (personaData.id) {
      setPersonas(personas.map(p => p.id === personaData.id ? { ...p, ...personaData } : p))
    } else {
      setPersonas([...personas, { ...personaData, id: `persona-${Date.now()}` }])
    }
  }

  const handleDelete = (id: string) => {
    setPersonas(personas.filter(p => p.id !== id))
  }
  
  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setIsDialogOpen(true);
  }

  return (
    <>
    <Card className="glassmorphic">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Users /> Target Personas</CardTitle>
          <CardDescription>Create and manage profiles for your target audiences.</CardDescription>
        </div>
        <Button variant="outline" onClick={() => { setEditingPersona(null); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2"/> Add Persona
        </Button>
      </CardHeader>
      <CardContent>
        {personas.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
                <p>No personas defined yet.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 gap-4">
                {personas.map(persona => (
                    <Card key={persona.id} className="group">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={persona.avatar} alt={persona.name} data-ai-hint="person portrait"/>
                                    <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{persona.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{persona.bio}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(persona)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                        <AlertDialogDescription>This will permanently delete the persona.</AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(persona.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm">Goals</h4>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {persona.goals.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm">Pain Points</h4>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {persona.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
    <PersonaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        persona={editingPersona}
        onSave={handleSave}
    />
    </>
  )
}
