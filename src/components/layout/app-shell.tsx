

"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Client, Deal, Project, Note } from "@/lib/types"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from '@/lib/auth';


import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  BrainCircuit,
  CircleDollarSign,
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  PenSquare,
  Search,
  SendHorizonal,
  Users,
  Youtube,
  Settings,
  LogOut,
  Bell,
  ListTodo,
  Notebook,
  FileText,
  LayoutTemplate,
  Blocks,
  GanttChartSquare,
  Network,
  Target,
  FlaskConical,
  View,
  Shield,
  Package,
  Archive,
  Palette,
  Building,
  Workflow,
  Sparkles,
  Wrench,
  HelpCircle,
  User,
  Image as ImageIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Icons } from "../icons"
import { SettingsDialog } from "./settings-dialog"
import { useSettings } from "@/hooks/use-settings"
import { PageHeader } from "../page-header"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useRouter } from "next/navigation"

export const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", description: "A high-level overview of your business." },
    { href: "/ai-room", icon: BrainCircuit, label: "AI Room", description: "Your custom-trained AI business advisor." },
    { href: "/tasks", icon: ListTodo, label: "Tasks", description: "Create and manage your tasks and to-do lists." },
    { href: "/notes", icon: Notebook, label: "Notes", description: "Create and manage your notes. They are saved automatically." },
    { href: "/gm", icon: MessageSquare, label: "GM Room", description: "Say GM to the community. Your message will be visible to all users." },
    { href: "/clients", icon: Users, label: "Client Command Center", description: "A mini-CRM to manage your clients and their status." },
    { href: "/projects", icon: KanbanSquare, label: "Project Board", description: "Kanban-style task management for your projects." },
    { href: "/outreach", icon: SendHorizonal, label: "AI Outreach Engine", description: "Generate high-converting cold outreach copy." },
    { href: "/finance", icon: CircleDollarSign, label: "Finance Room", description: "Track your revenue, expenses, and profitability." },
    { href: "/offer-builder", icon: Package, label: "Offer Builder", description: "Visually develop and test new products or services." },
    { href: "/asset-tracker", icon: Archive, label: "Asset Tracker", description: "A central vault for all your digital and brand assets." },
    { href: "/brand-room", icon: Palette, label: "Brand Room", description: "Codify and expand your brand's identity." },
    { href: "/pipeline-tracker", icon: View, label: "Pipeline Tracker", description: "Visual status boards for your sales deals." },
    { href: "/research", icon: Search, label: "Research Assistant", description: "Leverage AI and Wikipedia to get comprehensive answers." },
    { href: "/cortex-room", icon: Target, label: "Cortex Room", description: "The interface for linking your goals to your strategy and tasks." },
    { href: "/autodocs", icon: FileText, label: "AutoDocs", description: "Generate summaries, briefs, or documentation automatically." },
    { href: "/template-builder", icon: LayoutTemplate, label: "Template Builder", description: "Create, customize, and reuse templates across all rooms." },
    { href: "/integration-hub", icon: Blocks, label: "Integration Hub", description: "Connect and sync with external tools for real-time updates." },
    { href: "/content", icon: PenSquare, label: "Content Scheduler", description: "Plan and auto-generate social media content." },
    { href: "/youtube-studio", icon: Youtube, label: "YouTube Studio", description: "A full creative suite to generate video scripts and media." },
    { href: "/thumbnail", icon: ImageIcon, label: "Thumbnail Generator", description: "Generate and refine thumbnails with AI." },
];


const favouritesNavItems = [
  { href: "/ai-room", icon: BrainCircuit, label: "Crifohay" },
  { href: "/research", icon: Search, label: "Research" },
]

const mainNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/tasks", icon: ListTodo, label: "Tasks" },
    { href: "/notes", icon: Notebook, label: "Notes" },
    { href: "/gm", icon: MessageSquare, label: "GM" },
    { href: "/clients", icon: Users, label: "Client" },
    { href: "/projects", icon: KanbanSquare, label: "Projects" },
    { href: "/outreach", icon: SendHorizonal, label: "Outreach" },
    { href: "/finance", icon: CircleDollarSign, label: "Finance" },
]

const businessBuilderNavItems = [
  { href: "/offer-builder", icon: Package, label: "Offer Builder" },
  { href: "/asset-tracker", icon: Archive, label: "Asset Tracker" },
  { href: "/brand-room", icon: Palette, label: "Brand Room" },
  { href: "/pipeline-tracker", icon: View, label: "Pipeline Tracker" },
]

const aiAdvantageNavItems = [
    { href: "https://miro.com/app/dashboard/", icon: Network, label: "Miro", external: true },
    { href: "/cortex-room", icon: Target, label: "Cortex Room" },
]

const utilityNavItems = [
  { href: "/autodocs", icon: FileText, label: "AutoDocs" },
  { href: "/template-builder", icon: LayoutTemplate, label: "Template Builder" },
  { href: "/integration-hub", icon: Blocks, label: "Integration Hub" },
  { href: "https://make.com", icon: Workflow, label: "Make.com", external: true },
]

const contentCreationNavItems = [
  { href: "/content", icon: PenSquare, label: "Content" },
  { href: "/youtube-studio", icon: Youtube, label: "Studio" },
  { href: "/thumbnail", icon: ImageIcon, label: "Thumbnail" },
]

