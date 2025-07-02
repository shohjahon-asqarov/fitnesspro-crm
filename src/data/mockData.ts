import { Member, Trainer, GymClass, Equipment, Payment, DashboardStats } from '../types';

// Initialize with some sample data for demo purposes
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Sardor Abdullayev',
    email: 'sardor@email.com',
    phone: '+998901234567',
    membershipType: 'Premium',
    joinDate: '2024-01-15',
    expiryDate: '2024-12-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    totalVisits: 45,
    lastVisit: '2024-01-20',
    trainerId: '1',
    monthlyFee: 500000
  },
  {
    id: '2',
    name: 'Nigina Karimova',
    email: 'nigina@email.com',
    phone: '+998901234568',
    membershipType: 'Pro',
    joinDate: '2024-02-01',
    expiryDate: '2024-01-25',
    status: 'expired',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    totalVisits: 28,
    lastVisit: '2024-01-18',
    trainerId: '2',
    monthlyFee: 300000
  },
  {
    id: '3',
    name: 'Jasur Toshmatov',
    email: 'jasur@email.com',
    phone: '+998901234569',
    membershipType: 'Basic',
    joinDate: '2024-01-10',
    expiryDate: '2024-07-10',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    totalVisits: 52,
    lastVisit: '2024-01-21',
    monthlyFee: 200000
  },
  {
    id: '4',
    name: 'Malika Nazarova',
    email: 'malika@email.com',
    phone: '+998901234570',
    membershipType: 'Premium',
    joinDate: '2023-12-01',
    expiryDate: '2024-02-01',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    totalVisits: 67,
    lastVisit: '2024-01-21',
    trainerId: '1',
    monthlyFee: 500000
  }
];

export const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'Aziza Nazarova',
    email: 'aziza@fitnesspro.uz',
    phone: '+998909876543',
    specialization: ['Fitness', 'CrossFit', 'Personal Training'],
    experience: 5,
    rating: 4.8,
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    assignedMembers: 15,
    schedule: ['Mon 9-12', 'Wed 9-12', 'Fri 9-12', 'Sat 10-14'],
    commission: 25,
    status: 'active'
  },
  {
    id: '2',
    name: 'Bobur Alimov',
    email: 'bobur@fitnesspro.uz',
    phone: '+998909876544',
    specialization: ['Yoga', 'Pilates', 'Meditation'],
    experience: 3,
    rating: 4.6,
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    assignedMembers: 12,
    schedule: ['Tue 8-11', 'Thu 8-11', 'Sat 8-12'],
    commission: 20,
    status: 'active'
  },
  {
    id: '3',
    name: 'Dilshod Umarov',
    email: 'dilshod@fitnesspro.uz',
    phone: '+998909876545',
    specialization: ['Boxing', 'MMA', 'Strength Training'],
    experience: 7,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    assignedMembers: 18,
    schedule: ['Mon 14-18', 'Wed 14-18', 'Fri 14-18'],
    commission: 30,
    status: 'active'
  }
];

