import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Tag, 
  Avatar, 
  Space, 
  Rate, 
  Progress, 
  Typography, 
  Statistic,
  Badge,
  Tooltip,
  Dropdown,
  Modal,
  Form,
  Select,
  InputNumber,
  Upload,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
  StarOutlined
} from '@ant-design/icons';
import { mockTrainers } from '../../data/mockData';
import { Trainer } from '../../types';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Trainers() {
  const [trainers] = useState<Trainer[]>(mockTrainers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'success'
      : 'error';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Faol' : 'Nofaol';
  };

  const getSpecializationColor = (spec: string) => {
    const colors = {
      'Fitness': 'blue',
      'CrossFit': 'red',
      'Personal Training': 'green',
      'Yoga': 'purple',
      'Pilates': 'pink',
      'Meditation': 'cyan',
      'Boxing': 'orange',
      'MMA': 'volcano',
      'Strength Training': 'geekblue',
      'Zumba': 'magenta',
      'Dance Fitness': 'lime',
      'Aerobics': 'gold',
      'Powerlifting': 'default',
      'Bodybuilding': 'processing',
      'Nutrition': 'success'
    };
    return colors[spec as keyof typeof colors] || 'default';
  };

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    form.setFieldsValue(trainer);
    setIsModalVisible(true);
  };

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsDetailModalVisible(true);
  };

  const handleDeleteTrainer = (trainer: Trainer) => {
    Modal.confirm({
      title: 'Murabbiyni o\'chirish',
      content: `${trainer.name}ni o\'chirishga ishonchingiz komilmi?`,
      okText: 'O\'chirish',
      cancelText: 'Bekor qilish',
      okType: 'danger',
      onOk() {
        message.success('Murabbiy muvaffaqiyatli o\'chirildi');
      },
    });
  };

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    message.success(selectedTrainer ? 'Murabbiy ma\'lumotlari yangilandi' : 'Yangi murabbiy qo\'shildi');
    setIsModalVisible(false);
    form.resetFields();
  };

  const getMenuItems = (trainer: Trainer) => [
    {
      key: 'view',
      label: 'Ko\'rish',
      icon: <EyeOutlined />,
      onClick: () => handleViewTrainer(trainer),
    },
    {
      key: 'edit',
      label: 'Tahrirlash',
      icon: <EditOutlined />,
      onClick: () => handleEditTrainer(trainer),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'O\'chirish',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteTrainer(trainer),
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
            <Title level={2} className="!mb-2">Murabbiylar</Title>
            <Text type="secondary" className="text-base">
              Sport zali murabbiylarini boshqarish va ularning jadvallarini kuzatish
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAddTrainer}
            className="h-12 px-6 text-base font-medium"
          >
            Murabbiy Qo'shish
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Input
                placeholder="Murabbiylar yoki mutaxassislik bo'yicha qidirish..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} md={12}>
              <div className="flex justify-end">
                <Space>
                  <Text type="secondary">Jami: {filteredTrainers.length} ta murabbiy</Text>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Trainers Grid */}
      <Row gutter={[24, 24]}>
        {filteredTrainers.map((trainer, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={trainer.id}>
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
                    <EyeOutlined onClick={() => handleViewTrainer(trainer)} />
                  </Tooltip>,
                  <Tooltip title="Tahrirlash">
                    <EditOutlined onClick={() => handleEditTrainer(trainer)} />
                  </Tooltip>,
                  <Dropdown menu={{ items: getMenuItems(trainer) }} trigger={['click']}>
                    <MoreOutlined />
                  </Dropdown>
                ]}
              >
                {/* Trainer Header */}
                <div className="text-center mb-4">
                  <Badge 
                    status={trainer.status === 'active' ? 'success' : 'error'} 
                    offset={[-8, 8]}
                  >
                    <Avatar 
                      src={trainer.avatar} 
                      size={80} 
                      icon={<UserOutlined />}
                      className="mb-3"
                    />
                  </Badge>
                  <Title level={4} className="!mb-1">{trainer.name}</Title>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Rate disabled defaultValue={trainer.rating} allowHalf className="text-sm" />
                    <Text type="secondary" className="text-sm">
                      {trainer.rating}/5.0
                    </Text>
                  </div>
                  <Tag color={getStatusColor(trainer.status)}>
                    {getStatusText(trainer.status)}
                  </Tag>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MailOutlined className="text-gray-400" />
                    <Text className="truncate flex-1" title={trainer.email}>
                      {trainer.email}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneOutlined className="text-gray-400" />
                    <Text>{trainer.phone}</Text>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <Text strong className="text-sm block mb-2">Mutaxassislik:</Text>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialization.slice(0, 2).map((spec, idx) => (
                      <Tag key={idx} color={getSpecializationColor(spec)} className="text-xs">
                        {spec}
                      </Tag>
                    ))}
                    {trainer.specialization.length > 2 && (
                      <Tag className="text-xs">+{trainer.specialization.length - 2}</Tag>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <Row gutter={[8, 8]} className="mb-4">
                  <Col span={12}>
                    <Card size="small" className="text-center bg-blue-50 border-blue-200">
                      <Statistic
                        title="A'zolar"
                        value={trainer.assignedMembers}
                        prefix={<TeamOutlined />}
                        valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" className="text-center bg-green-50 border-green-200">
                      <Statistic
                        title="Tajriba"
                        value={trainer.experience}
                        suffix="yil"
                        prefix={<TrophyOutlined />}
                        valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Commission */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarOutlined className="text-orange-600" />
                      <Text className="text-sm font-medium">Komissiya</Text>
                    </div>
                    <Text className="text-lg font-bold text-orange-600">
                      {trainer.commission}%
                    </Text>
                  </div>
                </div>

                {/* Schedule Preview */}
                <div>
                  <Text strong className="text-sm block mb-2 flex items-center gap-1">
                    <CalendarOutlined />
                    Jadval:
                  </Text>
                  <div className="space-y-1">
                    {trainer.schedule.slice(0, 2).map((time, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {time}
                      </div>
                    ))}
                    {trainer.schedule.length > 2 && (
                      <Text type="secondary" className="text-xs">
                        +{trainer.schedule.length - 2} ta boshqa vaqt
                      </Text>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Trainer Modal */}
      <Modal
        title={selectedTrainer ? 'Murabbiyni Tahrirlash' : 'Yangi Murabbiy Qo\'shish'}
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
                label="To'liq Ism"
                rules={[{ required: true, message: 'Ism kiritish majburiy!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Ism va familiya" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email kiritish majburiy!' },
                  { type: 'email', message: 'Noto\'g\'ri email format!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon kiritish majburiy!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+998 90 123 45 67" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="experience"
                label="Tajriba (yil)"
                rules={[{ required: true, message: 'Tajriba kiritish majburiy!' }]}
              >
                <InputNumber min={0} max={50} className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="commission"
                label="Komissiya (%)"
                rules={[{ required: true, message: 'Komissiya kiritish majburiy!' }]}
              >
                <InputNumber min={0} max={100} className="w-full" />
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
                  <Option value="inactive">Nofaol</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="specialization"
                label="Mutaxassislik"
                rules={[{ required: true, message: 'Kamida bitta mutaxassislik tanlang!' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Mutaxassisliklarni tanlang"
                  options={[
                    { label: 'Fitness', value: 'Fitness' },
                    { label: 'CrossFit', value: 'CrossFit' },
                    { label: 'Shaxsiy Mashg\'ulot', value: 'Personal Training' },
                    { label: 'Yoga', value: 'Yoga' },
                    { label: 'Pilates', value: 'Pilates' },
                    { label: 'Meditatsiya', value: 'Meditation' },
                    { label: 'Boks', value: 'Boxing' },
                    { label: 'MMA', value: 'MMA' },
                    { label: 'Kuch Mashg\'uloti', value: 'Strength Training' },
                    { label: 'Zumba', value: 'Zumba' },
                    { label: 'Raqs Fitnesi', value: 'Dance Fitness' },
                    { label: 'Aerobika', value: 'Aerobics' },
                    { label: 'Powerlifting', value: 'Powerlifting' },
                    { label: 'Bodibilding', value: 'Bodybuilding' },
                    { label: 'Ovqatlanish', value: 'Nutrition' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="avatar"
                label="Rasm"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Rasm yuklash</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button onClick={() => setIsModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedTrainer ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Trainer Detail Modal */}
      <Modal
        title="Murabbiy Ma'lumotlari"
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
              handleEditTrainer(selectedTrainer!);
            }}
          >
            Tahrirlash
          </Button>
        ]}
        width={700}
      >
        {selectedTrainer && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Avatar size={100} src={selectedTrainer.avatar} icon={<UserOutlined />} className="mb-4" />
              <Title level={3} className="!mb-2">{selectedTrainer.name}</Title>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Rate disabled defaultValue={selectedTrainer.rating} allowHalf />
                <Text type="secondary">{selectedTrainer.rating}/5.0</Text>
              </div>
              <Tag color={getStatusColor(selectedTrainer.status)} className="text-base px-3 py-1">
                {getStatusText(selectedTrainer.status)}
              </Tag>
            </div>

            {/* Details */}
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Text type="secondary">Email:</Text>
                <div className="font-medium">{selectedTrainer.email}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Telefon:</Text>
                <div className="font-medium">{selectedTrainer.phone}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Tajriba:</Text>
                <div className="font-medium">{selectedTrainer.experience} yil</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Komissiya:</Text>
                <div className="font-medium">{selectedTrainer.commission}%</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Tayinlangan A'zolar:</Text>
                <div className="font-medium">{selectedTrainer.assignedMembers} ta</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Reyting:</Text>
                <div className="font-medium flex items-center gap-2">
                  <StarOutlined className="text-yellow-500" />
                  {selectedTrainer.rating}/5.0
                </div>
              </Col>
              <Col span={24}>
                <Text type="secondary">Mutaxassislik:</Text>
                <div className="mt-2">
                  {selectedTrainer.specialization.map((spec, idx) => (
                    <Tag key={idx} color={getSpecializationColor(spec)} className="mb-1">
                      {spec}
                    </Tag>
                  ))}
                </div>
              </Col>
              <Col span={24}>
                <Text type="secondary">Ish Jadvali:</Text>
                <div className="mt-2 space-y-2">
                  {selectedTrainer.schedule.map((time, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <CalendarOutlined className="text-blue-500" />
                      <Text>{time}</Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}