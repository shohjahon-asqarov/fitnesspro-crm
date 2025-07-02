import React from 'react';
import { Crown, Shield, Zap, Headphones, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  {
    role: 'admin',
    label: 'Administrator',
    icon: <Crown size={24} />,
    description: 'Tizimga to\'liq kirish va moliyaviy hisobotlar',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    role: 'manager',
    label: 'Menejer',
    icon: <Shield size={24} />,
    description: 'A\'zolar, murabbiylar va operatsiyalarni boshqarish',
    color: 'from-blue-500 to-purple-600'
  },
  {
    role: 'trainer',
    label: 'Murabbiy',
    icon: <Zap size={24} />,
    description: 'Shaxsiy jadval va tayinlangan a\'zolar',
    color: 'from-green-500 to-teal-600'
  },
  {
    role: 'receptionist',
    label: 'Qabulxona',
    icon: <Headphones size={24} />,
    description: 'A\'zolarni ro\'yxatga olish va to\'lovlar',
    color: 'from-pink-500 to-rose-600'
  },
  {
    role: 'member',
    label: 'A\'zo',
    icon: <User size={24} />,
    description: 'Shaxsiy panel va mashg\'ulotlarni bron qilish',
    color: 'from-gray-500 to-gray-600'
  }
];

export default function RoleSelector() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Crown className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            FitnessPro Boshqaruv Paneli
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Zamonaviy Sport Zali Boshqaruv Tizimi
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Boshqaruv panelini ko'rish uchun rolni tanlang
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {roles.map((roleItem) => (
            <button
              key={roleItem.role}
              onClick={() => login(roleItem.role)}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${roleItem.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                {roleItem.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {roleItem.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {roleItem.description}
              </p>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Rolga Asoslangan Kirish
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Xavfsiz, rolga asoslangan ruxsatlar foydalanuvchilar faqat kerakli ma'lumotlarni ko'rishini ta'minlaydi
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="text-secondary-600 dark:text-secondary-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real Vaqt Tahlillari
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              A'zolar ko'rsatkichlari, daromad kuzatuvi va ishlash tahlillari bilan jonli boshqaruv paneli
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="text-accent-600 dark:text-accent-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Professional Dizayn
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Markaziy Osiyo fitness mutaxassislari uchun mo'ljallangan zamonaviy, intuitiv interfeys
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}