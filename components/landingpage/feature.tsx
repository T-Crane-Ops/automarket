"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, ChevronRightIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder data (consider making this dynamic via props)
const featuresData = {
  mainFeature: {
    category: "AI-Powered Insights",
    title: "Understand Your Market Like Never Before",
    description: "Leverage AI to analyze market trends, optimize pricing, and predict demand, giving you a competitive edge.",
    link: "#",
    imageAlt: "Graph showing market analysis data",
  },
  subFeature1: {
    category: "Streamlined Workflow",
    title: "Automate Listing Creation",
    link: "#",
    imageAlt: "Screenshot of automated listing creation interface",
  },
  subFeature2: {
    category: "Inventory Management",
    title: "Intelligent Stock Control",
    link: "#",
    imageAlt: "Dashboard showing vehicle inventory levels",
  },
};

export function FeatureGridSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm hover:border-primary/40 hover:bg-primary/15"
          >
            <LayoutGrid className="h-3 w-3 mr-1.5" />
            Core Features
          </Badge>
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Built for Performance & Efficiency
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg">
            Explore the tools designed to boost your dealership's success.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-screen-xl rounded-3xl bg-background/50 backdrop-blur-sm border border-primary/10 p-6 lg:p-8">
          <div className="grid max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-7">
            <div className="col-span-7 sm:col-span-7 lg:col-span-7">
              <Link
                href={featuresData.mainFeature.link}
                className={cn(
                  "grid overflow-hidden rounded-xl bg-background/60 backdrop-blur-sm shadow-sm",
                  "sm:grid-cols-2 border border-border/50 hover:border-border/70"
                )}
              >
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                  <div>
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {featuresData.mainFeature.category}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground lg:text-2xl">
                      {featuresData.mainFeature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground lg:text-base">
                      {featuresData.mainFeature.description}
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full px-5 py-2 text-sm font-medium shadow-sm border border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:border-primary/70"
                    >
                      Learn more
                      <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-span-7 lg:col-span-3">
              <Link
                href={featuresData.subFeature1.link}
                className="relative block h-full overflow-hidden rounded-xl bg-background/60 backdrop-blur-sm shadow-sm border border-border/50 hover:border-border/70"
              >
                <div className="p-6">
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {featuresData.subFeature1.category}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground lg:text-xl">
                    {featuresData.subFeature1.title}
                  </h3>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full border border-transparent bg-transparent text-primary backdrop-blur-sm hover:bg-primary/10 hover:border-primary/20 opacity-50"
                      aria-label="Learn more"
                  >
                      <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                </div>
              </Link>
            </div>

            <div className="col-span-7 sm:col-span-7 lg:col-span-4">
              <Link
                href={featuresData.subFeature2.link}
                className={cn(
                  "grid overflow-hidden h-full rounded-xl bg-background/60 backdrop-blur-sm shadow-sm",
                  "sm:grid-cols-2 border border-border/50 hover:border-border/70"
                )}
              >
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                  <div>
                    <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {featuresData.subFeature2.category}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground lg:text-2xl">
                      {featuresData.subFeature2.title}
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full px-5 py-2 text-sm font-medium shadow-sm border border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:border-primary/70"
                    >
                      Learn more
                      <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
