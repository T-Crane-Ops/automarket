'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import debounce from 'lodash/debounce';

export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

// Global cache for subscriptions
const globalSubscriptionCache: { [key: string]: { data: Subscription | null, timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute

export function useSubscription() {
  const { user, supabase } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const isCurrentlyFetching = useRef(false);
  const fetchAttempts = useRef(0);
  const MAX_RETRIES = 3;
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSubscription = useCallback(async (forceRefresh = false) => {
    if (!user?.id) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isCurrentlyFetching.current && !forceRefresh) return;
    isCurrentlyFetching.current = true;

    // Don't show loading if we already have data
    if (!subscription) setLoading(true);
    setError(null);

    try {
      // Check cache first, unless force refreshing
      const now = Date.now();
      const cachedSub = globalSubscriptionCache[user.id];
      
      if (!forceRefresh && cachedSub && (now - cachedSub.timestamp < CACHE_DURATION)) {
        if (isMounted.current) {
          setSubscription(cachedSub.data);
          setLoading(false);
        }
        isCurrentlyFetching.current = false;
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing', 'canceled'])
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;

      const isValid = data && 
        ['active', 'trialing'].includes(data.status) && 
        new Date(data.current_period_end) > new Date();

      const result = data ? data : null;
      
      // Update cache
      globalSubscriptionCache[user.id] = {
        data: result,
        timestamp: now
      };
      
      if (isMounted.current) {
        setSubscription(result);
        fetchAttempts.current = 0; // Reset attempts on success
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      
      if (isMounted.current) {
        setError('Failed to load subscription');
        
        // Implement retry logic
        if (fetchAttempts.current < MAX_RETRIES) {
          fetchAttempts.current += 1;
          console.log(`Retrying subscription fetch (attempt ${fetchAttempts.current} of ${MAX_RETRIES})...`);
          
          // Clear any existing timeout
          if (retryTimeout.current) clearTimeout(retryTimeout.current);
          
          // Exponential backoff: 1s, 2s, 4s, etc.
          const delay = Math.min(1000 * Math.pow(2, fetchAttempts.current - 1), 10000);
          retryTimeout.current = setTimeout(() => fetchSubscription(true), delay);
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isCurrentlyFetching.current = false;
    }
  }, [user?.id, supabase]);

  // Set up cleanup on component unmount
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchAttempts.current = 0; // Reset attempts when user changes
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user?.id, fetchSubscription]);

  const checkValidSubscription = useCallback((data: Subscription): boolean => {
    return ['active', 'trialing'].includes(data.status) &&
      new Date(data.current_period_end) > new Date();
  }, []);

  const debouncedSyncWithStripe = useCallback(
    debounce(async (subscriptionId: string) => {
      if (!user?.id || !isMounted.current) return;

      try {
        const response = await fetch('/api/stripe/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to sync with Stripe');
        }
        
        // Force refresh after sync
        if (isMounted.current) {
          // Invalidate cache
          if (user.id in globalSubscriptionCache) {
            delete globalSubscriptionCache[user.id];
          }
          await fetchSubscription(true);
        }
      } catch (error) {
        console.error('Error syncing with Stripe:', error);
        if (isMounted.current) {
          setError(error instanceof Error ? error.message : 'Failed to sync with Stripe');
        }
      }
    }, 2000), // Reduced to 2 seconds for more responsive updates
    [fetchSubscription, user?.id]
  );

  const syncWithStripe = useCallback((subscriptionId: string) => {
    if (!subscriptionId) return;
    debouncedSyncWithStripe(subscriptionId);
  }, [debouncedSyncWithStripe]);

  // Set up subscription to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('subscription_updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Subscription update received:', payload);
          
          // Force refresh the data when we get a real-time update
          if (user.id in globalSubscriptionCache) {
            delete globalSubscriptionCache[user.id];
          }
          
          await fetchSubscription(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, fetchSubscription]);

  // Sync with Stripe when subscription ID changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (subscription?.stripe_subscription_id) {
      // Add a shorter delay before first sync
      timeoutId = setTimeout(() => {
        syncWithStripe(subscription.stripe_subscription_id);
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [syncWithStripe, subscription?.stripe_subscription_id]);

  return {
    subscription,
    isLoading: loading,
    error,
    syncWithStripe,
    fetchSubscription
  };
} 