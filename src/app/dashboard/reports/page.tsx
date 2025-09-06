'use client';

import { useState } from 'react';
import { FileText, Download, BarChart3, Users } from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  type: 'performance' | 'staff';
  generatedDate: string;
  period: string;
  status: 'completed' | 'generating';
}

const reports: ReportData[] = [
  {
    id: '1',
    title: 'Monthly Performance Report',
    type: 'performance',
    generatedDate: '2024-01-15',
    period: 'January 2024',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Staff Management Report',
    type: 'staff',
    generatedDate: '2024-01-14',
    period: 'January 2024',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Weekly Collection Report',
    type: 'performance',
    generatedDate: '2024-01-13',
    period: 'Week 2, January 2024',
    status: 'completed'
  }
];

const performanceData = {
  totalCollections: 1247,
  tonsCollected: 45.2,
  collectionRate: 94.2,
  recyclingRate: 68.2,
  activeRoutes: 23,
  staffEfficiency: 87.5,
  monthlyTrend: '+12.5%',
  routes: [
    { name: 'Route 1 - Sector A', collections: 156, efficiency: 95.2, issues: 2 },
    { name: 'Route 2 - Sector B', collections: 142, efficiency: 89.1, issues: 5 },
    { name: 'Route 3 - Sector C', collections: 134, efficiency: 92.8, issues: 1 },
    { name: 'Route 4 - Sector D', collections: 148, efficiency: 88.5, issues: 3 },
    { name: 'Route 5 - Sector E', collections: 139, efficiency: 91.2, issues: 2 }
  ]
};

const staffData = {
  totalStaff: 25,
  activeStaff: 23,
  onLeave: 2,
  averageEfficiency: 87.5,
  topPerformers: [
    { name: 'Rajesh Kumar', role: 'Collection Supervisor', efficiency: 96.2, collections: 156 },
    { name: 'Priya Sharma', role: 'Driver', efficiency: 94.8, collections: 142 },
    { name: 'Sunita Patel', role: 'Route Manager', efficiency: 93.1, collections: 134 }
  ],
  staffByRole: [
    { role: 'Collection Supervisors', count: 5, efficiency: 92.1 },
    { role: 'Drivers', count: 15, efficiency: 86.3 },
    { role: 'Route Managers', count: 3, efficiency: 89.7 },
    { role: 'Administrative', count: 2, efficiency: 95.0 }
  ]
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('performance');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = (reportType: string) => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const element = document.getElementById('report-content');
      if (element) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${reportType === 'performance' ? 'Performance Report' : 'Staff Management Report'} - SafaiSathi</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
                  .section { margin-bottom: 30px; }
                  .metric { display: inline-block; margin: 10px 20px; text-align: center; }
                  .metric-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
                  .metric-label { font-size: 14px; color: #6B7280; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #D1D5DB; padding: 12px; text-align: left; }
                  th { background-color: #F3F4F6; font-weight: bold; }
                  .footer { margin-top: 50px; text-align: center; color: #6B7280; font-size: 12px; }
                </style>
              </head>
              <body>
                ${element.innerHTML}
                <div class="footer">
                  <p>Generated on ${new Date().toLocaleDateString()} by SafaiSathi Municipality Dashboard</p>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
      setIsGenerating(false);
    }, 2000);
  };

  const PerformanceReport = () => (
    <div id="report-content" className="space-y-6">
      <div className="header text-center border-b-2 border-indigo-500 pb-5 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Municipality Performance Report</h1>
        <p className="text-lg text-gray-600">Waste Collection & Management Analytics</p>
        <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{performanceData.totalCollections}</div>
            <div className="text-sm text-gray-600">Total Collections</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{performanceData.tonsCollected}</div>
            <div className="text-sm text-gray-600">Tons Collected</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{performanceData.collectionRate}%</div>
            <div className="text-sm text-gray-600">Collection Rate</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{performanceData.recyclingRate}%</div>
            <div className="text-sm text-gray-600">Recycling Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">Route Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Collections</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Efficiency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Issues</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.routes.map((route, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900">{route.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{route.collections}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{route.efficiency}%</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{route.issues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Collection Metrics</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Active Routes: {performanceData.activeRoutes}</li>
              <li>• Staff Efficiency: {performanceData.staffEfficiency}%</li>
              <li>• Monthly Trend: {performanceData.monthlyTrend}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Environmental Impact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Waste Diverted from Landfill: 68.2%</li>
              <li>• Carbon Footprint Reduction: 15.3%</li>
              <li>• Community Satisfaction: 92.1%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const StaffReport = () => (
    <div id="report-content" className="space-y-6">
      <div className="header text-center border-b-2 border-indigo-500 pb-5 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management Report</h1>
        <p className="text-lg text-gray-600">Municipality Staff Performance & Analytics</p>
        <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{staffData.totalStaff}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{staffData.activeStaff}</div>
            <div className="text-sm text-gray-600">Active Staff</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{staffData.onLeave}</div>
            <div className="text-sm text-gray-600">On Leave</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{staffData.averageEfficiency}%</div>
            <div className="text-sm text-gray-600">Avg Efficiency</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Efficiency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Collections</th>
              </tr>
            </thead>
            <tbody>
              {staffData.topPerformers.map((staff, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900">{staff.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{staff.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{staff.efficiency}%</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{staff.collections}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">Staff by Role</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Count</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Avg Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {staffData.staffByRole.map((role, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900">{role.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{role.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{role.efficiency}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-semibold mb-4">Staff Management Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Average Response Time: 2.3 hours</li>
              <li>• Training Completion: 94.2%</li>
              <li>• Safety Incidents: 0 this month</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Operational Status</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Route Coverage: 100%</li>
              <li>• Equipment Utilization: 87.5%</li>
              <li>• Staff Satisfaction: 91.3%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and download performance and staff management reports
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => generatePDF(selectedReport)}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report type selector */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedReport('performance')}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedReport === 'performance'
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-5 w-5 inline mr-2" />
            Performance Report
          </button>
          <button
            onClick={() => setSelectedReport('staff')}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedReport === 'staff'
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            Staff Management Report
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="bg-white rounded-lg shadow">
        {selectedReport === 'performance' ? <PerformanceReport /> : <StaffReport />}
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-500">{report.period} • Generated {report.generatedDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  report.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
