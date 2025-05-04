'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileFormData } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfilePicture } from './ProfilePicture';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, RefreshCw } from 'lucide-react';

export function PersonalInfoForm() {
  const { profile, isLoading, error, updatePersonalInfo, fetchProfile } = useUserProfile();
  const [formData, setFormData] = useState<UserProfileFormData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initializeForm = useCallback(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        country: profile.country || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setSuccess(false);

    try {
      const result = await updatePersonalInfo(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProfile(true); // Force refresh
    setIsRefreshing(false);
  };

  // Display a loading skeleton when data is loading
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-20 bg-secondary/60 rounded-md"></div>
      </div>
    );
  }

  // Handle error state 
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load profile: {error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-2 gap-2"
            >
              {isRefreshing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <ProfilePicture size="medium" />
      </div>

      {formError && <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>}
      {success && (
        <Alert className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input 
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input 
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input 
            id="display_name"
            name="display_name"
            value={formData.display_name || ''}
            onChange={handleChange}
            placeholder="Choose a display name"
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio"
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself"
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input 
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            placeholder="Enter your phone number"
            type="tel"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country"
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              placeholder="Enter your country"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Enter your city"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input 
            id="postal_code"
            name="postal_code"
            value={formData.postal_code || ''}
            onChange={handleChange}
            placeholder="Enter your postal code"
            className="h-9 max-w-xs"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="sm" disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 