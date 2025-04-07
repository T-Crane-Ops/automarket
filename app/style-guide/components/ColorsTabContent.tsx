'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ColorsTabContent() {
  return (
    <>
      <h2 className="mb-4">Color Palette</h2>

      <div className="space-y-8">
        {/* Primary Colors */}
        <Card variant="minimal" spotlight>
          <CardHeader>
            <CardTitle>Primary Brand Color</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary rounded-md flex items-end p-2">
                  <span className="text-primary-foreground text-sm font-medium">Primary</span>
                </div>
                <p className="text-sm font-medium">primary (Teal #1ABC9C)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: 'hsl(var(--primary-hover))'}}>
                  <span className="text-primary-foreground text-sm font-medium">Hover</span>
                </div>
                <p className="text-sm font-medium">primary-hover</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: 'hsl(var(--primary-active))'}}>
                  <span className="text-primary-foreground text-sm font-medium">Active</span>
                </div>
                <p className="text-sm font-medium">primary-active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neutral Palette */}
        <Card variant="minimal" spotlight>
          <CardHeader>
            <CardTitle>Neutral Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-neutral-0 border border-neutral-100 rounded-md flex items-end p-2">
                  <span className="text-neutral-900 text-sm font-medium">White</span>
                </div>
                <p className="text-sm font-medium">neutral-0 (#FFFFFF)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-neutral-100 rounded-md flex items-end p-2">
                  <span className="text-neutral-900 text-sm font-medium">Light Gray</span>
                </div>
                <p className="text-sm font-medium">neutral-100 (#F8F9FA)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-neutral-300 rounded-md flex items-end p-2">
                  <span className="text-neutral-900 text-sm font-medium">Medium Gray</span>
                </div>
                <p className="text-sm font-medium">neutral-300 (#E9ECEF)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-neutral-700 rounded-md flex items-end p-2">
                  <span className="text-white text-sm font-medium">Dark Gray</span>
                </div>
                <p className="text-sm font-medium">neutral-700 (#495057)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-neutral-900 rounded-md flex items-end p-2">
                  <span className="text-white text-sm font-medium">Near Black</span>
                </div>
                <p className="text-sm font-medium">neutral-900 (#212529)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accent/Data Viz Colors */}
        <Card variant="minimal" spotlight>
          <CardHeader>
            <CardTitle>Accent / Data Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#3498DB'}}>
                  <span className="text-white text-sm font-medium">Blue</span>
                </div>
                <p className="text-sm font-medium">accent-blue (#3498DB)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#2ECC71'}}>
                  <span className="text-white text-sm font-medium">Green</span>
                </div>
                <p className="text-sm font-medium">accent-green (#2ECC71)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#F1C40F'}}>
                  <span className="text-neutral-900 text-sm font-medium">Yellow</span>
                </div>
                <p className="text-sm font-medium">accent-yellow (#F1C40F)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#E67E22'}}>
                  <span className="text-white text-sm font-medium">Orange</span>
                </div>
                <p className="text-sm font-medium">accent-orange (#E67E22)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#E74C3C'}}>
                  <span className="text-white text-sm font-medium">Red</span>
                </div>
                <p className="text-sm font-medium">accent-red (#E74C3C)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#9B59B6'}}>
                  <span className="text-white text-sm font-medium">Purple</span>
                </div>
                <p className="text-sm font-medium">accent-purple (#9B59B6)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback/Status Colors */}
        <Card variant="minimal" spotlight>
          <CardHeader>
            <CardTitle>Feedback / Status Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#28A745'}}>
                  <span className="text-white text-sm font-medium">Success</span>
                </div>
                <p className="text-sm font-medium">status-success (#28A745)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#FFC107'}}>
                  <span className="text-neutral-900 text-sm font-medium">Warning</span>
                </div>
                <p className="text-sm font-medium">status-warning (#FFC107)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#DC3545'}}>
                  <span className="text-white text-sm font-medium">Error</span>
                </div>
                <p className="text-sm font-medium">status-error (#DC3545)</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-md flex items-end p-2" style={{backgroundColor: '#17A2B8'}}>
                  <span className="text-white text-sm font-medium">Info</span>
                </div>
                <p className="text-sm font-medium">status-info (#17A2B8)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 