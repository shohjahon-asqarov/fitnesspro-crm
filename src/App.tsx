import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, Layout, FloatButton } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
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

const { Content } = Layout;

function AppContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

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
          borderRadius: 12,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 14,
          colorBgContainer: isDark ? '#1f2937' : '#ffffff',
          colorBgElevated: isDark ? '#374151' : '#ffffff',
          boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        },
        components: {
          Layout: {
            siderBg: isDark ? '#1f2937' : '#ffffff',
            headerBg: isDark ? '#1f2937' : '#ffffff',
            bodyBg: isDark ? '#111827' : '#f8fafc',
            triggerBg: isDark ? '#374151' : '#f1f5f9',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#3b82f6',
            itemSelectedColor: '#ffffff',
            itemHoverBg: isDark ? '#374151' : '#f1f5f9',
            itemActiveBg: '#3b82f6',
            iconSize: 18,
            fontSize: 14,
            itemHeight: 48,
            itemMarginInline: 8,
            itemBorderRadius: 8,
          },
          Card: {
            headerBg: 'transparent',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
            borderRadius: 12,
          },
          Table: {
            headerBg: isDark ? '#374151' : '#f8fafc',
            borderRadius: 12,
            headerBorderRadius: 12,
          },
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            fontSize: 14,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
            fontSize: 14,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
            fontSize: 14,
          },
          Modal: {
            borderRadius: 16,
            headerBg: 'transparent',
          },
          Drawer: {
            borderRadius: 16,
          },
          Notification: {
            borderRadius: 12,
          },
          Message: {
            borderRadius: 8,
          }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />
        <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
          <TopBar onSectionChange={setActiveSection} />
          <Content 
            style={{ 
              margin: '80px 24px 24px 24px',
              background: isDark ? '#111827' : '#f8fafc',
              borderRadius: 16,
              overflow: 'auto'
            }}
          >
            <div style={{ padding: 24, minHeight: 'calc(100vh - 128px)' }}>
              {renderSection()}
            </div>
          </Content>
        </Layout>
        
        {/* Floating Help Button */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24, bottom: 24 }}
          icon={<QuestionCircleOutlined />}
        >
          <FloatButton tooltip="Yordam" />
          <FloatButton tooltip="Qo'llanma" />
          <FloatButton tooltip="Aloqa" />
        </FloatButton.Group>
      </Layout>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#f9fafb' : '#374151',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
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