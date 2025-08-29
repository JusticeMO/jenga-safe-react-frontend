import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  // role is now inferred on the backend, so the consumer only supplies credentials.
  login: (email: string, password: string) => Promise<boolean>;
  /**
   * Register a brand-new account and treat the user as logged-in
   * immediately once the backend returns a token.
   */
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: 'tenant' | 'landlord';
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
