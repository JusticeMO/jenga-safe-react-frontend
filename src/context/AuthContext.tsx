import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';
import apiClient from '../lib/api';
import { AuthContext } from './AuthContext-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth status...");
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiClient.getUser();
          console.log("getUser response:", response);
          if (response.success) {
            setUser(response.user);
            console.log("User set in context:", response.user);
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

  const login = async (input: string, password: string): Promise<boolean> => {
    console.log("Logging in from AuthContext...");
    try {
      const response = await apiClient.login(input, password);
      console.log("login response:", response);
      if (response.success) {
        setUser(response.user);
        console.log("User set in context after login:", response.user);

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      console.error("Error in login:", error);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    console.log("Logging out from AuthContext...");
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      console.log("User set to null in context");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
