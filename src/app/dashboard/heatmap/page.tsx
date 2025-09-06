'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { HeatmapPoint } from '@/types/heatmap';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const HeatmapLayer = dynamic(
  () => import('@/components/HeatmapLayer'),
  { ssr: false }
);


// Kolkata coordinates (center of the city)
const KOLKATA_CENTER = [22.5726, 88.3639] as [number, number];

// Generate random heatmap data points around Kolkata
const generateRandomHeatmapData = (): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  const numPoints = 50;
  
  for (let i = 0; i < numPoints; i++) {
    // Generate points within Kolkata's approximate boundaries
    const lat = 22.5726 + (Math.random() - 0.5) * 0.3; // ±0.15 degrees
    const lng = 88.3639 + (Math.random() - 0.5) * 0.3; // ±0.15 degrees
    const intensity = Math.random() * 100; // Random intensity 0-100
    
    points.push({ lat, lng, intensity });
  }
  
  return points;
};

export default function HeatmapPage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Initialize heatmap data
  useEffect(() => {
    const loadHeatmapData = () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setHeatmapData(generateRandomHeatmapData());
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 1000);
    };

    loadHeatmapData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHeatmapData(generateRandomHeatmapData());
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const stats = [
    {
      name: 'Total Data Points',
      value: heatmapData.length.toString(),
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Average Intensity',
      value: heatmapData.length > 0 
        ? (heatmapData.reduce((sum, point) => sum + point.intensity, 0) / heatmapData.length).toFixed(1)
        : '0',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Max Intensity',
      value: heatmapData.length > 0 
        ? Math.max(...heatmapData.map(point => point.intensity)).toFixed(1)
        : '0',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Heatmap Analytics</h1>
          <p className="text-gray-600 mt-1">
            Real-time waste collection intensity map for Kolkata
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kolkata Heatmap</h2>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="h-96 w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading heatmap data...</p>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <MapContainer
                center={KOLKATA_CENTER}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Heatmap Layer */}
                <HeatmapLayer
                  points={heatmapData}
                  radius={20}
                  max={100}
                  minOpacity={0.3}
                  blur={15}
                  gradient={{
                    0.4: 'blue',
                    0.6: 'cyan',
                    0.7: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                  }}
                />
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Heatmap Legend</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Low Intensity (0-40)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Medium Intensity (40-70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">High Intensity (70-100)</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          The heatmap shows waste collection intensity across different areas of Kolkata. 
          Red areas indicate high collection activity, while blue areas show lower activity.
        </p>
      </div>
    </div>
  );
}
