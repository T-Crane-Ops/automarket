import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoCard } from "@/components/landingpage/(bento)/bento-grid";
import {
  FileText,
  Database,
  Globe,
  BarChart3,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Enhanced feature data with more detailed descriptions
const features = [
  {
    Icon: FileText,
    name: "AI-Powered Ad Generation",
    description: "Create compelling car ads in seconds with our advanced AI engine that understands your inventory and targets your audience.",
    href: "/features/ai-ads",
    cta: "Explore AI",
    background: null,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Database,
    name: "Automated Inventory Sync",
    description: "Keep your listings up-to-date effortlessly with real-time synchronization across all of your marketplace platforms.",
    href: "/features/inventory-sync",
    cta: "Learn more",
    background: null,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Globe,
    name: "Marketplace Integration",
    description: "Publish ads across multiple platforms with a single click, reaching more potential buyers with less effort.",
    href: "/features/marketplace-integration",
    cta: "View platforms",
    background: null,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BarChart3,
    name: "Performance Analytics",
    description: "Track your ad performance with real-time data visualization and gain valuable insights to optimize your sales strategy.",
    href: "/features/analytics",
    cta: "See analytics",
    background: null,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Lead Management",
    description: "Capture and manage leads effectively with automated follow-ups, prioritization, and customer relationship tracking.",
    href: "/features/lead-management",
    cta: "Explore CRM",
    background: null,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoGridSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5" />
      
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge 
            variant="outline" 
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm hover:border-primary/40 hover:bg-primary/15"
          >
            AutoMarket Features
          </Badge>
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Discover the Power of AutoMarket
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            Streamline your automotive business with our powerful tools designed specifically for dealerships and car sellers
          </p>
        </div>
        
        <div className="mx-auto mt-12 max-w-screen-xl rounded-3xl bg-background/50 backdrop-blur-sm border border-primary/10 p-6 lg:p-8">
          <BentoGrid className="max-w-full mx-auto md:auto-rows-[20rem] lg:grid-rows-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className={cn(feature.className)}
              >
                <BentoCard
                  name={feature.name}
                  description={feature.description}
                  href={feature.href}
                  cta={feature.cta}
                  background={feature.background}
                  Icon={feature.Icon}
                  className="h-full w-full"
                />
              </div>
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
