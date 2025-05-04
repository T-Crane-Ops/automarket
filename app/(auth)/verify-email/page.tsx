/**
 * VERIFY EMAIL PAGE
 * 
 * This page is shown to users after they sign up and need to verify their email address.
 * It provides information about checking their email and allows them to request a new
 * verification email if needed.
 */

'use client'; // This tells Next.js this is a client-side component (runs in browser)

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

function VerifyEmailContent() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Countdown timer for resend button
  useEffect(() => {
    // Set up a timer that decrements the countdown every second
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Clean up the timer when component unmounts
    return () => clearInterval(timer);
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      // Call Supabase to resend verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      setResendSuccess(true);
      // Reset countdown after successful resend
      setCountdown(60);
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to{' '}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Please check your email and click the verification link to continue.</p>
            
            {/* Success message when a new verification email is sent */}
            {resendSuccess && (
              <Alert variant="success" className="mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  New verification email sent!
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-3">
            {/* Resend button with countdown timer */}
            <Button
              variant="outline"
              className="w-full"
              disabled={countdown > 0 || isResending}
              onClick={handleResendEmail}
            >
              {isResending 
                ? 'Sending...'
                : countdown > 0 
                  ? `Resend email (${countdown}s)` 
                  : 'Resend verification email'
              }
            </Button>
            
            {/* Back to login button */}
            <Button 
              variant="link"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailContent />
    </Suspense>
  );
} 