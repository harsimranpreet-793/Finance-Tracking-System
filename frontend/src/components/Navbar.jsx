import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Sun, Moon } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(
    localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  return (
    <header className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 px-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h1 className="m-0 text-2xl font-bold text-slate-800 dark:text-white">{title || 'Dashboard'}</h1>
      
      <div className="flex items-center gap-6">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white dark:border-slate-800" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="m-0 font-semibold text-sm text-slate-800 dark:text-white">{user?.username || 'User'}</p>
            <p className="m-0 text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-md">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
