import React, { useState } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  Badge, 
  Dropdown, 
  Avatar, 
  Space, 
  Typography,
  Switch,
  Divider
} from 'antd';
import { 
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { Header } = Layout;
const { Text } = Typography;

interface TopBarProps {
  onSectionChange: (section: string) => void;
}

export default function TopBar({ onSectionChange }: TopBarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications] = useState([
    { id: 1, message: '3 ta a\'zolik muddati tugayapti', type: 'warning' },
    { id: 2, message: 'To\'lov muddati o\'tgan: Nigina Karimova', type: 'error' },
    { id: 3, message: 'Yangi a\'zo ro\'yxatdan o\'tdi: Jasur Toshmatov', type: 'info' }
  ]);

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Menejer';
      case 'trainer': return 'Murabbiy';
      case 'receptionist': return 'Qabulxona';
      case 'member': return 'A\'zo';
      default: return role;
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
      onClick: () => onSectionChange('dashboard'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Sozlamalar',
      onClick: () => onSectionChange('settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'theme',
      icon: isDark ? <SunOutlined /> : <MoonOutlined />,
      label: (
        <Space>
          <span>{isDark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}</span>
          <Switch 
            size="small" 
            checked={isDark} 
            onChange={toggleTheme}
          />
        </Space>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      onClick: logout,
      danger: true,
    },
  ];

  const notificationItems = notifications.map((notification, index) => ({
    key: index,
    label: (
      <div className="max-w-xs">
        <Text className="text-sm">{notification.message}</Text>
      </div>
    ),
  }));

  return (
    <Header 
      className="fixed top-0 left-64 right-0 z-30 px-6 flex items-center justify-between"
      style={{
        background: 'var(--ant-color-bg-container)',
        borderBottom: '1px solid var(--ant-color-border)',
        height: 64,
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="A'zolar, murabbiylar, mashg'ulotlarni qidirish..."
          prefix={<SearchOutlined />}
          size="large"
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Actions */}
      <Space size="middle">
        {/* Theme Toggle */}
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          size="large"
        />

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={notifications.length} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              size="large"
            />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" className="h-auto p-2">
            <Space>
              <Avatar src={user?.avatar} icon={<UserOutlined />} />
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user && getRoleText(user.role)}
                </div>
              </div>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
}