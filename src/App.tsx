import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { initializeSampleData } from './data/mockData';
import RoleSelector from './components/RoleSelector';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/dashboard/Dashboard';
import Members from './components/members/Members';
import Trainers from './components/trainers/Trainers';
import Classes from './components/classes/Classes';
import Payments from './components/payments/Payments';
import Equipment from './components/equipment/Equipment';
import Attendance from './components/attendance/Attendance';
import Notifications from './components/notifications/Notifications';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import uzUZ from 'antd/locale/uz_UZ';

function AppContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);

  // Show role selector if no user is logged in
  if (!user) {
    return <RoleSelector />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'members':
        return <Members />;
      case 'trainers':
        return <Trainers />;
      case 'classes':
        return <Classes />;
      case 'payments':
        return <Payments />;
      case 'equipment':
        return <Equipment />;
      case 'attendance':
        return <Attendance />;
      case 'notifications':
        return <Notifications />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider
      locale={uzUZ}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 8,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Layout: {
            siderBg: isDark ? '#1f2937' : '#ffffff',
            headerBg: isDark ? '#1f2937' : '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#3b82f6',
            itemSelectedColor: '#ffffff',
            itemHoverBg: isDark ? '#374151' : '#f3f4f6',
          },
          Card: {
            headerBg: 'transparent',
          },
          Table: {
            headerBg: isDark ? '#374151' : '#f9fafb',
          }
        }
      }}
    >
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-inter">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col ml-64">
          <TopBar onSectionChange={setActiveSection} />
          <main className="flex-1 p-6 pt-20 overflow-auto">
            {renderSection()}
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
          }}
        />
      </div>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;