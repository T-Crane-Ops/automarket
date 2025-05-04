'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StripeBuyButton } from '@/components/StripeBuyButton';
import { cn } from "@/lib/utils";
import { RefreshCw } from 'lucide-react';

export function SubscriptionManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, isLoading, syncWithStripe, fetchSubscription } = useSubscription();
  const { isInTrial, trialEndTime } = useTrialStatus();

  // State for subscription actions
  const paymentStatus = searchParams.get('payment');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancellingSub, setIsCancellingSub] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  // Handle Stripe Payment Success Redirect
  useEffect(() => {
    if (paymentStatus === 'success') {
      console.log('Payment successful!');
      fetchSubscription(true); // Force refetch subscription after successful payment
    }
  }, [paymentStatus, fetchSubscription]);

  // Set a timeout to force refresh if loading takes too long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading && !isManualRefresh && !subError) {
      timeoutId = setTimeout(() => {
        if (isLoading) {
          handleManualRefresh();
        }
      }, 5000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isManualRefresh, subError]);

  // Handle manual refresh of subscription data
  const handleManualRefresh = async () => {
    if (isManualRefresh) return;
    
    // Use a local variable to track refresh state within this function
    let isCurrentlyRefreshing = true;
    setIsManualRefresh(true);
    setSubError(null);
    
    try {
      await fetchSubscription(true);
    } catch (err) {
      console.error('Error refreshing subscription data:', err);
      // Only update state if the component is still mounted and the refresh is still ongoing
      if (isCurrentlyRefreshing) {
        setSubError('Could not refresh subscription data. Please try again.');
      }
    } finally {
      // Only update state if the component is still mounted and the refresh is still ongoing
      if (isCurrentlyRefreshing) {
        setIsManualRefresh(false);
        isCurrentlyRefreshing = false;
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    setIsCancellingSub(true);
    setSubError(null);
    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }

      setIsCancelModalOpen(false);
      await fetchSubscription(true);
      router.refresh();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setSubError(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setIsCancellingSub(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    setSubError(null);
    try {
      const response = await fetch('/api/stripe/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate subscription');
      }

      await fetchSubscription(true);
      router.refresh();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      setSubError(error instanceof Error ? error.message : 'Failed to reactivate subscription');
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading subscription details...</span>
      </div>
      {isLoading && (
        <div className="h-10 bg-secondary/60 rounded-md animate-pulse"></div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {subError && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{subError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isManualRefresh}
              className="ml-2 gap-1.5 h-7 px-2 text-xs"
            >
              {isManualRefresh ? (
                <>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        renderLoadingState()
      ) : subscription ? (
        <div className="space-y-5">
          {/* Subscription Details */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Status</span>
              <span className={cn(
                "font-medium",
                subscription.status === 'active' || subscription.status === 'trialing' ? 'text-green-600 dark:text-green-400' :
                subscription.status === 'canceled' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              )}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Started</span>
              <span>{new Date(subscription.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Current Period End</span>
              <span>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-muted-foreground">Next Payment</span>
              <span>{subscription.cancel_at_period_end ? 'None (Set to cancel)' : new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Manual refresh button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isManualRefresh}
              className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              {isManualRefresh ? (
                <>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          {/* Subscription Actions */}
          {subscription.status === 'canceled' ? (
            <div className="mt-4">
              <Link
                href="/pay"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-md px-4")}
              >
                Resubscribe
              </Link>
            </div>
          ) : subscription.cancel_at_period_end ? (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800/40">
              <p className="text-yellow-700 dark:text-yellow-400 mb-3 text-sm">
                Your subscription is set to cancel and will end on {new Date(subscription.current_period_end).toLocaleDateString()}.
              </p>
              <Button
                onClick={handleReactivateSubscription}
                variant="outline"
                size="sm"
                className="text-xs h-8"
              >
                Keep Subscription Active
              </Button>
            </div>
          ) : (subscription.status === 'active' || subscription.status === 'trialing') ? (
            <Button
              onClick={() => setIsCancelModalOpen(true)}
              variant="destructive"
              size="sm"
              className="h-8 text-xs mt-4"
            >
              Cancel Subscription
            </Button>
          ) : null}

          {/* Cancellation Modal */}
          {isCancelModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-background border border-border rounded-lg p-4 max-w-sm w-full shadow-lg">
                <h3 className="text-base font-medium mb-2">Confirm Cancellation</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Are you sure you want to cancel? Your subscription will remain active until {new Date(subscription?.current_period_end || '').toLocaleDateString()}.
                </p>
                {subError && (
                  <Alert variant="destructive" className="mb-4 text-sm">
                    <AlertDescription>{subError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => { setIsCancelModalOpen(false); setSubError(null); }}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    disabled={isCancellingSub}
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    onClick={handleCancelSubscription}
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1.5"
                    disabled={isCancellingSub}
                  >
                    {isCancellingSub ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Canceling...
                      </>
                    ) : 'Yes, Cancel'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {isInTrial ? (
            <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-sm">
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                You are in your 48-hour trial period ending on {trialEndTime ? new Date(trialEndTime).toLocaleDateString() : 'soon'}.
                Subscribe to continue access.
              </AlertDescription>
            </Alert>
          ) : trialEndTime ? (
            <Alert variant="destructive" className="text-sm">
              <AlertDescription>
                Trial ended on {new Date(trialEndTime).toLocaleDateString()}. Please subscribe to continue.
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">You don't have an active subscription.</p>
          )}

          {/* Display Stripe Button */}
          <div>
            <StripeBuyButton
              buyButtonId={process.env.NEXT_PUBLIC_STRIPE_BUTTON_ID || ''}
              publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
} 