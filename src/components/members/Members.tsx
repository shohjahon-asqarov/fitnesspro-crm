import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Avatar, 
  Tooltip, 
  Dropdown, 
  Modal,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Divider,
  Pagination,
  Empty,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  CrownOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Member } from '../../types';
import { useMembers } from '../../hooks/useMembers';
import MemberForm from './MemberForm';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Members() {
  const { members, loading, createMember, updateMember, deleteMember, updateMembershipStatus } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [filterMembership, setFilterMembership] = useState<'all' | 'Basic' | 'Pro' | 'Premium'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      const matchesMembership = filterMembership === 'all' || member.membershipType === filterMembership;
      return matchesSearch && matchesStatus && matchesMembership;
    });
  }, [members, searchTerm, filterStatus, filterMembership]);

  // Pagination
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMembers.slice(startIndex, startIndex + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  const handleCreateMember = async (memberData: Omit<Member, 'id'>) => {
    setFormLoading(true);
    try {
      await createMember(memberData);
      setShowForm(false);
      toast.success('A\'zo muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      toast.error('A\'zo qo\'shishda xatolik yuz berdi');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMember = async (memberData: Omit<Member, 'id'>) => {
    if (!editingMember) return;
    
    setFormLoading(true);
    try {
      await updateMember(editingMember.id, memberData);
      setEditingMember(null);
      setShowForm(false);
      toast.success('A\'zo ma\'lumotlari yangilandi!');
    } catch (error) {
      toast.error('A\'zo ma\'lumotlarini yangilashda xatolik');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMember = (member: Member) => {
    Modal.confirm({
      title: 'A\'zoni O\'chirish',
      content: `${member.name}ni o\'chirishga ishonchingiz komilmi? Bu amalni bekor qilib bo\'lmaydi.`,
      icon: <ExclamationCircleOutlined />,
      okText: 'O\'chirish',
      cancelText: 'Bekor qilish',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMember(member.id);
          toast.success('A\'zo o\'chirildi');
        } catch (error) {
          toast.error('A\'zoni o\'chirishda xatolik');
        }
      }
    });
  };

  const handleStatusChange = async (memberId: string, newStatus: Member['status']) => {
    try {
      await updateMembershipStatus(memberId, newStatus);
      toast.success('A\'zo holati yangilandi');
    } catch (error) {
      toast.error('Holatni yangilashda xatolik');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Faol';
      case 'inactive': return 'Nofaol';
      case 'expired': return 'Muddati tugagan';
      default: return status;
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'Premium': return 'gold';
      case 'Pro': return 'blue';
      case 'Basic': return 'default';
      default: return 'default';
    }
  };

  const getMembershipIcon = (type: string) => {
    return type === 'Premium' ? <CrownOutlined /> : null;
  };

  const exportMembers = () => {
    toast.success('A\'zolar ro\'yxati eksport qilinmoqda...');
  };

  const refreshData = () => {
    toast.success('Ma\'lumotlar yangilandi');
  };

  // Table columns
  const columns = [
    {
      title: 'A\'zo',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Member) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{text}</div>
            <Text type="secondary" className="text-xs">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'A\'zolik',
      dataIndex: 'membershipType',
      key: 'membershipType',
      render: (type: string) => (
        <Tag color={getMembershipColor(type)} icon={getMembershipIcon(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Member) => (
        <Select
          value={status}
          size="small"
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="active">
            <Tag color="success">Faol</Tag>
          </Option>
          <Option value="inactive">
            <Tag color="default">Nofaol</Tag>
          </Option>
          <Option value="expired">
            <Tag color="error">Muddati tugagan</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <Space>
          <PhoneOutlined />
          <Text copyable>{phone}</Text>
        </Space>
      ),
    },
    {
      title: 'Tugash Sanasi',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string, record: Member) => {
        const isExpiring = new Date(date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return (
          <Space>
            <CalendarOutlined />
            <Text type={isExpiring ? 'danger' : 'secondary'}>
              {new Date(date).toLocaleDateString('uz-UZ')}
            </Text>
            {isExpiring && <Badge status="error" />}
          </Space>
        );
      },
    },
    {
      title: 'Oylik To\'lov',
      dataIndex: 'monthlyFee',
      key: 'monthlyFee',
      render: (fee: number) => (
        <Text strong>{fee.toLocaleString()} UZS</Text>
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record: Member) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'Ko\'rish',
                icon: <EyeOutlined />,
                onClick: () => setSelectedMember(record),
              },
              {
                key: 'edit',
                label: 'Tahrirlash',
                icon: <EditOutlined />,
                onClick: () => {
                  setEditingMember(record);
                  setShowForm(true);
                },
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: 'O\'chirish',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteMember(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Statistics
  const stats = useMemo(() => {
    const activeCount = members.filter(m => m.status === 'active').length;
    const expiredCount = members.filter(m => m.status === 'expired').length;
    const totalRevenue = members.reduce((sum, m) => sum + m.monthlyFee, 0);
    const expiringCount = members.filter(m => {
      const expiryDate = new Date(m.expiryDate);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return expiryDate <= nextMonth && m.status === 'active';
    }).length;

    return { activeCount, expiredCount, totalRevenue, expiringCount };
  }, [members]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-2">A'zolar</Title>
          <Text type="secondary">
            Sport zali a'zolari va ularning obunalarini boshqarish ({filteredMembers.length} ta)
          </Text>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={refreshData}
          >
            Yangilash
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={exportMembers}
          >
            Eksport
          </Button>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
          >
            A'zo Qo'shish
          </Button>
        </Space>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Jami A'zolar"
              value={members.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Faol A'zolar"
              value={stats.activeCount}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Muddati Tugaydi"
              value={stats.expiringCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Oylik Daromad"
              value={stats.totalRevenue}
              formatter={(value) => `${Number(value).toLocaleString()} UZS`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Ism, email yoki telefon bo'yicha qidirish..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Holat"
              value={filterStatus}
              onChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha Holatlar</Option>
              <Option value="active">Faol</Option>
              <Option value="inactive">Nofaol</Option>
              <Option value="expired">Muddati Tugagan</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="A'zolik"
              value={filterMembership}
              onChange={(value) => {
                setFilterMembership(value);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
            >
              <Option value="all">Barcha A'zoliklar</Option>
              <Option value="Basic">Basic</Option>
              <Option value="Pro">Pro</Option>
              <Option value="Premium">Premium</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Space className="w-full justify-end">
              <Text type="secondary">Sahifada:</Text>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1);
                }}
                style={{ width: 80 }}
              >
                <Option value={10}>10</Option>
                <Option value={20}>20</Option>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Spin spinning={loading}>
          {filteredMembers.length === 0 ? (
            <Empty description="A'zolar topilmadi" />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={paginatedMembers}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
                size="middle"
              />
              <Divider />
              <div className="flex justify-between items-center">
                <Text type="secondary">
                  {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredMembers.length)} dan {filteredMembers.length} ta natija
                </Text>
                <Pagination
                  current={currentPage}
                  total={filteredMembers.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            </>
          )}
        </Spin>
      </Card>

      {/* Member Form Modal */}
      <MemberForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingMember(null);
        }}
        onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
        member={editingMember}
        loading={formLoading}
      />

      {/* Member Detail Modal */}
      <Modal
        title="A'zo Ma'lumotlari"
        open={!!selectedMember}
        onCancel={() => setSelectedMember(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedMember(null)}>
            Yopish
          </Button>,
          <Button 
            key="edit" 
            type="primary"
            onClick={() => {
              setEditingMember(selectedMember);
              setSelectedMember(null);
              setShowForm(true);
            }}
          >
            Tahrirlash
          </Button>
        ]}
        width={600}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar size={64} src={selectedMember.avatar} icon={<UserOutlined />} />
              <div>
                <Title level={4} className="!mb-1">{selectedMember.name}</Title>
                <Space>
                  <Tag color={getStatusColor(selectedMember.status)}>
                    {getStatusText(selectedMember.status)}
                  </Tag>
                  <Tag color={getMembershipColor(selectedMember.membershipType)} icon={getMembershipIcon(selectedMember.membershipType)}>
                    {selectedMember.membershipType}
                  </Tag>
                </Space>
              </div>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Email:</Text>
                <div>{selectedMember.email}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Telefon:</Text>
                <div>{selectedMember.phone}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Qo'shilgan Sana:</Text>
                <div>{new Date(selectedMember.joinDate).toLocaleDateString('uz-UZ')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Tugash Sanasi:</Text>
                <div>{new Date(selectedMember.expiryDate).toLocaleDateString('uz-UZ')}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Jami Tashriflar:</Text>
                <div>{selectedMember.totalVisits}</div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Oxirgi Tashrif:</Text>
                <div>{new Date(selectedMember.lastVisit).toLocaleDateString('uz-UZ')}</div>
              </Col>
              <Col span={24}>
                <Text type="secondary">Oylik To'lov:</Text>
                <div className="text-lg font-semibold">{selectedMember.monthlyFee.toLocaleString()} UZS</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}