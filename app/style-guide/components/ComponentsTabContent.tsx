'use client';

import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ComponentsTabContent() {
  return (
    <>
      <h2 className="mb-4">Components</h2>

      {/* Buttons */}
      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 w-full sm:w-auto">
              <Button>Primary Button</Button>
              <p className="text-sm text-neutral-700">btn-primary / Button</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <Button variant="secondary">Secondary Button</Button>
              <p className="text-sm text-neutral-700">btn-secondary / variant=&quot;secondary&quot;</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <Button variant="outline">Outline Button</Button>
              <p className="text-sm text-neutral-700">variant=&quot;outline&quot;</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <Button variant="ghost">Ghost Button</Button>
              <p className="text-sm text-neutral-700">variant=&quot;ghost&quot;</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <Button variant="link">Link Button</Button>
              <p className="text-sm text-neutral-700">variant=&quot;link&quot;</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <Button variant="destructive">Destructive Button</Button>
              <p className="text-sm text-neutral-700">variant=&quot;destructive&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textarea">Message</Label>
                <Textarea id="textarea" placeholder="Type your message here" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="select">Select</Label>
                <Select>
                  <SelectTrigger id="select">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="toggle" />
                <Label htmlFor="toggle">Toggle Switch</Label>
              </div>

              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover Me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltip Content</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="minimal" spotlight>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description text goes here. This is for additional context.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content area of the card. It can contain text, images, or other components.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <div className="card">
                <h3 className="mb-2">Custom Card Class</h3>
                <p className="text-sm text-neutral-700">
                  This card uses our custom .card class for consistent styling across the application.
                </p>
                <div className="flex justify-end mt-4">
                  <Button>Action</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 