import React from 'react';
import { Card, Row, Col, Typography, Space, Button } from 'antd';
import { 
  CrownOutlined, 
  ShieldCheckOutlined, 
  ThunderboltOutlined, 
  CustomerServiceOutlined, 
  UserOutlined,
  RocketOutlined,
  SafetyOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const roles: { 
  role: UserRole; 
  label: string; 
  icon: React.ReactNode; 
  description: string; 
  color: string;
  features: string[];
}[] = [
  {
    role: 'admin',
    label: 'Administrator',
    icon: <CrownOutlined />,
    description: 'Tizimga to\'liq kirish va moliyaviy hisobotlar',
    color: 'from-yellow-400 to-orange-500',
    features: ['Barcha bo\'limlar', 'Moliyaviy hisobotlar', 'Foydalanuvchi boshqaruvi']
  },
  {
    role: 'manager',
    label: 'Menejer',
    icon: <ShieldCheckOutlined />,
    description: 'A\'zolar, murabbiylar va operatsiyalarni boshqarish',
    color: 'from-blue-500 to-purple-600',
    features: ['A\'zolar boshqaruvi', 'Murabbiylar nazorati', 'Operatsiya boshqaruvi']
  },
  {
    role: 'trainer',
    label: 'Murabbiy',
    icon: <ThunderboltOutlined />,
    description: 'Shaxsiy jadval va tayinlangan a\'zolar',
    color: 'from-green-500 to-teal-600',
    features: ['Shaxsiy jadval', 'A\'zolar ro\'yxati', 'Mashg\'ulotlar']
  },
  {
    role: 'receptionist',
    label: 'Qabulxona',
    icon: <CustomerServiceOutlined />,
    description: 'A\'zolarni ro\'yxatga olish va to\'lovlar',
    color: 'from-pink-500 to-rose-600',
    features: ['A\'zo ro\'yxati', 'To\'lovlar', 'Davomat nazorati']
  },
  {
    role: 'member',
    label: 'A\'zo',
    icon: <UserOutlined />,
    description: 'Shaxsiy panel va mashg\'ulotlarni bron qilish',
    color: 'from-gray-500 to-gray-600',
    features: ['Shaxsiy panel', 'Mashg\'ulot broni', 'Davomat ko\'rish']
  }
];

export default function RoleSelector() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CrownOutlined className="text-white text-4xl" />
          </div>
          <Title level={1} className="!text-5xl !font-bold !text-gray-900 dark:!text-white !mb-4">
            FitnessPro
          </Title>
          <Title level={2} className="!text-2xl !text-blue-600 dark:!text-blue-400 !mb-4">
            Sport Zali Boshqaruv Tizimi
          </Title>
          <Text className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Zamonaviy sport zali boshqaruv platformasiga xush kelibsiz. 
            Tizimga kirish uchun o'z rolingizni tanlang.
          </Text>
        </motion.div>

        {/* Role Cards */}
        <Row gutter={[24, 24]} justify="center">
          {roles.map((roleItem, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={roleItem.role}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="h-full cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  onClick={() => login(roleItem.role)}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${roleItem.color} rounded-2xl flex items-center justify-center mb-6 text-white mx-auto shadow-lg`}>
                      <div className="text-3xl">
                        {roleItem.icon}
                      </div>
                    </div>
                    
                    <Title level={3} className="!text-xl !font-bold !text-gray-900 dark:!text-white !mb-3">
                      {roleItem.label}
                    </Title>
                    
                    <Text className="text-gray-600 dark:text-gray-400 text-base leading-relaxed block mb-4">
                      {roleItem.description}
                    </Text>

                    <div className="space-y-2 mb-6">
                      {roleItem.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      type="primary" 
                      size="large" 
                      className="w-full h-12 text-base font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${roleItem.color.includes('yellow') ? '#f59e0b' : 
                                                                roleItem.color.includes('blue') ? '#3b82f6' :
                                                                roleItem.color.includes('green') ? '#10b981' :
                                                                roleItem.color.includes('pink') ? '#ec4899' : '#6b7280'}, 
                                                                ${roleItem.color.includes('yellow') ? '#d97706' : 
                                                                roleItem.color.includes('blue') ? '#1d4ed8' :
                                                                roleItem.color.includes('green') ? '#047857' :
                                                                roleItem.color.includes('pink') ? '#be185d' : '#4b5563'})`,
                        border: 'none',
                        borderRadius: '12px'
                      }}
                    >
                      Tanlash
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <SafetyOutlined className="text-white text-2xl" />
                </div>
                <Title level={4} className="!text-gray-900 dark:!text-white !mb-3">
                  Xavfsiz Kirish
                </Title>
                <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Rolga asoslangan ruxsatlar tizimi orqali har bir foydalanuvchi faqat o'z vakolatlari doirasidagi ma'lumotlarni ko'radi
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <RocketOutlined className="text-white text-2xl" />
                </div>
                <Title level={4} className="!text-gray-900 dark:!text-white !mb-3">
                  Real Vaqt Tahlili
                </Title>
                <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  A'zolar statistikasi, daromad kuzatuvi va ishlash ko'rsatkichlari bilan jonli boshqaruv paneli
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card className="text-center h-full border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrophyOutlined className="text-white text-2xl" />
                </div>
                <Title level={4} className="!text-gray-900 dark:!text-white !mb-3">
                  Professional Dizayn
                </Title>
                <Text className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  O'zbekiston fitness mutaxassislari uchun mo'ljallangan zamonaviy, intuitiv va foydalanuvchi-do'st interfeys
                </Text>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <Text type="secondary" className="text-sm">
            © 2024 FitnessPro. Barcha huquqlar himoyalangan. | Versiya 1.0.0
          </Text>
        </motion.div>
      </div>
    </div>
  );
}