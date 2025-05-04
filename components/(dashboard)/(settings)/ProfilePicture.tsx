'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X } from 'lucide-react';

export function ProfilePicture({
  size = 'large',
  showUploadControls = true,
}: {
  size?: 'small' | 'medium' | 'large';
  showUploadControls?: boolean;
}) {
  const { profile, uploadAvatar } = useUserProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizesMap = {
    small: 'h-16 w-16',
    medium: 'h-20 w-20',
    large: 'h-24 w-24',
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setAvatarError('Image file should be less than 5MB');
      return;
    }

    setAvatarError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingAvatar(true);
    setAvatarError(null);
    setAvatarSuccess(false);

    try {
      const result = await uploadAvatar(selectedFile);
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload avatar');
      }

      setAvatarSuccess(true);
      setTimeout(() => {
        setAvatarSuccess(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      }, 3000);
    } catch (err) {
      console.error('Avatar Upload error:', err);
      setAvatarError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div>
      <div className="relative group">
        <Avatar className={`${sizesMap[size]} border border-border`}>
          <AvatarImage
            src={previewUrl || profile?.avatar_url || ''}
            alt={profile?.display_name || 'User profile picture'}
            key={profile?.avatar_url}
          />
          <AvatarFallback className="text-lg font-medium bg-secondary text-secondary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        {showUploadControls && (
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            aria-label="Change profile picture"
            disabled={isUploadingAvatar}
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showUploadControls && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploadingAvatar}
          />

          {avatarError && (
            <Alert variant="destructive" className="mt-4 text-sm">
              <AlertDescription>{avatarError}</AlertDescription>
            </Alert>
          )}

          {avatarSuccess && (
            <Alert className="mt-4 text-sm bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <AlertDescription>Profile picture updated successfully!</AlertDescription>
            </Alert>
          )}

          {previewUrl && !avatarSuccess && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAvatarUpload} disabled={isUploadingAvatar} size="sm" className="h-8 text-xs gap-1.5">
                {isUploadingAvatar ? (
                  <>
                    <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3 w-3" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={handleAvatarCancel} variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled={isUploadingAvatar}>
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 