import React from 'react';
import { Layout, Menu, Avatar, Typography, Space, Badge, Tooltip } from 'antd';
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
  CrownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
  badge?: number;
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
    roles: ['admin', 'manager', 'receptionist'],
    badge: 3
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
    roles: ['admin', 'manager', 'receptionist'],
    badge: 5
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
    roles: ['admin', 'manager', 'receptionist'],
    badge: 2
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

export default function Sidebar({ activeSection, onSectionChange, collapsed, onCollapse }: SidebarProps) {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return '#f59e0b';
      case 'manager': return '#3b82f6';
      case 'trainer': return '#10b981';
      case 'receptionist': return '#ec4899';
      case 'member': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <Sider
      width={256}
      collapsedWidth={80}
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="fixed left-0 top-0 h-full z-50"
      style={{
        background: 'var(--ant-color-bg-container)',
        borderRight: '1px solid var(--ant-color-border)',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
      }}
      trigger={null}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Collapse Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="fade-in">
                <Space align="center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
            )}
            <Tooltip title={collapsed ? 'Kengaytirish' : 'Yig\'ish'} placement="right">
              <div
                onClick={() => onCollapse(!collapsed)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-2">
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            onClick={({ key }) => onSectionChange(key)}
            style={{ border: 'none', background: 'transparent' }}
            inlineCollapsed={collapsed}
            items={filteredMenuItems.map(item => ({
              key: item.key,
              icon: item.badge ? (
                <Badge count={item.badge} size="small" offset={[10, 0]}>
                  {item.icon}
                </Badge>
              ) : item.icon,
              label: item.label,
            }))}
          />
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {collapsed ? (
              <Tooltip title={`${user.name} - ${getRoleText(user.role)}`} placement="right">
                <div className="flex justify-center">
                  <Badge 
                    dot 
                    color={getRoleBadgeColor(user.role)}
                    offset={[-8, 8]}
                  >
                    <Avatar src={user.avatar} icon={<UserOutlined />} size={40} />
                  </Badge>
                </div>
              </Tooltip>
            ) : (
              <div className="fade-in">
                <Space className="w-full">
                  <Badge 
                    dot 
                    color={getRoleBadgeColor(user.role)}
                    offset={[-8, 8]}
                  >
                    <Avatar src={user.avatar} icon={<UserOutlined />} size={40} />
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
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
        )}
      </div>
    </Sider>
  );
}