import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  Dumbbell, 
  BarChart3, 
  Settings,
  Crown,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    icon: <LayoutDashboard size={20} />,
    label: 'Bosh sahifa',
    roles: ['admin', 'manager', 'trainer', 'receptionist', 'member']
  },
  {
    id: 'members',
    icon: <Users size={20} />,
    label: 'A\'zolar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    id: 'trainers',
    icon: <UserCheck size={20} />,
    label: 'Murabbiylar',
    roles: ['admin', 'manager']
  },
  {
    id: 'classes',
    icon: <Calendar size={20} />,
    label: 'Mashg\'ulotlar',
    roles: ['admin', 'manager', 'trainer', 'receptionist', 'member']
  },
  {
    id: 'payments',
    icon: <CreditCard size={20} />,
    label: 'To\'lovlar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    id: 'equipment',
    icon: <Dumbbell size={20} />,
    label: 'Jihozlar',
    roles: ['admin', 'manager']
  },
  {
    id: 'attendance',
    icon: <ClipboardList size={20} />,
    label: 'Davomat',
    roles: ['admin', 'manager', 'trainer', 'receptionist']
  },
  {
    id: 'notifications',
    icon: <Bell size={20} />,
    label: 'Bildirishnomalar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    id: 'reports',
    icon: <BarChart3 size={20} />,
    label: 'Hisobotlar',
    roles: ['admin']
  },
  {
    id: 'settings',
    icon: <Settings size={20} />,
    label: 'Sozlamalar',
    roles: ['admin', 'manager', 'member']
  }
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Crown className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FitnessPro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sport Zali Boshqaruvi</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className={`transition-colors ${
                activeSection === item.id 
                  ? 'text-white' 
                  : 'text-gray-400 group-hover:text-primary-500'
              }`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role === 'admin' ? 'Administrator' :
                   user.role === 'manager' ? 'Menejer' :
                   user.role === 'trainer' ? 'Murabbiy' :
                   user.role === 'receptionist' ? 'Qabulxona' : 'A\'zo'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}