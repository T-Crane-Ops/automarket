 'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SpacingTabContent() {
  return (
    <>
      <h2 className="mb-4">Spacing & Layout</h2>

      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>All spacing (padding, margins) follow a consistent scale based on 8px units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-16 h-4 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-xs: 4px (0.5x)</p>
            </div>
            <div className="flex items-center">
              <div className="w-16 h-8 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-sm: 8px (1x) - Base Unit</p>
            </div>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-md: 16px (2x)</p>
            </div>
            <div className="flex items-center">
              <div className="w-24 h-24 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-lg: 24px (3x)</p>
            </div>
            <div className="flex items-center">
              <div className="w-32 h-32 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-xl: 32px (4x)</p>
            </div>
            <div className="flex items-center">
              <div className="w-48 h-48 bg-primary"></div>
              <p className="ml-4 text-sm font-medium">space-xxl: 48px (6x)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="minimal" spotlight>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="h-16 w-full bg-primary rounded-btn flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">Button Radius (6px)</span>
              </div>
              <p className="text-sm font-medium text-center">rounded-btn</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full bg-primary rounded-input flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">Input Radius (6px)</span>
              </div>
              <p className="text-sm font-medium text-center">rounded-input</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full bg-primary rounded-card flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">Card Radius (12px)</span>
              </div>
              <p className="text-sm font-medium text-center">rounded-card</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
