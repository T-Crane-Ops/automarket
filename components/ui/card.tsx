import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardStyles = cva(
  "rounded-xl transition-all duration-300 border border-neutral-200 dark:border-neutral-800",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow",
        minimal: "bg-neutral-50/50 dark:bg-neutral-900/20 shadow-none",
      },
      borderRadius: {
        default: "rounded-xl",
        sm: "rounded-md",
        lg: "rounded-2xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      borderRadius: "default",
    },
  }
)

interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardStyles> {
  spotlight?: boolean;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, borderRadius, spotlight, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      cardStyles({ variant, borderRadius }),
      "relative overflow-hidden",
      className
    )}
    {...props}
  >
    <div className={cn(
      "absolute -inset-[50%] bg-gradient-radial pointer-events-none transform scale-110 blur-xl",
      "from-primary/30 via-primary/10 to-transparent"
    )}></div>
    <div className="relative z-10">
      {props.children}
    </div>
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { divider?: boolean }
>(({ className, divider = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6", 
      divider && "border-b border-border/50 pb-4", 
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gradient?: boolean }
>(({ className, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight", 
      gradient && "bg-gradient-to-r from-primary to-primary-400 dark:from-primary-300 dark:to-primary bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { divider?: boolean }
>(({ className, divider = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0", 
      divider && "border-t border-border/50 mt-4 pt-4", 
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
