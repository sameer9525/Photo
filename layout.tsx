
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Logo } from '@/components/shared/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/30 via-background to-accent/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-8">
          <Logo size="large" />
        </div>
        <div className="bg-card p-8 rounded-xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
