
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, User, Settings, Compass, Heart, MessageSquare, Users, Gift, PlusCircle, Images, Megaphone } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  // SidebarFooter, // Removed as not used
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/upload', label: 'Upload Photo', icon: Upload },
  { href: '/upload-multiple', label: 'Add Stories', icon: Images },
  { href: '/donate', label: 'Create Campaign', icon: PlusCircle },
  { href: '/create-ad', label: 'Create Ad', icon: Megaphone },
  { href: '/friends', label: 'Friends', icon: Users },
  { href: '/refer-earn', label: 'Refer & Earn', icon: Gift },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/activity', label: 'Activity', icon: Heart, subItems: [
      {href: '/activity/likes', label: 'Likes', icon: Heart},
      {href: '/activity/comments', label: 'Comments', icon: MessageSquare}
    ]
  },
  { href: '/profile/edit', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Logo size="medium" className="mb-4" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.subItems && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
              {item.subItems && (
                 <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                <Link href={subItem.href}>
                                    <subItem.icon/>
                                    <span>{subItem.label}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                 </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>My Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl} alt={user.displayName || user.username} data-ai-hint="profile avatar small" />
                    <AvatarFallback>{user.displayName?.[0] || user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">{user.displayName || user.username}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Link>
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
      {/*
      <SidebarFooter className="p-2">
         Add footer content if needed, e.g. logout button or app version
      </SidebarFooter>
      */}
    </Sidebar>
  );
}
