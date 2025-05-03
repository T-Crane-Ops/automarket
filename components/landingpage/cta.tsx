"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles } from "lucide-react"

interface CTAProps {
  badge?: {
    text: string
  }
  title?: string
  description?: string
  action?: {
    text: string
    href: string
    variant?: "default" | "link" | "secondary" | "destructive" | "outline" | "minimal" | "ghost"
  }
  withGlow?: boolean
  className?: string
}

// Default CTA content
const defaultCTAContent = {
  title: "Ready to Boost Your Dealership?",
  description: "Join thousands of successful dealerships already using AutoMarket",
  badge: { text: "Limited Time Offer" },
  action: {
    text: "Start Free 14-Day Trial",
    href: "/dashboard",
    variant: "default" as "default" | "link" | "secondary" | "destructive" | "outline" | "minimal" | "ghost"
  }
};

export function CTASection({
  badge = defaultCTAContent.badge,
  title = defaultCTAContent.title,
  description = defaultCTAContent.description,
  action = defaultCTAContent.action,
  withGlow = true,
  className,
}: CTAProps) {
  return (
    <section className={cn("py-16 sm:py-20 md:py-24 relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60" />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="mx-auto max-w-screen-xl rounded-3xl overflow-hidden">
          <div className="relative group">
            {/* Background with animated gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background z-0">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)] opacity-20"></div>
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-[100px] opacity-70" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-[100px] opacity-70" />
              </div>
            </div>

            <div className="relative z-10 flex max-w-container flex-col items-center gap-6 sm:gap-8 py-16 sm:py-20 px-6 text-center">
              {/* Badge */}
              {badge && (
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm hover:border-primary/40 hover:bg-primary/15"
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    <span className="text-sm">{badge.text}</span>
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl font-bold md:text-5xl max-w-2xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                {title}
              </h2>

              {/* Description */}
              {description && (
                <p className="text-muted-foreground max-w-[600px] text-lg">
                  {description}
                </p>
              )}

              {/* Action Button */}
              <div className="mt-4 relative">
                <Button
                  variant={action.variant || "default"}
                  size="lg"
                  className="rounded-full px-7 py-3 text-base font-semibold shadow-md border border-primary/50 bg-primary/80 text-primary-foreground backdrop-blur-sm hover:bg-primary/90 hover:border-primary/70"
                  asChild
                >
                  <a href={action.href} className="flex items-center gap-2">
                    {action.text}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full border border-primary/20 opacity-50" />
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full border border-primary/20 opacity-50" />
              
              {/* Glow Effect */}
              {withGlow && (
                <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_80px_rgba(22,163,74,0.25)] opacity-70" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
