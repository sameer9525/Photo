
"use client";

import type { User } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit3, Globe } from 'lucide-react'; // Removed UserPlus, MessageSquare as buttons moved
import NextLink from 'next/link'; 
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_COVER_IMAGE, DEFAULT_PROFILE_IMAGE } from '@/config/constants';

interface ProfileHeaderProps {
  profileUser: User;
  // No need for isFollowing or onToggleFollow if buttons are managed on the parent page
}

export function ProfileHeader({ profileUser }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const isCurrentUserProfile = currentUser?.id === profileUser.id;

  const coverImageSrc = profileUser.coverImageUrl || DEFAULT_COVER_IMAGE;
  const profileImageSrc = profileUser.profileImageUrl || DEFAULT_PROFILE_IMAGE;

  return (
    <div className="mb-8">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden bg-muted shadow-inner cursor-pointer group">
            <Image
              key={coverImageSrc} 
              src={coverImageSrc}
              alt={`${profileUser.displayName || profileUser.username}'s cover photo`}
              fill
              style={{ objectFit: 'cover' }} // Changed from objectFit prop to style
              className="object-center group-hover:opacity-90 transition-opacity"
              data-ai-hint="profile cover photo main"
              priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
           <DialogHeader>
             <DialogTitle className="sr-only">Cover photo of {profileUser.displayName || profileUser.username}</DialogTitle>
           </DialogHeader>
           <div className="relative aspect-video max-h-[90vh] w-full">
              <Image
                key={coverImageSrc} 
                src={coverImageSrc}
                alt={`${profileUser.displayName || profileUser.username}'s cover photo`}
                fill
                style={{ objectFit: 'contain' }} // Changed from objectFit prop to style
                className="rounded-lg"
                data-ai-hint="profile cover photo dialog"
              />
            </div>
        </DialogContent>
      </Dialog>

      <div className="bg-card p-6 rounded-b-xl shadow-lg relative -mt-16 md:-mt-20 mx-4 md:mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md -mt-12 md:-mt-16 shrink-0">
            <AvatarImage key={profileImageSrc} src={profileImageSrc} alt={profileUser.displayName || profileUser.username} data-ai-hint="profile avatar large display" />
            <AvatarFallback className="text-3xl md:text-4xl">
              {profileUser.displayName?.[0]?.toUpperCase() || profileUser.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-2xl md:text-3xl font-bold">{profileUser.displayName || profileUser.username}</h1>
            <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
            {profileUser.bio && <p className="text-sm text-foreground mt-2 max-w-prose whitespace-pre-wrap">{profileUser.bio}</p>}
             {profileUser.websiteUrl && (
              <div className="mt-2 flex items-center text-sm text-primary hover:underline justify-center md:justify-start">
                <Globe className="mr-2 h-4 w-4" />
                <a href={profileUser.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {profileUser.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

          {/* Action buttons are now managed on the parent profile page directly for non-currentUser profiles */}
          {isCurrentUserProfile && (
             <div className="flex gap-2 mt-4 md:mt-0 shrink-0">
                <Button asChild variant="outline">
                    <NextLink href="/profile/edit">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                    </NextLink>
                </Button>
             </div>
          )}
        </div>

        <div className="mt-6 flex justify-center md:justify-start md:pl-[calc(8rem+1.5rem)] lg:pl-[calc(8rem+1.5rem)] gap-x-6 gap-y-2 flex-wrap border-t border-border pt-4">
          <div className="text-sm text-center"> {/* Added text-center */}
            <span className="font-bold block">123</span> 
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div className="text-sm text-center"> {/* Added text-center */}
            <span className="font-bold block">{profileUser.followersCount.toLocaleString()}</span> 
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="text-sm text-center"> {/* Added text-center */}
            <span className="font-bold block">{profileUser.followingCount.toLocaleString()}</span> 
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}

