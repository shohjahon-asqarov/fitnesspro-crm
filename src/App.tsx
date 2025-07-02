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
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Davomat Kuzatuvi
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tez orada - QR kod orqali kirish tizimi va qo'lda davomat belgilash
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bildirishnomalar Markazi
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A'zolik muddati tugayotganligi, to'lov ogohlantirishlari va marketing kampaniyalari uchun avtomatik eslatmalar
            </p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Moliyaviy Hisobotlar
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Keng qamrovli moliyaviy tahlillar, foyda/zarar hisobotlari va biznes ko'rsatkichlari
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tizim Sozlamalari
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sport zali sozlamalari, foydalanuvchi ruxsatlari, to'lov parametrlari va tizim sozlamalarini sozlash
            </p>
          </div>
        );
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