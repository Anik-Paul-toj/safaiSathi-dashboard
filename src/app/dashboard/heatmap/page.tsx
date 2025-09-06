'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Activity, TrendingUp, RefreshCw, Map, Satellite, AlertCircle } from 'lucide-react';
import { ModelResult, ModelResultsResponse } from '@/types/garbage-detection';
import { FirebaseService } from '@/services/firebaseService';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import '@/styles/leaflet.css';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const LayerGroup = dynamic(
  () => import('react-leaflet').then((mod) => mod.LayerGroup),
  { ssr: false }
);

const GeodesicAreasLayer = dynamic(
  () => import('@/components/GeodesicAreasLayer'),
  { ssr: false }
);




// Default center coordinates (will be overridden by actual data bounds)
const DEFAULT_CENTER = [22.5726, 88.3639] as [number, number];

// Tile layer configurations
const TILE_LAYERS = {
  terrain: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 10,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    minZoom: 10,
  },
  satelliteWithLabels: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    minZoom: 10,
  }
};


// Function to calculate map center from data points
const calculateMapCenter = (results: ModelResult[]): [number, number] => {
  if (results.length === 0) return DEFAULT_CENTER;
  
  const validResults = results.filter(r => r.latitude && r.longitude && r.latitude !== 0 && r.longitude !== 0);
  if (validResults.length === 0) return DEFAULT_CENTER;
  
  const avgLat = validResults.reduce((sum, r) => sum + r.latitude, 0) / validResults.length;
  const avgLng = validResults.reduce((sum, r) => sum + r.longitude, 0) / validResults.length;
  
  return [avgLat, avgLng];
};

type MapType = 'terrain' | 'satellite' | 'satelliteWithLabels';

