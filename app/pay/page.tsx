'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { StripeBuyButton } from '@/components/StripeBuyButton';
import { SubscriptionStatus } from '@/components/SubscriptionStatus';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function PaymentPage() {
  // const { user } = useAuth();
  const { subscription, isLoading, error } = useSubscription();
  const router = useRouter();

  // Redirect if already subscribed
  useEffect(() => {
    if ( (subscription?.status === 'active' || subscription?.status === 'trialing') && !subscription.cancel_at_period_end) {
      const timer = setTimeout(() => {
        router.push('/profile');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscription, router]);

  // Check if user can subscribe
  const canSubscribe = !isLoading && 
    (!subscription || 
    (subscription.status === 'canceled' && !subscription.cancel_at_period_end));

  // Add error handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border border-destructive/30">
          <CardHeader className="items-center text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-xl">Error Loading Subscription</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Unable to load subscription information. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="destructive"
              className="rounded-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canSubscribe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border border-primary/10">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-xl">Subscription Not Available</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              You already have an active or pending subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => router.push('/profile')}
              variant="outline"
              className="rounded-full"
            >
              View Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Complete Your Purchase</h1>
      
      <SubscriptionStatus />

      <div className="w-full max-w-md px-4">
        <StripeBuyButton
          className="flex justify-center text-neutral"
          buyButtonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_ID || ''}
          publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
        />
      </div>
    </div>
  );
}





