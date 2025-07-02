import React from 'react';
import { Layout, Menu, Avatar, Typography, Space, Badge } from 'antd';
import { 
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  ToolOutlined,
  CheckSquareOutlined,
  BellOutlined,
  BarChartOutlined,
  SettingOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Bosh sahifa',
    roles: ['admin', 'manager', 'trainer', 'receptionist', 'member']
  },
  {
    key: 'members',
    icon: <TeamOutlined />,
    label: 'A\'zolar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    key: 'trainers',
    icon: <UserOutlined />,
    label: 'Murabbiylar',
    roles: ['admin', 'manager']
  },
  {
    key: 'classes',
    icon: <CalendarOutlined />,
    label: 'Mashg\'ulotlar',
    roles: ['admin', 'manager', 'trainer', 'receptionist', 'member']
  },
  {
    key: 'payments',
    icon: <CreditCardOutlined />,
    label: 'To\'lovlar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    key: 'equipment',
    icon: <ToolOutlined />,
    label: 'Jihozlar',
    roles: ['admin', 'manager']
  },
  {
    key: 'attendance',
    icon: <CheckSquareOutlined />,
    label: 'Davomat',
    roles: ['admin', 'manager', 'trainer', 'receptionist']
  },
  {
    key: 'notifications',
    icon: <BellOutlined />,
    label: 'Bildirishnomalar',
    roles: ['admin', 'manager', 'receptionist']
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Hisobotlar',
    roles: ['admin']
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Sozlamalar',
    roles: ['admin', 'manager', 'member']
  }
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

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

  return (
    <Sider
      width={256}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40"
      style={{
        background: 'var(--ant-color-bg-container)',
        borderRight: '1px solid var(--ant-color-border)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Space align="center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CrownOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={4} className="!mb-0 !text-gray-900 dark:!text-white">
                FitnessPro
              </Title>
              <Text type="secondary" className="text-xs">
                Sport Zali Boshqaruvi
              </Text>
            </div>
          </Space>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            onClick={({ key }) => onSectionChange(key)}
            style={{ border: 'none' }}
            items={filteredMenuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Space className="w-full">
              <Avatar src={user.avatar} icon={<UserOutlined />} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </div>
                <Text type="secondary" className="text-xs">
                  {getRoleText(user.role)}
                </Text>
              </div>
            </Space>
          </div>
        )}
      </div>
    </Sider>
  );
}