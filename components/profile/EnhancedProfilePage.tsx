'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './PersonalInfoForm';
import { AccountSettingsForm } from './AccountSettingsForm';
import { PreferencesForm } from './PreferencesForm';
import { User, Settings, Sliders, CreditCard } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedProfilePageProps {
  subscriptionComponent: React.ReactNode;
}

export function EnhancedProfilePage({ subscriptionComponent }: EnhancedProfilePageProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const { profile } = useUserProfile();
  const { user } = useAuth();

  // Generate display name from available data
  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) return `${profile.first_name} ${profile.last_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Profile Header */}
      <div className="bg-background/50 backdrop-blur-sm border-b border-primary/10 p-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {getDisplayName()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 pb-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger 
                value="personal" 
                className="flex items-center gap-2"
                data-state={activeTab === 'personal' ? 'active' : ''}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Personal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="flex items-center gap-2"
                data-state={activeTab === 'account' ? 'active' : ''}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2"
                data-state={activeTab === 'preferences' ? 'active' : ''}
              >
                <Sliders className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Prefs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="flex items-center gap-2"
                data-state={activeTab === 'subscription' ? 'active' : ''}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Subscription</span>
                <span className="sm:hidden">Sub</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6">
            <TabsContent value="personal" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-muted-foreground">Manage your personal details and profile picture</p>
              </div>
              <PersonalInfoForm />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Account Settings</h2>
                <p className="text-muted-foreground">Update your email, password, and notification preferences</p>
              </div>
              <AccountSettingsForm />
            </TabsContent>

            <TabsContent value="preferences" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                <p className="text-muted-foreground">Customize your language, theme, and regional settings</p>
              </div>
              <PreferencesForm />
            </TabsContent>

            <TabsContent value="subscription" className="mt-0">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Subscription</h2>
                <p className="text-muted-foreground">Manage your subscription details and payment methods</p>
              </div>
              {subscriptionComponent}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 