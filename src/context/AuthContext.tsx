import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authApi, userApi } from '@/lib/api';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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
        const userId = localStorage.getItem('userId');
        
        if (userId) {
          try {
            const userData = await userApi.getProfile(userId);
            setUser(userData);
          } catch (error) {
            localStorage.removeItem('userId');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth status check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authApi.login(email, password);
      
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

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authApi.register(email, password);
      
      setUser(data.user);
      localStorage.setItem('userId', data.user.id);
      navigate('/onboarding');
      
      toast({
        title: "Sign up successful",
        description: "Your account has been created",
      });
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authApi.logout();
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
