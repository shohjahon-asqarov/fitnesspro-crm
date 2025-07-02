import React from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Dumbbell,
  DollarSign,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import StatsCard from './StatsCard';
import { useAuth } from '../../contexts/AuthContext';
import { mockDashboardStats, monthlyRevenueData, membershipDistribution } from '../../data/mockData';

export default function Dashboard() {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'trainer':
        return [
          { title: 'Tayinlangan A\'zolar', value: 15, icon: Users, color: 'primary' as const },
          { title: 'Bugungi Mashg\'ulotlar', value: 3, icon: Calendar, color: 'secondary' as const },
          { title: 'Oylik Komissiya', value: '1,250,000 UZS', icon: DollarSign, color: 'accent' as const },
          { title: 'Reyting', value: '4.8/5', icon: Activity, color: 'warning' as const }
        ];
      case 'receptionist':
        return [
          { title: 'Kunlik Tashrif', value: 42, icon: UserCheck, color: 'primary' as const },
          { title: 'Yangi Ro\'yxatlar', value: 5, icon: Users, color: 'secondary' as const },
          { title: 'Bugungi To\'lovlar', value: '3,200,000 UZS', icon: DollarSign, color: 'accent' as const },
          { title: 'Kutilayotgan Vazifalar', value: 7, icon: AlertTriangle, color: 'warning' as const }
        ];
      case 'member':
        return [
          { title: 'Tashrif Kunlari', value: 18, icon: Activity, color: 'primary' as const },
          { title: 'Qatnashgan Mashg\'ulotlar', value: 12, icon: Calendar, color: 'secondary' as const },
          { title: 'A\'zolik Qolgan Kunlar', value: 45, icon: Users, color: 'accent' as const },
          { title: 'Yoqilgan Kaloriya', value: '12,450', icon: TrendingUp, color: 'warning' as const }
        ];
      default:
        return [
          { title: 'Jami A\'zolar', value: mockDashboardStats.totalMembers, icon: Users, color: 'primary' as const, change: '+12 bu oy', changeType: 'positive' as const },
          { title: 'Faol A\'zolar', value: mockDashboardStats.activeMembers, icon: UserCheck, color: 'secondary' as const, change: '+5.2%', changeType: 'positive' as const },
          { title: 'Oylik Daromad', value: `${(mockDashboardStats.monthlyRevenue / 1000000).toFixed(1)}M UZS`, icon: TrendingUp, color: 'accent' as const, change: '+8.1%', changeType: 'positive' as const },
          { title: 'Muddati Tugaydi', value: mockDashboardStats.expiringThisMonth, icon: AlertTriangle, color: 'warning' as const, change: 'E\'tibor talab qiladi', changeType: 'neutral' as const }
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Xush kelibsiz, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bugun sport zalingizda nima bo'layotgani haqida ma'lumot.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('uz-UZ', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Section - Only for Admin and Manager */}
      {user?.role && ['admin', 'manager'].includes(user.role) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Oylik Daromad
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="url(#colorRevenue)" 
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Membership Distribution */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              A'zolik Taqsimoti
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
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
          </div>
        </div>
      )}

      {/* Additional Stats for Admin/Manager */}
      {user?.role && ['admin', 'manager'].includes(user.role) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Jami Murabbiylar"
            value={mockDashboardStats.totalTrainers}
            icon={UserCheck}
            color="secondary"
            change="Hammasi faol"
            changeType="positive"
          />
          <StatsCard
            title="Faol Mashg'ulotlar"
            value={mockDashboardStats.activeClasses}
            icon={Calendar}
            color="primary"
            change="3 ta yangi bu hafta"
            changeType="positive"
          />
          <StatsCard
            title="Ishlaydigan Jihozlar"
            value={mockDashboardStats.equipmentWorking}
            icon={Dumbbell}
            color="secondary"
            change={`${mockDashboardStats.equipmentMaintenance} ta ta'mirda`}
            changeType="neutral"
          />
          <StatsCard
            title="Jami Daromad"
            value={`${(mockDashboardStats.totalRevenue / 1000000).toFixed(0)}M UZS`}
            icon={DollarSign}
            color="accent"
            change="+15.3% o'tgan oyga nisbatan"
            changeType="positive"
          />
        </div>
      )}
    </div>
  );
}