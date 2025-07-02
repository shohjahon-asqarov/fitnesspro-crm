export type UserRole = 'admin' | 'manager' | 'trainer' | 'receptionist' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  department?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'Basic' | 'Pro' | 'Premium';
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
  avatar: string;
  totalVisits: number;
  lastVisit: string;
  trainerId?: string;
  monthlyFee: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  rating: number;
  avatar: string;
  assignedMembers: number;
  schedule: string[];
  commission: number;
  status: 'active' | 'inactive';
}

export interface GymClass {
  id: string;
  name: string;
  type: 'Yoga' | 'Fitness' | 'CrossFit' | 'Boxing' | 'Pilates' | 'Zumba';
  trainerId: string;
  trainerName: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolled: number;
  price: number;
  status: 'active' | 'cancelled';
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'working' | 'maintenance' | 'broken';
  lastMaintenance: string;
  nextMaintenance: string;
  usageHours: number;
  purchaseDate: string;
  warranty: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'membership' | 'personal_training' | 'classes' | 'supplements';
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  method: 'cash' | 'card' | 'transfer';
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTrainers: number;
  activeClasses: number;
  equipmentWorking: number;
  equipmentMaintenance: number;
}