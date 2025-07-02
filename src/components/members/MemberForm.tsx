import React, { useState } from 'react';
import { Member, Trainer } from '../../types';
import { useMembers } from '../../hooks/useMembers';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchableSelect from '../common/SearchableSelect';
import { mockTrainers } from '../../data/mockData';

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: Omit<Member, 'id'>) => Promise<void>;
  member?: Member | null;
  loading?: boolean;
}

export default function MemberForm({ isOpen, onClose, onSubmit, member, loading = false }: MemberFormProps) {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    membershipType: member?.membershipType || 'Basic',
    joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
    expiryDate: member?.expiryDate || '',
    status: member?.status || 'active',
    avatar: member?.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    totalVisits: member?.totalVisits || 0,
    lastVisit: member?.lastVisit || new Date().toISOString().split('T')[0],
    trainerId: member?.trainerId || '',
    monthlyFee: member?.monthlyFee || 200000
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyFee' || name === 'totalVisits' ? Number(value) : value
    }));
  };

  // Calculate expiry date based on membership type and join date
  const calculateExpiryDate = (joinDate: string, membershipType: string) => {
    const join = new Date(joinDate);
    const expiry = new Date(join);
    
    switch (membershipType) {
      case 'Basic':
        expiry.setMonth(expiry.getMonth() + 1);
        break;
      case 'Pro':
        expiry.setMonth(expiry.getMonth() + 3);
        break;
      case 'Premium':
        expiry.setFullYear(expiry.getFullYear() + 1);
        break;
    }
    
    return expiry.toISOString().split('T')[0];
  };

  // Update expiry date when join date or membership type changes
  React.useEffect(() => {
    if (formData.joinDate && formData.membershipType) {
      const newExpiryDate = calculateExpiryDate(formData.joinDate, formData.membershipType);
      setFormData(prev => ({ ...prev, expiryDate: newExpiryDate }));
    }
  }, [formData.joinDate, formData.membershipType]);

  // Update monthly fee when membership type changes
  React.useEffect(() => {
    const fees = {
      'Basic': 200000,
      'Pro': 300000,
      'Premium': 500000
    };
    setFormData(prev => ({ 
      ...prev, 
      monthlyFee: fees[formData.membershipType as keyof typeof fees] 
    }));
  }, [formData.membershipType]);

  // Trainer options for select
  const trainerOptions = [
    { value: '', label: 'Murabbiy tanlanmagan' },
    ...mockTrainers.map(trainer => ({
      value: trainer.id,
      label: trainer.name,
      avatar: trainer.avatar,
      subtitle: trainer.specialization.join(', ')
    }))
  ];

  const membershipOptions = [
    { value: 'Basic', label: 'Basic - 200,000 UZS/oy' },
    { value: 'Pro', label: 'Pro - 300,000 UZS/oy' },
    { value: 'Premium', label: 'Premium - 500,000 UZS/yil' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Faol' },
    { value: 'inactive', label: 'Nofaol' },
    { value: 'expired', label: 'Muddati Tugagan' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member ? 'A\'zoni Tahrirlash' : 'Yangi A\'zo Qo\'shish'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To'liq Ism *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ism va familiyani kiriting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              A'zolik Turi *
            </label>
            <SearchableSelect
              options={membershipOptions}
              value={formData.membershipType}
              onChange={(value) => setFormData(prev => ({ ...prev, membershipType: value as Member['membershipType'] }))}
              placeholder="A'zolik turini tanlang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qo'shilgan Sana *
            </label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tugash Sanasi *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Holat
            </label>
            <SearchableSelect
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value as Member['status'] }))}
              placeholder="Holatni tanlang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Oylik To'lov (UZS) *
            </label>
            <input
              type="number"
              name="monthlyFee"
              value={formData.monthlyFee}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shaxsiy Murabbiy
            </label>
            <SearchableSelect
              options={trainerOptions}
              value={formData.trainerId || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, trainerId: value || undefined }))}
              placeholder="Murabbiyni tanlang (ixtiyoriy)"
              searchPlaceholder="Murabbiy qidirish..."
            />
          </div>

          {member && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jami Tashriflar
                </label>
                <input
                  type="number"
                  name="totalVisits"
                  value={formData.totalVisits}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Oxirgi Tashrif
                </label>
                <input
                  type="date"
                  name="lastVisit"
                  value={formData.lastVisit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {member ? 'A\'zoni Yangilash' : 'A\'zo Qo\'shish'}
          </button>
        </div>
      </form>
    </Modal>
  );
}