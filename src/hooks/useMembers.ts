import { useState, useEffect } from 'react';
import { Member } from '../types';
import { memberService } from '../services/api';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const newMember = await memberService.create(memberData);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      setError('Failed to create member');
      throw err;
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const updatedMember = await memberService.update(id, updates);
      if (updatedMember) {
        setMembers(prev => prev.map(member => 
          member.id === id ? updatedMember : member
        ));
      }
      return updatedMember;
    } catch (err) {
      setError('Failed to update member');
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const success = await memberService.delete(id);
      if (success) {
        setMembers(prev => prev.filter(member => member.id !== id));
      }
      return success;
    } catch (err) {
      setError('Failed to delete member');
      throw err;
    }
  };

  const updateMembershipStatus = async (id: string, status: Member['status']) => {
    try {
      const updatedMember = await memberService.updateMembershipStatus(id, status);
      if (updatedMember) {
        setMembers(prev => prev.map(member => 
          member.id === id ? updatedMember : member
        ));
      }
      return updatedMember;
    } catch (err) {
      setError('Failed to update membership status');
      throw err;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    updateMembershipStatus,
    refetch: fetchMembers
  };
};