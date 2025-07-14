
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_COVER_IMAGE } from '@/config/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER_KEY = 'photoshere_mock_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setLoading(false);
  }, []);

  const login = (userData: Partial<User>) => {
    const fullUserData: User = {
      id: userData.id || Date.now().toString(),
      username: userData.username || 'testuser',
      displayName: userData.displayName || 'Test User',
      email: userData.email || 'test@example.com',
      profileImageUrl: userData.profileImageUrl || DEFAULT_PROFILE_IMAGE,
      coverImageUrl: userData.coverImageUrl || DEFAULT_COVER_IMAGE,
      bio: userData.bio || 'This is a mock bio.',
      websiteUrl: userData.websiteUrl || '',
      gender: userData.gender || 'prefer-not-to-say',
      privacy: userData.privacy || 'public',
      followersCount: userData.followersCount || 100,
      followingCount: userData.followingCount || 50,
    };
    setUser(fullUserData);
    try {
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(fullUserData));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(MOCK_USER_KEY);
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
  };
  
  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      setUser(newUser);
      try {
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      } catch (error) {
        console.error("Failed to update user in localStorage", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