export const mockClasses: GymClass[] = [
  {
    id: '1',
    name: 'Morning Yoga Flow',
    type: 'Yoga',
    trainerId: '2',
    trainerName: 'Bobur Alimov',
    schedule: 'Mon, Wed, Fri - 8:00 AM',
    duration: 60,
    capacity: 20,
    enrolled: 15,
    price: 50000,
    status: 'active'
  },
  {
    id: '2',
    name: 'HIIT Fitness',
    type: 'Fitness',
    trainerId: '1',
    trainerName: 'Aziza Nazarova',
    schedule: 'Tue, Thu - 6:00 PM',
    duration: 45,
    capacity: 15,
    enrolled: 12,
    price: 75000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Boxing Fundamentals',
    type: 'Boxing',
    trainerId: '3',
    trainerName: 'Dilshod Umarov',
    schedule: 'Mon, Wed, Fri - 7:00 PM',
    duration: 90,
    capacity: 12,
    enrolled: 10,
    price: 100000,
    status: 'active'
  },
  {
    id: '4',
    name: 'CrossFit Challenge',
    type: 'CrossFit',
    trainerId: '1',
    trainerName: 'Aziza Nazarova',
    schedule: 'Sat - 10:00 AM',
    duration: 75,
    capacity: 10,
    enrolled: 8,
    price: 150000,
    status: 'active'
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Treadmill Pro X1',
    type: 'Cardio',
    status: 'working',
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-04-01',
    usageHours: 2450,
    purchaseDate: '2023-06-15',
    warranty: '2025-06-15'
  },
  {
    id: '2',
    name: 'Power Rack Station',
    type: 'Strength',
    status: 'working',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    usageHours: 1850,
    purchaseDate: '2023-08-20',
    warranty: '2025-08-20'
  },
  {
    id: '3',
    name: 'Elliptical Elite',
    type: 'Cardio',
    status: 'maintenance',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-01-25',
    usageHours: 3200,
    purchaseDate: '2023-04-10',
    warranty: '2025-04-10'
  },
  {
    id: '4',
    name: 'Cable Machine Deluxe',
    type: 'Strength',
    status: 'broken',
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-02-01',
    usageHours: 2800,
    purchaseDate: '2023-05-25',
    warranty: '2025-05-25'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Sardor Abdullayev',
    amount: 500000,
    type: 'membership',
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-15',
    method: 'card'
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Nigina Karimova',
    amount: 300000,
    type: 'membership',
    status: 'overdue',
    date: '2024-01-01',
    dueDate: '2024-01-25',
    method: 'cash'
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Jasur Toshmatov',
    amount: 100000,
    type: 'personal_training',
    status: 'paid',
    date: '2024-01-20',
    dueDate: '2024-01-20',
    method: 'transfer'
  },
  {
    id: '4',
    memberId: '4',
    memberName: 'Malika Nazarova',
    amount: 75000,
    type: 'classes',
    status: 'pending',
    date: '2024-01-18',
    dueDate: '2024-01-28',
    method: 'card'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalMembers: 247,
  activeMembers: 189,
  expiringThisMonth: 23,
  totalRevenue: 45750000,
  monthlyRevenue: 8950000,
  totalTrainers: 12,
  activeClasses: 15,
  equipmentWorking: 28,
  equipmentMaintenance: 3
};

export const monthlyRevenueData = [
  { month: 'Jul', revenue: 7200000 },
  { month: 'Aug', revenue: 8100000 },
  { month: 'Sep', revenue: 7800000 },
  { month: 'Oct', revenue: 9200000 },
  { month: 'Nov', revenue: 8600000 },
  { month: 'Dec', revenue: 9100000 },
  { month: 'Jan', revenue: 8950000 }
];

export const membershipDistribution = [
  { name: 'Basic', value: 45, color: '#3b82f6' },
  { name: 'Pro', value: 35, color: '#10b981' },
  { name: 'Premium', value: 20, color: '#f59e0b' }
];

// Initialize localStorage with sample data if empty
export const initializeSampleData = () => {
  const storageKeys = {
    MEMBERS: 'gym_members',
    TRAINERS: 'gym_trainers', 
    CLASSES: 'gym_classes',
    EQUIPMENT: 'gym_equipment',
    PAYMENTS: 'gym_payments'
  };

  // Only add sample data if localStorage is empty
  if (!localStorage.getItem(storageKeys.MEMBERS) || JSON.parse(localStorage.getItem(storageKeys.MEMBERS) || '[]').length === 0) {
    localStorage.setItem(storageKeys.MEMBERS, JSON.stringify(mockMembers));
  }
  
  if (!localStorage.getItem(storageKeys.TRAINERS) || JSON.parse(localStorage.getItem(storageKeys.TRAINERS) || '[]').length === 0) {
    localStorage.setItem(storageKeys.TRAINERS, JSON.stringify(mockTrainers));
  }
  
  if (!localStorage.getItem(storageKeys.CLASSES) || JSON.parse(localStorage.getItem(storageKeys.CLASSES) || '[]').length === 0) {
    localStorage.setItem(storageKeys.CLASSES, JSON.stringify(mockClasses));
  }
  
  if (!localStorage.getItem(storageKeys.EQUIPMENT) || JSON.parse(localStorage.getItem(storageKeys.EQUIPMENT) || '[]').length === 0) {
    localStorage.setItem(storageKeys.EQUIPMENT, JSON.stringify(mockEquipment));
  }
  
  if (!localStorage.getItem(storageKeys.PAYMENTS) || JSON.parse(localStorage.getItem(storageKeys.PAYMENTS) || '[]').length === 0) {
    localStorage.setItem(storageKeys.PAYMENTS, JSON.stringify(mockPayments));
  }
};