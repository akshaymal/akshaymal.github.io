"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User, Briefcase, FolderGit2 } from "lucide-react"
import Image from "next/image"

const menuItems = [
  {
    title: "About Me",
    url: "#about",
    icon: User,
  },
  {
    title: "Experience",
    url: "#experience",
    icon: Briefcase,
  },
  {
    title: "Projects",
    url: "#projects",
    icon: FolderGit2,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {state === "expanded" ? (
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold">Akshay Malhotra</h2>
            <p className="text-sm text-muted-foreground">Portfolio</p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <Image
              src="/assets/logo2.png"
              alt="AM"
              width={32}
              height={32}
              className="w-8 h-8 shrink-0"
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {state === "expanded" && (
          <div className="px-4 py-2 text-xs text-muted-foreground">
            <p>© 2025 Akshay Malhotra</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
