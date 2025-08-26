import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  // role is now inferred on the backend, so the consumer only supplies credentials.
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
