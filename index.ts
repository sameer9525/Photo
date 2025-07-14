
export type User = {
  id: string;
  username: string;
  displayName?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  websiteUrl?: string; // New: For user's website or social media link
  gender?: string; // New: User's gender
  privacy?: 'public' | 'private'; // New: Basic profile privacy setting
  followersCount: number;
  followingCount: number;
  email?: string; // For profile display, not necessarily auth
};

export type Comment = {
  id: string;
  photoId: string;
  userId: string;
  user?: User; // Optional: denormalized user info
  text: string;
  createdAt: string; // ISO date string
};

export type Photo = {
  id: string;
  userId: string;
  user?: User; // Optional: denormalized user info for display
  imageUrl: string;
  caption: string;
  hashtags: string[];
  emojis: string[];
  category: string;
  filter: string; // e.g., 'grayscale', 'sepia'
  likesCount: number;
  commentsCount: number;
  sharesCount: number; // Simplified as a count
  createdAt: string; // ISO date string
  aspectRatio?: string; // e.g., "9/16"
  comments?: Comment[]; // For inline comments
  isLikedByCurrentUser?: boolean; // Mock state
  isBookmarkedByCurrentUser?: boolean; // Mock state
};

export type StoryItem = {
  id: string; // Unique ID for the item within the story
  imageUrl: string;
  type: 'image'; // For now, only image
  duration?: number; // Optional: for auto-play slideshow
  link?: string; // Optional: swipe-up link
};

export type Story = {
  id: string;
  userId: string;
  user: User;
  timestamp: string; // ISO date string
  items: StoryItem[]; // Array of story items
  content?: string; // Optional overall caption/title for the story
  isSeen?: boolean; // Client-side state for UI
};


// For Donation/Campaign page
export type CurrencyOption = {
  code: string;
  name: string;
  symbol: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon?: React.ElementType; // For potential icons later
};

export type Campaign = {
  id: string;
  title: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  currencySymbol: string;
  category: string;
  imageUrl?: string; // Can be a data URI from upload, or a placeholder path
  creatorName: string;
  creatorAvatar?: string; // URL to avatar
  createdAt: string; // ISO date string
};

