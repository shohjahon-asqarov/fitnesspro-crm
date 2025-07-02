import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Wrench,
  CheckCircle,
  AlertTriangle,
  X,
  Calendar,
  Clock,
  Settings,
  Edit,
  Trash2
} from 'lucide-react';
import { Equipment as EquipmentType } from '../../types';
import { useEquipment } from '../../hooks/useEquipment';
import EquipmentForm from './EquipmentForm';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Equipment() {
  const { equipment, loading, createEquipment, updateStatus, deleteEquipment } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'working' | 'maintenance' | 'broken'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; equipment: EquipmentType | null }>({
    show: false,
    equipment: null
  });
  const [formLoading, setFormLoading] = useState(false);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEquipment = async (equipmentData: Omit<EquipmentType, 'id'>) => {
    setFormLoading(true);
    try {
      await createEquipment(equipmentData);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: EquipmentType['status']) => {
    try {
      await updateStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deleteConfirm.equipment) return;
    
    try {
      await deleteEquipment(deleteConfirm.equipment.id);
      setDeleteConfirm({ show: false, equipment: null });
    } catch (error) {
      console.error('Failed to delete equipment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircle size={20} className="text-green-500" />;
      case 'maintenance': return <Wrench size={20} className="text-yellow-500" />;
      case 'broken': return <X size={20} className="text-red-500" />;
      default: return <Settings size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'broken': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Cardio': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Strength': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Functional': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Free Weights': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const workingCount = equipment.filter(item => item.status === 'working').length;
  const maintenanceCount = equipment.filter(item => item.status === 'maintenance').length;
  const brokenCount = equipment.filter(item => item.status === 'broken').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Equipment</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and maintain gym equipment
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingEquipment(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Equipment
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Working
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {workingCount}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200/50 dark:border-yellow-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                Maintenance
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {maintenanceCount}
              </p>
            </div>
            <Wrench className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200/50 dark:border-red-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                Broken
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {brokenCount}
              </p>
            </div>
            <X className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="maintenance">Maintenance</option>
            <option value="broken">Broken</option>
          </select>
          <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
            {/* Equipment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value as EquipmentType['status'])}
                  className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(item.status)}`}
                >
                  <option value="working">Working</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="broken">Broken</option>
                </select>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Clock size={16} className="text-primary-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.usageHours.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Usage Hours</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Calendar size={16} className="text-secondary-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {Math.floor((new Date().getTime() - new Date(item.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) || 1}y
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
              </div>
            </div>

            {/* Maintenance Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last Maintenance:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(item.lastMaintenance).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Next Maintenance:</span>
                <span className={`font-medium ${
                  new Date(item.nextMaintenance) < new Date() 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {new Date(item.nextMaintenance).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Warranty Until:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(item.warranty).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingEquipment(item);
                  setShowForm(true);
                }}
                className="flex-1 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium"
              >
                <Edit size={14} className="inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm({ show: true, equipment: item })}
                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Form Modal */}
      <EquipmentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingEquipment(null);
        }}
        onSubmit={handleCreateEquipment}
        equipment={editingEquipment}
        loading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, equipment: null })}
        onConfirm={handleDeleteEquipment}
        title="Delete Equipment"
        message={`Are you sure you want to delete ${deleteConfirm.equipment?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}