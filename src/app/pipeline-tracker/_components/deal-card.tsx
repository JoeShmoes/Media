
"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"

import type { Deal } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface DealCardProps {
  deal: Deal
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function DealCard({ deal, onView, onEdit, onDelete }: DealCardProps) {
  return (
    <Card className="group cursor-pointer hover:bg-muted/50" onClick={onView}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm leading-tight pr-2">{deal.title}</p>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                   <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
             <AlertDialogContent onClick={e => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete this deal from your pipeline. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Badge variant="secondary">${deal.value.toLocaleString()}</Badge>
        {deal.clientName && <p className="text-xs text-muted-foreground mt-2">{deal.clientName}</p>}
      </CardContent>
    </Card>
  )
}
