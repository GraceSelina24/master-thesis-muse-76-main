import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="h-full">
          <div className="container mx-auto p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
