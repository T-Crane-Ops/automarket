 'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TypographyTabContent() {
  return (
    <>
      <h2 className="mb-4">Typography</h2>

      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Font Family</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Primary Font: <span className="font-medium">Inter</span></p>
          <p className="mt-2">The quick brown fox jumps over the lazy dog.</p>
        </CardContent>
      </Card>

      <Card variant="minimal" spotlight className="mb-8">
        <CardHeader>
          <CardTitle>Type Scale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h1>Heading 1 (28px, Semi-bold)</h1>
            <p className="text-sm text-neutral-700 mt-1">Used for page titles</p>
          </div>
          <div>
            <h2>Heading 2 (22px, Semi-bold)</h2>
            <p className="text-sm text-neutral-700 mt-1">Used for section titles</p>
          </div>
          <div>
            <h3>Heading 3 (18px, Semi-bold)</h3>
            <p className="text-sm text-neutral-700 mt-1">Used for card titles and subsections</p>
          </div>
          <div>
            <p className="text-body">Body (16px, Regular)</p>
            <p className="text-sm text-neutral-700 mt-1">Primary body text</p>
          </div>
          <div>
            <p className="text-body-sm">Body Small (14px, Regular)</p>
            <p className="text-sm text-neutral-700 mt-1">Secondary text, descriptions</p>
          </div>
          <div>
            <p className="text-caption">Caption (12px, Regular)</p>
            <p className="text-sm text-neutral-700 mt-1">Labels, captions, helper text</p>
          </div>
          <div>
            <p className="text-button font-medium">Button Text (14px, Medium)</p>
            <p className="text-sm text-neutral-700 mt-1">Used for button labels</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
