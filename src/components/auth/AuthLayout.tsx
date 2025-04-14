import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        backgroundImage: 'url(/health-bg.jpg)',
      }}
    >
      <div className="w-full max-w-md backdrop-blur-sm bg-white/90 p-8 rounded-xl shadow-xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;