/**
 * RESET PASSWORD PAGE
 * 
 * This page allows users to request a password reset. It automatically sends a reset
 * email to the provided email address and displays the appropriate status messages.
 */

'use client'; // This tells Next.js this is a client-side component (runs in browser)

// Import necessary libraries and components
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // For authentication functions
import { useSearchParams, useRouter } from 'next/navigation'; // For navigation and URL parameters
import LoadingSpinner from '@/components/LoadingSpinner'; // Loading indicator
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // UI components
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'; // Icons

// Main component content, wrapped with Suspense in the exported component
function ResetPasswordContent() {
  const { supabase } = useAuth(); // Get Supabase client from auth context
  const router = useRouter(); // Next.js router for navigation
  const searchParams = useSearchParams(); // Get URL parameters
  const email = searchParams.get('email'); // Extract email from URL
  
  // State variables for tracking status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically trigger reset password if email is present
  useEffect(() => {
    if (email && !success && !isLoading) {
      handleResetPassword();
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to handle the password reset request
  const handleResetPassword = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Call Supabase auth to send reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password#`, // Where to send the user after clicking reset link
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // If no email is provided, show error message
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Invalid Request</CardTitle>
            <CardDescription className="text-muted-foreground">
              No email address provided for password reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main component UI - shows status of reset request
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {success 
              ? 'Instructions sent to your email' 
              : `Sending reset link to: ${email}`
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Show error message if there was a problem */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="link"
                  onClick={handleResetPassword}
                  className="ml-2 p-0 h-auto"
                >
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Show success message or loading state */}
          {success ? (
            <div className="space-y-4">
              <Alert variant="success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Reset link has been sent to your email address. Please check your inbox.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Back to login
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {isLoading ? 'Sending reset link...' : 'Processing your request...'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main exported component with Suspense for loading states
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 