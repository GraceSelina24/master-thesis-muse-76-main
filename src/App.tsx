import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import RequireAuth from './components/RequireAuth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Calendar from '@/pages/Calendar';
import MealPlanner from '@/pages/MealPlanner';
import Fitness from '@/pages/Fitness';
import HealthInsights from '@/pages/HealthInsights';
import Onboarding from '@/pages/Onboarding';
import Index from '@/pages/Index';
import MainLayout from '@/components/layout/MainLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'bg-background text-foreground border border-border',
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            {/*<Route path="/register" element={<onbarding />} />*/}
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/fitness" element={<Fitness />} />
              <Route path="/health-insights" element={<HealthInsights />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
