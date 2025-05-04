import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { UserProfile, UserProfileFormData, AccountSettingsFormData, PreferencesFormData } from '@/types/user';

// Create a global cache for profiles to share across hook instances
const globalProfileCache: { [key: string]: { data: UserProfile, timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAttempts = useRef(0);
  const maxRetries = 3;
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Use a ref to track if we're currently fetching to avoid race conditions
  const isCurrentlyFetching = useRef(false);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!user?.id) return;
    
    // Prevent multiple simultaneous fetches
    if (isCurrentlyFetching.current && !forceRefresh) return;
    isCurrentlyFetching.current = true;

    // Don't show loading indicator on retries to avoid UI flicker
    if (!profile) setIsLoading(true);
    setError(null);

    try {
      // Check if we have a fresh cached profile
      const now = Date.now();
      const cachedProfile = globalProfileCache[user.id];
      
      if (!forceRefresh && cachedProfile && (now - cachedProfile.timestamp < CACHE_DURATION)) {
        if (isMounted.current) {
          setProfile(cachedProfile.data);
          setIsLoading(false);
        }
        isCurrentlyFetching.current = false;
        return;
      }

      // Try to get existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      if (data) {
        // Update the global cache
        globalProfileCache[user.id] = {
          data: data as UserProfile,
          timestamp: Date.now()
        };
        
        if (isMounted.current) {
          setProfile(data as UserProfile);
          fetchAttempts.current = 0; // Reset attempts on success
        }
      } else {
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

        if (createError) throw createError;
        
        // Update the global cache
        globalProfileCache[user.id] = {
          data: createdProfile as UserProfile,
          timestamp: Date.now()
        };
        
        if (isMounted.current) {
          setProfile(createdProfile as UserProfile);
          fetchAttempts.current = 0; // Reset attempts on success
        }
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
      
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        
        // Implement retry logic
        if (fetchAttempts.current < maxRetries) {
          fetchAttempts.current += 1;
          console.log(`Retrying profile fetch (attempt ${fetchAttempts.current} of ${maxRetries})...`);
          
          // Clear any existing timeout
          if (retryTimeout.current) clearTimeout(retryTimeout.current);
          
          // Exponential backoff: 1s, 2s, 4s, etc.
          const delay = Math.min(1000 * Math.pow(2, fetchAttempts.current - 1), 10000);
          retryTimeout.current = setTimeout(() => fetchProfile(true), delay);
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      isCurrentlyFetching.current = false;
    }
  }, [user?.id]);

  // Set up cleanup on component unmount
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    fetchAttempts.current = 0; // Reset attempts when user changes
    
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user?.id, fetchProfile]);

  // Helper function to invalidate cache and refresh
  const invalidateCache = useCallback(() => {
    if (user?.id && user.id in globalProfileCache) {
      delete globalProfileCache[user.id];
    }
  }, [user?.id]);

  const updatePersonalInfo = async (formData: UserProfileFormData) => {
    if (!user?.id || !profile?.id) return { success: false, error: 'User not authenticated' };
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      // Invalidate cache and refresh profile data
      invalidateCache();
      await fetchProfile(true);
      return { success: true };
    } catch (err) {
      console.error('Error updating personal info:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update profile' 
      };
    }
  };

  const updateAccountSettings = async (formData: AccountSettingsFormData) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    try {
      // Update email if provided
      if (formData.email && formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (emailError) throw emailError;
      }
      
      // Update password if provided
      if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });
        if (passwordError) throw passwordError;
      }
      
      // Update notification preferences if provided
      if (formData.notification_preferences && profile?.id) {
        const { error: prefError } = await supabase
          .from('user_profiles')
          .update({
            notification_preferences: formData.notification_preferences,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
          
        if (prefError) throw prefError;
      }
      
      // Invalidate cache and refresh profile data
      invalidateCache();
      await fetchProfile(true);
      return { success: true };
    } catch (err) {
      console.error('Error updating account settings:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update account settings' 
      };
    }
  };

  const updatePreferences = async (formData: PreferencesFormData) => {
    if (!user?.id || !profile?.id) return { success: false, error: 'User not authenticated' };
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      // Invalidate cache and refresh profile data
      invalidateCache();
      await fetchProfile(true);
      return { success: true };
    } catch (err) {
      console.error('Error updating preferences:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update preferences' 
      };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id || !profile?.id) return { success: false, error: 'User not authenticated' };
    
    try {
      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
        
      if (updateError) throw updateError;
      
      // Invalidate cache and refresh profile data
      invalidateCache();
      await fetchProfile(true);
      return { success: true, avatarUrl: urlData.publicUrl };
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to upload avatar' 
      };
    }
  };

  const exportUserData = async () => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      // Fetch user data from all related tables
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id);
        
      if (profileError) throw profileError;
      
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(user.id);
      if (authError) throw authError;
      
      // Get other user-related data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);
        
      if (subscriptionError) throw subscriptionError;
      
      // Combine all data
      const userData = {
        profile: profileData[0] || null,
        auth: {
          email: authData?.user?.email,
          created_at: authData?.user?.created_at,
          last_sign_in: authData?.user?.last_sign_in_at
        },
        subscription: subscriptionData[0] || null,
        exported_at: new Date().toISOString()
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // Trigger download
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', dataUri);
      downloadLink.setAttribute('download', `user_data_export_${new Date().toISOString()}.json`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      return { success: true };
    } catch (err) {
      console.error('Error exporting user data:', err);
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updatePersonalInfo,
    updateAccountSettings,
    updatePreferences,
    uploadAvatar,
    exportUserData
  };
}; 