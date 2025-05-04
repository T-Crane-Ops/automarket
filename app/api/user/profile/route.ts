import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
  
  if (!profile) {
    // Create a new profile if none exists
    const newProfile = {
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select('*')
      .single();
      
    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(createdProfile);
  }
  
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  // Get the update data
  const updates = await req.json();
  
  // Validate updates (basic validation)
  if (typeof updates !== 'object' || updates === null) {
    return NextResponse.json(
      { error: 'Invalid update data' },
      { status: 400 }
    );
  }
  
  // Add updated_at timestamp
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Update the profile
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updatesWithTimestamp)
    .eq('user_id', user.id)
    .select('*')
    .single();
    
  if (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
  
  return NextResponse.json(data);
} 