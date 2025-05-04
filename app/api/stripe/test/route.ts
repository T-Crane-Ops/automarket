/**
 * STRIPE TEST API ROUTE
 * 
 * This endpoint allows testing the Stripe connection. It makes a simple
 * request to Stripe to verify that the API key is valid and the connection
 * works properly.
 */

// Import required dependencies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe'; // For Stripe payment processing
import { withCors } from '@/utils/cors'; // CORS handling middleware

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * GET Function - Test Stripe connection
 * 
 * This function makes a simple request to Stripe to verify that the
 * connection is working properly. It's used for diagnostics and debugging.
 * The eslint-disable comment is used to silence warnings about the unused variable.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withCors(async function GET(request: NextRequest) {
  try {
    // Log that we're testing the connection
    console.log('Testing Stripe connection...');
    
    // Log a masked version of the API key for debugging (showing just the first 8 characters)
    console.log('Stripe key starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...');
    
    // Make a simple request to Stripe to verify the connection
    // The balance.retrieve() call is a lightweight operation that confirms API access
    await stripe.balance.retrieve();
    console.log('Stripe connection successful');
    
    // Return success response with partial key info (for debugging)
    return NextResponse.json({ 
      status: 'success',
      message: 'Stripe connection successful',
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...'
    });
  } catch (error) {
    // Log and return any errors that occur
    console.error('Stripe test failed:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}); 