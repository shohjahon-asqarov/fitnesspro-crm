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
  Progress,
  Badge,
  Tooltip,
  Modal,
  Form,
  Select,
  InputNumber,
  TimePicker,
  Dropdown,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { mockClasses } from '../../data/mockData';
import { GymClass } from '../../types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Classes() {
  const [classes] = useState<GymClass[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredClasses = classes.filter(gymClass => {
    const matchesSearch = gymClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gymClass.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || gymClass.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      'Yoga': 'purple',
      'Fitness': 'blue',
      'CrossFit': 'red',
      'Boxing': 'orange',
      'Pilates': 'pink',
      'Zumba': 'green'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getCapacityStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return { color: 'red', text: 'To\'liq' };
    if (percentage >= 75) return { color: 'orange', text: 'Deyarli to\'liq' };
    if (percentage >= 50) return { color: 'blue', text: 'Yaxshi' };
    return { color: 'green', text: 'Bo\'sh joylar bor' };
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClass = (gymClass: GymClass) => {
    setSelectedClass(gymClass);
    form.setFieldsValue({
      ...gymClass,
      time: dayjs(gymClass.schedule.split(' - ')[1], 'HH:mm A')
    });
    setIsModalVisible(true);
  };

  const handleViewClass = (gymClass: GymClass) => {
    setSelectedClass(gymClass);
    setIsDetailModalVisible(true);
  };

  const handleDeleteClass = (gymClass: GymClass) => {
    Modal.confirm({
      title: 'Mashg\'ulotni o\'chirish',
      content: `${gymClass.name}ni o\'chirishga ishonchingiz komilmi?`,
      okText: 'O\'chirish',
      cancelText: 'Bekor qilish',
      okType: 'danger',
      onOk() {
        message.success('Mashg\'ulot muvaffaqiyatli o\'chirildi');
      },
    });
  };

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    message.success(selectedClass ? 'Mashg\'ulot ma\'lumotlari yangilandi' : 'Yangi mashg\'ulot qo\'shildi');
    setIsModalVisible(false);
    form.resetFields();
  };

  const getMenuItems = (gymClass: GymClass) => [
    {
      key: 'view',
      label: 'Ko\'rish',
      icon: <EyeOutlined />,
      onClick: () => handleViewClass(gymClass),
    },
    {
      key: 'edit',
      label: 'Tahrirlash',
      icon: <EditOutlined />,
      onClick: () => handleEditClass(gymClass),
    },
    {
      key: 'pause',
      label: gymClass.status === 'active' ? 'To\'xtatish' : 'Faollashtirish',
      icon: gymClass.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'O\'chirish',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteClass(gymClass),
    },
  ];

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
            <Title level={2} className="!mb-2">Mashg'ulotlar</Title>
            <Text type="secondary" className="text-base">
              Fitness mashg'ulotlari va jadvallarni boshqarish
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAddClass}
            className="h-12 px-6 text-base font-medium"
          >
            Mashg'ulot Qo'shish
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                placeholder="Mashg'ulotlar yoki murabbiylarni qidirish..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Select
                placeholder="Turi bo'yicha filter"
                value={filterType}
                onChange={setFilterType}
                size="large"
                className="w-full"
              >
                <Option value="all">Barcha Turlar</Option>
                <Option value="Yoga">Yoga</Option>
                <Option value="Fitness">Fitness</Option>
                <Option value="CrossFit">CrossFit</Option>
                <Option value="Boxing">Boks</Option>
                <Option value="Pilates">Pilates</Option>
                <Option value="Zumba">Zumba</Option>
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
                <Text type="secondary">Jami: {filteredClasses.length} ta mashg'ulot</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Classes Grid */}
      <Row gutter={[24, 24]}>
        {filteredClasses.map((gymClass, index) => {
          const capacityStatus = getCapacityStatus(gymClass.enrolled, gymClass.capacity);
          
          return (
            <Col xs={24} lg={12} xl={8} key={gymClass.id}>
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
                      <EyeOutlined onClick={() => handleViewClass(gymClass)} />
                    </Tooltip>,
                    <Tooltip title="Tahrirlash">
                      <EditOutlined onClick={() => handleEditClass(gymClass)} />
                    </Tooltip>,
                    <Tooltip title="Bron qilish">
                      <CalendarOutlined />
                    </Tooltip>,
                    <Dropdown menu={{ items: getMenuItems(gymClass) }} trigger={['click']}>
                      <MoreOutlined />
                    </Dropdown>
                  ]}
                >
                  {/* Class Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Title level={4} className="!mb-2">{gymClass.name}</Title>
                      <Tag color={getTypeColor(gymClass.type)} className="mb-2">
                        {gymClass.type}
                      </Tag>
                      <div className="flex items-center gap-2">
                        <Badge 
                          status={gymClass.status === 'active' ? 'success' : 'error'} 
                        />
                        <Text type="secondary" className="text-sm">
                          {gymClass.status === 'active' ? 'Faol' : 'Bekor qilingan'}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {gymClass.price.toLocaleString()} UZS
                      </div>
                      <Text type="secondary" className="text-xs">har bir dars</Text>
                    </div>
                  </div>

                  {/* Trainer Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                    <UserOutlined className="text-blue-500" />
                    <div>
                      <Text strong className="text-sm">Murabbiy</Text>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {gymClass.trainerName}
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Duration */}
                  <Row gutter={[12, 12]} className="mb-4">
                    <Col span={12}>
                      <Card size="small" className="text-center bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CalendarOutlined className="text-blue-500" />
                        </div>
                        <Text strong className="text-sm block">Jadval</Text>
                        <Text className="text-xs text-gray-600">
                          {gymClass.schedule}
                        </Text>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" className="text-center bg-purple-50 border-purple-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <ClockCircleOutlined className="text-purple-500" />
                        </div>
                        <Text strong className="text-sm block">Davomiyligi</Text>
                        <Text className="text-xs text-gray-600">
                          {gymClass.duration} daqiqa
                        </Text>
                      </Card>
                    </Col>
                  </Row>

                  {/* Capacity */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TeamOutlined className="text-orange-500" />
                        <Text strong className="text-sm">Ro'yxat</Text>
                      </div>
                      <Text className="text-sm font-bold" style={{ color: capacityStatus.color }}>
                        {gymClass.enrolled}/{gymClass.capacity}
                      </Text>
                    </div>
                    <Progress
                      percent={Math.round((gymClass.enrolled / gymClass.capacity) * 100)}
                      strokeColor={{
                        '0%': '#52c41a',
                        '50%': '#1890ff',
                        '75%': '#faad14',
                        '90%': '#ff4d4f'
                      }}
                      className="mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <Text className="text-xs" style={{ color: capacityStatus.color }}>
                        {capacityStatus.text}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {Math.round((gymClass.enrolled / gymClass.capacity) * 100)}% to'liq
                      </Text>
                    </div>
                  </div>

                  {/* Revenue Info */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarOutlined className="text-green-600" />
                        <Text className="text-sm font-medium">Oylik Daromad</Text>
                      </div>
                      <Text className="text-lg font-bold text-green-600">
                        {(gymClass.price * gymClass.enrolled * 4).toLocaleString()} UZS
                      </Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          );
        })}
      </Row>

      {/* Add/Edit Class Modal */}
      <Modal
        title={selectedClass ? 'Mashg\'ulotni Tahrirlash' : 'Yangi Mashg\'ulot Qo\'shish'}
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
                label="Mashg'ulot Nomi"
                rules={[{ required: true, message: 'Nom kiritish majburiy!' }]}
              >
                <Input placeholder="Mashg'ulot nomini kiriting" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="type"
                label="Turi"
                rules={[{ required: true, message: 'Turni tanlang!' }]}
              >
                <Select placeholder="Mashg'ulot turini tanlang">
                  <Option value="Yoga">Yoga</Option>
                  <Option value="Fitness">Fitness</Option>
                  <Option value="CrossFit">CrossFit</Option>
                  <Option value="Boxing">Boks</Option>
                  <Option value="Pilates">Pilates</Option>
                  <Option value="Zumba">Zumba</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="trainerName"
                label="Murabbiy"
                rules={[{ required: true, message: 'Murabbiyni tanlang!' }]}
              >
                <Select placeholder="Murabbiyni tanlang">
                  <Option value="Aziza Nazarova">Aziza Nazarova</Option>
                  <Option value="Bobur Alimov">Bobur Alimov</Option>
                  <Option value="Dilshod Umarov">Dilshod Umarov</Option>
                  <Option value="Feruza Qodirova">Feruza Qodirova</Option>
                  <Option value="Rustam Salimov">Rustam Salimov</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="time"
                label="Vaqt"
                rules={[{ required: true, message: 'Vaqtni tanlang!' }]}
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full"
                  placeholder="Vaqtni tanlang"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="duration"
                label="Davomiyligi (daqiqa)"
                rules={[{ required: true, message: 'Davomiylikni kiriting!' }]}
              >
                <InputNumber min={15} max={180} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="capacity"
                label="Sig'im"
                rules={[{ required: true, message: 'Sig\'imni kiriting!' }]}
              >
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="Narx (UZS)"
                rules={[{ required: true, message: 'Narxni kiriting!' }]}
              >
                <InputNumber 
                  min={0} 
                  className="w-full"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Holat"
                rules={[{ required: true, message: 'Holatni tanlang!' }]}
              >
                <Select placeholder="Holatni tanlang">
                  <Option value="active">Faol</Option>
                  <Option value="cancelled">Bekor qilingan</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="schedule"
                label="Jadval"
                rules={[{ required: true, message: 'Jadvalni kiriting!' }]}
              >
                <Input placeholder="Masalan: Dush, Chor, Juma - 8:00 AM" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => setIsModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedClass ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Class Detail Modal */}
      <Modal
        title="Mashg'ulot Ma'lumotlari"
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
              handleEditClass(selectedClass!);
            }}
          >
            Tahrirlash
          </Button>
        ]}
        width={700}
      >
        {selectedClass && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Title level={3} className="!mb-2">{selectedClass.name}</Title>
              <Space>
                <Tag color={getTypeColor(selectedClass.type)} className="text-base px-3 py-1">
                  {selectedClass.type}
                </Tag>
                <Badge 
                  status={selectedClass.status === 'active' ? 'success' : 'error'} 
                  text={selectedClass.status === 'active' ? 'Faol' : 'Bekor qilingan'}
                />
              </Space>
            </div>

            {/* Details */}
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text type="secondary">Murabbiy:</Text>
                <div className="font-medium">{selectedClass.trainerName}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Jadval:</Text>
                <div className="font-medium">{selectedClass.schedule}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Davomiyligi:</Text>
                <div className="font-medium">{selectedClass.duration} daqiqa</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Narx:</Text>
                <div className="font-medium text-green-600">{selectedClass.price.toLocaleString()} UZS</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Ro'yxat:</Text>
                <div className="font-medium">{selectedClass.enrolled}/{selectedClass.capacity} kishi</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">To'liqlik:</Text>
                <div className="font-medium">
                  {Math.round((selectedClass.enrolled / selectedClass.capacity) * 100)}%
                </div>
              </Col>
              <Col span={24}>
                <Text type="secondary">Oylik Daromad:</Text>
                <div className="text-2xl font-bold text-green-600">
                  {(selectedClass.price * selectedClass.enrolled * 4).toLocaleString()} UZS
                </div>
              </Col>
            </Row>

            {/* Progress */}
            <div>
              <Text type="secondary" className="block mb-2">Ro'yxat Holati:</Text>
              <Progress
                percent={Math.round((selectedClass.enrolled / selectedClass.capacity) * 100)}
                strokeColor={{
                  '0%': '#52c41a',
                  '50%': '#1890ff',
                  '75%': '#faad14',
                  '90%': '#ff4d4f'
                }}
                format={(percent) => `${selectedClass.enrolled}/${selectedClass.capacity}`}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}