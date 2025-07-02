import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';
import { Member } from '../../types';
import { useMembers } from '../../hooks/useMembers';
import MemberForm from './MemberForm';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import SearchableSelect from '../common/SearchableSelect';
import toast from 'react-hot-toast';

export default function Members() {
  const { members, loading, createMember, updateMember, deleteMember, updateMembershipStatus } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [filterMembership, setFilterMembership] = useState<'all' | 'Basic' | 'Pro' | 'Premium'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; member: Member | null }>({
    show: false,
    member: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'expiryDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      const matchesMembership = filterMembership === 'all' || member.membershipType === filterMembership;
      return matchesSearch && matchesStatus && matchesMembership;
    });
  }, [members, searchTerm, filterStatus, filterMembership]);

  // Sort logic
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
          break;
        case 'expiryDate':
          aValue = new Date(a.expiryDate).getTime();
          bValue = new Date(b.expiryDate).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMembers, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = sortedMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateMember = async (memberData: Omit<Member, 'id'>) => {
    setFormLoading(true);
    try {
      await createMember(memberData);
      setShowForm(false);
      toast.success('A\'zo muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      toast.error('A\'zo qo\'shishda xatolik yuz berdi');
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
      toast.success('A\'zo ma\'lumotlari yangilandi!');
    } catch (error) {
      toast.error('A\'zo ma\'lumotlarini yangilashda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirm.member) return;
    
    try {
      await deleteMember(deleteConfirm.member.id);
      setDeleteConfirm({ show: false, member: null });
      toast.success('A\'zo o\'chirildi');
    } catch (error) {
      toast.error('A\'zoni o\'chirishda xatolik');
    }
  };

  const handleStatusChange = async (memberId: string, newStatus: Member['status']) => {
    try {
      await updateMembershipStatus(memberId, newStatus);
      toast.success('A\'zo holati yangilandi');
    } catch (error) {
      toast.error('Holatni yangilashda xatolik');
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

  const exportMembers = () => {
    toast.success('A\'zolar ro\'yxati eksport qilinmoqda...');
  };

  const refreshData = () => {
    toast.success('Ma\'lumotlar yangilandi');
  };

  // Status options for select
  const statusOptions = [
    { value: 'all', label: 'Barcha Holatlar' },
    { value: 'active', label: 'Faol' },
    { value: 'inactive', label: 'Nofaol' },
    { value: 'expired', label: 'Muddati Tugagan' }
  ];

  const membershipOptions = [
    { value: 'all', label: 'Barcha A\'zoliklar' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Pro', label: 'Pro' },
    { value: 'Premium', label: 'Premium' }
  ];

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
            Sport zali a'zolari va ularning obunalarini boshqarish ({filteredMembers.length} ta)
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Yangilash
          </button>
          <button 
            onClick={exportMembers}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Eksport
          </button>
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
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Ism, email yoki telefon bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <SearchableSelect
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => {
              setFilterStatus(value as any);
              setCurrentPage(1);
            }}
            placeholder="Holat bo'yicha filter"
          />
          
          <SearchableSelect
            options={membershipOptions}
            value={filterMembership}
            onChange={(value) => {
              setFilterMembership(value as any);
              setCurrentPage(1);
            }}
            placeholder="A'zolik turi"
          />
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Saralash:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Ism bo'yicha</option>
                <option value="joinDate">Qo'shilgan sana</option>
                <option value="expiryDate">Tugash sanasi</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sahifada:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group"
            >
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
                      {member.membershipType === 'Premium' && <Crown size={8} className="text-white" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{member.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {getStatusText(member.status)}
                    </span>
                  </div>
                </div>
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Mail size={12} />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Phone size={12} />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>Tugaydi: {new Date(member.expiryDate).toLocaleDateString('uz-UZ')}</span>
                  {member.status === 'expired' && <AlertTriangle size={12} className="text-red-500" />}
                </div>
              </div>

              {/* Membership Badge */}
              <div className="mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getMembershipColor(member.membershipType)}`}>
                    {member.membershipType}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {member.monthlyFee.toLocaleString()} UZS/oy
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {member.totalVisits} tashrif • Oxirgi: {new Date(member.lastVisit).toLocaleDateString('uz-UZ')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-xs"
                >
                  <Eye size={12} />
                  Ko'rish
                </button>
                <button 
                  onClick={() => {
                    setEditingMember(member);
                    setShowForm(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  <Edit size={12} />
                  Tahrirlash
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: true, member })}
                  className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-xs"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={sortedMembers.length}
        itemsPerPage={itemsPerPage}
      />

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
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
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}