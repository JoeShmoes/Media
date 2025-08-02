

"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

const favouritesNavItems = [
  { href: "/ai-room", icon: BrainCircuit, label: "Crifohay" },
  { href: "/research", icon: Search, label: "Research" },
]

const mainNavItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
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
  const pathname = usePathname()
  const { settings, setSetting } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  
  const sidebarOpen = settings.sidebarLayout === 'expanded';
  const setSidebarOpen = (isOpen: boolean) => {
      setSetting('sidebarLayout', isOpen ? 'expanded' : 'minimal');
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar collapsible={settings.sidebarLayout === 'hidden' ? 'offcanvas' : 'icon'}>
        <SidebarHeader className="flex flex-col items-stretch gap-2">
            <div className="flex items-center gap-2">
                <Icons.logo className="w-8 h-8 text-white group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 transition-all group-data-[state=expanded]:hidden"/>
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Nexaris Media</span>
            </div>
             <div className="relative group-data-[collapsible=icon]:hidden">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8" />
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
                   <div className="h-8 w-8 flex items-center justify-center">
                    <User className="h-5 w-5"/>
                   </div>
                  <div className="flex-col items-start group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-foreground">Fozan Shazad</span>
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
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-sidebar/80 backdrop-blur-md px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
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
          </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
