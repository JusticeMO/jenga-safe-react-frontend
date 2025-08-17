
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { useToast } from '@/hooks/use-toast';
import apiClient from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, otp: string) => Promise<boolean>;
  requestOTP: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiClient.getUser();
          if (response.success) {
            setUser({
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
              avatar: response.user.profile_picture,
              hasAssignedProperty: response.user.has_assigned_property,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const requestOTP = async (input: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await apiClient.requestOTP(input, password, role);
      
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: response.message,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send OTP",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
      return false;
    }
  };

  const login = async (input: string, password: string, otp: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(input, password, otp);
      
      if (response.success) {
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          avatar: response.user.profile_picture,
          hasAssignedProperty: response.user.has_assigned_property,
        });

        toast({
          title: "Success",
          description: "Login successful",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.message || "Login failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    }
  };

  const value = {
    user,
    login,
    requestOTP,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
