import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found token in localStorage, attempting to validate');
          const userData = await auth.getCurrentUser();
          console.log('User data retrieved:', userData);
          setUser(userData);
        } else {
          console.log('No token found in localStorage');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Login attempt with email:', email);
      const loginData = await auth.login(email, password);
      console.log('Login successful, token received');
      
      // Wait a moment for the token to be stored
      setTimeout(async () => {
        try {
          console.log('Fetching user data after login');
          const userData = await auth.getCurrentUser();
          console.log('User data received:', userData);
          setUser(userData);
        } catch (userErr) {
          console.error('Failed to get user data after login:', userErr);
          setError('Login successful but failed to retrieve user data');
        }
      }, 500);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      console.log('Registration attempt with email:', email);
      await auth.register(name, email, password);
      console.log('Registration successful, attempting login');
      
      // Automatically log in after registration
      await login(email, password);
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
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