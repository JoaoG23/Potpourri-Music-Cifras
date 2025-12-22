import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home as HomeIcon, Music } from 'lucide-react';
import { Toaster } from '../ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Potpourri Music</h1>
            </div>
            
            <div className="flex items-center gap-1">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/list-musics">
                <Button 
                  variant={isActive('/list-musics') ? 'default' : 'ghost'} 
                  className="flex items-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  Músicas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto">
        {children}
      </main>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};
