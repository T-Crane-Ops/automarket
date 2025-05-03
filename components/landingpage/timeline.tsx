import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Data defining each phase of the timeline (color property removed)
const timelineData = [
  {
    value: "phase1",
    title: "Discover",
    date: "Day 1",
    heading: "Initial Consultation",
    description:
      "We'll discuss your business needs, analyze your current automotive sales strategy, and identify key opportunities for improvement with our platform.",
    buttonText: "Learn about",
    downloadText: "our discovery process",
  },
  {
    value: "phase2",
    title: "Setup",
    date: "Week 1",
    heading: "Platform Integration",
    description:
      "Our technical team handles your account setup, inventory synchronization, and marketplace integrations. We ensure your data is secure and properly configured.",
    buttonText: "Explore",
    downloadText: "the setup process",
  },
  {
    value: "phase3",
    title: "Launch",
    date: "Week 2",
    heading: "Go Live",
    description:
      "With everything configured, your AutoMarket-powered listings go live across all connected platforms. We monitor performance to ensure a smooth launch phase.",
    buttonText: "See how",
    downloadText: "we ensure a successful launch",
  },
  {
    value: "phase4",
    title: "Optimize",
    date: "Ongoing",
    heading: "Growth & Optimization",
    description:
      "Our AI continuously optimizes your listings and marketing strategy based on performance data, helping you maximize conversions and ROI month after month.",
    buttonText: "Discover",
    downloadText: "continuous optimization",
  },
];

// Removed the colorMappings object as we now use the default primary theme

export default function TimelineSection() {
  const [activePhase, setActivePhase] = useState(timelineData[0].value); // Default to the first phase

  const handlePhaseChange = (value: string) => {
    setActivePhase(value);
  };

  // Find the index of the currently active phase for the progress bar
  const activeIndex = timelineData.findIndex(phase => phase.value === activePhase);

  // Default theme classes based on 'primary' color
  const theme = {
      light: "from-primary/15 to-primary/5",
      medium: "bg-primary/10",
      border: "border-primary/40",
      text: "text-primary",
      highlight: "bg-primary",
      hoverBorder: "hover:border-primary/60" // Added for button hover clarity
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Decorative background elements using primary color */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 -z-10" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 -z-10" />

      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge
            variant="outline"
            className={cn(
                // Applying styles inspired by the hero button: rounded-full, specific border/bg/text, subtle hover
                "rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm hover:border-primary/40 hover:bg-primary/15",
                // theme.text // Removed direct theme usage, defined styles above
            )}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 inline-block" />
            Implementation Timeline
          </Badge>

          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Four Simple Steps to Success
          </h2>

          <p className="text-muted-foreground max-w-xl text-lg">
            Our streamlined process makes implementation quick, efficient, and tailored to your dealership.
          </p>
        </div>
        {/* Timeline Component Container */}
        <div className="mx-auto max-w-screen-xl rounded-3xl bg-background/50 backdrop-blur-sm border border-primary/10 p-6 lg:p-8 shadow-sm">
          <Tabs
            value={activePhase}
            onValueChange={handlePhaseChange}
            className="flex flex-col gap-8 w-full"
          >
            {/* Timeline Navigation */}
            <div className="relative">
              <TabsList className="relative w-full bg-transparent p-0 h-auto rounded-none gap-4">
                {/* Background Track */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/50 rounded-full" />
                
                {/* Timeline Steps */}
                <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {timelineData.map((phase, index) => {
                    const isActive = activePhase === phase.value;
                    const isCompleted = index < activeIndex;
                    
                    return (
                      <TabsTrigger
                        key={phase.value}
                        value={phase.value}
                        className={cn(
                          "group relative flex flex-col items-center gap-3 p-4 rounded-xl border",
                          "data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none",
                          isActive
                            ? "border-primary/30 bg-gradient-to-br from-primary/10 to-transparent"
                            : "border-border/40 hover:border-primary/20 hover:bg-muted/50"
                        )}
                      >
                        {/* Step Number */}
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : isCompleted
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground border border-border/50"
                        )}>
                          {index + 1}
                        </div>
                        
                        {/* Title and Date */}
                        <div className="text-center space-y-1">
                          <span className={cn(
                            "font-semibold text-sm sm:text-base block",
                            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}>
                            {phase.title}
                          </span>
                          <span className="text-xs text-muted-foreground/80 block">
                            {phase.date}
                          </span>
                        </div>
                        
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-primary rounded-full" />
                        )}
                      </TabsTrigger>
                    );
                  })}
                </div>
              </TabsList>
            </div>

            {/* Tabs Content Area */}
            <div className="relative min-h-[420px] md:min-h-[400px]">
              {timelineData.map((phase) => {
                // No colorSet needed, using default theme
                return (
                  <TabsContent
                    key={phase.value}
                    value={phase.value}
                    className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                      {/* Text Content */}
                      <div className="flex flex-col gap-4">
                        <p className={cn(
                          "font-mono text-sm font-medium tracking-wide uppercase",
                          theme.text // Use primary text color
                        )}>
                          {phase.date}
                        </p>

                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                          {phase.heading}
                        </h3>

                        <p className="text-muted-foreground text-lg">
                          {phase.description}
                        </p>

                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="lg"
                            // Applying outline style inspired by hero button
                            className={cn(
                              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3 text-base font-semibold group shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-primary/50 bg-primary/10 text-primary backdrop-blur-sm hover:bg-primary/20 hover:border-primary/70"
                            )}
                          >
                            {/* <Download className="size-4 shrink-0" /> -- Optional icon removed for consistency */}
                            <span className="font-medium">
                              {phase.buttonText}{" "}
                              <span className="text-muted-foreground font-normal">{phase.downloadText}</span>
                            </span>
                            <ChevronRight className="h-4 w-4 ml-1 opacity-70" />
                          </Button>
                        </div>
                      </div>

                      {/* Image Content using primary theme */}
                      <div
                        className={cn(
                          "aspect-video relative rounded-xl overflow-hidden border shadow-md",
                          theme.border // Use primary border
                        )}
                      >
                        {/* Gradient Overlay using primary theme */}
                        <div className={cn(
                          "absolute inset-0 opacity-20 bg-gradient-to-tr -z-0",
                          theme.light // Use primary light gradient
                        )} aria-hidden="true" />

                        {/* Inner container for padding, background, and image */}
                        <div className="relative z-10 h-full w-full p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-[10px] shadow-inner overflow-hidden">
                            <img
                              src={`/timeline-${phase.value}.jpg`} // Ensure these image paths are correct
                              alt={`${phase.title} process illustration`}
                              className="h-full w-full object-cover rounded-lg"
                              loading="lazy"
                            />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </div>

            {/* Progress Indicator using primary theme */}
            <div className="w-full max-w-md mx-auto mt-4">
              <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute top-0 bottom-0 left-0 rounded-full",
                    theme.highlight // Use primary highlight
                  )}
                  style={{ width: `${((activeIndex + 1) / timelineData.length) * 100}%` }}
                  aria-label={`Progress: Step ${activeIndex + 1} of ${timelineData.length}`}
                />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}