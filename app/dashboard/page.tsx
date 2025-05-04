'use client'

import { useState, useCallback, memo } from "react"
import { AppSidebar } from "@/components/(dashboard)/(sidebar)/app-sidebar"
import { SiteHeader } from "@/components/(dashboard)/(navbar)/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProfilePage } from "@/components/(dashboard)/(settings)/Settings"

// Memoize the ProfilePage component to improve performance
const MemoizedProfilePage = memo(ProfilePage);

export default function Page() {
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard')

  // Memoize callbacks to prevent recreating functions on render
  const handleSettingsClick = useCallback(() => {
    setActiveView('settings')
  }, [])

  const handleBackToMain = useCallback(() => {
    setActiveView('dashboard')
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar 
          variant="inset" 
          onSettingsClick={handleSettingsClick}
          activeView={activeView}
        />
        <SidebarInset className="flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className={`flex flex-1 flex-col ${activeView === 'settings' ? 'px-0' : 'gap-2'}`}>
              {activeView === 'dashboard' ? (
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {/* Dashboard content goes here */}
                </div>
              ) : (
                <div className="flex-1 h-full pl-4 overflow-y-auto">
                  <MemoizedProfilePage 
                    isEmbedded={true} 
                    onBackToMain={handleBackToMain}
                  />
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
