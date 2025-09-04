"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '@/lib/config';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  age?: number;
  gender?: string;
  photoUrl?: string;
  about?: string;
  Skills?: string[];
  relationshipType?: string;
  location?: string;
  education?: string;
  religion?: string;
  drinking?: string;
  smoking?: string;
  prompts?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (emailId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try the check-auth endpoint first
      const response = await fetch(`${API_BASE_URL}/check-auth`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(null);
        }
      } else if (response.status === 401) {
        // Check localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUser(user);
          } catch (e) {
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          setUser(null);
        }
      } else if (response.status === 404) {
        // If check-auth endpoint doesn't exist, try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUser(user);
          } catch (e) {
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On any error, check localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
        } catch (e) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailId: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ emailId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.message === 'Login successful') {
        // If user data is in the response, use it immediately
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Otherwise, try to get user data from check-auth
          await checkAuthStatus();
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/');
      } else {
        // Even if logout fails, clear local state
        setUser(null);
        localStorage.removeItem('user');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state even if request fails
      setUser(null);
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const setCurrentUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };



  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}