/**
 * USER PROFILE API ROUTE
 * 
 * This file handles API endpoints for getting and updating user profile data.
 * It provides two functions:
 * 1. GET - Fetch the user's profile information
 * 2. PUT - Update the user's profile information
 */

// Import required dependencies
import { NextRequest, NextResponse } from 'next/server'; // For handling API requests/responses
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // For Supabase authentication
import { cookies } from 'next/headers'; // For accessing cookies

/**
 * GET Function - Retrieve user profile
 * 
 * This function handles GET requests to fetch the user's profile data.
 * If no profile exists, it creates a new one.
 */
export async function GET(req: NextRequest) {
  // Create a Supabase client that works with route handlers and cookies
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get the current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // If no user is authenticated or there's an error, return 401 Unauthorized
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Try to get the user's profile from the database
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  // Handle database errors (except "not found" errors)
  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
  
  // If no profile exists, create a new one
  if (!profile) {
    // Prepare new profile data
    const newProfile = {
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insert the new profile into the database
    const { data: createdProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select('*')
      .single();
      
    // If there was an error creating the profile, return error
    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }
    
    // Return the newly created profile
    return NextResponse.json(createdProfile);
  }
  
  // Return the existing profile
  return NextResponse.json(profile);
}

/**
 * PUT Function - Update user profile
 * 
 * This function handles PUT requests to update the user's profile data.
 * It validates the request and updates the profile in the database.
 */
export async function PUT(req: NextRequest) {
  // Create a Supabase client that works with route handlers and cookies
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get the current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // If no user is authenticated or there's an error, return 401 Unauthorized
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Get the update data from the request body
  const updates = await req.json();
  
  // Basic validation of the update data
  if (typeof updates !== 'object' || updates === null) {
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    );
  }
  
  // Add updated_at timestamp to the update data
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Update the profile in the database
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updatesWithTimestamp)
    .eq('user_id', user.id)
    .select('*')
    .single();
    
  // Handle update errors
  if (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
  
  // Return the updated profile data
  return NextResponse.json(data);
} 