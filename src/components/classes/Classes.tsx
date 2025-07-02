import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';
import { mockClasses } from '../../data/mockData';
import { GymClass } from '../../types';

export default function Classes() {
  const [classes] = useState<GymClass[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredClasses = classes.filter(gymClass => {
    const matchesSearch = gymClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gymClass.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || gymClass.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      'Yoga': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Fitness': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'CrossFit': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Boxing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Pilates': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'Zumba': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage fitness classes and schedules
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
          <Plus size={18} />
          Add Class
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search classes or trainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="Yoga">Yoga</option>
            <option value="Fitness">Fitness</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Boxing">Boxing</option>
            <option value="Pilates">Pilates</option>
            <option value="Zumba">Zumba</option>
          </select>
          <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((gymClass) => (
          <div key={gymClass.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
            {/* Class Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {gymClass.name}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(gymClass.type)}`}>
                  {gymClass.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${gymClass.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">per session</div>
              </div>
            </div>

            {/* Trainer Info */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <User size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {gymClass.trainerName}
              </span>
            </div>

            {/* Schedule & Duration */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Schedule
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {gymClass.schedule}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-secondary-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Duration
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {gymClass.duration} minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-accent-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enrollment
                  </span>
                </div>
                <span className={`text-sm font-bold ${getCapacityColor(gymClass.enrolled, gymClass.capacity)}`}>
                  {gymClass.enrolled}/{gymClass.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(gymClass.enrolled / gymClass.capacity) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((gymClass.enrolled / gymClass.capacity) * 100)}% full
              </div>
            </div>

            {/* Revenue Info */}
            <div className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-accent-600 dark:text-accent-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Revenue
                </span>
              </div>
              <span className="text-lg font-bold text-accent-600 dark:text-accent-400">
                ${(gymClass.price * gymClass.enrolled * 4).toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                Edit
              </button>
              <button className="px-3 py-2 bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors text-sm font-medium">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}