"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter, MessageCircle, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

function Footer() {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1000)
  }

  return (
    <footer className="relative border-t border-primary/10 bg-background py-16 sm:py-20 mt-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <h2 className="mb-4 text-2xl font-bold">Stay Connected</h2>
              <p className="mb-6 text-muted-foreground">
                Join our newsletter for the latest updates and exclusive offers.
              </p>
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pr-12 rounded-full border-primary/20 focus:border-primary bg-background/50 backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isSubmitted}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting || isSubmitted}
                  className={cn(
                    "absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground",
                    isSubmitting ? "opacity-70" : "", 
                    isSubmitted ? "bg-green-500" : ""
                  )}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  ) : isSubmitted ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Subscribe</span>
                </Button>
              </form>
              {isSubmitted && (
                <p className="absolute mt-2 text-sm text-green-500">
                  Thanks for subscribing!
                </p>
              )}
              <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <nav className="space-y-3 text-sm">
                {[
                  { label: "Home", href: "/" },
                  { label: "About Us", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Products", href: "/products" },
                  { label: "Contact", href: "/contact" }
                ].map((link, i) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <address className="space-y-3 text-sm not-italic text-muted-foreground">
                <p>123 Innovation Street</p>
                <p>Tech City, TC 12345</p>
                <p>Phone: <a href="tel:+11234567890" className="text-primary hover:underline">(123) 456-7890</a></p>
                <p>Email: <a href="mailto:hello@automarket.com" className="text-primary hover:underline">hello@automarket.com</a></p>
              </address>
            </div>
            
            <div className="relative">
              <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
              <div className="mb-6 flex space-x-3">
                {[
                  { icon: Facebook, label: "Facebook", color: "hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-500" },
                  { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-500" },
                  { icon: Instagram, label: "Instagram", color: "hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-500" },
                  { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-600/10 hover:border-blue-600/30 hover:text-blue-600" }
                ].map((social, i) => (
                  <TooltipProvider key={social.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className={cn(
                              "rounded-full border-primary/20 bg-background/50 backdrop-blur-sm",
                              social.color
                            )}
                          >
                            <social.icon className="h-4 w-4" />
                            <span className="sr-only">{social.label}</span>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Follow us on {social.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
          
          <div 
            className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-primary/10 pt-8 text-center md:flex-row"
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AutoMarket. All rights reserved.
            </p>
            <nav className="flex gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                <a key={item} href="#" className="hover:text-primary">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      <div className="fixed right-6 bottom-6 z-50">
        <Button
          className="rounded-full h-12 w-12 bg-primary shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">Chat Support</span>
        </Button>
      </div>
    </footer>
  )
}

export { Footer }