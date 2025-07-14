
"use client";

import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Added for story caption
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2, CheckCircle2, X, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { mockStories } from '@/app/(app)/home/page'; // Import mockStories
import { useAuth } from '@/contexts/AuthContext'; 
import type { Story, StoryItem } from '@/types'; 
import { cn } from '@/lib/utils';

const MAX_IMAGES_PER_STORY = 10;

export function MultiplePhotoUploadForm() {
  const { user: currentUser } = useAuth(); 
  const { toast } = useToast();
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [storyCaption, setStoryCaption] = useState<string>(''); // For overall story caption
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Clean up object URLs when component unmounts or files change
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Revoke old URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);

    if (e.target.files) {
      let filesArray = Array.from(e.target.files);
      
      if (filesArray.length > MAX_IMAGES_PER_STORY) {
        filesArray = filesArray.slice(0, MAX_IMAGES_PER_STORY);
        toast({
          title: "Upload Limit Reached",
          description: `You can add a maximum of ${MAX_IMAGES_PER_STORY} images to a story. Only the first ${MAX_IMAGES_PER_STORY} images have been selected.`,
          variant: "default", 
        });
      }

      setSelectedFiles(filesArray);
      
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    } else {
      setSelectedFiles([]);
    }
    if(e.target) e.target.value = ''; 
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]); 
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.length || !currentUser) {
      toast({
        title: "Missing Information",
        description: "Please select at least one image for your story and ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);

    const storyItems: StoryItem[] = [];

    for (const file of selectedFiles) {
      try {
        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        storyItems.push({
          id: `storyitem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          imageUrl: dataUri,
          type: 'image',
        });
      } catch (error) {
        console.error("Error processing file for story item:", file.name, error);
        toast({
          title: "Processing Error",
          description: `Could not process ${file.name}.`,
          variant: "destructive",
        });
      }
    }
    
    if (storyItems.length > 0) {
      const newStory: Story = {
        id: `story_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: currentUser.id,
        user: currentUser,
        timestamp: new Date().toISOString(),
        items: storyItems,
        content: storyCaption.trim() || undefined,
        isSeen: false, // New stories are unseen by default
      };
      mockStories.unshift(newStory); // Add to the beginning of mockStories
      
      toast({
        title: "Story Created!",
        description: `Your story with ${storyItems.length} image(s) has been added.`,
        action: <CheckCircle2 className="text-green-500" />,
      });
      router.push('/home'); 
    } else {
       toast({
        title: "No Images Processed",
        description: `Could not create story as no images were successfully processed.`,
        variant: "destructive",
      });
    }
    
    setIsUploading(false);
    // Reset form
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url)); 
    setPreviewUrls([]);
    setStoryCaption('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Add to Your Story</CardTitle> 
        <CardDescription>Select up to {MAX_IMAGES_PER_STORY} images. Each image will be a slide in your story.</CardDescription> 
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="storyImageUpload" className="block text-sm font-medium mb-1">Select Images (Max {MAX_IMAGES_PER_STORY})</Label>
            <Input 
              id="storyImageUpload" 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          
          {previewUrls.length > 0 && (
            <div>
              <Label>Preview ({previewUrls.length} images selected for this story)</Label>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto p-2 border rounded-md bg-muted/50">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      fill 
                      className="object-cover rounded-md" 
                      sizes="100px"
                      data-ai-hint="story image preview"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="storyCaption">Story Caption (Optional)</Label>
            <Textarea
              id="storyCaption"
              value={storyCaption}
              onChange={(e) => setStoryCaption(e.target.value)}
              placeholder="Add an overall caption for your story..."
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground mt-1">This caption will apply to the entire story.</p>
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading || selectedFiles.length === 0} className="w-full">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
            {isUploading ? `Adding ${selectedFiles.length} images to story...` : `Add ${selectedFiles.length} Image(s) to Story`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
