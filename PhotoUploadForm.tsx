
"use client";

import { useState, type FormEvent, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, ImagePlus, Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, IMAGE_FILTERS, type FilterOption } from '@/config/constants';
import { generateCaption, type GenerateCaptionInput, type GenerateCaptionOutput } from '@/ai/flows/generate-caption';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { mockPhotos } from '@/app/(app)/home/page'; 
import { useAuth } from '@/contexts/AuthContext'; 
import type { Photo } from '@/types'; 

export function PhotoUploadForm() {
  const { user: currentUser } = useAuth(); 
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null); 
  const [aspectRatio, setAspectRatio] = useState<string>("1/1"); 
  
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(IMAGE_FILTERS[0]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<GenerateCaptionOutput | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const readerPreview = new FileReader();
      readerPreview.onloadend = () => {
        const resultStr = readerPreview.result as string;
        setImagePreviewUrl(resultStr);
        
        const img = document.createElement('img');
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          if (w === h) setAspectRatio("1/1");
          else if (w > h) setAspectRatio("16/9");
          else setAspectRatio("9/16"); 
        }
        img.src = resultStr;
      };
      readerPreview.readAsDataURL(file);

      const readerDataUri = new FileReader();
      readerDataUri.onloadend = () => {
        setImageDataUri(readerDataUri.result as string);
      };
      readerDataUri.readAsDataURL(file);
      setAiSuggestions(null); 
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
      setImageDataUri(null);
      setAiSuggestions(null);
    }
  };

  const handleGenerateCaption = async () => {
    if (!imageDataUri || !category) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and select a category to generate a caption.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingCaption(true);
    setAiSuggestions(null);
    try {
      const input: GenerateCaptionInput = { photoDataUri: imageDataUri, category };
      const result = await generateCaption(input);
      setAiSuggestions(result);
      toast({
        title: "AI Suggestions Ready!",
        description: "Caption, hashtags, and emojis suggested.",
      });
    } catch (error) {
      console.error("Error generating caption:", error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleUseSuggestion = (type: 'caption' | 'hashtags' | 'emojis', value: string | string[]) => {
    if (type === 'caption' && typeof value === 'string') {
      setCaption(value);
    } else if (type === 'hashtags' && Array.isArray(value)) {
      // Add hashtags that are not already in the caption
      const existingHashtags = new Set((caption.match(/#\w+/g) || []).map(h => h.toLowerCase()));
      const newHashtags = value.filter(h => !existingHashtags.has(h.toLowerCase())).map(h => h.startsWith('#') ? h : `#${h}`);
      setCaption(prev => `${prev} ${newHashtags.join(' ')}`.trim());
    } else if (type === 'emojis' && Array.isArray(value)) {
      // Add emojis not already in caption
      const existingEmojis = new Set(Array.from(caption.matchAll(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu)).map(match => match[0]));
      const newEmojis = value.filter(e => !existingEmojis.has(e));
      setCaption(prev => `${prev} ${newEmojis.join(' ')}`.trim());
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile || !caption || !category || !currentUser || !imagePreviewUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide an image, caption, category, and ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const newPhoto: Photo = {
      id: `uploaded_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      imageUrl: imagePreviewUrl, 
      caption,
      hashtags: caption.match(/#\w+/g)?.map(h => h.substring(1)) || [],
      emojis: Array.from(caption.matchAll(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu)).map(match => match[0]) || [],
      category,
      filter: selectedFilter.className,
      likesCount: 0, 
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      aspectRatio: "1/1", 
      comments: [], 
      isLikedByCurrentUser: false,
      isBookmarkedByCurrentUser: false,
    };

    mockPhotos.unshift(newPhoto); 
    
    setIsUploading(false);
    toast({
      title: "Photo Uploaded!",
      description: `${imageFile.name} has been uploaded.`,
      action: <CheckCircle2 className="text-green-500" />,
    });

    setImageFile(null);
    setImagePreviewUrl(null);
    setImageDataUri(null);
    setCaption('');
    setCategory('');
    setSelectedFilter(IMAGE_FILTERS[0]);
    setAiSuggestions(null);
    
    router.push('/home'); 
  };

  const previewContainerClass = imagePreviewUrl ? "aspect-square" : "h-60";

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Upload New Photo</CardTitle>
        <CardDescription>Share your moments. Add details and let AI help with your caption!</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="photoUpload" className="block text-sm font-medium mb-1">Photo (Displayed as 1:1)</Label>
            <div
              className={cn(
                "w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center text-center bg-muted hover:border-primary transition-all duration-300 group relative",
                previewContainerClass,
                imagePreviewUrl && selectedFilter.className 
              )}
            >
              {imagePreviewUrl ? (
                <Image 
                  src={imagePreviewUrl} 
                  alt="Image preview" 
                  fill 
                  className="object-cover rounded-md"
                  data-ai-hint="uploaded photo preview" 
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              ) : (
                <div className="p-4">
                  <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground group-hover:text-primary">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
                </div>
              )}
              <Input id="photoUpload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter">Filter</Label>
              <Select value={selectedFilter.name} onValueChange={(val) => setSelectedFilter(IMAGE_FILTERS.find(f => f.name === val) || IMAGE_FILTERS[0])}>
                <SelectTrigger id="filter">
                  <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_FILTERS.map((filt) => (
                    <SelectItem key={filt.name} value={filt.name}>{filt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {imagePreviewUrl && category && (
            <Button type="button" variant="outline" onClick={handleGenerateCaption} disabled={isGeneratingCaption || !imageDataUri} className="w-full">
              {isGeneratingCaption ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGeneratingCaption ? 'Generating Suggestions...' : 'Get AI Caption Help'}
            </Button>
          )}

          {aiSuggestions && (
            <Card className="bg-secondary/50 p-4 space-y-3">
              <CardTitle className="text-lg mb-2 flex items-center"><Wand2 className="mr-2 h-5 w-5 text-primary"/>AI Suggestions</CardTitle>
              {aiSuggestions.caption && (
                <div>
                  <Label className="text-sm font-semibold">Suggested Caption:</Label>
                  <Textarea value={aiSuggestions.caption} readOnly className="mt-1 bg-background/70" rows={3}/>
                  <Button type="button" size="sm" variant="link" onClick={() => handleUseSuggestion('caption', aiSuggestions.caption!)} className="p-0 h-auto mt-1">Use this caption</Button>
                </div>
              )}
              {aiSuggestions.hashtags?.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Suggested Hashtags/Tags:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiSuggestions.hashtags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/20 bg-background/70" 
                        onClick={() => handleUseSuggestion('hashtags', [tag])}
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                   <Button type="button" size="sm" variant="link" onClick={() => handleUseSuggestion('hashtags', aiSuggestions.hashtags!)} className="p-0 h-auto mt-1">Use all suggested hashtags</Button>
                </div>
              )}
              {aiSuggestions.emojis?.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Suggested Emojis:</Label>
                   <div className="flex flex-wrap gap-1 mt-1">
                    {aiSuggestions.emojis.map(emoji => (
                      <Badge 
                        key={emoji} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/20 text-lg bg-background/70" 
                        onClick={() => handleUseSuggestion('emojis', [emoji])}
                      >
                        {emoji}
                      </Badge>
                    ))}
                  </div>
                  <Button type="button" size="sm" variant="link" onClick={() => handleUseSuggestion('emojis', aiSuggestions.emojis!)} className="p-0 h-auto mt-1">Use all suggested emojis</Button>
                </div>
              )}
            </Card>
          )}

          <div>
            <Label htmlFor="caption">Your Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption here... #hashtags 😊"
              className="min-h-[120px]"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading || !imageFile} className="w-full">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

    