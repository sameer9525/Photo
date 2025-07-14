
import { APP_NAME } from '@/config/constants';
import { Camera } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ size = 'medium', className, iconOnly = false }: LogoProps) {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  const iconSizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-7 w-7',
  }

  return (
    <Link href="/home" className={`flex items-center gap-2 font-bold text-primary ${sizeClasses[size]} ${className}`}>
      <Camera className={`${iconSizeClasses[size]}`} />
      {!iconOnly && <span>{APP_NAME}</span>}
    </Link>
  );
}
