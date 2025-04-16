import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { auth } from '../lib/api'; // Updated import to use `auth` instead of `authApi`

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>; // Updated to include `name` argument
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await auth.getCurrentUser(); // Replaced `userApi.getProfile` with `auth.getCurrentUser`
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await auth.login(email, password); // Updated to use `auth`
      
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id);
        navigate('/dashboard');
        
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const data = await auth.register(name, email, password); // Added `name` as the first argument
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/register');
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created",
      });
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth.logout(); // Updated to use `auth`
      setUser(null);
      localStorage.removeItem('userId');
      navigate('/');
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      toast({
        title: "Google Sign-In",
        description: "Google Sign-In is not currently supported",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error with Google sign in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
