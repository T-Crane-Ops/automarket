/**
 * STRIPE WEBHOOK HANDLER
 * 
 * This file processes webhook events from Stripe, which are notifications about
 * payment and subscription events. It updates our database based on these events.
 */

// Import required dependencies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe'; // For Stripe payment processing
import { supabaseAdmin } from '@/utils/supabase-admin'; // Admin Supabase client
import { withCors } from '@/utils/cors'; // CORS handling middleware

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper function for consistent logging
function logWebhookEvent(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] WEBHOOK: ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// Define interfaces for temporary data storage
interface StoredSessionData {
  userId: string;
  customerId: string;
}

interface StoredSubscriptionData {
  id: string;
  customer: string;
}

// Store checkout sessions and subscriptions temporarily in memory
// (This is a simple solution - production apps might use a database for this)
const checkoutSessionMap = new Map<string, StoredSessionData>();
const pendingSubscriptions = new Map<string, StoredSubscriptionData>();

// Disable body parsing for Stripe webhooks (Stripe requires raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to check if a customer already has an active subscription
async function checkExistingSubscription(customerId: string): Promise<boolean> {
  const { data: existingSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .in('status', ['active', 'trialing'])
    .single();

  return !!existingSubs;
}

/**
 * POST handler for Stripe webhooks
 * 
 * This function processes webhook events from Stripe, which are notifications
 * about various events like:
 * - Checkout completion
 * - Subscription creation, updates, and cancellation
 * - Payment success or failure
 */
export const POST = withCors(async function POST(request: NextRequest) {
  const body = await request.text(); // Get the raw request body
  const sig = request.headers.get('stripe-signature')!; // Get Stripe signature from headers

  try {
    logWebhookEvent('Received webhook request');
    logWebhookEvent('Stripe signature', sig);

    // Verify the webhook signature to ensure it's from Stripe
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    logWebhookEvent(`Event received: ${event.type}`, event.data.object);

    // Handle different types of events
    switch (event.type) {
      case 'checkout.session.completed': {
        // Customer completed the checkout process
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Check for existing active subscription to prevent duplicates
        const hasActiveSubscription = await checkExistingSubscription(session.customer as string);
        
        if (hasActiveSubscription) {
          logWebhookEvent('Duplicate subscription attempt blocked', {
            customerId: session.customer,
            sessionId: session.id
          });
          
          // Cancel the new subscription immediately to prevent double-charging
          if (session.subscription) {
            await stripe.subscriptions.cancel(session.subscription as string);
          }
          
          return NextResponse.json({ 
            status: 'blocked',
            message: 'Customer already has an active subscription'
          });
        }

        logWebhookEvent('Processing checkout.session.completed', {
          sessionId: session.id,
          clientReferenceId: session.client_reference_id,
          customerId: session.customer,
          subscriptionId: session.subscription
        });

        // Validate that we have all needed data
        if (!session.client_reference_id || !session.customer || !session.subscription) {
          logWebhookEvent('Missing required session data', {
            clientReferenceId: session.client_reference_id,
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
        }

        try {
          // Create a subscription record in our database
          const subscription = await createSubscription(
            session.subscription as string,
            session.client_reference_id!,
            session.customer as string
          );
          logWebhookEvent('Successfully created subscription', subscription);
        } catch (error) {
          logWebhookEvent('Failed to create subscription', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.created': {
        // A new subscription was created
        const subscription = event.data.object as Stripe.Subscription;
        
        // Check if we have session data to associate this subscription with a user
        const sessionData = checkoutSessionMap.get(subscription.id);
        if (sessionData) {
          // We can create the subscription record in our database
          await createSubscription(
            subscription.id,
            sessionData.userId,
            sessionData.customerId
          );
          checkoutSessionMap.delete(subscription.id);
        } else {
          // Store this subscription until we get session data
          pendingSubscriptions.set(subscription.id, {
            id: subscription.id,
            customer: subscription.customer as string
          });
        }
        break;
      }

      // These events update subscription status in our database
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.pending_update_applied':
      case 'customer.subscription.pending_update_expired':
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update our database with the latest subscription status
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription was permanently deleted (or expired)
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update our database to mark subscription as deleted
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: false,
            current_period_end: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      // Additional events could be handled here:
      // - invoice.paid
      // - invoice.payment_failed
      // - customer.subscription.trial_will_end
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (err) {
    // Log and return error response
    logWebhookEvent('Webhook error', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
});

/**
 * Helper function to create or update a subscription in our database
 * 
 * This function:
 * 1. Retrieves detailed subscription data from Stripe
 * 2. Checks if we already have this subscription in our database
 * 3. Creates or updates the subscription record
 */
async function createSubscription(subscriptionId: string, userId: string, customerId: string) {
  logWebhookEvent('Starting createSubscription', { subscriptionId, userId, customerId });

  try {
    // Get detailed subscription data from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    logWebhookEvent('Retrieved Stripe subscription', stripeSubscription);

    // Check if this subscription already exists in our database
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (checkError) {
      logWebhookEvent('Error checking existing subscription', checkError);
    }

    if (existingData) {
      // If subscription exists, update it with the latest data
      logWebhookEvent('Found existing subscription', existingData);
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)
        .select()
        .single();

      if (updateError) {
        logWebhookEvent('Error updating existing subscription', updateError);
        throw updateError;
      }
      return existingData;
    }

    // If subscription doesn't exist, create a new record
    logWebhookEvent('Creating new subscription record');
    const { data, error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: stripeSubscription.status,
        price_id: stripeSubscription.items.data[0]?.price.id,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      logWebhookEvent('Error inserting new subscription', insertError);
      throw insertError;
    }

    logWebhookEvent('Successfully created new subscription', data);
    return data;
  } catch (error) {
    logWebhookEvent('Error in createSubscription', error);
    throw error;
  }
} 