
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Laptop, Palette, Shield, Code, Bell, User, LayoutDashboard, ListTodo, Notebook, Search, MessageSquare, Users, KanbanSquare, SendHorizonal, CircleDollarSign, Package, Archive, View, BrainCircuit, Workflow, Blocks, FileText, LayoutTemplate, Youtube, PenSquare, HelpCircle, Wrench } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SettingCategory = 'universal' | 'profile' | 'notifications' | 'workspace' | 'cortex' | 'dashboard' | 'tasks' | 'notes' | 'research' | 'gm' | 'clients' | 'projects' | 'outreach' | 'finance' | 'offer-builder' | 'asset-tracker' | 'brand-room' | 'pipeline-tracker' | 'ai-advantage' | 'autodocs' | 'template-builder' | 'integration-hub' | 'make-com' | 'content-studio' ;

const settingCategories: { id: SettingCategory, label: string, icon: React.ReactElement }[] = [
    { id: 'universal', label: 'Universal', icon: <Wrench/> },
    { id: 'workspace', label: 'Workspace', icon: <Shield /> },
    { id: 'profile', label: 'Profile', icon: <User/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell/> },
]

const roomSettingCategories: { id: SettingCategory, label: string, icon: React.ReactElement }[] = [
    { id: 'cortex', label: 'Cortex Room', icon: <BrainCircuit/> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard/> },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo/> },
    { id: 'notes', label: 'Notes', icon: <Notebook/> },
    { id: 'research', label: 'Research', icon: <Search/> },
    { id: 'gm', label: 'GM (Growth Map)', icon: <MessageSquare/> },
    { id: 'clients', label: 'Clients', icon: <Users/> },
    { id: 'projects', label: 'Projects', icon: <KanbanSquare/> },
    { id: 'outreach', label: 'Outreach', icon: <SendHorizonal/> },
    { id: 'finance', label: 'Finance', icon: <CircleDollarSign/> },
    { id: 'offer-builder', label: 'Offer Builder', icon: <Package/> },
    { id: 'asset-tracker', label: 'Asset Tracker', icon: <Archive/> },
    { id: 'brand-room', label: 'Brand Room', icon: <Palette/> },
    { id: 'pipeline-tracker', label: 'Pipeline Tracker', icon: <View/> },
    { id: 'ai-advantage', label: 'AI Advantage', icon: <HelpCircle/> },
    { id: 'autodocs', label: 'AutoDocs', icon: <FileText/> },
    { id: 'template-builder', label: 'Template Builder', icon: <LayoutTemplate/> },
    { id: 'integration-hub', label: 'Integration Hub', icon: <Blocks/> },
    { id: 'make-com', label: 'Make.com', icon: <Workflow/> },
    { id: 'content-studio', label: 'Content + Studio', icon: <Youtube/> },
]


export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [activeCategory, setActiveCategory] = React.useState<SettingCategory>('universal')

  const renderContent = () => {
    switch (activeCategory) {
      case 'universal':
        return (
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Theme</Label>
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
                            <Label>Sidebar Layout</Label>
                            <Select defaultValue="expanded">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expanded">Expanded</SelectItem>
                                    <SelectItem value="minimal">Minimal Icons</SelectItem>
                                    <SelectItem value="hidden">Hidden</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Room Background</Label>
                            <Select defaultValue="blur">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solid">Solid Color</SelectItem>
                                    <SelectItem value="blur">Blur Glass</SelectItem>
                                    <SelectItem value="custom">Custom Image</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>General</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="autosave">Autosave</Label>
                            <Switch id="autosave" defaultChecked/>
                        </div>
                        <div className="space-y-2">
                            <Label>Time Format</Label>
                            <Select defaultValue="12hr">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12hr">12-hour</SelectItem>
                                    <SelectItem value="24hr">24-hour</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Default Date Range</Label>
                            <Select defaultValue="this-week">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="this-week">This Week</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Productivity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="ai-assist">AI Assistant</Label>
                             <Switch id="ai-assist" defaultChecked/>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="quick-sync">Quick Sync</Label>
                             <Switch id="quick-sync"/>
                        </div>
                         <Button variant="outline">View Keyboard Shortcuts</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Data & Export</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-2">
                            <Label>Export Options</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select an export format..."/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="docx">.docx</SelectItem>
                                    <SelectItem value="csv">.csv</SelectItem>
                                    <SelectItem value="png">PNG Screenshot</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
      case 'workspace':
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Global app settings for your workspace.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Workspace Name</Label>
                            <Input defaultValue="Nexaris Media" />
                        </div>
                         <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Input defaultValue="Your Central AI Command Hub" />
                        </div>
                        <Button variant="outline">Set App Logo & Brand Colors</Button>
                        <Button variant="outline">Set Workspace Wallpaper</Button>
                        <Button variant="outline">Customize Typography</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline">Manage Favorite Rooms</Button>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="fav-panel">Favourites Panel Visibility</Label>
                            <Switch id="fav-panel" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Access Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Button variant="outline">Manage Multiple Brands</Button>
                    </CardContent>
                </Card>
            </div>
        )
      case 'cortex':
         return (
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cortex AI Brain</CardTitle>
                        <CardDescription>Configure your global AI assistant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>LLM Model Selection</Label>
                            <Select defaultValue="gpt4o">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt4o">GPT-4o</SelectItem>
                                    <SelectItem value="claude">Claude 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="memory">Memory (Save/Forget Context)</Label>
                            <Switch id="memory" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="file-upload">File Upload</Label>
                            <Switch id="file-upload" defaultChecked />
                        </div>
                         <div className="space-y-2">
                            <Label>Default Prompt Style</Label>
                            <Select defaultValue="casual">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="formal">Formal</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="tactical">Tactical</SelectItem>
                                    <SelectItem value="copywriting">Copywriting</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline">View Prompt History</Button>
                         <div className="space-y-2">
                            <Label>Custom LLM API Key</Label>
                            <Input type="password" placeholder="Enter your API key" />
                        </div>
                    </CardContent>
                </Card>
            </div>
         )
      case 'tasks':
        return (
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Task Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Default View</Label>
                            <Select defaultValue="board">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="list">List</SelectItem>
                                    <SelectItem value="board">Board</SelectItem>
                                    <SelectItem value="calendar">Calendar</SelectItem>
                                    <SelectItem value="gantt">Gantt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <Button variant="outline">Set Priority Colors</Button>
                         <Button variant="outline">Manage Task Categories</Button>
                         <div className="space-y-2">
                            <Label>Daily Task Limit</Label>
                            <Input type="number" defaultValue="10" />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="auto-rollover">Auto-Roll Over Incomplete Tasks</Label>
                            <Switch id="auto-rollover" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="ai-suggestions">AI Task Suggestions</Label>
                            <Switch id="ai-suggestions" defaultChecked />
                        </div>
                        <Button variant="outline">Manage Task Templates</Button>
                    </CardContent>
                </Card>
            </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Settings for <span className="font-semibold">{activeCategory}</span> are coming soon.</p>
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
            <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-1">
                        <p className="p-2 text-xs font-semibold text-muted-foreground">Global</p>
                        {settingCategories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2"
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon} {cat.label}
                            </Button>
                        ))}
                         <p className="p-2 pt-4 text-xs font-semibold text-muted-foreground">Room Specific</p>
                        {roomSettingCategories.map(cat => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2"
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon} {cat.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
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
