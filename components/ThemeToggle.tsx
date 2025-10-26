import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { SunIcon, MoonIcon } from './Icons.tsx';
// FIX: Import Theme type for stronger typing.
// FIX: Add file extension to import to fix module resolution error.
import { Theme } from '../types.ts';

// FIX: Update ThemeToggleProps to use the specific Theme type to resolve type mismatches.
interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-brand-secondary"
    >
      <span className="sr-only">Toggle theme</span>
      {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
    </button>
  );
};

export default ThemeToggle;