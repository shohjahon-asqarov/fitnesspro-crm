import React, { useState } from 'react';
import { Notification } from '../../types';
import { useMembers } from '../../hooks/useMembers';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

interface NotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notificationData: Omit<Notification, 'id'>) => Promise<void>;
}

export default function NotificationForm({ isOpen, onClose, onSubmit }: NotificationFormProps) {
  const { members } = useMembers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'marketing' as Notification['type'],
    recipients: [] as string[],
    scheduledAt: '',
    channel: 'email' as Notification['channel']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const notificationData: Omit<Notification, 'id'> = {
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        scheduledAt: formData.scheduledAt || new Date().toISOString()
      };
      
      await onSubmit(notificationData);
      setFormData({
        title: '',
        message: '',
        type: 'marketing',
        recipients: [],
        scheduledAt: '',
        channel: 'email'
      });
      onClose();
    } catch (error) {
      console.error('Failed to create notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      recipients: selectedOptions
    }));
  };

  const selectAllMembers = () => {
    const allMemberIds = members.filter(m => m.status === 'active').map(m => m.id);
    setFormData(prev => ({
      ...prev,
      recipients: allMemberIds
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yangi Bildirishnoma" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sarlavha
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Turi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="membership">A'zolik</option>
              <option value="payment">To'lov</option>
              <option value="marketing">Marketing</option>
              <option value="system">Tizim</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kanal
            </label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Bildirishnoma</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xabar
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Qabul qiluvchilar
              </label>
              <button
                type="button"
                onClick={selectAllMembers}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Barchasini tanlash
              </button>
            </div>
            <select
              multiple
              value={formData.recipients}
              onChange={handleRecipientsChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
            >
              {members.filter(m => m.status === 'active').map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.email}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ctrl/Cmd tugmasini bosib bir nechta a'zoni tanlang
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rejalashtirilgan vaqt (ixtiyoriy)
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
            disabled={loading || formData.recipients.length === 0}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            Yaratish
          </button>
        </div>
      </form>
    </Modal>
  );
}