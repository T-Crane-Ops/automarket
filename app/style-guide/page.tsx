'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ColorsTabContent,
  TypographyTabContent,
  SpacingTabContent,
  ComponentsTabContent,
  CardStylesTabContent,
  MinimalSpotlightTabContent
} from './components';

export default function StyleGuidePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="mb-8">Design System Style Guide</h1>

      <Tabs defaultValue="card-styles" className="mb-10">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing & Layout</TabsTrigger>
          <TabsTrigger value="components">Basic Components</TabsTrigger>
          <TabsTrigger value="card-styles">Card Styles</TabsTrigger>
          <TabsTrigger value="minimal-spotlight">Card Examples</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <ColorsTabContent />
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography">
          <TypographyTabContent />
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing">
          <SpacingTabContent />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components">
          <ComponentsTabContent />
        </TabsContent>

        {/* Card Styles Tab */}
        <TabsContent value="card-styles">
          <CardStylesTabContent />
        </TabsContent>

        {/* Card Examples Tab */}
        <TabsContent value="minimal-spotlight">
          <MinimalSpotlightTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
} 