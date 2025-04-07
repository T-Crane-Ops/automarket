'use client';

import React, { useState } from 'react';
import { Mail, Search, Bell, Calendar, ChevronRight, Settings, User, Home, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MinimalSpotlightTabContent() {
  const [email, setEmail] = useState('');

  return (
    <>
      <h2 className="mb-4">Modern Card Designs</h2>
      <p className="mb-8 text-muted-foreground">
        Our cards now feature a clean minimal style with light gray borders, subtle backgrounds, and elegant spotlight effects by default.
      </p>
      <div className="space-y-16">
        {/* Dashboard Cards Section */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Dashboard Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Card */}
            <Card className="group">
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-center">
                  <CardTitle>Total Users</CardTitle>
                  <Users className="text-primary h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold">24,563</div>
                <div className="text-sm text-emerald-500 flex items-center gap-1 mt-1">
                  <span>↑</span> 12% from last month
                </div>
                <div className="mt-4">
                  <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="group">
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Activity</CardTitle>
                  <Zap className="text-amber-500 h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Purchase completed</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">New comment added</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="group">
              <CardHeader className="pb-2 relative z-10">
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Events</CardTitle>
                  <Calendar className="text-primary h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="flex gap-3">
                  <div className="bg-primary/10 text-primary rounded-md h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium">24</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team Meeting</p>
                    <p className="text-xs text-muted-foreground">10:00 AM - 11:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 text-primary rounded-md h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium">25</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Product Launch</p>
                    <p className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/10 text-primary rounded-md h-10 w-10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium">26</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client Call</p>
                    <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Card */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Contact Form</h3>

          <Card className="max-w-xl mx-auto">
            <CardHeader className="relative z-10">
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Send us a message and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  placeholder="Your name"
                  className="border-neutral-200 dark:border-neutral-800 bg-transparent hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <div className="relative">
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="border-neutral-200 dark:border-neutral-800 bg-transparent hover:border-primary/50 focus:border-primary transition-colors pr-10"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Type your message here"
                  className="border-neutral-200 dark:border-neutral-800 bg-transparent min-h-[120px] hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="contact-terms" />
                <Label htmlFor="contact-terms" className="text-sm">I agree to the terms and conditions</Label>
              </div>
            </CardContent>
            <CardFooter className="relative z-10">
              <Button className="w-full">Send Message</Button>
            </CardFooter>
          </Card>
        </section>

        {/* Navigation Card */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Navigation Example</h3>

          <Card className="p-4">
            <div className="relative z-10">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b dark:border-neutral-800 rounded-none p-0 h-auto">
                  <TabsTrigger
                    value="dashboard"
                    className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="h-4 w-4" /> Dashboard
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Analytics
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-medium">Dashboard Overview</h4>
                    <div className="relative">
                      <Input
                        placeholder="Search..."
                        className="w-64 border-neutral-200 dark:border-neutral-800 bg-transparent focus:border-primary transition-colors pl-9"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-transparent">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-muted-foreground">New Users</p>
                          <Badge variant="outline" className="bg-transparent">+22%</Badge>
                        </div>
                        <p className="text-2xl font-bold">1,294</p>
                        <div className="mt-4">
                          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-2/3"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

// Users icon component
const Users = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
