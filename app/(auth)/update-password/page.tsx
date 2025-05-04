/**
 * UPDATE PASSWORD PAGE
 * 
 * This page allows users to set a new password after clicking a reset password link.
 * It validates the recovery link parameters and handles the password update process.
 */

'use client'; // This tells Next.js this is a client-side component (runs in browser)

// Import necessary libraries and components
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // For authentication functions
import { useRouter } from 'next/navigation'; // For navigation
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'; // Icons

export default function UpdatePasswordPage() {
  // Get Supabase client from auth context
  const { supabase } = useAuth();
  const router = useRouter();
  
  // State for password form and validation
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidHash, setIsValidHash] = useState(false); // Tracks if the recovery link is valid

  // Check if we have a valid hash in the URL when the component mounts
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Extract parameters from the URL hash
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Verify this is a recovery link with valid tokens
      if (type === 'recovery' && accessToken) {
        // Try to set the session with the tokens
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        }).then(({ error }) => {
          if (error) {
            setError('Invalid or expired recovery link');
          } else {
            setIsValidHash(true); // Hash is valid, enable the form
          }
        });
      } else {
        setError('Invalid recovery link');
      }
    } else {
      setError('Missing authentication token');
    }
  }, [supabase.auth]); // Only run when supabase.auth changes

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password length for basic security
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call Supabase to update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setSuccess(true);
      // Redirect to login after successful password update
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the password update form
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Update Password</CardTitle>
          <CardDescription>
            Enter a new secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error alert shown if there are any issues */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success message or password form */}
          {success ? (
            <div className="space-y-4">
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Password updated successfully! Redirecting to login...
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={!isValidHash || isLoading}
                />
              </div>
              
              {/* Confirm password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={!isValidHash || isLoading}
                />
              </div>
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={!isValidHash || isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
              
              {/* Back to login link */}
              <div className="text-center text-sm">
                <Button
                  variant="link"
                  onClick={() => router.push('/login')}
                  className="text-primary"
                >
                  Back to login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 