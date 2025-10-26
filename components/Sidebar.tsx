import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { DashboardIcon, MappingIcon, SettingsIcon, LogoIcon } from './Icons.tsx';
// FIX: Import AdminView for stronger typing of props.
// FIX: Add file extension to import to fix module resolution error.
import { AdminView } from '../types.ts';

// FIX: Update SidebarProps to use the specific AdminView type for better type safety, resolving a type mismatch with the state setter from App.tsx.
interface SidebarProps {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen }) => {
  const navItems: { id: AdminView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'mapping', label: 'Product Mapping', icon: MappingIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
        role="presentation"
      ></div>

      <aside
        className={`w-64 flex-shrink-0 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center justify-center space-x-3 bg-gradient-to-r from-brand-secondary to-green-600 shadow-lg">
            <LogoIcon className="h-10 w-10 text-white drop-shadow-lg" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-white tracking-wide">TrueCost</h1>
        </div>
        <nav className="flex-grow px-4 py-6" aria-label="Admin menu">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                  }}
                  className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-brand-secondary to-green-600 text-white shadow-lg transform scale-105'
                      : 'hover:bg-gray-700 hover:text-white hover:translate-x-1'
                  }`}
                  aria-label={item.label}
                  aria-current={currentView === item.id ? 'page' : undefined}
                >
                  <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-center text-gray-500">&copy; 2024 TrueCost Inc.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;