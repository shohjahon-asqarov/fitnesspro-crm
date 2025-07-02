import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  LogOut,
  ChevronDown,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface TopBarProps {
  onSectionChange: (section: string) => void;
}

export default function TopBar({ onSectionChange }: TopBarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: '3 ta a\'zolik muddati tugayapti', type: 'warning' },
    { id: 2, message: 'To\'lov muddati o\'tgan: Nigina Karimova', type: 'error' },
    { id: 3, message: 'Yangi a\'zo ro\'yxatdan o\'tdi: Jasur Toshmatov', type: 'info' }
  ]);

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="A'zolar, murabbiylar, mashg'ulotlarni qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'admin' ? 'Administrator' :
                   user?.role === 'manager' ? 'Menejer' :
                   user?.role === 'trainer' ? 'Murabbiy' :
                   user?.role === 'receptionist' ? 'Qabulxona' : 'A\'zo'}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-slide-up">
                <button
                  onClick={() => {
                    onSectionChange('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <SettingsIcon size={16} />
                  Sozlamalar
                </button>
                <button
                  onClick={() => {
                    onSectionChange('dashboard');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={16} />
                  Profil
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} />
                  Chiqish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}