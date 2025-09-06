'use client';

import { 
  Trash2, 
  TrendingUp, 
  MapPin, 
  Activity,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  Recycle,
  AlertTriangle
} from 'lucide-react';

const stats = [
  {
    name: 'Total Collections',
    value: '1,247',
    change: '+8.2%',
    changeType: 'positive',
    icon: Trash2,
  },
  {
    name: 'Tons Collected',
    value: '45.2',
    change: '+12.5%',
    changeType: 'positive',
    icon: TrendingUp,
  },
  {
    name: 'Active Routes',
    value: '23',
    change: '+2',
    changeType: 'positive',
    icon: MapPin,
  },
  {
    name: 'Collection Rate',
    value: '94.2%',
    change: '+1.8%',
    changeType: 'positive',
    icon: Activity,
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Route 5 - Sector A',
    action: 'Collection completed',
    time: '2 minutes ago',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  {
    id: 2,
    user: 'Route 12 - Sector B',
    action: 'Collection in progress',
    time: '15 minutes ago',
    icon: Clock,
    iconColor: 'text-blue-500',
  },
  {
    id: 3,
    user: 'Route 8 - Sector C',
    action: 'Collection completed',
    time: '1 hour ago',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  {
    id: 4,
    user: 'Route 3 - Sector D',
    action: 'Missed collection - rescheduled',
    time: '2 hours ago',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Garbage Management Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor waste collection operations and track municipality performance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Collection chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Collection Performance</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Collection metrics chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Collection Activities</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.iconColor
                          }`}
                        >
                          <activity.icon className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">
                              {activity.user}
                            </span>{' '}
                            {activity.action}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <Truck className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Schedule Collection
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Plan new collection route
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <Recycle className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Waste Report
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate collection report
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                <MapPin className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Route Management
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage collection routes
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <AlertTriangle className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Report Issue
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Report collection problems
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
