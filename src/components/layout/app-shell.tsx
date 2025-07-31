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
} from "@/components/ui/sidebar"
import {
  BrainCircuit,
  CircleDollarSign,
  KanbanSquare,
  LayoutDashboard,
  PenSquare,
  SendHorizonal,
  Users,
  Youtube,
} from "lucide-react"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients", icon: Users, label: "Clients" },
  { href: "/outreach", icon: SendHorizonal, label: "Outreach" },
  { href: "/projects", icon: KanbanSquare, label: "Projects" },
  { href: "/finance", icon: CircleDollarSign, label: "Finance" },
  { href: "/content", icon: PenSquare, label: "Content" },
  { href: "/youtube-studio", icon: Youtube, label: "YouTube Studio" },
  { href: "/ai-room", icon: BrainCircuit, label: "AI Room" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-7 text-primary" />
            <span className="text-lg font-semibold">BizMaster AI</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
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
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
             <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@fozan" data-ai-hint="man portrait" />
              <AvatarFallback>FS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Fozan Shazad</span>
                <span className="text-xs text-muted-foreground">Entrepreneur</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
