import { useState, useEffect } from 'react';
import { Payment } from '../types';
import { paymentService } from '../services/api';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAll();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Omit<Payment, 'id'>) => {
    try {
      const newPayment = await paymentService.create(paymentData);
      setPayments(prev => [...prev, newPayment]);
      return newPayment;
    } catch (err) {
      setError('Failed to create payment');
      throw err;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      const updatedPayment = await paymentService.markAsPaid(id);
      if (updatedPayment) {
        setPayments(prev => prev.map(payment => 
          payment.id === id ? updatedPayment : payment
        ));
      }
      return updatedPayment;
    } catch (err) {
      setError('Failed to mark payment as paid');
      throw err;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const success = await paymentService.delete(id);
      if (success) {
        setPayments(prev => prev.filter(payment => payment.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete payment');
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    createPayment,
    markAsPaid,
    deletePayment,
    refetch: fetchPayments
  };
};