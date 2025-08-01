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
  SidebarSeparator,
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
import { Icons } from "../icons"

const favouritesNavItems = [
  { href: "/ai-room", icon: BrainCircuit, label: "Crifohay" },
  { href: "/research", icon: Search, label: "Research" },
]

const essentialsNavItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/notes", icon: Notebook, label: "Notes" },
  { href: "/gm", icon: MessageSquare, label: "GM" },
  { href: "/clients", icon: Users, label: "Client" },
  { href: "/projects", icon: KanbanSquare, label: "Projects" },
  { href: "/finance", icon: CircleDollarSign, label: "Finance" },
]

const contentCreationNavItems = [
  { href: "/content", icon: PenSquare, label: "Content" },
  { href: "/youtube-studio", icon: Youtube, label: "Studio" },
  { href: "/outreach", icon: SendHorizonal, label: "Outreach" },
]

function Clock() {
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

  return <div className="text-sm font-medium text-muted-foreground">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>;
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center gap-2">
            <Icons.logo className="w-8 h-8 text-white group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 transition-all group-data-[state=expanded]:hidden"/>
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Nexaris Media</span>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup className="mt-4">
             <SidebarGroupLabel>Favourites</SidebarGroupLabel>
            <SidebarMenu>
              {favouritesNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
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
            <SidebarGroupLabel>Essentials</SidebarGroupLabel>
            <SidebarMenu>
              {essentialsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
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
            <SidebarGroupLabel>Content Creation</SidebarGroupLabel>
            <SidebarMenu>
              {contentCreationNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
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
                    <AvatarImage src="https://placehold.co/40x40.png" alt="@fozan" data-ai-hint="man portrait" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <div className="flex-col items-start group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-foreground">Fozan Shazad</span>
                      <span className="text-xs text-muted-foreground">Entrepreneur</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 bg-sidebar/80 backdrop-blur-md px-4 sm:px-6">
            <SidebarTrigger />
             <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
            </div>
            <div className="flex-1" />
            <Clock />
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
