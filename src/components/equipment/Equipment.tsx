import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Dropdown,
  message,
  Progress,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  FilterOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  WarningOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Equipment as EquipmentType } from '../../types';
import { useEquipment } from '../../hooks/useEquipment';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Equipment() {
  const { equipment, loading, createEquipment, updateStatus, deleteEquipment } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'working' | 'maintenance' | 'broken'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEquipment = async (equipmentData: Omit<EquipmentType, 'id'>) => {
    try {
      await createEquipment(equipmentData);
      message.success('Jihoz muvaffaqiyatli qo\'shildi');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Jihoz qo\'shishda xatolik yuz berdi');
    }
  };

  const handleStatusChange = async (id: string, status: EquipmentType['status']) => {
    try {
      await updateStatus(id, status);
      message.success('Jihoz holati yangilandi');
    } catch (error) {
      message.error('Holatni yangilashda xatolik');
    }
  };

  const handleDeleteEquipment = (equipment: EquipmentType) => {
    Modal.confirm({
      title: 'Jihozni o\'chirish',
      content: `${equipment.name}ni o\'chirishga ishonchingiz komilmi?`,
      okText: 'O\'chirish',
      cancelText: 'Bekor qilish',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteEquipment(equipment.id);
          message.success('Jihoz o\'chirildi');
        } catch (error) {
          message.error('Jihozni o\'chirishda xatolik');
        }
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircleOutlined className="text-green-500" />;
      case 'maintenance': return <ToolOutlined className="text-yellow-500" />;
      case 'broken': return <CloseCircleOutlined className="text-red-500" />;
      default: return <SettingOutlined className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'success';
      case 'maintenance': return 'warning';
      case 'broken': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working': return 'Ishlamoqda';
      case 'maintenance': return 'Ta\'mirda';
      case 'broken': return 'Buzilgan';
      default: return 'Noma\'lum';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Cardio': 'blue',
      'Strength': 'purple',
      'Functional': 'green',
      'Free Weights': 'orange'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeText = (type: string) => {
    const types = {
      'Cardio': 'Kardio',
      'Strength': 'Kuch',
      'Functional': 'Funksional',
      'Free Weights': 'Erkin Og\'irliklar'
    };
    return types[type as keyof typeof types] || type;
  };

  const getMaintenanceStatus = (nextMaintenance: string) => {
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const daysLeft = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { color: 'red', text: 'Muddati o\'tgan', urgent: true };
    if (daysLeft <= 7) return { color: 'orange', text: `${daysLeft} kun qoldi`, urgent: true };
    if (daysLeft <= 30) return { color: 'yellow', text: `${daysLeft} kun qoldi`, urgent: false };
    return { color: 'green', text: `${daysLeft} kun qoldi`, urgent: false };
  };

  const handleSubmit = (values: any) => {
    const equipmentData = {
      ...values,
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      warranty: values.warranty.format('YYYY-MM-DD'),
      lastMaintenance: values.lastMaintenance.format('YYYY-MM-DD'),
      nextMaintenance: values.nextMaintenance.format('YYYY-MM-DD'),
    };
    handleCreateEquipment(equipmentData);
  };

  const getMenuItems = (item: EquipmentType) => [
    {
      key: 'view',
      label: 'Ko\'rish',
      icon: <EyeOutlined />,
      onClick: () => {
        setSelectedEquipment(item);
        setIsDetailModalVisible(true);
      },
    },
    {
      key: 'edit',
      label: 'Tahrirlash',
      icon: <EditOutlined />,
    },
    {
      key: 'maintenance',
      label: item.status === 'working' ? 'Ta\'mirga yuborish' : 'Ishga tushirish',
      icon: <ToolOutlined />,
      onClick: () => handleStatusChange(item.id, item.status === 'working' ? 'maintenance' : 'working'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'O\'chirish',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteEquipment(item),
    },
  ];

  const workingCount = equipment.filter(item => item.status === 'working').length;
  const maintenanceCount = equipment.filter(item => item.status === 'maintenance').length;
  const brokenCount = equipment.filter(item => item.status === 'broken').length;
  const urgentMaintenanceCount = equipment.filter(item => {
    const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance);
    return maintenanceStatus.urgent;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Title level={2} className="!mb-2">Jihozlar</Title>
            <Text type="secondary" className="text-base">
              Sport zali jihozlarini kuzatish va ta'mirlash
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => {
              setSelectedEquipment(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            className="h-12 px-6 text-base font-medium"
          >
            Jihoz Qo'shish
          </Button>
        </div>
      </motion.div>

      {/* Status Summary */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
              <Statistic
                title="Ishlamoqda"
                value={workingCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
              <Statistic
                title="Ta'mirda"
                value={maintenanceCount}
                prefix={<ToolOutlined />}
                valueStyle={{ color: '#faad14', fontSize: '28px' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <Statistic
                title="Buzilgan"
                value={brokenCount}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f', fontSize: '28px' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
              <Statistic
                title="Shoshilinch Ta'mir"
                value={urgentMaintenanceCount}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Urgent Maintenance Alert */}
      {urgentMaintenanceCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Alert
            message="Diqqat!"
            description={`${urgentMaintenanceCount} ta jihozning texnik ko'rikdan o'tish vaqti keldi yoki o'tib ketdi.`}
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary">
                Ko'rish
              </Button>
            }
            className="mb-6"
          />
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Jihozlarni qidirish..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Holat bo'yicha filter"
                value={filterStatus}
                onChange={setFilterStatus}
                size="large"
                className="w-full"
              >
                <Option value="all">Barcha Holatlar</Option>
                <Option value="working">Ishlamoqda</Option>
                <Option value="maintenance">Ta'mirda</Option>
                <Option value="broken">Buzilgan</Option>
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Button 
                icon={<FilterOutlined />} 
                size="large"
                className="w-full"
              >
                Filter
              </Button>
            </Col>
            <Col xs={24} md={6}>
              <div className="text-right">
                <Text type="secondary">Jami: {filteredEquipment.length} ta jihoz</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Equipment Grid */}
      <Row gutter={[24, 24]}>
        {filteredEquipment.map((item, index) => {
          const maintenanceStatus = getMaintenanceStatus(item.nextMaintenance);
          const usagePercentage = Math.min((item.usageHours / 10000) * 100, 100);
          
          return (
            <Col xs={24} lg={12} xl={8} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="h-full hover:shadow-lg transition-all duration-300"
                  actions={[
                    <Tooltip title="Ko'rish">
                      <EyeOutlined onClick={() => {
                        setSelectedEquipment(item);
                        setIsDetailModalVisible(true);
                      }} />
                    </Tooltip>,
                    <Tooltip title="Tahrirlash">
                      <EditOutlined />
                    </Tooltip>,
                    <Tooltip title="Holat o'zgartirish">
                      <SettingOutlined onClick={() => handleStatusChange(item.id, 
                        item.status === 'working' ? 'maintenance' : 'working')} />
                    </Tooltip>,
                    <Dropdown menu={{ items: getMenuItems(item) }} trigger={['click']}>
                      <MoreOutlined />
                    </Dropdown>
                  ]}
                >
                  {/* Equipment Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Title level={4} className="!mb-2">{item.name}</Title>
                      <Tag color={getTypeColor(item.type)} className="mb-2">
                        {getTypeText(item.type)}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <Tag color={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Tag>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <Row gutter={[12, 12]} className="mb-4">
                    <Col span={12}>
                      <Card size="small" className="text-center bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <ClockCircleOutlined className="text-blue-500" />
                        </div>
                        <Text strong className="text-sm block">Foydalanish</Text>
                        <Text className="text-xs text-gray-600">
                          {item.usageHours.toLocaleString()} soat
                        </Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" className="text-center bg-purple-50 border-purple-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CalendarOutlined className="text-purple-500" />
                        </div>
                        <Text strong className="text-sm block">Yoshi</Text>
                        <Text className="text-xs text-gray-600">
                          {Math.floor((new Date().getTime() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) || 1} yil
                        </Text>
                      </Card>
                    </Col>
                  </Row>

                  {/* Usage Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Text className="text-sm">Foydalanish darajasi</Text>
                      <Text className="text-xs text-gray-500">{usagePercentage.toFixed(1)}%</Text>
                    </div>
                    <Progress
                      percent={usagePercentage}
                      strokeColor={{
                        '0%': '#52c41a',
                        '50%': '#1890ff',
                        '80%': '#faad14',
                        '95%': '#ff4d4f'
                      }}
                      size="small"
                    />
                  </div>

                  {/* Maintenance Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <Text type="secondary">Oxirgi ta'mir:</Text>
                      <Text>{dayjs(item.lastMaintenance).format('DD.MM.YYYY')}</Text>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Text type="secondary">Keyingi ta'mir:</Text>
                      <Text style={{ color: maintenanceStatus.color }}>
                        {dayjs(item.nextMaintenance).format('DD.MM.YYYY')}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Text type="secondary">Kafolat:</Text>
                      <Text>{dayjs(item.warranty).format('DD.MM.YYYY')}</Text>
                    </div>
                  </div>

                  {/* Maintenance Status */}
                  <div className={`p-3 rounded-lg mb-4 ${
                    maintenanceStatus.urgent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {maintenanceStatus.urgent ? 
                          <ExclamationCircleOutlined style={{ color: maintenanceStatus.color }} /> :
                          <SafetyCertificateOutlined style={{ color: maintenanceStatus.color }} />
                        }
                        <Text className="text-sm font-medium">Ta'mir holati</Text>
                      </div>
                      <Text className="text-sm font-bold" style={{ color: maintenanceStatus.color }}>
                        {maintenanceStatus.text}
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* Add Equipment Modal */}
      <Modal
        title="Yangi Jihoz Qo'shish"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Jihoz Nomi"
                rules={[{ required: true, message: 'Nom kiritish majburiy!' }]}
              >
                <Input placeholder="Jihoz nomini kiriting" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Turi"
                rules={[{ required: true, message: 'Turni tanlang!' }]}
              >
                <Select placeholder="Jihoz turini tanlang">
                  <Option value="Cardio">Kardio</Option>
                  <Option value="Strength">Kuch</Option>
                  <Option value="Functional">Funksional</Option>
                  <Option value="Free Weights">Erkin Og'irliklar</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Holat"
                rules={[{ required: true, message: 'Holatni tanlang!' }]}
              >
                <Select placeholder="Holatni tanlang">
                  <Option value="working">Ishlamoqda</Option>
                  <Option value="maintenance">Ta'mirda</Option>
                  <Option value="broken">Buzilgan</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="usageHours"
                label="Foydalanish Soatlari"
                rules={[{ required: true, message: 'Soatni kiriting!' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="purchaseDate"
                label="Sotib Olingan Sana"
                rules={[{ required: true, message: 'Sanani tanlang!' }]}
              >
                <DatePicker className="w-full" format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="warranty"
                label="Kafolat Muddati"
                rules={[{ required: true, message: 'Kafolat sanasini tanlang!' }]}
              >
                <DatePicker className="w-full" format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="lastMaintenance"
                label="Oxirgi Ta'mir"
                rules={[{ required: true, message: 'Ta\'mir sanasini tanlang!' }]}
              >
                <DatePicker className="w-full" format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="nextMaintenance"
                label="Keyingi Ta'mir"
                rules={[{ required: true, message: 'Keyingi ta\'mir sanasini tanlang!' }]}
              >
                <DatePicker className="w-full" format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => setIsModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              Qo'shish
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Equipment Detail Modal */}
      <Modal
        title="Jihoz Ma'lumotlari"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Yopish
          </Button>,
          <Button 
            key="edit" 
            type="primary"
            onClick={() => {
              setIsDetailModalVisible(false);
              // Handle edit
            }}
          >
            Tahrirlash
          </Button>
        ]}
        width={700}
      >
        {selectedEquipment && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Title level={3} className="!mb-2">{selectedEquipment.name}</Title>
              <Space>
                <Tag color={getTypeColor(selectedEquipment.type)} className="text-base px-3 py-1">
                  {getTypeText(selectedEquipment.type)}
                </Tag>
                <Tag color={getStatusColor(selectedEquipment.status)} className="text-base px-3 py-1">
                  {getStatusText(selectedEquipment.status)}
                </Tag>
              </Space>
            </div>

            {/* Details */}
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text type="secondary">Foydalanish soatlari:</Text>
                <div className="font-medium">{selectedEquipment.usageHours.toLocaleString()} soat</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Sotib olingan sana:</Text>
                <div className="font-medium">{dayjs(selectedEquipment.purchaseDate).format('DD.MM.YYYY')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Kafolat muddati:</Text>
                <div className="font-medium">{dayjs(selectedEquipment.warranty).format('DD.MM.YYYY')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Oxirgi ta'mir:</Text>
                <div className="font-medium">{dayjs(selectedEquipment.lastMaintenance).format('DD.MM.YYYY')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Keyingi ta'mir:</Text>
                <div className="font-medium">{dayjs(selectedEquipment.nextMaintenance).format('DD.MM.YYYY')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Yoshi:</Text>
                <div className="font-medium">
                  {Math.floor((new Date().getTime() - new Date(selectedEquipment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) || 1} yil
                </div>
              </Col>
            </Row>

            {/* Usage Progress */}
            <div>
              <Text type="secondary" className="block mb-2">Foydalanish darajasi:</Text>
              <Progress
                percent={Math.min((selectedEquipment.usageHours / 10000) * 100, 100)}
                strokeColor={{
                  '0%': '#52c41a',
                  '50%': '#1890ff',
                  '80%': '#faad14',
                  '95%': '#ff4d4f'
                }}
                format={(percent) => `${selectedEquipment.usageHours.toLocaleString()} soat`}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}