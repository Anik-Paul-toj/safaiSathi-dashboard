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
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { useRef } from 'react';

const stats = [
  {
    name: 'Total Detections',
    value: '2,847',
    change: '+12.3%',
    changeType: 'positive',
    icon: Trash2,
  },
  {
    name: 'Detection Frequency',
    value: '2/min',
    change: '+0.5',
    changeType: 'positive',
    icon: Activity,
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Nilgunj Road, Sodepur',
    action: 'Garbage overflow detected',
    time: '2 minutes ago',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    confidence: '46.97%',
    status: 'LOW_OVERFLOW',
  },
  {
    id: 2,
    user: 'Kamarhati, Barrackpore',
    action: 'Detection completed',
    time: '5 minutes ago',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    confidence: '32.92%',
    status: 'LOW_OVERFLOW',
  },
  {
    id: 3,
    user: 'North 24 Parganas',
    action: 'Overflow monitoring active',
    time: '15 minutes ago',
    icon: Activity,
    iconColor: 'text-blue-500',
    confidence: '41.5%',
    status: 'MEDIUM_OVERFLOW',
  },
  {
    id: 4,
    user: 'West Bengal Area',
    action: 'Collection scheduled',
    time: '1 hour ago',
    icon: Clock,
    iconColor: 'text-yellow-500',
    confidence: '38.2%',
    status: 'LOW_OVERFLOW',
  },
];

