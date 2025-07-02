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
  Divider,
  Breadcrumb,
  Tooltip,
  AutoComplete
} from 'antd';
import { 
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  GiftOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const { Header } = Layout;
const { Text } = Typography;

interface TopBarProps {
  onSectionChange: (section: string) => void;
}

export default function TopBar({ onSectionChange }: TopBarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [notifications] = useState([
    { id: 1, message: '3 ta a\'zolik muddati tugayapti', type: 'warning', time: '5 daqiqa oldin' },
    { id: 2, message: 'To\'lov muddati o\'tgan: Nigina Karimova', type: 'error', time: '10 daqiqa oldin' },
    { id: 3, message: 'Yangi a\'zo ro\'yxatdan o\'tdi: Jasur Toshmatov', type: 'info', time: '15 daqiqa oldin' },
    { id: 4, message: 'Jihozlar tekshiruvi kerak', type: 'warning', time: '1 soat oldin' },
    { id: 5, message: 'Oylik hisobot tayyor', type: 'success', time: '2 soat oldin' }
  ]);

  const searchOptions = [
    { value: 'Sardor Abdullayev', label: 'Sardor Abdullayev - A\'zo' },
    { value: 'Nigina Karimova', label: 'Nigina Karimova - A\'zo' },
    { value: 'Aziza Nazarova', label: 'Aziza Nazarova - Murabbiy' },
    { value: 'Morning Yoga', label: 'Morning Yoga - Mashg\'ulot' },
    { value: 'CrossFit Challenge', label: 'CrossFit Challenge - Mashg\'ulot' },
  ];

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
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Yordam',
    },
    {
      key: 'language',
      icon: <GlobalOutlined />,
      label: 'Til',
      children: [
        { key: 'uz', label: 'O\'zbek' },
        { key: 'ru', label: 'Русский' },
        { key: 'en', label: 'English' },
      ]
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
      <div className="max-w-xs p-2">
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 ${
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`} />
          <div className="flex-1">
            <Text className="text-sm font-medium">{notification.message}</Text>
            <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
          </div>
        </div>
      </div>
    ),
  }));

  const breadcrumbItems = [
    {
      title: <HomeOutlined />,
    },
    {
      title: 'FitnessPro',
    },
    {
      title: user?.role === 'admin' ? 'Administrator' : 
             user?.role === 'manager' ? 'Menejer' :
             user?.role === 'trainer' ? 'Murabbiy' :
             user?.role === 'receptionist' ? 'Qabulxona' : 'A\'zo',
    },
  ];

  return (
    <Header 
      className="fixed top-0 right-0 z-40 px-6 flex items-center justify-between shadow-sm"
      style={{
        left: 256,
        background: 'var(--ant-color-bg-container)',
        borderBottom: '1px solid var(--ant-color-border)',
        height: 72,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <AutoComplete
            options={searchOptions}
            value={searchValue}
            onChange={setSearchValue}
            onSelect={(value) => {
              console.log('Selected:', value);
              setSearchValue('');
            }}
            placeholder="A'zolar, murabbiylar, mashg'ulotlarni qidirish..."
            allowClear
          >
            <Input
              prefix={<SearchOutlined />}
              size="large"
              style={{ borderRadius: 12 }}
            />
          </AutoComplete>
        </div>
      </div>

      {/* Actions */}
      <Space size="middle">
        {/* Quick Actions */}
        <Tooltip title="Yangi a'zo qo'shish">
          <Button
            type="text"
            icon={<GiftOutlined />}
            size="large"
            onClick={() => onSectionChange('members')}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          />
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={isDark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            size="large"
            className="hover:bg-gray-50 dark:hover:bg-gray-700"
          />
        </Tooltip>

        {/* Notifications */}
        <Dropdown
          menu={{ 
            items: [
              ...notificationItems,
              { type: 'divider' },
              {
                key: 'view-all',
                label: (
                  <div className="text-center p-2">
                    <Button type="link" onClick={() => onSectionChange('notifications')}>
                      Barchasini ko'rish
                    </Button>
                  </div>
                )
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <Badge count={notifications.length} size="small" offset={[0, 0]}>
            <Button
              type="text"
              icon={<BellOutlined />}
              size="large"
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            />
          </Badge>
        </Dropdown>

        <Divider type="vertical" style={{ height: 32 }} />

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
          arrow
        >
          <Button type="text" className="h-auto p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Space>
              <Badge dot color="#52c41a" offset={[-8, 8]}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} size={40} />
              </Badge>
              <div className="text-left hidden sm:block">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user && getRoleText(user.role)}
                  </div>
                </motion.div>
              </div>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
}