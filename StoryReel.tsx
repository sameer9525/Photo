
"use client";

import type { Story } from '@/types';
import { StoryAvatar } from './StoryAvatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface StoryReelProps {
  stories: Story[];
  onStoryClick: (storyId: string) => void; // Changed to pass storyId
}

export function StoryReel({ stories, onStoryClick }: StoryReelProps) {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 px-1">Stories</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
                {stories.map((story) => (
                    <StoryAvatar key={story.id} story={story} onClick={() => onStoryClick(story.id)} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
}
