import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/landingpage/testimonialcard"
import { Badge } from "@/components/ui/badge"

interface TestimonialsSectionProps {
  title?: string
  description?: string
  testimonials?: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

// Default testimonials data
const defaultTestimonials = [
  {
    author: {
      name: "Sarah Johnson",
      handle: "@sarahj",
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    text: "AutoMarket has completely transformed how we manage our dealership. The AI-generated ads save us hours of work every week.",
    href: "#"
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@michaelc",
      avatar: "https://i.pravatar.cc/100?img=2"
    },
    text: "The platform is intuitive and powerful. We've seen a 30% increase in lead generation since implementing AutoMarket.",
    href: "#"
  },
  {
    author: {
      name: "Emily Rodriguez",
      handle: "@emilyr",
      avatar: "https://i.pravatar.cc/100?img=3"
    },
    text: "Customer support is exceptional. Any issues we had were resolved quickly and professionally. Great team!",
    href: "#"
  },
  {
    author: {
      name: "David Kim",
      handle: "@davidk",
      avatar: "https://i.pravatar.cc/100?img=4"
    },
    text: "The analytics dashboard gives us incredible insights into what's working and what's not. Game-changer for our marketing strategy.",
    href: "#"
  }
];

export function TestimonialsSection({ 
  title = "What Our Customers Say",
  description = "Hear from dealerships that have transformed their businesses with AutoMarket",
  testimonials = defaultTestimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "py-12 sm:py-16 md:py-20",
      className
    )}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline">Testimonials</Badge>
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-[600px]">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-background p-6 lg:p-8">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-2 [--gap:0.5rem] sm:[--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee group-hover:animate-paused flex-row">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`set1-${i}`}
                    {...testimonial}
                    className="border-primary/20 hover:border-primary/40"
                  />
                ))}
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`set2-${i}`}
                    {...testimonial}
                    className="border-primary/20 hover:border-primary/40"
                  />
                ))}
              </div>
              <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee group-hover:animate-paused flex-row">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`set3-${i}`}
                    {...testimonial}
                    className="border-primary/20 hover:border-primary/40"
                  />
                ))}
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`set4-${i}`}
                    {...testimonial}
                    className="border-primary/20 hover:border-primary/40"
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
          </div>
        </div>
      </div>
    </section>
  )
}