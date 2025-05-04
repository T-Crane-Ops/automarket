"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSubscription } from "@/hooks/useSubscription"
import { useTrialStatus } from "@/hooks/useTrialStatus"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    onClick?: () => void
    isActive?: boolean
  }[]
}) {
  const router = useRouter()
  const { user } = useAuth()
  const { subscription } = useSubscription()
  const { isInTrial } = useTrialStatus()

  const handleActionClick = () => {
    if (!user) {
      router.push('/login')
    } else if (subscription || isInTrial) {
      router.push('/dashboard')
    } else {
      router.push('/profile')
    }
  }

  const actionText = !user 
    ? "Sign In" 
    : subscription 
      ? "Start Building" 
      : isInTrial 
        ? "Start Free Trial" 
        : "View Subscription"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Action"
              onClick={handleActionClick}
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>{actionText}</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.url !== '#') {
                    router.push(item.url);
                  }
                }}
                className={cn(
                  item.isActive && "bg-primary/10 text-primary"
                )}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
