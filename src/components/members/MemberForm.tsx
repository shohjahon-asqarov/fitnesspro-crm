import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  Space, 
  Row, 
  Col,
  Typography,
  Divider
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, DollarOutlined } from '@ant-design/icons';
import { Member, Trainer } from '../../types';
import { mockTrainers } from '../../data/mockData';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: Omit<Member, 'id'>) => Promise<void>;
  member?: Member | null;
  loading?: boolean;
}

export default function MemberForm({ isOpen, onClose, onSubmit, member, loading = false }: MemberFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (member) {
        form.setFieldsValue({
          ...member,
          joinDate: dayjs(member.joinDate),
          expiryDate: dayjs(member.expiryDate),
          lastVisit: dayjs(member.lastVisit),
        });
      } else {
        form.resetFields();
        // Set default values for new member
        const today = dayjs();
        form.setFieldsValue({
          joinDate: today,
          membershipType: 'Basic',
          status: 'active',
          monthlyFee: 200000,
          totalVisits: 0,
          lastVisit: today,
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
        });
      }
    }
  }, [isOpen, member, form]);

  const handleSubmit = async (values: any) => {
    try {
      const memberData = {
        ...values,
        joinDate: values.joinDate.format('YYYY-MM-DD'),
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
        lastVisit: values.lastVisit.format('YYYY-MM-DD'),
      };
      await onSubmit(memberData);
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  // Calculate expiry date based on membership type and join date
  const handleMembershipTypeChange = (membershipType: string) => {
    const joinDate = form.getFieldValue('joinDate');
    if (joinDate) {
      const expiry = dayjs(joinDate);
      switch (membershipType) {
        case 'Basic':
          expiry.add(1, 'month');
          form.setFieldValue('monthlyFee', 200000);
          break;
        case 'Pro':
          expiry.add(3, 'month');
          form.setFieldValue('monthlyFee', 300000);
          break;
        case 'Premium':
          expiry.add(1, 'year');
          form.setFieldValue('monthlyFee', 500000);
          break;
      }
      form.setFieldValue('expiryDate', expiry);
    }
  };

  const handleJoinDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const membershipType = form.getFieldValue('membershipType');
      const expiry = dayjs(date);
      switch (membershipType) {
        case 'Basic':
          expiry.add(1, 'month');
          break;
        case 'Pro':
          expiry.add(3, 'month');
          break;
        case 'Premium':
          expiry.add(1, 'year');
          break;
      }
      form.setFieldValue('expiryDate', expiry);
    }
  };

  return (
    <Modal
      title={
        <Title level={4} className="!mb-0">
          {member ? 'A\'zoni Tahrirlash' : 'Yangi A\'zo Qo\'shish'}
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="To'liq Ism"
              rules={[{ required: true, message: 'Ism kiritish majburiy!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Ism va familiyani kiriting"
                size="large"
              />
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
              <Input 
                prefix={<MailOutlined />} 
                placeholder="email@example.com"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{ required: true, message: 'Telefon kiritish majburiy!' }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="+998 90 123 45 67"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="membershipType"
              label="A'zolik Turi"
              rules={[{ required: true, message: 'A\'zolik turini tanlang!' }]}
            >
              <Select 
                placeholder="A'zolik turini tanlang"
                size="large"
                onChange={handleMembershipTypeChange}
              >
                <Option value="Basic">Basic - 200,000 UZS/oy</Option>
                <Option value="Pro">Pro - 300,000 UZS/oy</Option>
                <Option value="Premium">Premium - 500,000 UZS/yil</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="joinDate"
              label="Qo'shilgan Sana"
              rules={[{ required: true, message: 'Sanani tanlang!' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                size="large"
                format="DD/MM/YYYY"
                onChange={handleJoinDateChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="expiryDate"
              label="Tugash Sanasi"
              rules={[{ required: true, message: 'Tugash sanasini tanlang!' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                size="large"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Holat"
            >
              <Select size="large">
                <Option value="active">Faol</Option>
                <Option value="inactive">Nofaol</Option>
                <Option value="expired">Muddati Tugagan</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="monthlyFee"
              label="Oylik To'lov (UZS)"
              rules={[{ required: true, message: 'To\'lov miqdorini kiriting!' }]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                style={{ width: '100%' }}
                size="large"
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="trainerId"
              label="Shaxsiy Murabbiy (ixtiyoriy)"
            >
              <Select 
                placeholder="Murabbiyni tanlang"
                size="large"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {mockTrainers.map((trainer) => (
                  <Option key={trainer.id} value={trainer.id}>
                    {trainer.name} - {trainer.specialization.join(', ')}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {member && (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  name="totalVisits"
                  label="Jami Tashriflar"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="lastVisit"
                  label="Oxirgi Tashrif"
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    size="large"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        <Divider />
        
        <div className="flex justify-end gap-3">
          <Button size="large" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
          >
            {member ? 'A\'zoni Yangilash' : 'A\'zo Qo\'shish'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}