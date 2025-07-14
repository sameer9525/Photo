
"use client";

import type { Story } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Added DialogHeader, DialogTitle
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface StoryViewerProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewer({ story, isOpen, onClose }: StoryViewerProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentItemIndex(0); 
    }
  }, [isOpen, story]);

  if (!story || !isOpen || !story.items || story.items.length === 0) return null;

  const currentItem = story.items[currentItemIndex];
  const totalItems = story.items.length;

  const goToNextItem = () => {
    setCurrentItemIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToPreviousItem = () => {
    setCurrentItemIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="p-0 max-w-md w-full h-[90vh] sm:h-[85vh] bg-black flex flex-col items-center justify-center border-0 !rounded-lg overflow-hidden shadow-2xl">
        <DialogHeader className="sr-only"> {/* Added DialogHeader and DialogTitle for accessibility */}
          <DialogTitle>Story from {story.user.displayName || story.user.username}</DialogTitle>
        </DialogHeader>
        
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <Avatar className="h-9 w-9 border-2 border-white/80">
              <AvatarImage src={story.user.profileImageUrl} alt={story.user.displayName || story.user.username} data-ai-hint="story viewer avatar"/>
              <AvatarFallback className="text-xs text-black bg-white/90">{story.user.displayName?.[0] || story.user.username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-semibold" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>{story.user.displayName || story.user.username}</span>
        </div>
        
        {totalItems > 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex space-x-1 px-4 w-full max-w-sm">
            {story.items.map((_, index) => (
              <div key={`progress-${index}`} className="h-1 flex-1 rounded-full bg-white/40">
                <div 
                  className="h-full rounded-full bg-white transition-all duration-300" 
                  style={{ width: index === currentItemIndex ? '100%' : (index < currentItemIndex ? '100%' : '0%') }}
                />
              </div>
            ))}
          </div>
        )}
        
        {currentItem.imageUrl && (
          <div className="relative w-full h-full">
            <Image
              key={currentItem.id} 
              src={currentItem.imageUrl}
              alt={`Story by ${story.user.displayName || story.user.username} - slide ${currentItemIndex + 1}`}
              fill
              className="object-contain" 
              data-ai-hint="story image viewer item"
              sizes="100vw" 
              priority={currentItemIndex === 0} 
            />
          </div>
        )}
        
        {totalItems > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-1 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:bg-black/30 h-16 w-10"
              onClick={goToPreviousItem}
              aria-label="Previous story item"
            >
              <ChevronLeft size={32}/>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white hover:bg-black/30 h-16 w-10"
              onClick={goToNextItem}
              aria-label="Next story item"
            >
              <ChevronRight size={32}/>
            </Button>
          </>
        )}

        {story.content && ( 
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-10">
                <p className="text-white text-center text-sm">{story.content}</p>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
