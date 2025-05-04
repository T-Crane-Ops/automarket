import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { UserProfile, UserProfileFormData, AccountSettingsFormData, PreferencesFormData } from '@/types/user';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
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
        setProfile(data as UserProfile);
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
        setProfile(createdProfile as UserProfile);
      }
    } catch (err) {
      console.error('Error fetching/creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user?.id, fetchProfile]);

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
      
      // Refresh profile data
      await fetchProfile();
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
      
      // Refresh profile data
      await fetchProfile();
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
      
      // Refresh profile data
      await fetchProfile();
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
      
      // Refresh profile data
      await fetchProfile();
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
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      
      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);
        
      if (subscriptionError) throw subscriptionError;
      
      // Combine all data
      const exportData = {
        user: userData.user,
        profile: profileData,
        subscriptions: subscriptionData
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create and trigger a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `user_data_${Date.now()}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      return { success: true };
    } catch (err) {
      console.error('Error exporting user data:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to export user data' 
      };
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