import { Member, Trainer, GymClass, Equipment, Payment, DashboardStats } from '../types';

// Generate more realistic member data
const generateMembers = (): Member[] => {
  const firstNames = [
    'Sardor', 'Nigina', 'Jasur', 'Malika', 'Bobur', 'Aziza', 'Dilshod', 'Feruza',
    'Akmal', 'Gulnora', 'Rustam', 'Sevara', 'Otabek', 'Madina', 'Sherzod', 'Nargiza',
    'Farrux', 'Kamola', 'Bekzod', 'Dilfuza', 'Sanjar', 'Zarina', 'Umid', 'Yulduz',
    'Javohir', 'Nilufar', 'Temur', 'Shahnoza', 'Alisher', 'Munisa', 'Davron', 'Sitora',
    'Nodir', 'Gulshan', 'Islom', 'Nasiba', 'Karim', 'Fotima', 'Baxtiyor', 'Dildora',
    'Muzaffar', 'Zebo', 'Anvar', 'Mohira', 'Eldor', 'Komila', 'Farhod', 'Laylo',
    'Jamshid', 'Oygul', 'Mirzo', 'Saida', 'Ulugbek', 'Nozima', 'Shohrux', 'Gulnoza',
    'Abdulla', 'Manzura', 'Jahongir', 'Robiya', 'Shavkat', 'Diyora', 'Mansur', 'Zebiniso'
  ];
  
  const lastNames = [
    'Abdullayev', 'Karimova', 'Toshmatov', 'Nazarova', 'Alimov', 'Usmanova', 'Rahimov',
    'Yusupova', 'Mahmudov', 'Hasanova', 'Ismoilov', 'Qodirova', 'Salimov', 'Ergasheva',
    'Nematov', 'Mirzayeva', 'Sharipov', 'Tursunova', 'Kamilov', 'Azimova', 'Fayzullayev',
    'Normatova', 'Haydarov', 'Sultanova', 'Rustamov', 'Xolmatova', 'Otajonov', 'Ibragimova',
    'Jurayev', 'Mamatova', 'Sobirova', 'Qosimov', 'Raxmatova', 'Bobojonov', 'Xudoyorova'
  ];

  const membershipTypes: ('Basic' | 'Pro' | 'Premium')[] = ['Basic', 'Pro', 'Premium'];
  const statuses: ('active' | 'inactive' | 'expired')[] = ['active', 'inactive', 'expired'];
  const avatars = [
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
  ];

  const members: Member[] = [];
  
  for (let i = 1; i <= 150; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const membershipType = membershipTypes[Math.floor(Math.random() * membershipTypes.length)];
    const status = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * 3)] : 'active';
    
    const joinDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const expiryDate = new Date(joinDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    // Some members have expired memberships
    if (status === 'expired') {
      expiryDate.setMonth(expiryDate.getMonth() - Math.floor(Math.random() * 6));
    }
    
    const monthlyFee = membershipType === 'Premium' ? 500000 : 
                     membershipType === 'Pro' ? 300000 : 200000;

    members.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+998${90 + Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9000000).toString().padStart(7, '0')}`,
      membershipType,
      joinDate: joinDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      status,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      totalVisits: Math.floor(Math.random() * 100) + 1,
      lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trainerId: Math.random() > 0.7 ? (Math.floor(Math.random() * 3) + 1).toString() : undefined,
      monthlyFee
    });
  }
  
  return members;
};

export const mockMembers: Member[] = generateMembers();

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
    assignedMembers: 25,
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
    assignedMembers: 18,
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
    assignedMembers: 22,
    schedule: ['Mon 14-18', 'Wed 14-18', 'Fri 14-18'],
    commission: 30,
    status: 'active'
  },
  {
    id: '4',
    name: 'Feruza Qodirova',
    email: 'feruza@fitnesspro.uz',
    phone: '+998909876546',
    specialization: ['Zumba', 'Dance Fitness', 'Aerobics'],
    experience: 4,
    rating: 4.7,
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    assignedMembers: 20,
    schedule: ['Mon 18-20', 'Wed 18-20', 'Fri 18-20'],
    commission: 22,
    status: 'active'
  },
  {
    id: '5',
    name: 'Rustam Salimov',
    email: 'rustam@fitnesspro.uz',
    phone: '+998909876547',
    specialization: ['Powerlifting', 'Bodybuilding', 'Nutrition'],
    experience: 8,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    assignedMembers: 15,
    schedule: ['Tue 16-20', 'Thu 16-20', 'Sat 14-18'],
    commission: 35,
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
  },
  {
    id: '5',
    name: 'Zumba Party',
    type: 'Zumba',
    trainerId: '4',
    trainerName: 'Feruza Qodirova',
    schedule: 'Mon, Wed, Fri - 6:00 PM',
    duration: 60,
    capacity: 25,
    enrolled: 22,
    price: 60000,
    status: 'active'
  },
  {
    id: '6',
    name: 'Power Pilates',
    type: 'Pilates',
    trainerId: '2',
    trainerName: 'Bobur Alimov',
    schedule: 'Tue, Thu - 9:00 AM',
    duration: 50,
    capacity: 15,
    enrolled: 11,
    price: 70000,
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
  },
  {
    id: '5',
    name: 'Rowing Machine Pro',
    type: 'Cardio',
    status: 'working',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-04-10',
    usageHours: 1200,
    purchaseDate: '2023-09-01',
    warranty: '2025-09-01'
  },
  {
    id: '6',
    name: 'Leg Press Machine',
    type: 'Strength',
    status: 'working',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-04-05',
    usageHours: 1800,
    purchaseDate: '2023-07-12',
    warranty: '2025-07-12'
  }
];

// Generate more payment data
const generatePayments = (): Payment[] => {
  const payments: Payment[] = [];
  const memberIds = mockMembers.slice(0, 50).map(m => m.id); // Use first 50 members
  const types: Payment['type'][] = ['membership', 'personal_training', 'classes', 'supplements'];
  const statuses: Payment['status'][] = ['paid', 'pending', 'overdue'];
  const methods: Payment['method'][] = ['cash', 'card', 'transfer'];

  for (let i = 1; i <= 200; i++) {
    const memberId = memberIds[Math.floor(Math.random() * memberIds.length)];
    const member = mockMembers.find(m => m.id === memberId);
    const type = types[Math.floor(Math.random() * types.length)];
    const status = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * 3)] : 'paid';
    const method = methods[Math.floor(Math.random() * methods.length)];
    
    const amount = type === 'membership' ? (member?.monthlyFee || 200000) :
                  type === 'personal_training' ? 150000 :
                  type === 'classes' ? 75000 : 50000;

    const date = new Date(2024, Math.floor(Math.random() * 2), Math.floor(Math.random() * 28) + 1);
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 30) + 1));

    payments.push({
      id: i.toString(),
      memberId,
      memberName: member?.name || 'Unknown Member',
      amount,
      type,
      status,
      date: date.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      method
    });
  }

  return payments;
};

export const mockPayments: Payment[] = generatePayments();

export const mockDashboardStats: DashboardStats = {
  totalMembers: mockMembers.length,
  activeMembers: mockMembers.filter(m => m.status === 'active').length,
  expiringThisMonth: mockMembers.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return expiryDate <= nextMonth && m.status === 'active';
  }).length,
  totalRevenue: mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
  monthlyRevenue: mockPayments.filter(p => {
    const paymentDate = new Date(p.date);
    const currentMonth = new Date().getMonth();
    return paymentDate.getMonth() === currentMonth && p.status === 'paid';
  }).reduce((sum, p) => sum + p.amount, 0),
  totalTrainers: mockTrainers.length,
  activeClasses: mockClasses.length,
  equipmentWorking: mockEquipment.filter(e => e.status === 'working').length,
  equipmentMaintenance: mockEquipment.filter(e => e.status === 'maintenance').length
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
  { name: 'Basic', value: mockMembers.filter(m => m.membershipType === 'Basic').length, color: '#3b82f6' },
  { name: 'Pro', value: mockMembers.filter(m => m.membershipType === 'Pro').length, color: '#10b981' },
  { name: 'Premium', value: mockMembers.filter(m => m.membershipType === 'Premium').length, color: '#f59e0b' }
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