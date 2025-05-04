'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AccountSettingsFormData, NotificationPreferences } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Save, DownloadCloud, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AccountSettingsForm() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { profile, isLoading, updateAccountSettings, exportUserData } = useUserProfile();
  const [formData, setFormData] = useState<AccountSettingsFormData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        email: user.email || '',
        password: '',
        notification_preferences: profile.notification_preferences || {
          email_notifications: true,
          marketing_emails: false,
          in_app_notifications: true
        }
      });
    }
  }, [user, profile]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setFormData(prev => ({
      ...prev,
      notification_preferences: {
        ...(prev.notification_preferences || {
          email_notifications: true,
          marketing_emails: false,
          in_app_notifications: true
        }),
        [key]: !prev.notification_preferences?.[key]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateAccountSettings(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update account settings');
      }

      setSuccess(true);
      setFormData(prev => ({ ...prev, password: '' }));
      setPasswordConfirm('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update account settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      await exportUserData();
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Failed to export user data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/user/delete?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      await signOut();
      router.push('/login');
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const isOAuthUser = user?.app_metadata?.provider === 'google';

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
        <div className="h-10 bg-secondary/60 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        {success && (
          <Alert className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <AlertDescription>Account settings updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleTextChange}
              placeholder="Enter your email address"
              disabled={isOAuthUser}
              className="h-9"
            />
            {isOAuthUser && (
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed for accounts connected with Google.
              </p>
            )}
          </div>

          {!isOAuthUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleTextChange}
                  placeholder="Enter new password"
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to keep your current password.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm New Password</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={!formData.password}
                  className="h-9"
                />
              </div>
            </>
          )}

          <div className="mt-5 pt-5 border-t border-border/40">
            <h3 className="text-sm font-medium mb-3">Notification Preferences</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications" className="text-sm">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={formData.notification_preferences?.email_notifications || false}
                  onCheckedChange={() => handleNotificationToggle('email_notifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing_emails" className="text-sm">Marketing Emails</Label>
                  <p className="text-xs text-muted-foreground">Receive marketing and promotional emails</p>
                </div>
                <Switch
                  id="marketing_emails"
                  checked={formData.notification_preferences?.marketing_emails || false}
                  onCheckedChange={() => handleNotificationToggle('marketing_emails')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="in_app_notifications" className="text-sm">In-App Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications in the app</p>
                </div>
                <Switch
                  id="in_app_notifications"
                  checked={formData.notification_preferences?.in_app_notifications || false}
                  onCheckedChange={() => handleNotificationToggle('in_app_notifications')}
                />
              </div>
            </div>
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

      <div className="pt-5 border-t border-border/40">
        <h3 className="text-sm font-medium mb-3">Account Data</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleExportData} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <DownloadCloud className="h-3.5 w-3.5" />
            Export My Data
          </Button>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8 text-xs gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogDescription className="text-sm">
                  This action cannot be undone. All your data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>

              {deleteError && (
                <Alert variant="destructive" className="my-3 text-sm">
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="h-8 text-xs gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : 'Delete Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-3">
          <p className="text-xs text-muted-foreground">
            Account created: {user ? new Date(user.created_at).toLocaleDateString() : '-'}
          </p>
          <p className="text-xs text-muted-foreground">
            Last sign in: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>
    </div>
  );
} 