
"use client";

import type { Photo, User, Comment as CommentType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PhotoCardProps {
  photo: Photo;
  currentUser?: User | null;
}

export function PhotoCard({ photo, currentUser }: PhotoCardProps) {
  const { user: authUser } = useAuth(); 
  const { toast } = useToast();

  const photoUser = photo.user || { 
    id: 'unknown',
    username: 'UnknownUser',
    profileImageUrl: "https://placehold.co/40x40.png",
    displayName: "Unknown",
    followersCount: 0,
    followingCount: 0,
    bio: ""
  };

  const [isLiked, setIsLiked] = useState(photo.isLikedByCurrentUser || false);
  const [localLikesCount, setLocalLikesCount] = useState(photo.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(photo.isBookmarkedByCurrentUser || false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [displayedComments, setDisplayedComments] = useState<CommentType[]>(photo.comments?.slice(0, 2) || []); 
  const [localCommentsCount, setLocalCommentsCount] = useState(photo.commentsCount);

  useEffect(() => {
    setIsLiked(photo.isLikedByCurrentUser || false);
    setLocalLikesCount(photo.likesCount);
    setIsBookmarked(photo.isBookmarkedByCurrentUser || false);
    setDisplayedComments(photo.comments?.slice(0, 2) || []);
    setLocalCommentsCount(photo.commentsCount);
  }, [photo]);

  const handleLike = () => {
    if (isLiked) {
      setLocalLikesCount(prev => prev - 1);
    } else {
      setLocalLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({ title: !isBookmarked ? "Bookmarked!" : "Bookmark removed."});
  };
  
  const handleShare = () => {
    toast({ title: "Shared!", description: "Photo link (mock) copied to clipboard."});
    console.log("Sharing photo:", photo.id);
  };

  const handlePostComment = () => {
    if (!newCommentText.trim() || !authUser) return;
    const newComment: CommentType = {
      id: `comment_${Date.now()}`,
      photoId: photo.id,
      userId: authUser.id,
      user: authUser,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setDisplayedComments(prev => [newComment, ...prev]); 
    setLocalCommentsCount(prev => prev + 1);
    setNewCommentText("");
    setShowCommentInput(false); 
    toast({ title: "Comment posted!" });
  };

  const aspectRatioClass = "aspect-square"; 
  let dialogImageHeight = 1200; 
  // Assuming 1:1 aspect ratio for dialog based on card's square display
  // If original aspect ratio is important for dialog, photo.aspectRatio could be used here.

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl w-full">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${photoUser.username}`}>
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={photoUser.profileImageUrl} alt={photoUser.displayName || photoUser.username} data-ai-hint="user avatar" />
            <AvatarFallback>{photoUser.displayName?.[0] || photoUser.username[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="grid gap-0.5">
          <Link href={`/profile/${photoUser.username}`}>
            <CardTitle className="text-sm font-semibold hover:underline">{photoUser.displayName || photoUser.username}</CardTitle>
          </Link>
          {photo.category && <Badge variant="outline" className="text-xs">{photo.category}</Badge>}
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <Dialog>
          <DialogTrigger asChild>
            <div className={`relative w-full bg-muted ${aspectRatioClass} ${photo.filter || ''} cursor-pointer group`}>
              <Image
                src={photo.imageUrl}
                alt={photo.caption || `Photo by ${photoUser.username}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="photo content main square"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0 bg-transparent border-0">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Enlarged photo: {photo.caption || `Photo by ${photoUser.username}`}
              </DialogTitle>
            </DialogHeader>
            <div className="relative aspect-square max-h-[90vh] w-full">
              <Image
                src={photo.imageUrl}
                alt={photo.caption || `Photo by ${photoUser.username}`}
                width={1200} 
                height={1200} 
                className={`rounded-lg object-contain ${photo.filter || ''}`}
                data-ai-hint="photo content dialog square"
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="flex w-full items-center space-x-1">
          <Button variant="ghost" size="icon" aria-label="Like" onClick={handleLike}>
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Comment" onClick={() => setShowCommentInput(!showCommentInput)}>
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto" aria-label="Bookmark" onClick={handleBookmark}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
        
        <div className="text-sm font-semibold">
          {localLikesCount.toLocaleString()} likes
        </div>

        {photo.caption && (
          <p className="text-sm text-foreground">
            <Link href={`/profile/${photoUser.username}`} className="font-semibold hover:underline">
              {photoUser.username}
            </Link>{' '}
            {photo.caption}
          </p>
        )}
        
        {(photo.hashtags?.length > 0 || photo.emojis?.length > 0) && (
          <div className="flex flex-wrap gap-1 text-sm">
            {photo.hashtags?.map(tag => ( 
              <Link key={tag} href={`/tags/${tag.replace('#', '')}`} className="text-primary hover:underline">
                #{tag}
              </Link>
            ))}
            {photo.emojis?.map((emoji, index) => ( 
              <span key={`${emoji}-${index}`}>{emoji}</span>
            ))}
          </div>
        )}

        <div className="w-full space-y-2">
          {displayedComments.length > 0 && (
            <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
              {displayedComments.map(comment => (
                <div key={comment.id}>
                  <Link href={`/profile/${comment.user?.username || '#'}`} className="font-semibold hover:underline">
                    {comment.user?.username || 'User'}
                  </Link>
                  : {comment.text}
                </div>
              ))}
            </div>
          )}
           {localCommentsCount > displayedComments.length && (
             <button 
                onClick={() => { 
                    toast({title: "Feature coming soon!", description: "Ability to view all comments."});
                }} 
                className="text-xs text-muted-foreground hover:underline"
             >
                View all {localCommentsCount.toLocaleString()} comments
             </button>
           )}
        </div>
        
        {showCommentInput && authUser && (
          <div className="flex w-full items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authUser.profileImageUrl} alt={authUser.displayName || authUser.username} data-ai-hint="current user avatar comment input" />
              <AvatarFallback>{authUser.displayName?.[0] || authUser.username[0]}</AvatarFallback>
            </Avatar>
            <Input
              type="text"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="h-9 flex-grow"
            />
            <Button size="sm" onClick={handlePostComment} disabled={!newCommentText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <time className="text-xs text-muted-foreground">
          {new Date(photo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </time>
      </CardFooter>
    </Card>
  );
}
