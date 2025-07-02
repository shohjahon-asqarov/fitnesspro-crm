import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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

function AppContent() {
  const { user } = useAuth();
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-inter">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col ml-64">
        <TopBar onSectionChange={setActiveSection} />
        <main className="flex-1 p-6 pt-22 overflow-auto">
          {renderSection()}
        </main>
      </div>
    </div>
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