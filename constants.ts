
import type { CurrencyOption, PaymentMethod } from "@/types"; // Import new types

export const APP_NAME = "ZuzzBee";

export const CATEGORIES = [
  "Nature", "Travel", "Food", "Fashion", "Sports",
  "Animals", "Art", "Music", "Technology", "Architecture",
  "People", "Street", "Black & White", "Events", "Lifestyle",
  "Abstract", "Vintage", "Business", "Education", "Health"
];

export type FilterOption = {
  name: string;
  className: string; // Tailwind class or CSS filter value
};

export const IMAGE_FILTERS: FilterOption[] = [
  { name: 'Original', className: '' },
  { name: 'Black & White', className: 'grayscale' },
  { name: 'Sepia', className: 'sepia' },
  { name: 'Vibrant', className: 'saturate-150 contrast-125' },
  { name: 'Cool', className: 'hue-rotate-[-15deg] saturate-125' },
  { name: 'Warm', className: 'hue-rotate-[15deg] saturate-125' },
  { name: 'Sketchy', className: 'grayscale contrast-200 brightness-150' },
  { name: 'Charcoal Light', className: 'grayscale contrast-150 brightness-90' },
  { name: 'Dramatic B&W', className: 'grayscale contrast-175 brightness-110' },
  { name: 'Vintage Film', className: 'sepia saturate-125 contrast-75 brightness-90' },
  { name: 'Technicolor Dream', className: 'saturate-200 hue-rotate-[-30deg] contrast-125' },
  { name: 'Emerald Tint', className: 'sepia hue-rotate-[60deg] saturate-150 brightness-95' },
  { name: 'Ruby Glow', className: 'sepia hue-rotate-[300deg] saturate-150 brightness-95' },
  { name: 'Faded Glory', className: 'opacity-80 saturate-60 contrast-125 brightness-110' },
  { name: 'Blueprint', className: 'grayscale invert sepia saturate-300 hue-rotate-[180deg] contrast-150 brightness-110' },
  { name: 'Night Vision', className: 'grayscale contrast-200 sepia hue-rotate-[90deg] brightness-75 saturate-200' },
  { name: 'X-Ray', className: 'invert grayscale contrast-200 brightness-125' },
  { name: 'Pop Art', className: 'saturate-300 contrast-150 hue-rotate-45 brightness-105' },
  { name: 'Sun Kissed', className: 'sepia-50 saturate-150 brightness-110 contrast-110 hue-rotate-[-10deg]' },
  { name: 'Moonlit', className: 'grayscale brightness-75 contrast-150 hue-rotate-[200deg] saturate-150' },
  // Adding more filters
  { name: 'Oceanic', className: 'hue-rotate-[200deg] saturate-150 contrast-110' },
  { name: 'Forest Mist', className: 'grayscale-[50%] saturate-120 contrast-90 brightness-95 hue-rotate-[100deg]' },
  { name: 'Golden Hour', className: 'sepia-[30%] saturate-160 contrast-110 hue-rotate-[-20deg] brightness-105' },
  { name: 'Crimson Peak', className: 'hue-rotate-[330deg] saturate-170 contrast-120' },
  { name: 'Arctic Blue', className: 'hue-rotate-[180deg] saturate-200 contrast-100 brightness-110 sepia-[20%]' },
  { name: 'Matrix Green', className: 'hue-rotate-[90deg] saturate-200 contrast-150 brightness-80 grayscale-[50%]' },
  { name: 'Retro Wave', className: 'hue-rotate-[270deg] saturate-180 contrast-130 brightness-110 sepia-[10%]' },
  { name: 'Sunny Day', className: 'saturate-130 contrast-105 brightness-110' },
  { name: 'Muted Tones', className: 'saturate-70 contrast-90' },
  { name: 'High Contrast', className: 'contrast-200' },
  { name: 'Dreamy Haze', className: 'blur-[1px] opacity-90 saturate-120' },
  { name: 'Infrared Mock', className: 'hue-rotate-[280deg] saturate-200 contrast-150 sepia-[40%]' },
  { name: 'Lomo Effect', className: 'saturate-160 contrast-140 brightness-90 hue-rotate-[10deg]' },
  { name: 'Old Photo', className: 'sepia-[60%] grayscale-[30%] contrast-90 brightness-95' },
  { name: 'Cyberpunk', className: 'hue-rotate-[240deg] saturate-200 contrast-130 brightness-105' },
];


export const DEFAULT_PROFILE_IMAGE = "https://placehold.co/100x100.png";
export const DEFAULT_COVER_IMAGE = "https://placehold.co/1920x1080.png";

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private (Only followers can see your posts - mock)' },
];

// For Donation Page
export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'qr', name: 'QR Code' },
  { id: 'upi', name: 'UPI (Unified Payments Interface)'},
  { id: 'card', name: 'Debit/Credit Card' },
  { id: 'netbanking', name: 'Net Banking (Mock)'},
];

// Campaign categories for the Create Campaign page
export const FUNDRAISER_CATEGORIES = [
    "Medical", "Education", "Animal Welfare", "Environment", "Community",
    "Creative Arts", "Technology", "Sports", "Memorial", "Charity"
];


export type ColorTheme = {
  id: string;
  name: string;
};

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'forest-canopy', name: 'Forest Canopy' }, // Default
  { id: 'ocean-breeze', name: 'Ocean Breeze' },
  { id: 'sunset-glow', name: 'Sunset Glow' },
  { id: 'midnight-sapphire', name: 'Midnight Sapphire' },
  { id: 'cherry-blossom', name: 'Cherry Blossom' },
  { id: 'desert-mirage', name: 'Desert Mirage' },
  { id: 'lavender-fields', name: 'Lavender Fields' },
  { id: 'arctic-dawn', name: 'Arctic Dawn' },
  { id: 'volcanic-ash', name: 'Volcanic Ash' },
  { id: 'tropical-rainforest', name: 'Tropical Rainforest' },
];

export const DEFAULT_COLOR_THEME_ID = 'forest-canopy';