export default function HeatmapPage() {
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [mapType, setMapType] = useState<MapType>('terrain');
  const [showLabels, setShowLabels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDataPoints, setTotalDataPoints] = useState(0);
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // Auto-refresh data every 30 seconds to keep it live
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize heatmap data from Firebase
  useEffect(() => {
    const loadHeatmapData = async () => {
      setIsLoading(true);
      setMapLoaded(false);
      setError(null);
      
      try {
        const response: ModelResultsResponse = await FirebaseService.fetchModelResults();
        setModelResults(response.results);
        setTotalDataPoints(response.totalCount);
        setAverageConfidence(response.averageConfidence);
        
        // Calculate map center from actual data
        const center = calculateMapCenter(response.results);
        setMapCenter(center);
        
        setLastUpdated(new Date());
        setIsLoading(false);
        // Give map time to render
        setTimeout(() => setMapLoaded(true), 500);
      } catch (err) {
        console.error('Error loading heatmap data:', err);
        setError('Failed to load data from Firebase. Please try again.');
        setIsLoading(false);
      }
    };

    loadHeatmapData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    setMapLoaded(false);
    setError(null);
    
    try {
      const response: ModelResultsResponse = await FirebaseService.fetchModelResults();
      setModelResults(response.results);
      setTotalDataPoints(response.totalCount);
      setAverageConfidence(response.averageConfidence);
      
      // Calculate map center from actual data
      const center = calculateMapCenter(response.results);
      setMapCenter(center);
      
      setLastUpdated(new Date());
      setIsLoading(false);
      // Give map time to render
      setTimeout(() => setMapLoaded(true), 500);
    } catch (err) {
      console.error('Error refreshing heatmap data:', err);
      setError('Failed to refresh data from Firebase. Please try again.');
      setIsLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Data Points',
      value: totalDataPoints.toString(),
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Average Intensity',
      value: averageConfidence.toFixed(2),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Max Intensity',
      value: modelResults.length > 0 
        ? Math.max(...modelResults.map(result => result.confidence_score)).toFixed(2)
        : '0.00',
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
          <h1 className="text-3xl font-bold text-gray-900">Garbage Detection Heatmap</h1>
          <p className="text-gray-600 mt-1">
            Live garbage detection intensity map from Firebase model results (auto-updates every 30s)
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

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
          <h2 className="text-xl font-semibold text-gray-900">Garbage Detection Map</h2>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()} • {totalDataPoints} detection points from Firestore
          </p>
        </div>
        
        <div className="h-96 w-full relative overflow-hidden rounded-b-lg bg-gray-100">
          {isLoading ? (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading garbage detection data from Firebase...</p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full relative">
              {/* Map Loading Overlay */}
              {!mapLoaded && (
                <div className="absolute inset-0 map-loading-overlay flex items-center justify-center z-10 rounded-b-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Rendering map...</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gray-100 rounded-b-lg">
                {/* Map Type Toggle Overlay */}
                <div className="absolute top-4 right-4 z-20 space-y-2">
                  {/* Map Type Toggle */}
                  <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setMapType('terrain')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        mapType === 'terrain'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Map className="h-4 w-4" />
                      <span className="text-sm font-medium">Terrain</span>
                    </button>
                    <button
                      onClick={() => setMapType('satellite')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        mapType === 'satellite'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Satellite className="h-4 w-4" />
                      <span className="text-sm font-medium">Satellite</span>
                    </button>
                    <button
                      onClick={() => {
                        setMapType('satelliteWithLabels');
                        setShowLabels(true);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        mapType === 'satelliteWithLabels'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Satellite className="h-4 w-4" />
                      <span className="text-sm font-medium">Hybrid</span>
                    </button>
                  </div>
                  
                  {/* Labels Toggle (only show for satellite view, not hybrid) */}
                  {mapType === 'satellite' && (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                      <button
                        onClick={() => setShowLabels(!showLabels)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors w-full ${
                          showLabels
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {showLabels ? 'Hide Labels' : 'Show Labels'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ 
                    height: '100%', 
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1
                  }}
                  className="rounded-b-lg"
                  zoomControl={true}
                  scrollWheelZoom={true}
                  doubleClickZoom={true}
                  dragging={true}
                  touchZoom={true}
                  whenReady={() => {
                    // Map is ready, but give it a moment to fully render
                    setTimeout(() => setMapLoaded(true), 300);
                  }}
                >
                  <LayerGroup>
                    {/* Base layer */}
                    <TileLayer
                      key={`${mapType}-base`}
                      url={TILE_LAYERS[mapType].url}
                      attribution={TILE_LAYERS[mapType].attribution}
                      maxZoom={TILE_LAYERS[mapType].maxZoom}
                      minZoom={TILE_LAYERS[mapType].minZoom}
                    />
                    
                    {/* Labels layer for satellite views */}
                    {(mapType === 'satellite' || mapType === 'satelliteWithLabels') && showLabels && (
                      <TileLayer
                        key={`${mapType}-labels`}
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                        attribution="&copy; <a href='https://www.esri.com/'>Esri</a>"
                        maxZoom={19}
                        minZoom={10}
                        opacity={0.8}
                      />
                    )}
                  </LayerGroup>
                  
                  {/* Geodesic Areas Layer */}
                  {mapLoaded && modelResults.length > 0 && (
                    <GeodesicAreasLayer results={modelResults} />
                  )}
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Intensity Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600">High (80-100%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span className="text-sm text-gray-600">Medium-High (60-80%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-gray-600">Medium (40-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-lime-500 rounded"></div>
            <span className="text-sm text-gray-600">Low (20-40%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-sm text-gray-600">Very Low (0-20%)</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          The map shows garbage detection intensity levels from your Firebase data. 
          Each colored circle represents a detection area with radius based on GPS accuracy (100-200m).
          Red areas indicate high intensity detections, while green areas show lower intensity.
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Map Features:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Colored Circles:</strong> Detection areas with intensity-based coloring</li>
            <li>• <strong>Circle Size:</strong> Based on GPS accuracy (100-200m radius)</li>
            <li>• <strong>Tooltips:</strong> Hover over circles to see confidence, accuracy, and address</li>
            <li>• <strong>Popups:</strong> Click circles for detailed information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
