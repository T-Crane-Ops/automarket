"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, LogIn, User, Home, PieChart, GanttChartSquare, MessageSquareQuote, Contact, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
  logo?: string
  logoAlt?: string
}

// Updated navigation items to match the sections in page.tsx
const updatedNavItems = [
  { name: "Overview", url: "#overview", icon: Home },
  { name: "Features", url: "#features-grid", icon: LayoutGrid },
  { name: "Timeline", url: "#timeline", icon: GanttChartSquare },
  { name: "Testimonials", url: "#testimonials", icon: MessageSquareQuote },
  { name: "Pricing", url: "#pricing", icon: PieChart },
];

export function NavBar({ 
  items = updatedNavItems, 
  className, 
  logo = "/logo.png", 
  logoAlt = "Logo" 
}: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items?.[0]?.name ?? "")
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleResize()
    handleScroll()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed sm:bottom-auto sm:top-4 left-1/2 -translate-x-1/2 z-50 w-auto md:w-[95%] lg:w-[90%] transition-all duration-300",
        isScrolled ? "sm:top-2" : "sm:top-4",
        isMobile ? "bottom-6" : "",
        className,
      )}
    >
      <div className={cn(
        "flex items-center justify-between gap-4 bg-background/80 border border-primary/20 backdrop-blur-lg rounded-full shadow-[0_0_20px_rgba(22,163,74,0.15)] transition-all duration-300",
        isScrolled ? "py-1 px-3" : "py-2 px-4"
      )}>
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 md:h-10 md:w-10">
              <Image 
                src={logo} 
                alt={logoAlt} 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg hidden md:block text-foreground">AutoMarket</span>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 sm:gap-3 rounded-full bg-muted/30 px-1 py-1">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-colors",
                    "flex items-center justify-center gap-1.5",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <span className="md:hidden">
                    <Icon size={16} strokeWidth={2} className={isActive ? "text-primary" : ""} />
                  </span>
                  <span className="hidden md:inline">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href="/login"
            className={cn(
              "relative cursor-pointer text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-colors",
              "text-foreground/70 hover:text-primary hover:bg-primary/5 flex items-center justify-center gap-1.5"
            )}
          >
            <LogIn size={16} className="hidden sm:inline text-primary/70"/>
            <span className="hidden md:inline">Login</span>
            <LogIn size={16} className="sm:hidden text-primary/70"/>
          </Link>

          <Link
            href="/signup"
            className={cn(
              "relative cursor-pointer text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-colors",
              "text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center gap-1.5"
            )}
          >
            <User size={16} className="hidden sm:inline"/>
            <span className="hidden md:inline">Sign Up</span>
            <User size={16} className="sm:hidden"/>
          </Link>
        </div>
      </div>
    </div>
  )
}
