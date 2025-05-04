/**
 * USER DELETION API ROUTE
 * 
 * This file handles the deletion of user accounts. It performs a "soft delete" by marking
 * the account as deleted rather than completely removing it from the database.
 * It also handles canceling any active Stripe subscriptions for the user.
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
 * DELETE Function - Soft delete a user account
 * 
 * This function handles DELETE requests to remove a user account.
 * It's wrapped with CORS middleware to handle cross-origin requests.
 */
export const DELETE = withCors(async function DELETE(request: NextRequest) {
  try {
    // Get the userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate that a userId was provided
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('Starting account soft-deletion for user:', userId);

    // Step 1: Cancel any active Stripe subscriptions for this user
    const { data: subscriptionsData, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id, status')
      .eq('user_id', userId);

    // Handle any errors fetching subscriptions
    if (subError) {
      console.error('Subscription fetch error:', subError);
    } else if (subscriptionsData) {
      // Loop through all subscriptions and cancel active ones
      for (const sub of subscriptionsData) {
        if (sub.stripe_subscription_id && (sub.status === 'active' || sub.status === 'trialing')) {
          try {
            // Cancel the subscription in Stripe
            await stripe.subscriptions.cancel(sub.stripe_subscription_id);
            console.log('Stripe subscription cancelled:', sub.stripe_subscription_id);
          } catch (stripeError) {
            console.error('Stripe cancellation error:', stripeError);
          }
        }
      }
    }

    // Step 2: Mark the user as deleted in the database (soft delete)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .update({ 
        deleted_at: new Date().toISOString(), // Timestamp when deleted
        is_deleted: true                      // Flag as deleted
      })
      .eq('id', userId);

    // Handle errors updating the user record
    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile', details: profileError },
        { status: 500 }
      );
    }

    // Step 3: Mark the user's subscriptions as canceled
    const { error: subscriptionUpdateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        deleted_at: new Date().toISOString(), // Timestamp when deleted
        status: 'canceled'                    // Update status to canceled
      })
      .eq('user_id', userId);

    // Handle errors updating subscription records
    if (subscriptionUpdateError) {
      console.error('Subscription update error:', subscriptionUpdateError);
    }

    // Return success response
    console.log('Account soft-deletion completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error in account soft-deletion:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process account deletion', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}); 