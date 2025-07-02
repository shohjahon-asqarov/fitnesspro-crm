import { useState, useEffect } from 'react';
import { Equipment } from '../types';
import { equipmentService } from '../services/api';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll();
      setEquipment(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (equipmentData: Omit<Equipment, 'id'>) => {
    try {
      const newEquipment = await equipmentService.create(equipmentData);
      setEquipment(prev => [...prev, newEquipment]);
      return newEquipment;
    } catch (err) {
      setError('Failed to create equipment');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const updatedEquipment = await equipmentService.update(id, updates);
      if (updatedEquipment) {
        setEquipment(prev => prev.map(item => 
          item.id === id ? updatedEquipment : item
        ));
      }
      return updatedEquipment;
    } catch (err) {
      setError('Failed to update equipment');
      throw err;
    }
  };

  const updateStatus = async (id: string, status: Equipment['status']) => {
    try {
      const updatedEquipment = await equipmentService.updateStatus(id, status);
      if (updatedEquipment) {
        setEquipment(prev => prev.map(item => 
          item.id === id ? updatedEquipment : item
        ));
      }
      return updatedEquipment;
    } catch (err) {
      setError('Failed to update equipment status');
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const success = await equipmentService.delete(id);
      if (success) {
        setEquipment(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete equipment');
      throw err;
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    createEquipment,
    updateEquipment,
    updateStatus,
    deleteEquipment,
    refetch: fetchEquipment
  };
};