/**
 * STRIPE SUBSCRIPTION REACTIVATION API ROUTE
 * 
 * This endpoint handles reactivating a subscription that was previously
 * set to cancel at the end of the billing period. This allows users to
 * continue their subscription without interruption.
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
 * POST Function - Reactivate a subscription
 * 
 * This function takes a subscription ID and removes the cancellation status,
 * allowing the subscription to continue automatically renewing.
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

    // Update the subscription in Stripe to continue automatically renewing
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false // This turns off the cancellation at period end
    });

    // Also update our database to reflect this change
    await supabaseAdmin
      .from('subscriptions')
      .update({
        cancel_at_period_end: false, // Set to false to indicate it will automatically renew
        updated_at: new Date().toISOString() // Update the timestamp
      })
      .eq('stripe_subscription_id', subscriptionId);

    // Return success response with the updated subscription
    return NextResponse.json({ status: 'success', subscription });
  } catch (error) {
    // Handle and log any errors
    console.error('Subscription reactivation failed:', error);
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    );
  }
}); 