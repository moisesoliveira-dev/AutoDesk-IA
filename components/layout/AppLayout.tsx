import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { User } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={onLogout} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden flex items-center p-4 bg-white shadow-sm z-10 no-print">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-700">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-lg text-slate-800">AutoDesk AI</span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;