import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useMembers } from '../../hooks/useMembers';
import { usePayments } from '../../hooks/usePayments';
import { useAttendance } from '../../hooks/useAttendance';

export default function Reports() {
  const { members } = useMembers();
  const { payments } = usePayments();
  const { attendance } = useAttendance();
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Calculate revenue data
  const revenueData = payments
    .filter(p => p.status === 'paid')
    .reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleDateString('uz-UZ', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.revenue += payment.amount;
      } else {
        acc.push({ month, revenue: payment.amount });
      }
      return acc;
    }, [] as { month: string; revenue: number }[]);

  // Calculate membership distribution
  const membershipData = [
    { name: 'Basic', value: members.filter(m => m.membershipType === 'Basic').length, color: '#3b82f6' },
    { name: 'Pro', value: members.filter(m => m.membershipType === 'Pro').length, color: '#10b981' },
    { name: 'Premium', value: members.filter(m => m.membershipType === 'Premium').length, color: '#f59e0b' }
  ];

  // Calculate attendance data
  const attendanceData = attendance
    .filter(a => a.date >= dateRange.start && a.date <= dateRange.end)
    .reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        if (record.status === 'present') existing.present++;
        else existing.absent++;
      } else {
        acc.push({ 
          date, 
          present: record.status === 'present' ? 1 : 0,
          absent: record.status === 'absent' ? 1 : 0
        });
      }
      return acc;
    }, [] as { date: string; present: number; absent: number }[]);

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = payments
    .filter(p => p.status === 'paid' && new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);
  
  const activeMembers = members.filter(m => m.status === 'active').length;
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const exportReport = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} report...`);
    alert(`${type} hisoboti yuklab olinmoqda...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hisobotlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Moliyaviy va operatsion hisobotlar
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button 
            onClick={() => exportReport('PDF')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Jami Daromad
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(totalRevenue / 1000000).toFixed(1)}M UZS
              </p>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Oylik Daromad
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(monthlyRevenue / 1000000).toFixed(1)}M UZS
              </p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Faol A'zolar
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeMembers}
              </p>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Davomat %
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {attendanceRate}%
              </p>
            </div>
            <Activity className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Oylik Daromad Dinamikasi
            </h3>
            <BarChart3 className="text-primary-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              A'zolik Taqsimoti
            </h3>
            <PieChart className="text-secondary-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Kunlik Davomat
            </h3>
            <Activity className="text-accent-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                }}
              />
              <Bar dataKey="present" fill="#10b981" name="Hozir" />
              <Bar dataKey="absent" fill="#ef4444" name="Yo'q" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hisobotlarni Eksport Qilish
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => exportReport('Moliyaviy')}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <DollarSign className="text-green-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Moliyaviy Hisobot</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Daromad va xarajatlar</div>
            </div>
          </button>

          <button
            onClick={() => exportReport('A\'zolar')}
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="text-blue-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">A'zolar Hisoboti</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">A'zolar ro'yxati va statistika</div>
            </div>
          </button>

          <button
            onClick={() => exportReport('Davomat')}
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <Activity className="text-purple-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Davomat Hisoboti</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tashrif statistikasi</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}