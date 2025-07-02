import { useState, useEffect } from 'react';
import { Attendance } from '../types';
import { attendanceService } from '../services/api';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll();
      setAttendance(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (memberId: string, status: 'present' | 'absent', date: string) => {
    try {
      const attendanceRecord = await attendanceService.markAttendance(memberId, status, date);
      if (attendanceRecord) {
        setAttendance(prev => {
          const existingIndex = prev.findIndex(a => a.memberId === memberId && a.date === date);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = attendanceRecord;
            return updated;
          } else {
            return [...prev, attendanceRecord];
          }
        });
      }
      return attendanceRecord;
    } catch (err) {
      setError('Failed to mark attendance');
      throw err;
    }
  };

  const getAttendanceByDate = (date: string): Attendance[] => {
    return attendance.filter(record => record.date === date);
  };

  const getAttendanceByMember = (memberId: string): Attendance[] => {
    return attendance.filter(record => record.memberId === memberId);
  };

  const getAttendanceStats = (startDate: string, endDate: string) => {
    const filteredAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });

    const totalDays = filteredAttendance.length;
    const presentDays = filteredAttendance.filter(record => record.status === 'present').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendance,
    loading,
    error,
    markAttendance,
    getAttendanceByDate,
    getAttendanceByMember,
    getAttendanceStats,
    refetch: fetchAttendance
  };
};