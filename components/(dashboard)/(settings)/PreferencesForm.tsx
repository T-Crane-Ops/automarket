'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from 'next-themes';
import { PreferencesFormData } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Save, Monitor, Sun, Moon } from 'lucide-react';

// Constants
const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'nl', label: 'Dutch' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
];

export function PreferencesForm() {
  const { profile, isLoading, updatePreferences } = useUserProfile();
  const { setTheme } = useTheme();
  const [formData, setFormData] = useState<PreferencesFormData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        language: profile.language || 'en',
        theme_preference: profile.theme_preference || 'system',
        currency: profile.currency || 'USD',
        timezone: profile.timezone || 'America/New_York',
      });
    }
  }, [profile]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'theme_preference') {
      setTheme(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updatePreferences(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update preferences');
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Preferences Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {success && (
        <Alert className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <AlertDescription>Preferences updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={formData.language || 'en'}
            onValueChange={(value) => handleSelectChange('language', value)}
            disabled={isSaving}
          >
            <SelectTrigger id="language" className="h-9">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <ToggleGroup
            type="single"
            value={formData.theme_preference || 'system'}
            onValueChange={(value) => {
              if (value) handleSelectChange('theme_preference', value);
            }}
            className="justify-start"
            disabled={isSaving}
          >
            <ToggleGroupItem value="light" aria-label="Light theme" className="h-9 gap-1.5 text-sm">
              <Sun className="h-3.5 w-3.5" /> Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Dark theme" className="h-9 gap-1.5 text-sm">
              <Moon className="h-3.5 w-3.5" /> Dark
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="System theme" className="h-9 gap-1.5 text-sm">
              <Monitor className="h-3.5 w-3.5" /> System
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency || 'USD'}
            onValueChange={(value) => handleSelectChange('currency', value)}
            disabled={isSaving}
          >
            <SelectTrigger id="currency" className="h-9">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Zone */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Time Zone</Label>
          <Select
            value={formData.timezone || 'America/New_York'}
            onValueChange={(value) => handleSelectChange('timezone', value)}
            disabled={isSaving}
          >
            <SelectTrigger id="timezone" className="h-9">
              <SelectValue placeholder="Select a time zone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map(timezone => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Button */}
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