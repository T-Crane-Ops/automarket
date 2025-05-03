"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, Sparkles } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup"; // Assuming these are custom components
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode; // Keep optional icon for flexibility
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"; // Use standard Shadcn variants + custom if needed
  onClick?: () => void;
  ariaLabel?: string; // Added for accessibility
}

interface HeroProps {
  badge?: {
    text: string;
    action?: { // Made action optional
      text: string;
      href: string;
    };
  };
  title?: string;
  description?: string;
  socialProof?: string;
  actions?: HeroAction[];
  image?: {
    src: string; // Changed from light to src for clarity
    alt: string;
  };
  backgroundImage?: string; // Added background image prop
}

// --- Default Content ---
const defaultHeroContent: Required<Omit<HeroProps, 'badge'>> & { badge?: HeroProps['badge'] } = {
  title: "Revolutionize Your Auto Dealership",
  description: "AutoMarket helps dealerships sell more vehicles with AI-powered listings, inventory management, and lead generation.",
  socialProof: "Trusted by over 1000 dealerships worldwide",
  badge: {
    text: "New Release",
    action: {
      text: "Learn more",
      href: "#features",
    },
  },
  actions: [
    {
      text: "Watch Demo",
      href: "#",
      variant: "default", // Use standard variant name
      ariaLabel: "Watch the AutoMarket demo video",
      icon: <ArrowRightIcon className="ml-1.5 h-4 w-4" /> // Added icon directly here
    },
    {
      text: "Start Free Trial",
      href: "/dashboard",
      variant: "outline",
      ariaLabel: "Start your free trial of AutoMarket",
    },
  ],
  image: {
    src: "/dashboard.png", // Using the actual image path
    alt: "Screenshot of the AutoMarket dashboard showcasing AI-powered features for car dealerships",
  },
  backgroundImage: "/hero.png", // Default background
};

// --- Component ---
export function HeroSection({
  badge = defaultHeroContent.badge,
  title = defaultHeroContent.title,
  description = defaultHeroContent.description,
  socialProof = defaultHeroContent.socialProof,
  actions = defaultHeroContent.actions,
  image = defaultHeroContent.image,
  backgroundImage = defaultHeroContent.backgroundImage,
}: HeroProps) {
  const titleWords = title.split(" ");

  return (
    <section
      className="relative py-24 sm:py-32 md:py-40 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      aria-labelledby="hero-title"
    >
      {/* Subtle overlay for better contrast */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50 z-0" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center gap-12 md:gap-16 text-center">
          {/* Content Block (Improved Glassmorphism) */}
          <div
            className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl p-8 md:p-14 border border-white/20 shadow-2xl flex flex-col items-center gap-5 max-w-4xl mx-auto" // Enhanced glassmorphism
          >
            {/* Badge */}
            {badge && (
              <div>
                <Badge
                  variant="outline"
                  className="bg-white/15 border-white/25 text-white px-3 py-1 backdrop-blur-md rounded-full text-sm font-medium shadow-sm" // Added subtle shadow
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-yellow-300 flex-shrink-0" /> {/* Changed icon color */}
                  <span className="mr-1">{badge.text}</span>
                  {badge.action && (
                     <a
                      href={badge.action.href}
                      className="flex items-center gap-0.5 text-white hover:text-white/80 font-medium ml-1 whitespace-nowrap" // Removed group, transition-colors
                    >
                      {badge.action.text}
                      <ArrowRightIcon className="h-3 w-3" />
                    </a>
                  )}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1
              id="hero-title"
              className="text-4xl font-bold md:text-6xl lg:text-7xl text-white leading-tight tracking-tighter"
              style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.4)' }} // Enhanced shadow
            >
              {titleWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="inline-block mr-2 md:mr-3 whitespace-nowrap" // Keep whitespace nowrap
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p
              className="max-w-xl text-neutral-100 text-lg md:text-xl leading-relaxed"
              style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)' }} // Enhanced shadow
            >
              {description}
            </p>

            {/* Social Proof */}
            {socialProof && (
              <p
                className="text-sm text-neutral-200 mt-1"
                style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' }}
              >
                {socialProof}
              </p>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div
                className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6"
              >
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    size="lg"
                    asChild
                    className={cn(
                      "rounded-full px-7 py-3 text-base font-semibold shadow-md", // Removed transitions and transforms
                      action.variant === 'default' && "bg-white text-teal-700 hover:bg-neutral-100", // Primary button
                      action.variant === 'outline' && "border border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/70" // Outline button - slightly increased border opacity
                    )}
                  >
                    <a href={action.href} onClick={action.onClick} aria-label={action.ariaLabel}>
                      {action.text}
                      {action.icon && <ArrowRightIcon className="ml-1.5 h-4 w-4" />}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Image Container - Improved */}
          {image && (
            <div
              className="relative w-full max-w-screen-xl mx-auto" // Adjusted max-width to match BentoGridSection
            >
              {/* Refined styling for the image frame to match BentoGrid padding (p-6 lg:p-8) */}
              <div className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/20 backdrop-blur-lg overflow-hidden">
                 <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-inner bg-black/30">
                   <Image
                     src={image.src}
                     alt={image.alt}
                     fill
                     className="object-cover"
                     priority
                     sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1024px"
                   />
                 </div>
              </div>  
            </div>
          )}
        </div>
      </div>
    </section>
  );
}