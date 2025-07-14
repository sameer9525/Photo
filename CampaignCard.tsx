
"use client";

import type { Campaign } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, CalendarDays, HandCoins } from "lucide-react";
import Link from "next/link"; // Import Link
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { toast } = useToast();
  const progressPercentage = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleMockDonate = () => {
    toast({
      title: "Donation Feature (Mock)",
      description: `You're about to donate to "${campaign.title}". Payment processing is not implemented.`,
    });
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl flex flex-col">
      <CardHeader className="p-4">
        <div className="relative h-40 w-full bg-muted rounded-md overflow-hidden mb-3">
          <Image
            src={campaign.imageUrl || "https://placehold.co/600x400.png"}
            alt={campaign.title}
            fill
            className="object-cover"
            data-ai-hint="campaign placeholder card"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle className="text-xl leading-tight">{campaign.title}</CardTitle>
        {campaign.category && <Badge variant="secondary" className="mt-1 w-fit">{campaign.category}</Badge>}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="mb-3 text-sm h-16 overflow-hidden">
            {truncateText(campaign.story, 100)}
        </CardDescription>
        
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Raised: {campaign.currencySymbol}{campaign.raisedAmount.toLocaleString()}</span>
              <span className="text-muted-foreground">Goal: {campaign.currencySymbol}{campaign.goalAmount.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progressPercentage)}% funded</p>
          </div>
        </div>

        <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Avatar className="h-6 w-6">
                <AvatarImage src={campaign.creatorAvatar || "https://placehold.co/40x40.png"} alt={campaign.creatorName} data-ai-hint="creator avatar campaign" />
                <AvatarFallback>{campaign.creatorName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <span>By {campaign.creatorName}</span>
            <span className="mx-1">·</span>
            <CalendarDays className="h-3 w-3 mr-1 inline-block" />
            <span>{new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <TrendingUp className="mr-2 h-4 w-4" /> View Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{campaign.title}</DialogTitle>
              <DialogDescription>
                Category: {campaign.category} <span className="mx-2">|</span> By: {campaign.creatorName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={campaign.imageUrl || "https://placehold.co/800x450.png"}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  data-ai-hint="campaign image dialog"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-1">Story</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{campaign.story}</p>
              
              <Separator className="my-4" />

              <h3 className="text-lg font-semibold mb-2">Fundraising Progress</h3>
              <div className="space-y-2 mb-4">
                <div>
                  <div className="flex justify-between text-lg font-medium mb-1">
                    <span>{campaign.currencySymbol}{campaign.raisedAmount.toLocaleString()} <span className="text-sm text-muted-foreground">raised</span></span>
                    <span className="text-muted-foreground">{campaign.currencySymbol}{campaign.goalAmount.toLocaleString()} <span className="text-sm text-muted-foreground">goal</span></span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1 text-right">{Math.round(progressPercentage)}% funded</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={campaign.creatorAvatar || "https://placehold.co/40x40.png"} alt={campaign.creatorName} data-ai-hint="creator avatar campaign dialog" />
                    <AvatarFallback>{campaign.creatorName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <span>Created by {campaign.creatorName} on {new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <DialogFooter className="sm:justify-start">
              <Button type="button" onClick={handleMockDonate} size="lg" className="w-full sm:w-auto">
                <HandCoins className="mr-2 h-5 w-5" /> Donate to this Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
