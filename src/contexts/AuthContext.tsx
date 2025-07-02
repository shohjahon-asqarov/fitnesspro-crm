import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Ahmad Karimov',
    email: 'admin@fitnesspro.uz',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    department: 'Management'
  },
  manager: {
    id: '2',
    name: 'Dilshod Tashmatov',
    email: 'manager@fitnesspro.uz',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    department: 'Operations'
  },
  trainer: {
    id: '3',
    name: 'Aziza Nazarova',
    email: 'trainer@fitnesspro.uz',
    role: 'trainer',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    department: 'Training'
  },
  receptionist: {
    id: '4',
    name: 'Malika Usmanova',
    email: 'reception@fitnesspro.uz',
    role: 'receptionist',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    department: 'Front Desk'
  },
  member: {
    id: '5',
    name: 'Bobur Alimov',
    email: 'member@fitnesspro.uz',
    role: 'member',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage or set default to admin
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole && mockUsers[savedRole]) {
      setUser(mockUsers[savedRole]);
    } else {
      setUser(mockUsers.admin);
    }
  }, []);

  const login = (role: UserRole) => {
    const selectedUser = mockUsers[role];
    setUser(selectedUser);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userRole');
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}