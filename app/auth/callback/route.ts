/**
 * AUTHENTICATION CALLBACK ROUTE
 * 
 * This file handles what happens after a user logs in or signs up with Supabase authentication.
 * It receives a special code from Supabase and converts it into a user session.
 */

// Import required tools
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Creates a Supabase client for use in route handlers
import { cookies } from 'next/headers'; // Allows us to access and manage browser cookies
import { NextResponse } from 'next/server'; // Helps us create standardized responses in Next.js

/**
 * The GET function is called when Supabase redirects back to our site after login
 * This happens when a user logs in, signs up, or resets their password
 */
export async function GET(request: Request) {
  console.log('AuthCallback: Processing callback');
  
  // Parse the URL to extract important parameters
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code'); // The authentication code from Supabase
  const next = requestUrl.searchParams.get('next'); // Where to send the user after successful login
  
  // If we have a code, we can exchange it for a user session
  if (code) {
    console.log('AuthCallback: Exchanging code for session');
    
    // Create a Supabase client that works with server functions and cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the temporary code for a permanent user session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      // Something went wrong with authentication
      console.error('AuthCallback: Error:', error);
      
      // Redirect to login page with an error message
      return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl.origin));
    }
    
    // Authentication successful! Now decide where to send the user
    if (next) {
      // If a 'next' URL was provided, go there
      console.log('AuthCallback: Redirecting to:', next);
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
    
    // Otherwise, go to the default dashboard page
    console.log('AuthCallback: Success, redirecting to home');
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  }
  
  // If no authentication code was provided, we can't complete login
  console.log('AuthCallback: No code present, redirecting to login');
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
} 