import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Bell,
  Send,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Notification } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationForm from './NotificationForm';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Notifications() {
  const { notifications, loading, createNotification, markAsRead, sendNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'membership' | 'payment' | 'marketing' | 'system'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');
  const [showForm, setShowForm] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateNotification = async (notificationData: Omit<Notification, 'id'>) => {
    try {
      await createNotification(notificationData);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const handleSendNotification = async (id: string) => {
    try {
      await sendNotification(id);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership': return <Users size={16} className="text-blue-500" />;
      case 'payment': return <DollarSign size={16} className="text-green-500" />;
      case 'marketing': return <MessageSquare size={16} className="text-purple-500" />;
      case 'system': return <Bell size={16} className="text-orange-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'failed': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'membership': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'payment': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'system': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const sentCount = notifications.filter(n => n.status === 'sent').length;
  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const failedCount = notifications.filter(n => n.status === 'failed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bildirishnomalar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            A'zolarga avtomatik eslatmalar va marketing xabarlari
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Yangi Bildirishnoma
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Yuborilgan
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {sentCount}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200/50 dark:border-yellow-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                Kutilmoqda
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {pendingCount}
              </p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200/50 dark:border-red-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                Xatolik
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {failedCount}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Bildirishnomalarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Barcha Turlar</option>
            <option value="membership">A'zolik</option>
            <option value="payment">To'lov</option>
            <option value="marketing">Marketing</option>
            <option value="system">Tizim</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Barcha Holatlar</option>
            <option value="sent">Yuborilgan</option>
            <option value="pending">Kutilmoqda</option>
            <option value="failed">Xatolik</option>
          </select>
          <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getTypeIcon(notification.type)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                    {notification.type === 'membership' ? 'A\'zolik' :
                     notification.type === 'payment' ? 'To\'lov' :
                     notification.type === 'marketing' ? 'Marketing' : 'Tizim'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {notification.message}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Yaratilgan: {new Date(notification.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  {notification.scheduledAt && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>Rejalashtirilgan: {new Date(notification.scheduledAt).toLocaleDateString('uz-UZ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Qabul qiluvchilar: {notification.recipients.length}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(notification.status)}
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                    {notification.status === 'sent' ? 'Yuborilgan' :
                     notification.status === 'pending' ? 'Kutilmoqda' : 'Xatolik'}
                  </span>
                </div>

                {notification.status === 'pending' && (
                  <button
                    onClick={() => handleSendNotification(notification.id)}
                    className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Send size={14} />
                    Yuborish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Form */}
      <NotificationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateNotification}
      />
    </div>
  );
}