import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function AccountManagement() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user signed in with OAuth
  const isOAuthUser = user?.app_metadata?.provider === 'google';

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError('');
    
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
    } catch (error) {
      console.error('Delete account error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>

      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="mb-6 space-y-2">
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Last Sign In:</span> {new Date(user?.last_sign_in_at || '').toLocaleString()}</p>
          <p><span className="font-medium">Account Type:</span> {isOAuthUser ? 'Google Account' : 'Email Account'}</p>
        </div>
        
        <div className="">
          {!isOAuthUser && (
            <button
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(user?.email || '')}`)}
              className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Reset Password
            </button>
          )}
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        {subscription ? (
          <div>
            <p className="mb-2">Status: <span className="font-medium text-success capitalize">{subscription.status}</span></p>
            <p className="mb-4">Plan: <span className="font-medium">{subscription.plan}</span></p>
            <button 
              onClick={handleManageSubscription}
              className="block w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Manage Subscription
            </button>
          </div>
        ) : (
          <p>No active subscription.</p>
        )}
      </div>

      {/* Danger Zone Section */}
      <div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full text-left px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 