function LiveClock() {
  const { settings } = useSettings();
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return null;
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: settings.timeFormat === '12hr',
  };

  return <div className="text-sm font-medium text-muted-foreground">{time.toLocaleTimeString([], formatOptions)}</div>;
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);
  const pathname = usePathname()
  const router = useRouter()
  const { settings, setSetting } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  
  // States for searchable data
  const [clients, setClients] = React.useState<Client[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    // Load searchable data from localStorage
    try {
      const savedClients = localStorage.getItem("clients");
      if (savedClients) setClients(JSON.parse(savedClients));
      
      const savedProjects = localStorage.getItem("projects");
      if (savedProjects) setProjects(Object.values(JSON.parse(savedProjects)).flat() as Project[]);

      const savedDeals = localStorage.getItem("deals");
      if (savedDeals) setDeals(JSON.parse(savedDeals));

      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

    } catch (error) {
      console.error("Failed to load searchable data from local storage", error);
    }

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen((open) => !open)
      }
      
      // Handle custom room shortcuts
      if (settings.roomShortcuts) {
        for (const href in settings.roomShortcuts) {
            const shortcut = settings.roomShortcuts[href];
             if (shortcut && e.key.toLowerCase() === shortcut.toLowerCase() && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                router.push(href);
            }
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [settings.roomShortcuts, router])
  
  const sidebarOpen = settings.sidebarLayout === 'expanded';
  const setSidebarOpen = (isOpen: boolean) => {
      setSetting('sidebarLayout', isOpen ? 'expanded' : 'minimal');
  }

  const currentPage = navLinks.find(link => pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/'));
  
  const runCommand = (command: () => void) => {
    setIsCommandOpen(false)
    command()
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar collapsible={settings.sidebarLayout === 'hidden' ? 'offcanvas' : 'icon'}>
        <SidebarHeader className="flex flex-col items-stretch gap-2">
            <div className="flex items-center gap-2">
                <Icons.logo className="w-8 h-8 text-white group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all"/>
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Nexaris Media</span>
            </div>
             <div className="relative group-data-[collapsible=icon]:hidden">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="w-full rounded-lg bg-background pl-8" 
                    onClick={() => setIsCommandOpen(true)}
                    readOnly
                 />
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="mt-4">
             <SidebarGroupLabel>Favourites</SidebarGroupLabel>
            <SidebarMenu>
              {favouritesNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-4">
             <SidebarGroupLabel>Business Builder</SidebarGroupLabel>
            <SidebarMenu>
              {businessBuilderNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-4">
             <SidebarGroupLabel>AI Advantage</SidebarGroupLabel>
            <SidebarMenu>
              {aiAdvantageNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  {item.external ? (
                     <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                       <SidebarMenuButton
                          isActive={false}
                          tooltip={item.label}
                          className="w-full"
                       >
                         <item.icon />
                         <span className="flex items-center justify-between w-full">
                            {item.label}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This opens Miro in a new tab.</p>
                                </TooltipContent>
                            </Tooltip>
                         </span>
                       </SidebarMenuButton>
                     </a>
                  ) : (
                    <Link href={item.href}>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
           <SidebarGroup className="mt-4">
             <SidebarGroupLabel>Utility / Automation</SidebarGroupLabel>
            <SidebarMenu>
              {utilityNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  {item.external ? (
                     <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                       <SidebarMenuButton
                          isActive={false}
                          tooltip={item.label}
                          className="w-full"
                       >
                         <item.icon />
                         <span className="flex items-center justify-between w-full">
                            {item.label}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>It opens Make.com</p>
                                </TooltipContent>
                            </Tooltip>
                         </span>
                       </SidebarMenuButton>
                     </a>
                  ) : (
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Content Creation</SidebarGroupLabel>
            <SidebarMenu>
              {contentCreationNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full h-auto p-2">
                 <div className="flex items-center gap-3">
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={user?.photoURL || undefined} />
                     <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                   </Avatar>
                  <div className="flex-col items-start group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-foreground">{user?.displayName || "User"}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Rooms">
                    {navLinks.map((link) => (
                       <CommandItem key={link.href} value={link.label} onSelect={() => runCommand(() => router.push(link.href))}>
                           <link.icon className="mr-2 h-4 w-4" />
                           <span>{link.label}</span>
                       </CommandItem>
                    ))}
                </CommandGroup>
                 <CommandGroup heading="Clients">
                    {clients.map((client) => (
                        <CommandItem key={`client-${client.id}`} value={`Client: ${client.name}`} onSelect={() => runCommand(() => router.push('/clients'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>{client.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Projects">
                    {projects.map((project) => (
                        <CommandItem key={`project-${project.id}`} value={`Project: ${project.title}`} onSelect={() => runCommand(() => router.push('/projects'))}>
                            <KanbanSquare className="mr-2 h-4 w-4" />
                            <span>{project.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                 <CommandGroup heading="Deals">
                    {deals.map((deal) => (
                        <CommandItem key={`deal-${deal.id}`} value={`Deal: ${deal.title}`} onSelect={() => runCommand(() => router.push('/pipeline-tracker'))}>
                            <View className="mr-2 h-4 w-4" />
                            <span>{deal.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                 <CommandGroup heading="Notes">
                    {notes.map((note) => (
                        <CommandItem key={`note-${note.id}`} value={`Note: ${note.title}`} onSelect={() => runCommand(() => router.push('/notes'))}>
                            <Notebook className="mr-2 h-4 w-4" />
                            <span>{note.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-background/80 backdrop-blur-md px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1 text-center">
                {currentPage && (
                    <>
                        <h1 className="text-lg font-semibold">{currentPage.label}</h1>
                        {currentPage.description && <p className="text-xs text-muted-foreground">{currentPage.description}</p>}
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
              <LiveClock />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell />
                    <span className="sr-only">Toggle notifications</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        You have no new notifications.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
