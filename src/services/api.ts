// Mock API service layer - keyinchalik real backend bilan almashtiriladi
import { Member, Trainer, GymClass, Equipment, Payment, Attendance, Notification } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const STORAGE_KEYS = {
  MEMBERS: 'gym_members',
  TRAINERS: 'gym_trainers',
  CLASSES: 'gym_classes',
  EQUIPMENT: 'gym_equipment',
  PAYMENTS: 'gym_payments',
  ATTENDANCE: 'gym_attendance',
  NOTIFICATIONS: 'gym_notifications'
};

// Initialize data in localStorage if not exists
const initializeData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
};

// Generic CRUD operations
class ApiService<T extends { id: string }> {
  constructor(private storageKey: string) {
    initializeData();
  }

  private getData(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveData(data: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async getAll(): Promise<T[]> {
    await delay(300);
    return this.getData();
  }

  async getById(id: string): Promise<T | null> {
    await delay(200);
    const data = this.getData();
    return data.find(item => item.id === id) || null;
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    await delay(500);
    const data = this.getData();
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    } as T;
    data.push(newItem);
    this.saveData(data);
    return newItem;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    await delay(400);
    const data = this.getData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    this.saveData(data);
    return data[index];
  }

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const data = this.getData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    data.splice(index, 1);
    this.saveData(data);
    return true;
  }
}

// Service instances
export const membersApi = new ApiService<Member>(STORAGE_KEYS.MEMBERS);
export const trainersApi = new ApiService<Trainer>(STORAGE_KEYS.TRAINERS);
export const classesApi = new ApiService<GymClass>(STORAGE_KEYS.CLASSES);
export const equipmentApi = new ApiService<Equipment>(STORAGE_KEYS.EQUIPMENT);
export const paymentsApi = new ApiService<Payment>(STORAGE_KEYS.PAYMENTS);
export const attendanceApi = new ApiService<Attendance>(STORAGE_KEYS.ATTENDANCE);
export const notificationsApi = new ApiService<Notification>(STORAGE_KEYS.NOTIFICATIONS);

// Add specialized methods to the service instances

// Members API extensions
membersApi.getActiveMembers = async function(): Promise<Member[]> {
  const members = await this.getAll();
  return members.filter(member => member.status === 'active');
};

membersApi.getExpiringMembers = async function(days: number = 30): Promise<Member[]> {
  const members = await this.getAll();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return members.filter(member => {
    const expiryDate = new Date(member.expiryDate);
    return expiryDate <= futureDate && member.status === 'active';
  });
};

membersApi.updateMembershipStatus = async function(id: string, status: Member['status']): Promise<Member | null> {
  return await this.update(id, { status });
};

// Payments API extensions
paymentsApi.getOverduePayments = async function(): Promise<Payment[]> {
  const payments = await this.getAll();
  const today = new Date();
  
  return payments.filter(payment => {
    const dueDate = new Date(payment.dueDate);
    return dueDate < today && payment.status !== 'paid';
  });
};

paymentsApi.markAsPaid = async function(id: string): Promise<Payment | null> {
  return await this.update(id, { 
    status: 'paid',
    date: new Date().toISOString().split('T')[0]
  });
};

paymentsApi.getTotalRevenue = async function(startDate?: string, endDate?: string): Promise<number> {
  const payments = await this.getAll();
  const paidPayments = payments.filter(payment => payment.status === 'paid');
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return paidPayments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= start && paymentDate <= end;
      })
      .reduce((total, payment) => total + payment.amount, 0);
  }
  
  return paidPayments.reduce((total, payment) => total + payment.amount, 0);
};

// Equipment API extensions
equipmentApi.updateStatus = async function(id: string, status: Equipment['status']): Promise<Equipment | null> {
  const updates: Partial<Equipment> = { status };
  
  if (status === 'working') {
    updates.lastMaintenance = new Date().toISOString().split('T')[0];
    const nextMaintenance = new Date();
    nextMaintenance.setMonth(nextMaintenance.getMonth() + 3);
    updates.nextMaintenance = nextMaintenance.toISOString().split('T')[0];
  }
  
  return await this.update(id, updates);
};

equipmentApi.getMaintenanceDue = async function(): Promise<Equipment[]> {
  const equipment = await this.getAll();
  const today = new Date();
  
  return equipment.filter(item => {
    const nextMaintenance = new Date(item.nextMaintenance);
    return nextMaintenance <= today && item.status === 'working';
  });
};

// Classes API extensions
classesApi.enrollMember = async function(classId: string): Promise<GymClass | null> {
  const gymClass = await this.getById(classId);
  if (!gymClass || gymClass.enrolled >= gymClass.capacity) return null;
  
  return await this.update(classId, { 
    enrolled: gymClass.enrolled + 1 
  });
};

classesApi.unenrollMember = async function(classId: string): Promise<GymClass | null> {
  const gymClass = await this.getById(classId);
  if (!gymClass || gymClass.enrolled <= 0) return null;
  
  return await this.update(classId, { 
    enrolled: gymClass.enrolled - 1 
  });
};

// Attendance API extensions
attendanceApi.markAttendance = async function(memberId: string, status: 'present' | 'absent', date: string): Promise<Attendance> {
  const attendance = await this.getAll();
  const existingRecord = attendance.find(record => record.memberId === memberId && record.date === date);
  
  if (existingRecord) {
    const updates: Partial<Attendance> = { 
      status,
      checkInTime: status === 'present' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : undefined
    };
    return await this.update(existingRecord.id, updates) as Attendance;
  } else {
    const newRecord: Omit<Attendance, 'id'> = {
      memberId,
      date,
      status,
      method: 'manual',
      checkInTime: status === 'present' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : undefined
    };
    return await this.create(newRecord);
  }
};

attendanceApi.getByDate = async function(date: string): Promise<Attendance[]> {
  const attendance = await this.getAll();
  return attendance.filter(record => record.date === date);
};

attendanceApi.getByMember = async function(memberId: string): Promise<Attendance[]> {
  const attendance = await this.getAll();
  return attendance.filter(record => record.memberId === memberId);
};

// Notifications API extensions
notificationsApi.send = async function(id: string): Promise<Notification | null> {
  await delay(1000); // Simulate sending delay
  return await this.update(id, { 
    status: 'sent',
    scheduledAt: new Date().toISOString()
  });
};

notificationsApi.markAsRead = async function(id: string): Promise<Notification | null> {
  return await this.update(id, { status: 'sent' });
};

notificationsApi.createAutoReminder = async function(type: 'membership' | 'payment', memberIds: string[]): Promise<Notification> {
  const reminderData: Omit<Notification, 'id'> = {
    title: type === 'membership' ? 'A\'zolik Muddati Tugayapti' : 'To\'lov Eslatmasi',
    message: type === 'membership' 
      ? 'Sizning a\'zolik muddatingiz tez orada tugaydi. Yangilash uchun sport zaliga murojaat qiling.'
      : 'To\'lov muddati yetib keldi. Iltimos, to\'lovni amalga oshiring.',
    type,
    recipients: memberIds,
    status: 'pending',
    createdAt: new Date().toISOString(),
    channel: 'email'
  };
  
  return await this.create(reminderData);
};

// Export the service instances with their specialized methods
export const memberService = membersApi;
export const paymentService = paymentsApi;
export const equipmentService = equipmentApi;
export const classService = classesApi;
export const attendanceService = attendanceApi;
export const notificationService = notificationsApi;