export default function DashboardPage() {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    try {
      // Dynamic import for html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create municipal report HTML
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Municipal Garbage Overflow Detection Report</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .municipality-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 5px;
            }
            .report-title {
              font-size: 18px;
              color: #666;
              margin-bottom: 10px;
            }
            .report-date {
              font-size: 14px;
              color: #888;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #2563eb;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .summary-item {
              background: #f8fafc;
              padding: 15px;
              border-left: 4px solid #2563eb;
              border-radius: 4px;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .summary-value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .location-info {
              background: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .location-address {
              font-weight: bold;
              margin-bottom: 10px;
              color: #1e40af;
            }
            .coordinates {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-top: 10px;
            }
            .coord-item {
              font-size: 14px;
            }
            .coord-label {
              color: #666;
            }
            .coord-value {
              font-weight: bold;
              font-family: monospace;
            }
            .detection-events {
              margin-top: 20px;
            }
            .event-item {
              background: #f9fafb;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 6px;
              border-left: 4px solid #10b981;
            }
            .event-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
            }
            .event-id {
              font-weight: bold;
              color: #1f2937;
            }
            .event-confidence {
              font-weight: bold;
              color: #059669;
            }
            .event-timestamp {
              font-size: 12px;
              color: #6b7280;
            }
            .recommendations {
              background: #fef3c7;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
            }
            .recommendation-item {
              margin-bottom: 10px;
              padding-left: 20px;
              position: relative;
            }
            .recommendation-item::before {
              content: "•";
              position: absolute;
              left: 0;
              color: #f59e0b;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .official-stamp {
              margin-top: 30px;
              text-align: right;
            }
            .stamp-box {
              display: inline-block;
              border: 2px solid #2563eb;
              padding: 10px 20px;
              border-radius: 4px;
              font-size: 12px;
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="municipality-name">MUNICIPAL CORPORATION OF KOLKATA</div>
            <div class="report-title">GARBAGE OVERFLOW DETECTION REPORT</div>
            <div class="report-date">Report Generated: September 6, 2025 at 18:52:17 IST</div>
          </div>

          <div class="section">
            <div class="section-title">EXECUTIVE SUMMARY</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total Detections</div>
                <div class="summary-value">2</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Average Confidence</div>
                <div class="summary-value">39.94%</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Overflow Score</div>
                <div class="summary-value">7.99</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Detection Frequency</div>
                <div class="summary-value">2/min</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">LOCATION INTELLIGENCE</div>
            <div class="location-info">
              <div class="location-address">Detection Location</div>
              <div>Nilgunj Road, Sodepur, Kamarhati, Barrackpore, North 24 Parganas, West Bengal, 700114, India</div>
              <div class="coordinates">
                <div class="coord-item">
                  <span class="coord-label">Latitude:</span>
                  <span class="coord-value">22.694976°</span>
                </div>
                <div class="coord-item">
                  <span class="coord-label">Longitude:</span>
                  <span class="coord-value">88.379449°</span>
                </div>
                <div class="coord-item">
                  <span class="coord-label">GPS Accuracy:</span>
                  <span class="coord-value">±73 meters</span>
                </div>
                <div class="coord-item">
                  <span class="coord-label">Status:</span>
                  <span class="coord-value">LOW OVERFLOW</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DETECTION EVENTS</div>
            <div class="detection-events">
              <div class="event-item">
                <div class="event-header">
                  <div class="event-id">Detection #1</div>
                  <div class="event-confidence">32.92%</div>
                </div>
                <div class="event-timestamp">Timestamp: 2025-09-06 18:52:07</div>
              </div>
              <div class="event-item">
                <div class="event-header">
                  <div class="event-id">Detection #2</div>
                  <div class="event-confidence">46.97%</div>
                </div>
                <div class="event-timestamp">Timestamp: 2025-09-06 18:52:15</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">RECOMMENDATIONS</div>
            <div class="recommendations">
              <div class="recommendation-item">Schedule immediate collection for the detected overflow area</div>
              <div class="recommendation-item">Continue monitoring as confidence increased from 32.92% to 46.97%</div>
              <div class="recommendation-item">Include this location in regular collection schedule</div>
              <div class="recommendation-item">Update municipal waste management database with new detection point</div>
            </div>
          </div>

          <div class="official-stamp">
            <div class="stamp-box">
              OFFICIAL REPORT<br>
              Municipal Corporation of Kolkata<br>
              Waste Management Department
            </div>
          </div>

          <div class="footer">
            <p>This report is generated automatically by the Municipal Garbage Overflow Detection System</p>
            <p>For queries contact: waste-management@kolkata.gov.in | Phone: +91-33-XXXX-XXXX</p>
          </div>
        </body>
        </html>
      `;
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Municipal-Garbage-Report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      // Create a temporary element with the report HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = reportHTML;
      document.body.appendChild(tempDiv);
      
      await html2pdf().set(opt).from(tempDiv).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };


  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Garbage Overflow Detection Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor garbage overflow detection and track waste management performance.
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
                      {stat.change && (
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive'
                              ? 'text-green-600'
                              : stat.changeType === 'negative'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {stat.change}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Detection Report */}
      <div ref={reportRef} className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Garbage Overflow Detection Report</h2>
                <p className="text-blue-100 text-sm">Generated on September 6, 2025 at 18:52:17 IST</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleExportPDF}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4 inline mr-1" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Executive Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Executive Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm text-blue-600 font-medium">Total Detections</div>
                <div className="text-2xl font-bold text-blue-900">2</div>
                <div className="text-xs text-blue-600">Current session</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-green-600 font-medium">Average Confidence</div>
                <div className="text-2xl font-bold text-green-900">39.94%</div>
                <div className="text-xs text-green-600">Detection accuracy</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="text-sm text-yellow-600 font-medium">Overflow Score</div>
                <div className="text-2xl font-bold text-yellow-900">7.99</div>
                <div className="text-xs text-yellow-600">Risk assessment</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <div className="text-sm text-purple-600 font-medium">Detection Frequency</div>
                <div className="text-2xl font-bold text-purple-900">2/min</div>
                <div className="text-xs text-purple-600">Activity rate</div>
              </div>
            </div>
          </div>

          {/* Location Intelligence */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Location Intelligence
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detection Location</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Nilgunj Road, Sodepur, Kamarhati, Barrackpore, North 24 Parganas, West Bengal, 700114, India
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Latitude:</span>
                      <span className="font-mono font-medium">22.694976°</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Longitude:</span>
                      <span className="font-mono font-medium">88.379449°</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GPS Accuracy:</span>
                      <span className="font-medium">±73 meters</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location Source:</span>
                      <span className="font-medium text-green-600">GPS</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Current Status</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        LOW OVERFLOW
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Confidence Range</span>
                      <span className="text-sm font-medium text-blue-800">32.92% - 46.97%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Detection Pattern</span>
                      <span className="text-sm font-medium text-yellow-800">2 in 8 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Analytics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Detection Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Confidence Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maximum Confidence</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '46.97%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">46.97%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Confidence</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '39.94%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">39.94%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Minimum Confidence</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '32.92%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">32.92%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Recent Detection Events</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Detection #1</p>
                      <p className="text-xs text-gray-500">2025-09-06 18:52:07</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">32.92%</span>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Detection #2</p>
                      <p className="text-xs text-gray-500">2025-09-06 18:52:15</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">46.97%</span>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Recommendations
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Schedule Collection</p>
                  <p className="text-sm text-gray-600">Plan immediate collection for the detected overflow area</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Monitor Confidence Trend</p>
                  <p className="text-sm text-gray-600">Confidence increased from 32.92% to 46.97% - continue monitoring</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Update Collection Routes</p>
                  <p className="text-sm text-gray-600">Include this location in regular collection schedule</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Detection Performance chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Detection Performance</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Garbage overflow detection metrics chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Detection Activities</h3>
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
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">Confidence: {activity.confidence}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              activity.status === 'LOW_OVERFLOW' ? 'bg-green-100 text-green-800' :
                              activity.status === 'MEDIUM_OVERFLOW' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {activity.status.replace('_', ' ')}
                            </span>
                          </div>
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
                Plan collection for overflow areas
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
                Detection Report
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate overflow detection report
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
                View Heatmap
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Check overflow locations on map
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-red-50 text-red-700 ring-4 ring-white">
                <AlertTriangle className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Alert Management
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage overflow alerts
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}