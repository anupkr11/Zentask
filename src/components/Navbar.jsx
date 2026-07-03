import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, CheckSquare, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-40 w-full transition-all duration-150 border-b glass dark:glass-dark border-zinc-200 dark:border-zinc-800">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white shadow-sm">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              ZenTask
            </span>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none transition-all duration-150"
              aria-label="Toggle Theme"
              id="theme-toggle-btn"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {user && (
              <div className="flex items-center space-x-3 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                {/* Profile */}
                <div className="flex items-center space-x-2.5">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                      {user.username}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 focus:outline-none transition-all duration-150"
                  title="Logout"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
