import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { QuoteIcon } from "lucide-react"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
  role?: string
  company?: string
  companyLogo?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
  rating?: number
  featured?: boolean
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className,
  rating,
  featured = false
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      <Card
        {...(href ? { href } : {})}
        className={cn(
          "flex flex-col rounded-xl relative overflow-hidden",
          "bg-background/50 backdrop-blur-sm",
          "p-6 md:p-6 text-start",
          "border border-primary/20 hover:border-primary/40",
          "hover:shadow-[0_10px_30px_rgba(22,163,74,0.15)]",
          "w-[300px] md:w-[340px]",
          "h-auto min-h-[220px]",
          "transition-all duration-300",
          featured ? "border-primary/40 shadow-[0_5px_20px_rgba(22,163,74,0.15)]" : "",
          className
        )}
      >
        {/* Quote icon */}
        <div className="absolute right-4 top-4 opacity-20">
          <QuoteIcon className="h-8 w-8 text-primary" />
        </div>
        
        {/* Rating stars if provided */}
        {rating && (
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={cn(
                  "w-4 h-4 mr-1",
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                )}
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
              </svg>
            ))}
          </div>
        )}
        
        {/* Testimonial text */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative z-10">
          "{text}"
        </p>
        
        <div className="mt-auto pt-4 border-t border-primary/10 flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={author.avatar} alt={author.name} />
          </Avatar>
          
          <div className="flex flex-col items-start gap-0.5">
            <h3 className="text-sm font-semibold leading-none">
              {author.name}
            </h3>
            
            {author.role && author.company ? (
              <p className="text-xs text-muted-foreground">
                {author.role}, <span className="text-primary">{author.company}</span>
              </p>
            ) : (
              <p className="text-xs text-primary">
                {author.handle}
              </p>
            )}
          </div>
          
          {author.companyLogo && (
            <img 
              src={author.companyLogo} 
              alt={author.company || author.handle}
              className="h-6 ml-auto opacity-80"
            />
          )}
        </div>
        
        {/* Decorative elements for featured testimonials */}
        {featured && (
          <>
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
            <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
          </>
        )}
      </Card>
    </motion.div>
  )
}