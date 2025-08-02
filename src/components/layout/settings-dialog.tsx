
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop, Palette, Shield, Code, Bell, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SettingCategory = 'universal' | 'profile' | 'notifications' | 'cortex' | 'dashboard' | 'tasks';
const settingCategories: { id: SettingCategory, label: string, icon: React.ReactElement }[] = [
    { id: 'universal', label: 'Universal', icon: <Palette/> },
    { id: 'profile', label: 'Profile', icon: <User/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell/> },
    { id: 'cortex', label: 'Cortex AI', icon: <Code/> },
    { id: 'dashboard', label: 'Dashboard', icon: <Shield/> },
    { id: 'tasks', label: 'Tasks', icon: <Code/> },
]

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [activeCategory, setActiveCategory] = React.useState<SettingCategory>('universal')

  const renderContent = () => {
    switch (activeCategory) {
      case 'universal':
        return (
             <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">Select how the application should look.</p>
                     <div className="flex gap-2 mt-2">
                        <Button variant={theme === "light" ? "secondary" : "outline"} onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" /> Light
                        </Button>
                        <Button variant={theme === "dark" ? "secondary" : "outline"} onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" /> Dark
                        </Button>
                         <Button variant={theme === "system" ? "secondary" : "outline"} onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4" /> System
                        </Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-medium">More settings coming soon!</h3>
                    <p className="text-sm text-muted-foreground">Stay tuned for more universal settings like sidebar layout, custom backgrounds, and more.</p>
                </div>
            </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Settings for this category are coming soon.</p>
          </div>
        )
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application and workspace settings.
          </DialogDescription>
        </DialogHeader>
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
            <ResizablePanel defaultSize={25} minSize={20}>
                <div className="p-2 space-y-1">
                    {settingCategories.map(cat => (
                         <Button
                            key={cat.id}
                            variant={activeCategory === cat.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveCategory(cat.id)}
                         >
                            {cat.icon} {cat.label}
                        </Button>
                    ))}
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  )
}
