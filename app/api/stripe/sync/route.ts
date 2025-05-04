/**
 * STRIPE SUBSCRIPTION SYNC API ROUTE
 * 
 * This endpoint synchronizes subscription data between Stripe and our database.
 * It's used to ensure that our database has the most up-to-date information
 * about a user's subscription status.
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
 * POST Function - Sync subscription data
 * 
 * This function takes a subscription ID and:
 * 1. Checks if the subscription exists in our database
 * 2. If not, creates a new record with data from Stripe
 * 3. If it exists, updates it with the latest data from Stripe
 */
export const POST = withCors(async function POST(request: NextRequest) {
  try {
    console.log('Starting sync process...');
    const { subscriptionId } = await request.json(); // Get subscription ID from request body
    
    // Validate that we have a subscription ID
    if (!subscriptionId) {
      console.error('No subscription ID provided');
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Check if the subscription already exists in our database
    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    // Handle database query errors (except "not found" errors)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscription:', checkError);
      throw checkError;
    }

    // If subscription doesn't exist in our database, create it
    if (!existingSubscription) {
      console.log('No existing subscription found, fetching from Stripe...');
      
      // Get full subscription details from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Get customer details to find the associated user ID
      const customerResponse = await stripe.customers.retrieve(stripeSubscription.customer as string);
      
      // Check if customer has been deleted
      if (customerResponse.deleted) {
        console.error('Customer has been deleted:', stripeSubscription.customer);
        throw new Error('Invalid customer');
      }

      // Cast to proper type and get user ID from customer metadata
      const customer = customerResponse as Stripe.Customer;
      const userId = customer.metadata?.user_id;

      // Make sure we have a user ID to link this subscription to
      if (!userId) {
        console.error('No user_id in customer metadata:', customer.id);
        throw new Error('No user_id found in customer metadata');
      }

      // Create new subscription record in our database
      const { error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeSubscription.customer as string,
          stripe_subscription_id: subscriptionId,
          status: stripeSubscription.status,
          price_id: stripeSubscription.items.data[0]?.price.id,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      // Handle errors creating subscription
      if (insertError) {
        console.error('Error creating subscription:', insertError);
        throw insertError;
      }
    } else {
      // If subscription exists, update it with the latest data from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId);

      // Handle errors updating subscription
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }
    }

    // Return success response
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    // Handle and log any errors
    console.error('Subscription sync failed:', error);
    return NextResponse.json({ 
      error: 'Failed to sync subscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}); 

// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { supabaseAdmin } from '@/utils/supabase-admin';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: Request) {
//   try {
//     const { subscriptionId } = await req.json();
    
//     // Fetch current subscription data from Stripe
//     const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
//     // Update Supabase with the latest Stripe data
//     const { error } = await supabaseAdmin
//       .from('subscriptions')
//       .update({
//         status: subscription.status,
//         cancel_at_period_end: subscription.cancel_at_period_end,
//         current_period_end: subscription.status === 'canceled' 
//           ? new Date().toISOString() 
//           : new Date(subscription.current_period_end * 1000).toISOString(),
//         updated_at: new Date().toISOString()
//       })
//       .eq('stripe_subscription_id', subscriptionId);

//     if (error) throw error;

//     return NextResponse.json({ status: 'success', subscription });
//   } catch (error) {
//     console.error('Subscription sync failed:', error);
//     return NextResponse.json(
//       { error: 'Failed to sync subscription' },
//       { status: 500 }
//     );
//   }
// } 