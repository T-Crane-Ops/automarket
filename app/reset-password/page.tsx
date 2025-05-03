'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

function ResetPasswordContent() {
  const { supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically trigger reset password if email is present
  useEffect(() => {
    if (email && !success && !isLoading) {
      handleResetPassword();
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResetPassword = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password#`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="minimal" className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Invalid Request</CardTitle>
            <CardDescription>
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card variant="minimal" className="max-w-md w-full">
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 