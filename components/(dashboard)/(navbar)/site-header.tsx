"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSubscription } from "@/hooks/useSubscription"
import { useTrialStatus } from "@/hooks/useTrialStatus"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: { className?: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const { subscription } = useSubscription()
  const { isInTrial } = useTrialStatus()

  return (
    <header className={cn(
      "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-background sticky top-0 z-50",
      className
    )}>
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!user ? (
            <Button
              size="sm"
              onClick={() => router.push('/login')}
              className="px-4 py-1 text-sm font-medium"
            >
              Sign in
            </Button>
          ) : (
            <>
            
              {subscription ? (
                <span className="hidden md:inline-block text-sm font-medium text-green-600 dark:text-green-400">
                  Premium Access
                </span>
              ) : isInTrial ? (
                <span className="hidden md:inline-block text-sm font-medium text-amber-600 dark:text-amber-400">
                  Trial Access
                </span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="px-4 py-1 text-sm font-medium"
                >
                  View Subscription
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
