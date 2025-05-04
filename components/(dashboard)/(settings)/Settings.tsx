'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, Sliders, CreditCard, RefreshCw } from 'lucide-react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { AccountSettingsForm } from './AccountSettingsForm';
import { PreferencesForm } from './PreferencesForm';
import { SubscriptionManager } from './SubscriptionManager';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfilePageProps {
  initialTab?: string;
  isEmbedded?: boolean;
  onBackToMain?: () => void;
}

// Memoize the individual forms to prevent unnecessary rerenders
const MemoizedPersonalInfoForm = memo(PersonalInfoForm);
const MemoizedAccountSettingsForm = memo(AccountSettingsForm);
const MemoizedPreferencesForm = memo(PreferencesForm);
const MemoizedSubscriptionManager = memo(SubscriptionManager);

export function ProfilePage({
  initialTab = 'personal',
  isEmbedded = false,
  onBackToMain
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { profile, isLoading, error, fetchProfile } = useUserProfile();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Use localStorage to persist the active tab, but only on client side
  useEffect(() => {
    // Try to load the active tab from localStorage
    try {
      const savedTab = localStorage.getItem('settings-active-tab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, []);

  // Save the active tab to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('settings-active-tab', activeTab);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [activeTab]);

  // Handle initial data loading
  useEffect(() => {
    if (!isLoading && !initialDataLoaded) {
      setInitialDataLoaded(true);
    }
  }, [isLoading, initialDataLoaded]);

  // If data isn't loaded within 5 seconds, force a refresh
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (!initialDataLoaded && !isRefreshing && !error) {
      timeoutId = setTimeout(() => {
        handleRefresh();
      }, 5000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialDataLoaded, isRefreshing, error]);

  // Memoize these functions to prevent recreating them on each render
  const getDisplayName = useCallback(() => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) return `${profile.first_name} ${profile.last_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  }, [profile, user]);

  const getInitials = useCallback(() => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [getDisplayName]);

  const getAccountStatus = useCallback(() => {
    if (!profile) return null;
    
    // Get subscription data from user metadata since it's not in the profile
    const subscriptionData = user?.user_metadata || {};
    const isPremium = subscriptionData?.subscription_tier === 'premium' || 
                     subscriptionData?.plan === 'premium';
    const isPro = subscriptionData?.subscription_tier === 'pro' || 
                 subscriptionData?.plan === 'pro';
    
    if (isPremium) {
      return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">Premium</Badge>;
    } else if (isPro) {
      return <Badge className="bg-gradient-to-r from-blue-400 to-purple-600">Pro</Badge>;
    }
    
    return <Badge variant="outline">Free</Badge>;
  }, [profile, user]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    // Use a local variable to track refresh state within this function
    let isCurrentlyRefreshing = true;
    setIsRefreshing(true);
    
    try {
      await fetchProfile(true); // Force a fresh fetch
    } catch (e) {
      console.error('Error refreshing profile:', e);
    } finally {
      // Only update state if the component is still mounted and the refresh is still ongoing
      if (isCurrentlyRefreshing) {
        setIsRefreshing(false);
        isCurrentlyRefreshing = false;
      }
    }
  }, [fetchProfile, isRefreshing]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const renderLoadingError = useCallback(() => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mb-6">
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
    );
  }, [error, handleRefresh, isRefreshing]);

  const renderLoadingSkeleton = useCallback(() => {
    if (!isLoading) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        
        <Skeleton className="h-10 w-full max-w-md" />
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }, [isLoading]);

  return (
    <div className="w-full py-4">
      {isLoading && !error && !initialDataLoaded && (
        <div className="flex items-center justify-center mb-6 text-sm text-muted-foreground">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span>Loading your profile...</span>
        </div>
      )}
      
      {renderLoadingError()}
      
      {isLoading && !initialDataLoaded ? renderLoadingSkeleton() : (
        <>
          {!error && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-56 shrink-0">
                <div className="md:sticky md:top-4 max-h-[calc(100vh-120px)]">
                  <div className="flex items-center space-x-3 mb-5">
                    <Avatar className="h-14 w-14 border border-primary/10">
                      <AvatarImage src={profile?.avatar_url} alt={getDisplayName()} />
                      <AvatarFallback className="text-sm bg-secondary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{getDisplayName()}</p>
                        {getAccountStatus()}
                      </div>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      className={cn(
                        "flex items-center text-left w-full px-3 py-2 h-9 rounded-md font-normal text-sm",
                        activeTab === "personal" ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                      onClick={() => handleTabChange("personal")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Personal
                    </button>
                    
                    <button
                      className={cn(
                        "flex items-center text-left w-full px-3 py-2 h-9 rounded-md font-normal text-sm",
                        activeTab === "account" ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                      onClick={() => handleTabChange("account")}
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Account
                    </button>
                    
                    <button
                      className={cn(
                        "flex items-center text-left w-full px-3 py-2 h-9 rounded-md font-normal text-sm",
                        activeTab === "preferences" ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                      onClick={() => handleTabChange("preferences")}
                    >
                      <Sliders className="h-4 w-4 mr-2" />
                      Preferences
                    </button>
                    
                    <button
                      className={cn(
                        "flex items-center text-left w-full px-3 py-2 h-9 rounded-md font-normal text-sm",
                        activeTab === "subscription" ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                      onClick={() => handleTabChange("subscription")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Subscription
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="w-full justify-start text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {isRefreshing ? (
                        <>
                          <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3" />
                          Refresh Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 max-w-3xl overflow-y-auto">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="sr-only">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="mt-0 space-y-4">
                    <h2 className="text-xl font-medium mb-4">Personal Information</h2>
                    <MemoizedPersonalInfoForm />
                  </TabsContent>

                  <TabsContent value="account" className="mt-0 space-y-4">
                    <h2 className="text-xl font-medium mb-4">Account Settings</h2>
                    <MemoizedAccountSettingsForm />
                  </TabsContent>

                  <TabsContent value="preferences" className="mt-0 space-y-4">
                    <h2 className="text-xl font-medium mb-4">Preferences</h2>
                    <MemoizedPreferencesForm />
                  </TabsContent>

                  <TabsContent value="subscription" className="mt-0 space-y-4">
                    <h2 className="text-xl font-medium mb-4">Subscription</h2>
                    <MemoizedSubscriptionManager />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 