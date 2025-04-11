import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Heart,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    name: 'Meal Planner',
    icon: Utensils,
    path: '/meal-planner'
  },
  {
    name: 'Fitness',
    icon: Dumbbell,
    path: '/fitness'
  },
  {
    name: 'Health Insights',
    icon: BarChart3,
    path: '/health-insights'
  },
  {
    name: 'Calendar',
    icon: Calendar,
    path: '/calendar'
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-primary text-primary-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
        "md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold text-sidebar-foreground">HealthMate</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                    location.pathname === '/profile'
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
