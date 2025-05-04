/**
 * LOGIN PAGE
 * 
 * This file creates the login page for the application. It handles both sign-in
 * and sign-up functionality, and redirects users after successful authentication.
 */

'use client'; // This tells Next.js that this is a client-side component (runs in the browser)

// Import necessary hooks and components
import { useState, useEffect } from 'react'; // React hooks for state management and side effects
import { useAuth } from '@/contexts/AuthContext'; // Custom hook that provides authentication functions
import { useRouter, useSearchParams } from 'next/navigation'; // Next.js navigation hooks
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // UI components
import { LoginForm } from '@/components/LoginForm'; // Our custom login form component

export default function LoginPage() {
  // Get authentication functions from our custom auth context
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  // Next.js router for navigation
  const router = useRouter();
  
  // Get URL parameters (for where to redirect after login)
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard'; // Default to dashboard if no redirect specified
  
  // State variables to track errors and loading state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This effect runs when the component mounts or when dependencies change
  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect them
      router.replace(redirect);
    } else {
      // Otherwise stop loading state
      setIsLoading(false);
    }
  }, [user, router, redirect]); // Dependencies for this effect

  // Function to handle form submission
  const handleSubmit = async (email: string, password: string, isSignUp: boolean) => {
    setError(''); // Clear any previous errors
    setIsLoading(true); // Show loading state

    try {
      if (isSignUp) {
        // Handle sign up (new user registration)
        const { data, error } = await signUpWithEmail(email, password);
        if (error) throw error;
        
        // Check if email verification is required
        if (data?.user && !data.user.email_confirmed_at) {
          // Redirect to verify email page if email needs verification
          router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        
        // Otherwise redirect to the requested page
        router.replace(redirect);
      } else {
        // Handle sign in (existing user login)
        await signInWithEmail(email, password);
        router.replace(redirect);
      }
    } catch (error) {
      // Handle any errors during authentication
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      // Always set loading to false when done
      setIsLoading(false);
    }
  };

  // Show loading spinner while waiting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render the login page with background image and card
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[url('/login.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-md">
        <Card className="bg-background/50 backdrop-blur-lg border border-primary/20 shadow-lg rounded-xl">
          <CardHeader className="text-center space-y-2">
          </CardHeader>
          <CardContent>
            {/* Pass all necessary props to our login form component */}
            <LoginForm
              onSubmit={handleSubmit}
              onGoogleSignIn={signInWithGoogle}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 