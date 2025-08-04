
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
import { useSettings, type SettingCategory } from "@/hooks/use-settings"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}


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
    { id: 'gm', label: 'GM Room', icon: <MessageSquare/> },
    { id: 'clients', label: 'Clients', icon: <Users/> },
    { id: 'projects', label: 'Projects', icon: <KanbanSquare/> },
    { id: 'outreach', label: 'Outreach', icon: <SendHorizonal/> },
    { id: 'finance', label: 'Finance', icon: <CircleDollarSign/> },
    { id: 'offerBuilder', label: 'Offer Builder', icon: <Package/> },
    { id: 'assetTracker', label: 'Asset Tracker', icon: <Archive/> },
    { id: 'brandRoom', label: 'Brand Room', icon: <Palette/> },
    { id: 'pipelineTracker', label: 'Pipeline Tracker', icon: <View/> },
    { id: 'autoDocs', label: 'AutoDocs', icon: <FileText/> },
    { id: 'templateBuilder', label: 'Template Builder', icon: <LayoutTemplate/> },
    { id: 'integrationHub', label: 'Integration Hub', icon: <Blocks/> },
    { id: 'contentStudio', label: 'Content Creation', icon: <Youtube/> },
]


export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const { settings, setSetting } = useSettings();
  const [activeCategory, setActiveCategory] = React.useState<SettingCategory>('universal')

  const renderContent = () => {
    switch (activeCategory) {
      case 'universal':
        return (
             <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <p className="text-sm text-muted-foreground">Select how the application should look.</p>
                            <div className="flex gap-2 mt-2">
                                <Button variant={theme === "light" ? "secondary" : "outline"} onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" /> Light</Button>
                                <Button variant={theme === "dark" ? "secondary" : "outline"} onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" /> Dark</Button>
                                <Button variant={theme === "system" ? "secondary" : "outline"} onClick={() => setTheme("system")}><Laptop className="mr-2 h-4 w-4" /> System</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Sidebar Layout</Label>
                             <Select value={settings.sidebarLayout} onValueChange={(v) => setSetting('sidebarLayout', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="expanded">Expanded</SelectItem><SelectItem value="minimal">Minimal Icons</SelectItem><SelectItem value="hidden">Hidden</SelectItem></SelectContent></Select>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>General</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><Label htmlFor="autosave">Autosave</Label><Switch id="autosave" checked={settings.autosave} onCheckedChange={(c) => setSetting('autosave', c)}/></div>
                        <div className="space-y-2">
                            <Label>Time Format</Label>
                            <Select value={settings.timeFormat} onValueChange={(v) => setSetting('timeFormat', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="12hr">12-hour</SelectItem><SelectItem value="24hr">24-hour</SelectItem></SelectContent></Select>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Productivity</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <Button variant="outline">View Keyboard Shortcuts</Button>
                        <div className="flex items-center justify-between"><Label htmlFor="ai-assist">AI Assistant</Label><Switch id="ai-assist" checked={settings.aiAssistant} onCheckedChange={(c) => setSetting('aiAssistant', c)}/></div>
                        <div className="flex items-center justify-between"><Label htmlFor="quick-sync">Quick Sync</Label><Switch id="quick-sync" checked={settings.quickSync} onCheckedChange={(c) => setSetting('quickSync', c)}/></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Data & Export</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <Label>Default Export Format</Label>
                        <Select value={settings.exportOptions} onValueChange={(v) => setSetting('exportOptions', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="docx">.docx</SelectItem><SelectItem value="csv">.csv</SelectItem><SelectItem value="png">PNG Screenshot</SelectItem></SelectContent></Select>
                    </CardContent>
                </Card>
            </div>
        )
      case 'workspace':
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Global app settings for your workspace.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Workspace Name</Label><Input value={settings.workspaceName} onChange={(e) => setSetting('workspaceName', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Tagline</Label><Input value={settings.tagline} onChange={(e) => setSetting('tagline', e.target.value)} /></div>
                        <Button variant="outline">Set App Logo & Brand Colors</Button>
                        <Button variant="outline">Set Workspace Wallpaper</Button>
                        <Button variant="outline">Customize Typography Settings</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Navigation</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline">Manage Favorite Rooms</Button>
                        <div className="flex items-center justify-between"><Label htmlFor="fav-panel">Favourites Panel Visibility</Label><Switch id="fav-panel" checked={settings.favouritesPanelVisibility} onCheckedChange={(c) => setSetting('favouritesPanelVisibility', c)} /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Access Control</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label>Room Access Control</Label>
                           <Select value={settings.roomAccessControl} onValueChange={(v) => setSetting('roomAccessControl', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="private">Private</SelectItem><SelectItem value="shared">Shared</SelectItem><SelectItem value="team">Team View</SelectItem></SelectContent></Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
      case 'profile':
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Manage your public profile information.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={settings.userAvatar} />
                            <AvatarFallback>{settings.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2 flex-1">
                               <Label>Avatar URL</Label>
                               <Input value={settings.userAvatar} onChange={(e) => setSetting('userAvatar', e.target.value)} />
                           </div>
                       </div>
                       <div className="space-y-2">
                           <Label>Full Name</Label>
                           <Input value={settings.userName} onChange={(e) => setSetting('userName', e.target.value)} />
                       </div>
                        <div className="space-y-2">
                           <Label>Email Address</Label>
                           <Input type="email" value={settings.userEmail} onChange={(e) => setSetting('userEmail', e.target.value)} />
                       </div>
                       <Button variant="outline">Change Password</Button>
                    </CardContent>
                </Card>
            </div>
        )
      case 'notifications':
        return (
             <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Manage how you receive notifications.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center justify-between">
                           <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                           <Switch id="desktop-notifications" checked={settings.desktopNotifications} onCheckedChange={(c) => setSetting('desktopNotifications', c)} />
                       </div>
                        <div className="space-y-2">
                           <Label>Email Notifications</Label>
                           <Select value={settings.emailNotifications} onValueChange={(v) => setSetting('emailNotifications', v as any)}>
                             <SelectTrigger><SelectValue/></SelectTrigger>
                             <SelectContent>
                               <SelectItem value="all">All</SelectItem>
                               <SelectItem value="mentions">Mentions & Important</SelectItem>
                               <SelectItem value="none">None</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
      case 'cortex':
         return (
             <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Cortex AI Brain</CardTitle><CardDescription>Configure your global AI assistant.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>LLM Model Selection</Label><Select value={settings.llmModel} onValueChange={(v) => setSetting('llmModel', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="gpt4o">GPT-4o</SelectItem><SelectItem value="claude">Claude 3</SelectItem></SelectContent></Select></div>
                        <div className="flex items-center justify-between"><Label htmlFor="memory">Memory (Save/Forget Context)</Label><Switch id="memory" checked={settings.cortexMemory} onCheckedChange={(c) => setSetting('cortexMemory', c)} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="file-upload">File Upload</Label><Switch id="file-upload" checked={settings.fileUpload} onCheckedChange={(c) => setSetting('fileUpload', c)} /></div>
                        <div className="space-y-2"><Label>Default Prompt Style</Label><Select value={settings.promptStyle} onValueChange={(v) => setSetting('promptStyle', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="formal">Formal</SelectItem><SelectItem value="casual">Casual</SelectItem><SelectItem value="tactical">Tactical</SelectItem><SelectItem value="copywriting">Copywriting</SelectItem></SelectContent></Select></div>
                        <Button variant="outline">View Prompt History</Button>
                        <div className="space-y-2"><Label>Custom LLM API Key</Label><Input type="password" value={settings.llmApiKey} onChange={(e) => setSetting('llmApiKey', e.target.value)} placeholder="Enter your API key" /></div>
                    </CardContent>
                </Card>
            </div>
         )
      case 'tasks':
        return (
            <div className="space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Task Management</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Default View</Label><Select value={settings.tasksDefaultView} onValueChange={(v) => setSetting('tasksDefaultView', v as any)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="list">List</SelectItem><SelectItem value="board">Board</SelectItem><SelectItem value="calendar">Calendar</SelectItem><SelectItem value="gantt">Gantt</SelectItem></SelectContent></Select></div>
                        <Button variant="outline">Set Priority Colors</Button>
                        <Button variant="outline">Manage Task Categories</Button>
                        <div className="space-y-2"><Label>Daily Task Limit</Label><Input type="number" value={settings.dailyTaskLimit} onChange={(e) => setSetting('dailyTaskLimit', Number(e.target.value))} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="auto-rollover">Auto-Roll Over Incomplete Tasks</Label><Switch id="auto-rollover" checked={settings.autoRollover} onCheckedChange={(c) => setSetting('autoRollover', c)} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="ai-suggestions">AI Task Suggestions</Label><Switch id="ai-suggestions" checked={settings.aiTaskSuggestions} onCheckedChange={(c) => setSetting('aiTaskSuggestions', c)} /></div>
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
      <DialogContent className="max-w-5xl h-[80vh]">
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
                                {React.cloneElement(cat.icon, { className: 'h-4 w-4' })} {cat.label}
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
                                {React.cloneElement(cat.icon, { className: 'h-4 w-4' })} {cat.label}
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
