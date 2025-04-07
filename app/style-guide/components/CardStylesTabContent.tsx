'use client';

import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CardStylesTabContent() {
  return (
    <>
      <h2 className="mb-4">Modern Card Design</h2>
      <p className="mb-8 text-muted-foreground">
        Our cards now feature a clean minimal style with light gray borders, subtle background, and permanent spotlight effects for a modern, elegant look.
      </p>
      <div className="space-y-12">
        {/* Card Styles */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Card Examples</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Card */}
            <Card>
              <CardHeader>
                <CardTitle>Modern Card</CardTitle>
                <CardDescription>Clean minimal design with spotlight effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p>All cards now feature a light background, subtle border, and elegant spotlight effect by default.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Card with dividers */}
            <Card>
              <CardHeader divider>
                <CardTitle>Card with Dividers</CardTitle>
                <CardDescription>Using header and footer dividers</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card demonstrates how dividers can be added to headers and footers for better content separation.</p>
              </CardContent>
              <CardFooter divider>
                <Button size="sm" variant="outline">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Card Usage Examples */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Example Use Cases</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Card */}
            <Card className="bg-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <Badge variant="outline" className="bg-transparent">+12.5%</Badge>
                </div>
                <p className="text-2xl font-bold">$24,563</p>
                <div className="mt-4">
                  <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Alex Johnson</CardTitle>
                    <CardDescription>Product Designer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold">254</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">13.5k</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">18</p>
                    <p className="text-xs text-muted-foreground">Collections</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" size="sm">View Profile</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Card With Gradient Title */}
        <section>
          <h3 className="mb-6 text-lg font-semibold">Enhanced Card Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle gradient>Gradient Title</CardTitle>
                <CardDescription>Cards can use gradient titles for emphasis</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card demonstrates the gradient title feature that can be used to make titles more visually appealing.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader divider>
                <CardTitle>Custom Border Radius</CardTitle>
                <CardDescription>Cards can have different border radius styles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">borderRadius="default"</Badge>
                  <Badge variant="outline">borderRadius="sm"</Badge>
                  <Badge variant="outline">borderRadius="lg"</Badge>
                  <Badge variant="outline">borderRadius="full"</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
