'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={`${geist.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <Analytics mode="auto" />
        <AuthProvider>   
          <ProtectedRoute>  
            <div className="flex flex-col flex-grow">
              {children}
            </div>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
