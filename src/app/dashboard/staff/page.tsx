'use client';

import { useState } from 'react';
import { Users, Plus, Search, Filter, MapPin, Phone, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { SafaiKarmi } from '@/types/staff';
import SafaiKarmiModal from '@/components/SafaiKarmiModal';

// Hardcoded safai karmi data
const safaiKarmis: SafaiKarmi[] = [
  {
    id: 'SK001',
    name: 'Ram Prasad Yadav',
    phone: '+91 98765 43210',
    workingArea: 'Sector 1 - Salt Lake',
    status: 'Active',
    joinDate: '2023-01-15',
    lastActive: '2 hours ago',
    totalCollections: 1247,
    rating: 4.8
  },
  {
    id: 'SK002',
    name: 'Sunita Devi',
    phone: '+91 98765 43211',
    workingArea: 'Sector 2 - Salt Lake',
    status: 'Active',
    joinDate: '2023-02-20',
    lastActive: '1 hour ago',
    totalCollections: 1156,
    rating: 4.9
  },
  {
    id: 'SK003',
    name: 'Mohammad Ali',
    phone: '+91 98765 43212',
    workingArea: 'Park Street Area',
    status: 'On Leave',
    joinDate: '2022-11-10',
    lastActive: '3 days ago',
    totalCollections: 2103,
    rating: 4.7
  },
  {
    id: 'SK004',
    name: 'Priya Kumari',
    phone: '+91 98765 43213',
    workingArea: 'New Market Area',
    status: 'Active',
    joinDate: '2023-03-05',
    lastActive: '30 minutes ago',
    totalCollections: 892,
    rating: 4.6
  },
  {
    id: 'SK005',
    name: 'Biswajit Mondal',
    phone: '+91 98765 43214',
    workingArea: 'Howrah Station Area',
    status: 'Active',
    joinDate: '2022-08-12',
    lastActive: '45 minutes ago',
    totalCollections: 1876,
    rating: 4.9
  },
  {
    id: 'SK006',
    name: 'Rekha Singh',
    phone: '+91 98765 43215',
    workingArea: 'Ballygunge Area',
    status: 'Inactive',
    joinDate: '2023-01-08',
    lastActive: '1 week ago',
    totalCollections: 567,
    rating: 4.2
  },
  {
    id: 'SK007',
    name: 'Amit Kumar',
    phone: '+91 98765 43216',
    workingArea: 'Tollygunge Area',
    status: 'Active',
    joinDate: '2023-04-15',
    lastActive: '1 hour ago',
    totalCollections: 743,
    rating: 4.5
  },
  {
    id: 'SK008',
    name: 'Kavita Sharma',
    phone: '+91 98765 43217',
    workingArea: 'Garia Area',
    status: 'Active',
    joinDate: '2022-12-03',
    lastActive: '2 hours ago',
    totalCollections: 1345,
    rating: 4.8
  }
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [karmis, setKarmis] = useState<SafaiKarmi[]>(safaiKarmis);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedKarmi, setSelectedKarmi] = useState<SafaiKarmi | null>(null);

  // Filter safai karmis based on search and status
  const filteredKarmis = karmis.filter(karmi => {
    const matchesSearch = karmi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         karmi.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         karmi.workingArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || karmi.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalKarmis = karmis.length;
  const activeKarmis = karmis.filter(k => k.status === 'Active').length;
  const onLeaveKarmis = karmis.filter(k => k.status === 'On Leave').length;
  const totalCollections = karmis.reduce((sum, k) => sum + k.totalCollections, 0);

  const stats = [
    {
      name: 'Total Safai Karmis',
      value: totalKarmis.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Workers',
      value: activeKarmis.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'On Leave',
      value: onLeaveKarmis.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Total Collections',
      value: totalCollections.toLocaleString(),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Modal handlers
  const handleAddKarmi = () => {
    setModalMode('add');
    setSelectedKarmi(null);
    setIsModalOpen(true);
  };

  const handleEditKarmi = (karmi: SafaiKarmi) => {
    setModalMode('edit');
    setSelectedKarmi(karmi);
    setIsModalOpen(true);
  };

  const handleViewKarmi = (karmi: SafaiKarmi) => {
    setModalMode('view');
    setSelectedKarmi(karmi);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKarmi(null);
  };

  // Generate new ID for new karmi
  const generateNewId = () => {
    if (karmis.length === 0) return 'SK001';
    const maxId = Math.max(...karmis.map(k => parseInt(k.id.replace('SK', ''))));
    return `SK${String(maxId + 1).padStart(3, '0')}`;
  };

  // Save new karmi
  const handleSaveKarmi = (karmiData: Omit<SafaiKarmi, 'id'>) => {
    const newKarmi: SafaiKarmi = {
      ...karmiData,
      id: generateNewId(),
      lastActive: 'Just now'
    };
    setKarmis(prev => [...prev, newKarmi]);
  };

  // Update existing karmi
  const handleUpdateKarmi = (id: string, karmiData: Omit<SafaiKarmi, 'id'>) => {
    setKarmis(prev => prev.map(k => 
      k.id === id 
        ? { ...karmiData, id, lastActive: 'Just now' }
        : k
    ));
  };

  // Remove karmi
  const handleRemoveKarmi = (id: string) => {
    if (window.confirm('Are you sure you want to remove this safai karmi?')) {
      setKarmis(prev => prev.filter(k => k.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Safai Karmi Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor waste collection workers across Kolkata
          </p>
        </div>
        <button 
          onClick={handleAddKarmi}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Safai Karmi
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, ID, or working area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Safai Karmis table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Safai Karmis ({filteredKarmis.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredKarmis.map((karmi) => (
            <li key={karmi.id}>
              <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {karmi.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{karmi.name}</p>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(karmi.status)}`}>
                        {karmi.status}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {karmi.id}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {karmi.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {karmi.workingArea}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {karmi.totalCollections.toLocaleString()} collections
                      </span>
                      <span className={`ml-2 text-sm font-medium ${getRatingColor(karmi.rating)}`}>
                        ⭐ {karmi.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Last active: {karmi.lastActive}</p>
                    <p className="text-sm text-gray-500">Joined: {new Date(karmi.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditKarmi(karmi)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewKarmi(karmi)}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleRemoveKarmi(karmi.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredKarmis.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No safai karmis found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <SafaiKarmiModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveKarmi}
        onUpdate={handleUpdateKarmi}
        karmi={selectedKarmi}
        mode={modalMode}
      />
    </div>
  );
}
