import React, { useState } from 'react';
import { Member } from '../../types';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

interface AttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberId: string, status: 'present' | 'absent') => Promise<void>;
  members: Member[];
  selectedDate: string;
}

export default function AttendanceForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  members, 
  selectedDate 
}: AttendanceFormProps) {
  const [selectedMember, setSelectedMember] = useState('');
  const [status, setStatus] = useState<'present' | 'absent'>('present');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setLoading(true);
    try {
      await onSubmit(selectedMember, status);
      setSelectedMember('');
      setStatus('present');
      onClose();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Qo'lda Davomat Belgilash" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sana
          </label>
          <input
            type="date"
            value={selectedDate}
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            A'zoni Tanlang
          </label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">A'zoni tanlang...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.membershipType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Holat
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="present"
                checked={status === 'present'}
                onChange={(e) => setStatus(e.target.value as 'present')}
                className="mr-2 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-green-600 dark:text-green-400">Hozir</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="absent"
                checked={status === 'absent'}
                onChange={(e) => setStatus(e.target.value as 'absent')}
                className="mr-2 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-red-600 dark:text-red-400">Yo'q</span>
            </label>
          </div>
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
            disabled={loading || !selectedMember}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            Belgilash
          </button>
        </div>
      </form>
    </Modal>
  );
}