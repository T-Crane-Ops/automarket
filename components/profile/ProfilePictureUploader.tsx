'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProfilePictureUploader() {
  const { profile, uploadAvatar } = useUserProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file should be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await uploadAvatar(selectedFile);
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload avatar');
      }
      
      setSuccess(true);
      
      // Reset after successful upload
      setTimeout(() => {
        setSuccess(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Get initials from name or email
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
    <div className="flex flex-col items-center">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-primary/10">
          <AvatarImage 
            src={previewUrl || profile?.avatar_url || ''} 
            alt="Profile picture" 
          />
          <AvatarFallback className="text-lg font-medium bg-secondary text-secondary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Change profile picture"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {error && (
        <Alert variant="destructive" className="mt-4 w-full max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mt-4 w-full max-w-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <AlertDescription>Profile picture updated successfully!</AlertDescription>
        </Alert>
      )}
      
      {previewUrl && (
        <div className="mt-4 flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            size="sm"
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button 
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
} 