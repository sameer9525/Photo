
"use client";

import type { Story } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StoryAvatarProps {
  story: Story;
  onClick: () => void; 
}

export function StoryAvatar({ story, onClick }: StoryAvatarProps) {
  const ringClass = story.isSeen
    ? 'ring-muted-foreground/50'
    : 'ring-primary group-hover:ring-primary/70';

  const firstItemImageUrl = story.items && story.items.length > 0 ? story.items[0].imageUrl : "https://placehold.co/64x64.png?text=S";

  return (
    <button
      onClick={onClick} 
      className="flex flex-col items-center space-y-1 group focus:outline-none"
      aria-label={`View story from ${story.user.displayName || story.user.username}`}
    >
      <div
        className={cn(
          'relative rounded-full p-0.5 ring-2 ring-offset-2 ring-offset-background transition-all duration-300',
          ringClass
        )}
      >
        <Avatar className="h-16 w-16 border-2 border-background">
          <AvatarImage src={firstItemImageUrl} alt={story.user.displayName || story.user.username} data-ai-hint="story avatar preview item" />
          <AvatarFallback>{story.user.displayName?.[0] || story.user.username[0]}</AvatarFallback>
        </Avatar>
      </div>
      <p className={cn(
        "text-xs font-medium truncate w-20",
        story.isSeen ? "text-muted-foreground" : "text-foreground"
      )}>
        {story.user.displayName || story.user.username}
      </p>
    </button>
  );
}
