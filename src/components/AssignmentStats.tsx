'use client';

import { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { AssignmentService } from '@/services/assignmentService';

interface AssignmentStatsProps {
  className?: string;
}

export default function AssignmentStats({ className = '' }: AssignmentStatsProps) {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    staffWithWork: 0,
    unassignedDetections: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const assignmentStats = await AssignmentService.getAssignmentStats();
      setStats(assignmentStats);
    } catch (err) {
      console.error('Error loading assignment stats:', err);
      setError('Failed to load assignment statistics');
      // Set default stats on error
      setStats({
        totalAssignments: 0,
        pendingAssignments: 0,
        completedAssignments: 0,
        staffWithWork: 0,
        unassignedDetections: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Assignments',
      value: stats.totalAssignments,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Pending Work',
      value: stats.pendingAssignments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Completed',
      value: stats.completedAssignments,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Staff with Work',
      value: stats.staffWithWork,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Assignment Overview</h3>
        <button
          onClick={loadStats}
          className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-4 rounded-lg border border-gray-100">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.unassignedDetections > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              {stats.unassignedDetections} detections need assignment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
