
"use client"

import * as React from "react"
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react"

import type { RoutineBlock, DayOfWeek } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoutineDialog } from "./routine-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"

const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface RoutineBoardProps {
  routineBlocks: RoutineBlock[]
  onSaveBlock: (block: Omit<RoutineBlock, 'id'> & { id?: string }) => void
  onDeleteBlock: (id: string) => void
}

export function RoutineBoard({ routineBlocks, onSaveBlock, onDeleteBlock }: RoutineBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingBlock, setEditingBlock] = React.useState<RoutineBlock | null>(null)

  const handleEdit = (block: RoutineBlock) => {
    setEditingBlock(block)
    setIsDialogOpen(true)
  }
  
  const handleAddNew = () => {
    setEditingBlock(null);
    setIsDialogOpen(true);
  }

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Routine</CardTitle>
          <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Block</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-muted/30 rounded-lg p-2 space-y-2">
                <h3 className="font-semibold text-center">{day}</h3>
                {routineBlocks
                  .filter(block => block.day === day)
                  .sort((a,b) => a.startTime.localeCompare(b.startTime))
                  .map(block => (
                    <Card key={block.id} className="group glassmorphic text-sm">
                      <CardContent className="p-2">
                        <div className="flex justify-between items-start">
                           <p className="font-medium pr-2">{block.name}</p>
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(block)}>
                                    <Edit className="mr-2 h-4 w-4"/> Edit
                                </DropdownMenuItem>
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                      <AlertDialogDescription>This will delete the routine block. This action cannot be undone.</AlertDialogDescription>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDeleteBlock(block.id)}>Delete</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                        <Badge variant="secondary">{block.startTime} - {block.endTime}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                  {routineBlocks.filter(b => b.day === day).length === 0 && (
                      <div className="text-center text-xs text-muted-foreground pt-4">No blocks</div>
                  )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
       <RoutineDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        block={editingBlock}
        onSave={onSaveBlock}
      />
    </>
  )
}
