import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Typography, 
  Space, 
  Button,
  Avatar,
  List,
  Tag,
  Divider,
  Alert,
  Timeline,
  Badge
} from 'antd';
import { 
  UserOutlined,
  UserAddOutlined,
  TrophyOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  TeamOutlined,
  ToolOutlined,
  BellOutlined,
  RightOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { mockDashboardStats, monthlyRevenueData, membershipDistribution } from '../../data/mockData';

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'trainer':
        return [
          { 
            title: 'Tayinlangan A\'zolar', 
            value: 15, 
            icon: <TeamOutlined />, 
            color: '#3b82f6',
            change: '+2 bu hafta',
            changeType: 'increase'
          },
          { 
            title: 'Bugungi Mashg\'ulotlar', 
            value: 3, 
            icon: <CalendarOutlined />, 
            color: '#10b981',
            change: '2 ta qoldi',
            changeType: 'neutral'
          },
          { 
            title: 'Oylik Komissiya', 
            value: '1,250,000', 
            suffix: 'UZS',
            icon: <DollarOutlined />, 
            color: '#f59e0b',
            change: '+15%',
            changeType: 'increase'
          },
          { 
            title: 'Reyting', 
            value: 4.8, 
            suffix: '/5',
            icon: <TrophyOutlined />, 
            color: '#ec4899',
            change: '+0.2',
            changeType: 'increase'
          }
        ];
      case 'receptionist':
        return [
          { 
            title: 'Kunlik Tashrif', 
            value: 42, 
            icon: <UserAddOutlined />, 
            color: '#3b82f6',
            change: '+8 kecha',
            changeType: 'increase'
          },
          { 
            title: 'Yangi Ro\'yxatlar', 
            value: 5, 
            icon: <TeamOutlined />, 
            color: '#10b981',
            change: 'Bugun',
            changeType: 'neutral'
          },
          { 
            title: 'Bugungi To\'lovlar', 
            value: '3,200,000', 
            suffix: 'UZS',
            icon: <DollarOutlined />, 
            color: '#f59e0b',
            change: '+12%',
            changeType: 'increase'
          },
          { 
            title: 'Kutilayotgan Vazifalar', 
            value: 7, 
            icon: <BellOutlined />, 
            color: '#ef4444',
            change: '2 ta muhim',
            changeType: 'decrease'
          }
        ];
      case 'member':
        return [
          { 
            title: 'Tashrif Kunlari', 
            value: 18, 
            icon: <FireOutlined />, 
            color: '#3b82f6',
            change: 'Bu oy',
            changeType: 'neutral'
          },
          { 
            title: 'Qatnashgan Mashg\'ulotlar', 
            value: 12, 
            icon: <CalendarOutlined />, 
            color: '#10b981',
            change: '+3 bu hafta',
            changeType: 'increase'
          },
          { 
            title: 'A\'zolik Qolgan Kunlar', 
            value: 45, 
            icon: <UserOutlined />, 
            color: '#f59e0b',
            change: '1.5 oy',
            changeType: 'neutral'
          },
          { 
            title: 'Yoqilgan Kaloriya', 
            value: '12,450', 
            icon: <ThunderboltOutlined />, 
            color: '#ec4899',
            change: '+850 bugun',
            changeType: 'increase'
          }
        ];
      default:
        return [
          { 
            title: 'Jami A\'zolar', 
            value: mockDashboardStats.totalMembers, 
            icon: <TeamOutlined />, 
            color: '#3b82f6',
            change: '+12 bu oy',
            changeType: 'increase'
          },
          { 
            title: 'Faol A\'zolar', 
            value: mockDashboardStats.activeMembers, 
            icon: <UserAddOutlined />, 
            color: '#10b981',
            change: '+5.2%',
            changeType: 'increase'
          },
          { 
            title: 'Oylik Daromad', 
            value: `${(mockDashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`, 
            suffix: 'UZS',
            icon: <DollarOutlined />, 
            color: '#f59e0b',
            change: '+8.1%',
            changeType: 'increase'
          },
          { 
            title: 'Muddati Tugaydi', 
            value: mockDashboardStats.expiringThisMonth, 
            icon: <BellOutlined />, 
            color: '#ef4444',
            change: 'E\'tibor talab qiladi',
            changeType: 'decrease'
          }
        ];
    }
  };

  const stats = getStatsForRole();

  const recentActivities = [
    { type: 'member', content: 'Yangi a\'zo: Sardor Abdullayev', time: '5 daqiqa oldin', color: 'blue' },
    { type: 'payment', content: 'To\'lov qabul qilindi: 300,000 UZS', time: '15 daqiqa oldin', color: 'green' },
    { type: 'class', content: 'Morning Yoga mashg\'uloti boshlandi', time: '30 daqiqa oldin', color: 'purple' },
    { type: 'equipment', content: 'Treadmill #3 ta\'mirga yuborildi', time: '1 soat oldin', color: 'orange' },
  ];

  const upcomingClasses = [
    { name: 'HIIT Fitness', time: '14:00', trainer: 'Aziza Nazarova', enrolled: 12, capacity: 15 },
    { name: 'Boxing Fundamentals', time: '16:00', trainer: 'Dilshod Umarov', enrolled: 8, capacity: 12 },
    { name: 'Zumba Party', time: '18:00', trainer: 'Feruza Qodirova', enrolled: 22, capacity: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="fade-in">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0">
          <div className="text-white">
            <Space direction="vertical" size="small">
              <Title level={2} className="!text-white !mb-0">
                Xush kelibsiz, {user?.name}! 👋
              </Title>
              <Text className="text-blue-100 text-lg">
                Bugun sport zalingizda nima bo'layotgani haqida ma'lumot
              </Text>
              <Text className="text-blue-200">
                {new Date().toLocaleDateString('uz-UZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </Space>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="slide-up">
              <Card className="hover:shadow-lg transition-smooth">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: stat.color }}
                    >
                      {stat.icon}
                    </div>
                  }
                  valueStyle={{ 
                    color: stat.color,
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                />
                <div className="mt-3 flex items-center gap-2">
                  {stat.changeType === 'increase' && <ArrowUpOutlined className="text-green-500" />}
                  {stat.changeType === 'decrease' && <ArrowDownOutlined className="text-red-500" />}
                  <Text 
                    type={stat.changeType === 'increase' ? 'success' : 
                         stat.changeType === 'decrease' ? 'danger' : 'secondary'}
                    className="text-sm"
                  >
                    {stat.change}
                  </Text>
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts and Activities */}
      <Row gutter={[24, 24]}>
        {/* Revenue Chart */}
        {user?.role && ['admin', 'manager'].includes(user.role) && (
          <Col xs={24} lg={16}>
            <div className="fade-in">
              <Card 
                title={
                  <Space>
                    <DollarOutlined className="text-green-500" />
                    <span>Oylik Daromad Dinamikasi</span>
                  </Space>
                }
                extra={
                  <Button type="link" icon={<RightOutlined />}>
                    Batafsil
                  </Button>
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#8c8c8c" />
                    <YAxis stroke="#8c8c8c" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #d9d9d9', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="url(#colorRevenue)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </Col>
        )}

        {/* Recent Activities */}
        <Col xs={24} lg={user?.role && ['admin', 'manager'].includes(user.role) ? 8 : 12}>
          <div className="fade-in">
            <Card 
              title={
                <Space>
                  <BellOutlined className="text-blue-500" />
                  <span>So'nggi Faoliyat</span>
                </Space>
              }
              extra={
                <Button type="link" icon={<RightOutlined />}>
                  Barchasini ko'rish
                </Button>
              }
            >
              <Timeline
                items={recentActivities.map((activity, index) => ({
                  dot: <Badge color={activity.color} />,
                  children: (
                    <div key={index}>
                      <Text strong className="text-sm">{activity.content}</Text>
                      <br />
                      <Text type="secondary" className="text-xs">{activity.time}</Text>
                    </div>
                  )
                }))}
              />
            </Card>
          </div>
        </Col>

        {/* Upcoming Classes */}
        <Col xs={24} lg={user?.role && ['admin', 'manager'].includes(user.role) ? 24 : 12}>
          <div className="fade-in">
            <Card 
              title={
                <Space>
                  <CalendarOutlined className="text-purple-500" />
                  <span>Bugungi Mashg'ulotlar</span>
                </Space>
              }
              extra={
                <Button type="link" icon={<RightOutlined />}>
                  Jadvalni ko'rish
                </Button>
              }
            >
              <List
                dataSource={upcomingClasses}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                          {item.time}
                        </div>
                      }
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          <Tag color="blue">{item.trainer}</Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary">{item.enrolled}/{item.capacity} a'zo</Text>
                          <Progress 
                            percent={Math.round((item.enrolled / item.capacity) * 100)} 
                            size="small" 
                            showInfo={false}
                            strokeColor={{
                              '0%': '#87d068',
                              '100%': '#108ee9',
                            }}
                          />
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>

      {/* Membership Distribution - Only for Admin/Manager */}
      {user?.role && ['admin', 'manager'].includes(user.role) && (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="fade-in">
              <Card 
                title={
                  <Space>
                    <UserOutlined className="text-orange-500" />
                    <span>A'zolik Taqsimoti</span>
                  </Space>
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={membershipDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="fade-in">
              <Card 
                title={
                  <Space>
                    <ToolOutlined className="text-red-500" />
                    <span>Jihozlar Holati</span>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card className="text-center bg-green-50 border-green-200">
                      <Statistic
                        title="Ishlamoqda"
                        value={mockDashboardStats.equipmentWorking}
                        valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="text-center bg-yellow-50 border-yellow-200">
                      <Statistic
                        title="Ta'mirda"
                        value={mockDashboardStats.equipmentMaintenance}
                        valueStyle={{ color: '#faad14', fontSize: '24px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="text-center bg-red-50 border-red-200">
                      <Statistic
                        title="Buzilgan"
                        value={2}
                        valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
                      />
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <Alert
                  message="Diqqat!"
                  description="3 ta jihozning texnik ko'rikdan o'tish vaqti keldi."
                  type="warning"
                  showIcon
                  action={
                    <Button size="small" type="primary">
                      Ko'rish
                    </Button>
                  }
                />
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}