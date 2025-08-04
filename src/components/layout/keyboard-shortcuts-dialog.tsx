
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Kbd } from "@/components/ui/kbd"
import { navLinks } from "./app-shell"
import { Input } from "../ui/input"
import { useSettings } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultShortcuts = [
  { action: "Command Menu", shortcut: "⌘ + K" },
  { action: "Toggle Sidebar", shortcut: "⌘ + B" },
]

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
    const { settings, setSetting } = useSettings();
    const { toast } = useToast();

    const handleShortcutChange = (href: string, key: string) => {
        const newShortcuts = {...settings.roomShortcuts};
        
        if (key.length > 1) {
            toast({
                variant: "destructive",
                title: "Invalid Shortcut",
                description: "Shortcut must be a single character.",
            });
            return;
        }

        // Check for duplicates
        for (const existingHref in newShortcuts) {
            if (newShortcuts[existingHref]?.toLowerCase() === key.toLowerCase() && existingHref !== href) {
                toast({
                    variant: "destructive",
                    title: "Duplicate Shortcut",
                    description: `The key "${key.toUpperCase()}" is already assigned.`,
                });
                return;
            }
        }
        
        if (key === "") {
            delete newShortcuts[href];
        } else {
            newShortcuts[href] = key.toLowerCase();
        }
        setSetting('roomShortcuts', newShortcuts);
    }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Manage and view keyboard shortcuts to navigate the app faster.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Shortcut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {defaultShortcuts.map((shortcut) => (
                    <TableRow key={shortcut.action}>
                        <TableCell>{shortcut.action}</TableCell>
                        <TableCell className="text-right">
                        <Kbd>{shortcut.shortcut}</Kbd>
                        </TableCell>
                    </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2} className="font-semibold text-muted-foreground pt-6">Room Shortcuts</TableCell>
                    </TableRow>
                    {navLinks.map((link) => (
                        <TableRow key={link.href}>
                            <TableCell>Open {link.label}</TableCell>
                            <TableCell className="text-right flex items-center justify-end gap-2">
                                <span className="text-muted-foreground"><Kbd>⌘ +</Kbd></span>
                                <Input 
                                    className="w-12 h-8 text-center"
                                    maxLength={1}
                                    value={settings.roomShortcuts?.[link.href]?.toUpperCase() || ""}
                                    onChange={(e) => handleShortcutChange(link.href, e.target.value)}
                                    placeholder="-"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
