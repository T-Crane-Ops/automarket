"use client";

import { useState, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, Star, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans?: PricingPlan[];
  title?: string;
  description?: string;
}

// Default pricing plans
const defaultPricingPlans = [
  {
    name: "Basic",
    price: "19",
    yearlyPrice: "180",
    period: "month",
    description: "Perfect for small dealerships",
    features: [
      "10 active listings",
      "Basic AI ad generation",
      "Standard analytics",
      "Email support",
      "Social media sharing"
    ],
    buttonText: "Get Started",
    href: "/dashboard",
    isPopular: false
  },
  {
    name: "Pro",
    price: "49",
    yearlyPrice: "480",
    period: "month",
    description: "For growing dealerships",
    features: [
      "Unlimited listings",
      "Advanced AI ad generation",
      "Performance analytics",
      "Priority support",
      "Multi-platform integration"
    ],
    buttonText: "Start Trial",
    href: "/dashboard",
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "99",
    yearlyPrice: "960",
    period: "month",
    description: "For large auto groups",
    features: [
      "Custom implementation",
      "White-label solution",
      "API access",
      "Dedicated support",
      "Training sessions"
    ],
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false
  }
];

export function Pricing({
  plans = defaultPricingPlans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for your dealership\nAll plans include core features, updates, and support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
  };

  // Calculate savings
  const calculateSavings = (plan: PricingPlan) => {
    const monthly = parseFloat(plan.price);
    const yearly = parseFloat(plan.yearlyPrice) / 12; // Monthly equivalent
    const savings = ((monthly - yearly) / monthly) * 100;
    return Math.round(savings);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-primary/10 opacity-20" />
      <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full border border-primary/10 opacity-20" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge 
            variant="outline" 
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm hover:border-primary/40 hover:bg-primary/15"
          >
            <Sparkles className="h-3 w-3 mr-1.5" />
            Pricing Plans
          </Badge>
          
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {title}
          </h2>
          
          <p className="text-muted-foreground max-w-[600px] whitespace-pre-line text-lg">
            {description}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <span className={cn(
              "font-medium", 
              isMonthly ? "text-primary" : "text-muted-foreground"
            )}>
              Monthly
            </span>
            
            <div className="relative h-7 w-12 rounded-full p-1 bg-primary/10 flex items-center">
              <Switch
                ref={switchRef as any}
                checked={!isMonthly}
                onCheckedChange={handleToggle}
                className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-transparent"
              />
              <div 
                className={cn(
                  "absolute h-5 w-5 rounded-full bg-primary",
                  !isMonthly ? "left-[22px]" : "left-[4px]"
                )}
              />
            </div>
            
            <span className={cn(
              "font-medium", 
              !isMonthly ? "text-primary" : "text-muted-foreground"
            )}>
              Annually
              <span className="ml-1.5 py-0.5 px-1.5 text-xs rounded-full bg-primary/10 text-primary">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const savingsPercent = calculateSavings(plan);
              
              return (
                <div
                  key={index} 
                  onMouseEnter={() => setActivePlan(index)}
                  onMouseLeave={() => setActivePlan(null)}
                  className={cn(
                    "rounded-2xl border p-1 bg-background/50 backdrop-blur-sm relative flex flex-col h-full",
                    plan.isPopular 
                      ? "border-primary shadow-[0_5px_30px_rgba(22,163,74,0.3)]" 
                      : "border-primary/20 hover:border-primary/40"
                  )}
                >
                  {/* Card inner container */}
                  <div className="rounded-xl h-full flex flex-col p-6 relative z-10 bg-background/90">
                    {/* Popular badge */}
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary py-1 px-3 rounded-full flex items-center shadow-md text-primary-foreground backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        <span className="text-xs font-semibold">Popular</span>
                      </div>
                    )}
                    
                    {/* Plan header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="mt-2 flex items-end">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {isMonthly
                          ? Number(plan.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                          : Number(plan.yearlyPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                        }
                      </span>
                      {plan.period !== "Next 3 months" && (
                        <span className="ml-1 text-sm font-medium text-muted-foreground">
                          / {plan.period}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {isMonthly 
                        ? "billed monthly" 
                        : `billed annually (${savingsPercent}% savings)`
                      }
                    </p>

                    {/* Features */}
                    <ul className="mt-6 space-y-4 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 mt-0.5 flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action button */}
                    <Link
                      href={plan.href}
                      className={cn(
                        "mt-8 w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3 text-base font-semibold group shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        plan.isPopular 
                          ? "border border-primary/50 bg-primary text-primary-foreground backdrop-blur-sm hover:bg-primary/90 hover:border-primary/70"
                          : "border border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:border-primary/70",
                      )}
                    >
                      <span className="mr-2 relative z-10">{plan.buttonText}</span>
                      <ChevronRight 
                        className="h-4 w-4"
                      />
                    </Link>
                  </div>
                  
                  {/* Gradient border effect for popular plan */}
                  {plan.isPopular && (
                    <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-b from-primary/50 via-primary/30 to-primary/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Enterprise callout */}
        <div className="mt-16 mx-auto max-w-screen-md rounded-2xl border border-primary/20 p-8 bg-background/50 backdrop-blur-sm text-center">
          <h3 className="text-xl font-semibold mb-2">Need a custom solution?</h3>
          <p className="text-muted-foreground mb-4">
            Contact our sales team for enterprise pricing and tailored solutions.
          </p>
          <Link 
            href="/contact" 
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3 text-base font-semibold group shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:border-primary/70"
            )}
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
