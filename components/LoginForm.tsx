'use client';

import { useState } from 'react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

interface LoginFormProps {
  onSubmit: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ 
  onSubmit, 
  onGoogleSignIn, 
  isLoading, 
  error 
}: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, isSignUp);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto p-6 rounded-lg border border-border/30 shadow-sm bg-card">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="bg-background border-border focus:border-primary h-11"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            {!isSignUp && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="px-0 font-medium text-primary hover:text-primary/80"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Forgot password?
              </Button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="bg-background border-border focus:border-primary h-11"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 font-medium text-base" 
          disabled={isLoading}
        >
          {isLoading 
            ? 'Processing...' 
            : isSignUp 
              ? 'Create Account' 
              : 'Sign In'
          }
        </Button>

        <div className="relative flex items-center my-6">
          <hr className="flex-grow border-border" />
          <span className="px-4 text-foreground/80 font-medium">or</span>
          <hr className="flex-grow border-border" />
        </div>

        <Button 
          variant="outline" 
          onClick={onGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 h-11 border-border"
        >
          <Image
            src="/Google-Logo.png"
            alt="Google Logo"
            width={18}
            height={18}
            className="mr-2"
          />
          <span className="font-medium">
            {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
          </span>
        </Button>

        <div className="text-center pt-2">
          <Button
            type="button"
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium hover:text-primary/80"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
          </Button>
        </div>
      </form>

      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}