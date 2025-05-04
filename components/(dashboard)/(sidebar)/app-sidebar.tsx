"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react"

import { NavMain } from "@/components/(dashboard)/(navbar)/nav-main"
import { NavSecondary } from "@/components/(dashboard)/(navbar)/nav-secondary"
import { NavUser } from "@/components/(dashboard)/(navbar)/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onSettingsClick?: () => void;
  activeView?: 'dashboard' | 'settings';
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ onSettingsClick, activeView = 'dashboard', ...props }: AppSidebarProps) {
  const navMainWithActive = data.navMain.map(item => ({
    ...item,
    isActive: item.title === "Dashboard" && activeView === 'dashboard'
  }));

  const navSecondaryWithHandler = data.navSecondary.map(item => ({
    ...item,
    onClick: item.title === "Settings" ? onSettingsClick : undefined,
    isActive: item.title === "Settings" && activeView === 'settings'
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">AutoMarket</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavSecondary items={navSecondaryWithHandler} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
