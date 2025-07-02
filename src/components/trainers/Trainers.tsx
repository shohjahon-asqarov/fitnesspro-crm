import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Users, 
  Calendar,
  Phone,
  Mail,
  Award,
  TrendingUp
} from 'lucide-react';
import { mockTrainers } from '../../data/mockData';
import { Trainer } from '../../types';

export default function Trainers() {
  const [trainers] = useState<Trainer[]>(mockTrainers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage fitness trainers and their schedules
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
          <Plus size={18} />
          Add Trainer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search trainers or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer) => (
          <div key={trainer.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
            {/* Trainer Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {trainer.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {trainer.rating}/5.0
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                  {trainer.status}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={14} />
                <span className="truncate">{trainer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone size={14} />
                <span>{trainer.phone}</span>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {trainer.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Users size={16} className="text-primary-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {trainer.assignedMembers}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Award size={16} className="text-secondary-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {trainer.experience}y
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
              </div>
            </div>

            {/* Commission */}
            <div className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-accent-600 dark:text-accent-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Commission</span>
              </div>
              <span className="text-lg font-bold text-accent-600 dark:text-accent-400">
                {trainer.commission}%
              </span>
            </div>

            {/* Schedule */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Calendar size={14} />
                Schedule
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {trainer.schedule.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}