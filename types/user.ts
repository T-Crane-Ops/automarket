import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  postal_code?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_preferences?: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  marketing_emails: boolean;
  in_app_notifications: boolean;
}

export interface UserProfileFormData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  country?: string;
  city?: string;
  postal_code?: string;
}

export interface AccountSettingsFormData {
  email?: string;
  password?: string;
  notification_preferences?: NotificationPreferences;
}

export interface PreferencesFormData {
  language?: string;
  theme_preference?: 'light' | 'dark' | 'system';
  currency?: string;
  timezone?: string;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
} 