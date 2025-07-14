
"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { UploadCloud, UserCircle, Mail, Info, Link as LinkIcon, Palette, Shield, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_COVER_IMAGE, GENDER_OPTIONS, PRIVACY_OPTIONS, COLOR_THEMES, DEFAULT_COLOR_THEME_ID } from '@/config/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '../ui/separator';

export function EditProfileForm() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { mode, setMode, colorThemeId, setColorThemeId, availableColorThemes } = useTheme();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [gender, setGender] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrlPreview, setProfileImageUrlPreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrlPreview, setCoverImageUrlPreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setWebsiteUrl(user.websiteUrl || '');
      setGender(user.gender || 'prefer-not-to-say');
      setPrivacy(user.privacy || 'public');
      setProfileImageUrlPreview(user.profileImageUrl || DEFAULT_PROFILE_IMAGE);
      setCoverImageUrlPreview(user.coverImageUrl || DEFAULT_COVER_IMAGE);
    }
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImageFile(file);
          setProfileImageUrlPreview(reader.result as string);
        } else {
          setCoverImageFile(file);
          setCoverImageUrlPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedUserData = {
      ...user,
      displayName,
      username,
      email,
      bio,
      websiteUrl,
      gender,
      privacy,
      profileImageUrl: profileImageUrlPreview || user.profileImageUrl,
      coverImageUrl: coverImageUrlPreview || user.coverImageUrl,
    };

    updateUser(updatedUserData);
    setIsLoading(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  if (authLoading || !user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Loading profile data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video w-full rounded-md bg-muted animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-40 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          {[1,2,3,4].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>)}
        </CardContent>
        <CardFooter>
          <Button disabled className="w-full md:w-auto">Loading...</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Edit Profile</CardTitle>
        <CardDescription>Make changes to your public profile and preferences.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-2">Profile Visuals</h3>
            <div>
              <Label htmlFor="coverImage">Cover Photo (16:9 Recommended)</Label>
              <div className="mt-1 aspect-video relative w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 hover:border-primary transition-colors group">
                {coverImageUrlPreview ? (
                  <Image src={coverImageUrlPreview} alt="Cover preview" fill style={{ objectFit: 'cover' }} className="rounded-md" data-ai-hint="cover photo preview edit" />
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground group-hover:text-primary" />
                    <p className="mt-1 text-sm text-muted-foreground group-hover:text-primary">Upload Cover Photo</p>
                  </div>
                )}
                <Input id="coverImage" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary ring-offset-background">
                <AvatarImage 
                  src={profileImageUrlPreview || undefined} 
                  alt="Profile preview" 
                  className="object-cover"
                  data-ai-hint="profile avatar preview edit" />
                <AvatarFallback>{displayName?.[0] || username?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profileImage" className="block text-sm font-medium text-foreground">Profile Picture</Label>
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <UploadCloud className="mr-2 h-4 w-4" /> Change Photo
                  </Label>
                </Button>
                <Input id="profileImage" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                 <p className="text-xs text-muted-foreground mt-1">
                  For best results, upload a square image. Non-square images will be cropped to fit.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative mt-1">
                  <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                 <div className="relative mt-1">
                  <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                   <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_unique_username" className="pl-10" />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative mt-1">
                <Info className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about yourself" className="pl-10 min-h-[100px]" />
              </div>
            </div>

             <div className="mt-6">
              <Label htmlFor="websiteUrl">Website/Link</Label>
              <div className="relative mt-1">
                <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input id="websiteUrl" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourlink.com" className="pl-10" />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-lg font-semibold mb-4">Settings & Preferences</h3>
             <div className="space-y-6"> {/* Increased spacing */}
                <div>
                  <Label htmlFor="colorTheme" className="flex items-center mb-1"><Palette className="mr-2 h-5 w-5 text-muted-foreground" /> Select Color Theme</Label>
                  <Select value={colorThemeId} onValueChange={setColorThemeId}>
                    <SelectTrigger id="colorTheme">
                      <SelectValue placeholder="Select a color theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColorThemes.map((themeOption) => (
                        <SelectItem key={themeOption.id} value={themeOption.id}>{themeOption.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                    <Label className="flex items-center">Appearance Mode</Label>
                    <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'light' | 'dark')} className="mt-2 flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="mode-light" />
                            <Label htmlFor="mode-light" className="font-normal cursor-pointer flex items-center"><Sun className="mr-1.5 h-4 w-4"/> Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="mode-dark" />
                            <Label htmlFor="mode-dark" className="font-normal cursor-pointer flex items-center"><Moon className="mr-1.5 h-4 w-4"/> Dark</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="privacy" className="flex items-center"><Shield className="mr-2 h-5 w-5 text-muted-foreground" /> Profile Privacy</Label>
                  <Select value={privacy} onValueChange={(value) => setPrivacy(value as 'public' | 'private')}>
                    <SelectTrigger id="privacy" className="mt-1">
                      <SelectValue placeholder="Select profile privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIVACY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   <p className="text-xs text-muted-foreground mt-1">Note: Full privacy enforcement requires backend changes.</p>
                </div>
             </div>
          </section>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto text-lg py-6">
            {isLoading ? 'Saving Changes...' : 'Save All Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
