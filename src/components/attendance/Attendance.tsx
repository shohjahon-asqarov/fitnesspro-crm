import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  QrCode,
  Clock,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Download,
  Eye
} from 'lucide-react';
import { Attendance as AttendanceType, Member } from '../../types';
import { useAttendance } from '../../hooks/useAttendance';
import { useMembers } from '../../hooks/useMembers';
import AttendanceForm from './AttendanceForm';
import QRScanner from './QRScanner';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Attendance() {
  const { attendance, loading, markAttendance, getAttendanceByDate } = useAttendance();
  const { members } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');

  const todayAttendance = getAttendanceByDate(selectedDate);
  
  const filteredAttendance = todayAttendance.filter(record => {
    const member = members.find(m => m.id === record.memberId);
    const matchesSearch = member?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleManualAttendance = async (memberId: string, status: 'present' | 'absent') => {
    try {
      await markAttendance(memberId, status, selectedDate);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleQRScan = async (memberId: string) => {
    try {
      await markAttendance(memberId, 'present', selectedDate);
      setShowQRScanner(false);
    } catch (error) {
      console.error('Failed to mark attendance via QR:', error);
    }
  };

  const presentCount = filteredAttendance.filter(a => a.status === 'present').length;
  const absentCount = filteredAttendance.filter(a => a.status === 'absent').length;
  const totalMembers = members.filter(m => m.status === 'active').length;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Davomat Kuzatuvi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            A'zolar davomatini kuzatish va boshqarish
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowQRScanner(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors"
          >
            <QrCode size={18} />
            QR Skaner
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Qo'lda Belgilash
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Hozir
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {presentCount}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200/50 dark:border-red-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                Yo'q
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {absentCount}
              </p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Jami A'zolar
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {totalMembers}
              </p>
            </div>
            <User className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                Davomat %
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {totalMembers > 0 ? Math.round((presentCount / totalMembers) * 100) : 0}%
              </p>
            </div>
            <Clock className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="A'zolarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Barchasi</option>
            <option value="present">Hozir</option>
            <option value="absent">Yo'q</option>
          </select>
          <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  A'zo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  A'zolik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kirish Vaqti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAttendance.map((record) => {
                const member = members.find(m => m.id === record.memberId);
                if (!member) return null;

                return (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        member.membershipType === 'Premium' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : member.membershipType === 'Pro'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {member.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {record.checkInTime || '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {record.status === 'present' ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {record.status === 'present' ? 'Hozir' : 'Yo\'q'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleManualAttendance(member.id, record.status === 'present' ? 'absent' : 'present')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            record.status === 'present'
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                        >
                          {record.status === 'present' ? 'Yo\'q deb belgilash' : 'Hozir deb belgilash'}
                        </button>
                        <button className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
                          <Eye size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Attendance Form */}
      <AttendanceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleManualAttendance}
        members={members.filter(m => m.status === 'active')}
        selectedDate={selectedDate}
      />

      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
}