/**
 * STRIPE SUBSCRIPTION CANCELLATION API ROUTE
 * 
 * This endpoint handles canceling a user's subscription in Stripe. It implements
 * a "cancel at period end" approach, which means the user will continue to have 
 * access until their current billing period ends.
 */

// Import required dependencies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe'; // For Stripe payment processing
import { supabaseAdmin } from '@/utils/supabase-admin'; // Admin Supabase client
import { withCors } from '@/utils/cors'; // CORS handling middleware

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST Function - Cancel a subscription
 * 
 * This function handles the cancellation process for a subscription:
 * 1. It checks the current subscription status
 * 2. Sets the subscription to cancel at the end of the billing period
 * 3. Updates our database to reflect this change
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // Get the subscription ID from the request body
    const { subscriptionId } = await request.json();

    // Make sure we have a subscription ID
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // First, check the current status of the subscription in Stripe
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // If subscription is already canceled, just return success
    if (currentSubscription.status === 'canceled') {
      return NextResponse.json({ status: 'success', alreadyCanceled: true });
    }

    // If subscription is active or trialing, set it to cancel at period end
    if (['active', 'trialing'].includes(currentSubscription.status)) {
      // Update subscription in Stripe to cancel at period end
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true // This schedules cancellation at the end of the billing period
      });

      // Update our database record to reflect this change
      const { error: supabaseError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          cancel_at_period_end: true, // Mark it for cancellation
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(), // Save when access will end
          updated_at: new Date().toISOString() // Update timestamp
        })
        .eq('stripe_subscription_id', subscriptionId);

      // Handle any errors updating our database
      if (supabaseError) {
        console.error('Supabase update error:', supabaseError);
        throw supabaseError;
      }

      // Return success response with updated subscription
      return NextResponse.json({
        status: 'success',
        subscription: subscription
      });
    }

    // If subscription is in another state (like past_due), return error
    return NextResponse.json(
      { error: 'Subscription cannot be canceled in its current state' },
      { status: 400 }
    );
  } catch (error) {
    // Handle and log any errors
    console.error('Subscription cancellation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 