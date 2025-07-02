import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData: Omit<Notification, 'id'>) => {
    try {
      const newNotification = await notificationService.create(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      setError('Failed to create notification');
      throw err;
    }
  };

  const sendNotification = async (id: string) => {
    try {
      const updatedNotification = await notificationService.send(id);
      if (updatedNotification) {
        setNotifications(prev => prev.map(notification => 
          notification.id === id ? updatedNotification : notification
        ));
      }
      return updatedNotification;
    } catch (err) {
      setError('Failed to send notification');
      throw err;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(id);
      if (updatedNotification) {
        setNotifications(prev => prev.map(notification => 
          notification.id === id ? updatedNotification : notification
        ));
      }
      return updatedNotification;
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const success = await notificationService.delete(id);
      if (success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    createNotification,
    sendNotification,
    markAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};