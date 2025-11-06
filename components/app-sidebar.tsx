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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User, Briefcase, FolderGit2, Heart, ChevronRight, Flag, Car, Gamepad2, Trophy, BookOpen, MountainSnow , Github as GitHubIcon, Linkedin as LinkedInIcon, Instagram as InstagramIcon, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "About Me",
    url: "/",
    icon: User,
  },
  {
    title: "Experience",
    url: "/experience",
    icon: Briefcase,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderGit2,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {state === "expanded" ? (
          <div className="px-4 py-3">
            <h2 className="text-2xl font-semibold">Akshay Malhotra</h2>
            <p className="text-base text-muted-foreground">Portfolio</p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <Image
              src="/assets/logo.png"
              alt="AM"
              width={40}
              height={40}
              className="w-10 h-10 shrink-0"
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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Hobbies">
                      <Heart />
                      <span>Hobbies</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/hobbies/race-marshal">
                            <Flag />
                            <span>Race Marshal</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/hobbies/karting">
                            <Car />
                            <span>Karting</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/hobbies/travel">
                            <MountainSnow  />
                            <span>Travelling</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/hobbies/sim-racing">
                            <Gamepad2 />
                            <span>Sim Racing</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/hobbies/motorsports">
                            <Trophy />
                            <span>Motorsports</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Blog">
                  <Link href="/blog">
                    <BookOpen />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-3">
          {state === "expanded" ? (
            <>
              <div className="flex justify-center gap-2 mb-3">
                <a
                  href="https://github.com/akshaymal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/akshaymal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/akshaymal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu"
                  className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  aria-label="Contact"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                <p>© 2025 Akshay Malhotra</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <a
                href="https://github.com/akshaymal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/akshaymal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/akshaymal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:malhotraakshay1997@gmail.com,amalho23@asu.edu"
                className="flex items-center justify-center rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
