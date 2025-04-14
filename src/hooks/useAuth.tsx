import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '../lib/firebase';
import { auth } from '../lib/api';

const API_URL = 'http://localhost:3001/api';

type User = {
  id: string;
  email: string;
  name: string;
  settings: {
    id: string;
    userId: string;
    theme: string;
    language: string;
    weightUnit: string;
    heightUnit: string;
    distanceUnit: string;
    calorieUnit: string;
    fontSize: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    workoutReminders: boolean;
    mealReminders: boolean;
    progressUpdates: boolean;
    goalNotifications: boolean;
    subscriptionStatus: string;
    subscriptionEndDate: string | null;
  } | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure Firebase is properly configured
      if (!firebaseAuth.app.options.apiKey) {
        toast.error('Firebase is not configured. Please add your Firebase config in src/lib/firebase.ts');
        throw new Error('Firebase configuration missing. See src/lib/firebase.ts for instructions.');
      }

      // Sign in with Google using Firebase
      const result = await signInWithPopup(firebaseAuth, googleProvider);

      // Send token to backend for authentication
      const userData = await auth.googleAuth(result);
      setUser(userData.user);

      toast.success('Successfully signed in with Google!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);

      // Handle specific error codes
      if (err instanceof Error) {
        if (err.message.includes('auth/popup-closed-by-user')) {
          setError('Sign-in popup was closed before completing the process.');
          toast.error('Sign-in popup was closed. Please try again.');
        } else if (err.message.includes('auth/api-key-not-valid')) {
          setError('Firebase API key is not valid. Please update your Firebase configuration.');
          toast.error('Firebase API key is not valid. Please update your Firebase configuration.');
        } else {
          setError(err.message);
          toast.error(err.message);
        }
      } else {
        setError('Failed to sign in with Google');
        toast.error('Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/users/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign up');
      }

      const data = await response.json();
      // Set the token and user data directly from the registration response
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Successfully signed up!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign up');
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}