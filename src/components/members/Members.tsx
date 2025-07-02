import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Phone,
  Mail,
  Crown,
  AlertTriangle
} from 'lucide-react';
import { Member } from '../../types';
import { useMembers } from '../../hooks/useMembers';
import MemberForm from './MemberForm';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Members() {
  const { members, loading, createMember, updateMember, deleteMember, updateMembershipStatus } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; member: Member | null }>({
    show: false,
    member: null
  });
  const [formLoading, setFormLoading] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateMember = async (memberData: Omit<Member, 'id'>) => {
    setFormLoading(true);
    try {
      await createMember(memberData);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMember = async (memberData: Omit<Member, 'id'>) => {
    if (!editingMember) return;
    
    setFormLoading(true);
    try {
      await updateMember(editingMember.id, memberData);
      setEditingMember(null);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirm.member) return;
    
    try {
      await deleteMember(deleteConfirm.member.id);
      setDeleteConfirm({ show: false, member: null });
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleStatusChange = async (memberId: string, newStatus: Member['status']) => {
    try {
      await updateMembershipStatus(memberId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Faol';
      case 'inactive': return 'Nofaol';
      case 'expired': return 'Muddati tugagan';
      default: return status;
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'Premium': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'Pro': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'Basic': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      default: return 'bg-gray-400';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A'zolar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sport zali a'zolari va ularning obunalarini boshqarish
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          A'zo Qo'shish
        </button>
      </div>

      {/* Search and Filters */}
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Barcha Holatlar</option>
            <option value="active">Faol</option>
            <option value="inactive">Nofaol</option>
            <option value="expired">Muddati Tugagan</option>
          </select>
          <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
            {/* Member Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getMembershipColor(member.membershipType)} flex items-center justify-center`}>
                    {member.membershipType === 'Premium' && <Crown size={10} className="text-white" />}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Member Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={14} />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone size={14} />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} />
                <span>Tugaydi: {new Date(member.expiryDate).toLocaleDateString('uz-UZ')}</span>
                {member.status === 'expired' && <AlertTriangle size={14} className="text-red-500" />}
              </div>
            </div>

            {/* Membership Badge */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getMembershipColor(member.membershipType)}`}>
                  {member.membershipType}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {member.monthlyFee.toLocaleString()} UZS/oy
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {member.totalVisits} tashrif • Oxirgi: {new Date(member.lastVisit).toLocaleDateString('uz-UZ')}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedMember(member)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm"
              >
                <Eye size={14} />
                Ko'rish
              </button>
              <button 
                onClick={() => {
                  setEditingMember(member);
                  setShowForm(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <Edit size={14} />
                Tahrirlash
              </button>
              <button
                onClick={() => setDeleteConfirm({ show: true, member })}
                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Member Form Modal */}
      <MemberForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMember(null);
        }}
        onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
        member={editingMember}
        loading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, member: null })}
        onConfirm={handleDeleteMember}
        title="A'zoni O'chirish"
        message={`${deleteConfirm.member?.name}ni o'chirishga ishonchingiz komilmi? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="O'chirish"
        type="danger"
      />

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">A'zo Ma'lumotlari</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMember.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMember.status)}`}>
                      {getStatusText(selectedMember.status)}
                    </span>
                    <select
                      value={selectedMember.status}
                      onChange={(e) => handleStatusChange(selectedMember.id, e.target.value as Member['status'])}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="active">Faol</option>
                      <option value="inactive">Nofaol</option>
                      <option value="expired">Muddati Tugagan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">A'zolik</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.membershipType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oylik To'lov</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.monthlyFee.toLocaleString()} UZS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Qo'shilgan Sana</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedMember.joinDate).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tugash Sanasi</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedMember.expiryDate).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jami Tashriflar</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMember.totalVisits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oxirgi Tashrif</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedMember.lastVisit).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}