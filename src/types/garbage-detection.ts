// Garbage overflow detection data types

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: string;
  address: string;
  source: 'GPS' | 'MANUAL' | 'ESTIMATED';
  timestamp: string;
}

export interface DetectionSummary {
  total_detections: number;
  average_confidence: number;
  max_confidence: number;
  min_confidence: number;
  overflow_score: number;
  detection_frequency: number;
  status: 'LOW_OVERFLOW' | 'MEDIUM_OVERFLOW' | 'HIGH_OVERFLOW' | 'CRITICAL_OVERFLOW';
}

export interface RecentDetection {
  timestamp: string;
  detection_count: number;
  confidence_scores: number[];
  average_confidence: number;
  location: {
    source: string;
    latitude: number;
    longitude: number;
    city: string | null;
    country: string | null;
    address: string;
  };
}

export interface GarbageOverflowReport {
  timestamp: string;
  gps_location: GPSLocation;
  detection_summary: DetectionSummary;
  recent_detections: RecentDetection[];
}

// Dashboard-specific data types
export interface DashboardStats {
  totalDetections: number;
  averageConfidence: number;
  overflowScore: number;
  detectionFrequency: number;
  status: string;
  totalCollections: number;
  collectionRate: number;
  activeRoutes: number;
  tonsCollected: number;
}

export interface DashboardActivity {
  id: string;
  timestamp: string;
  detectionCount: number;
  averageConfidence: number;
  status: string;
  area: string;
  action: string;
  timeAgo: string;
}

// Heatmap-specific data types
export interface HeatmapDetectionPoint {
  lat: number;
  lng: number;
  intensity: number; // Based on overflow_score or confidence
  timestamp: string;
  address: string;
  detectionCount: number;
  averageConfidence: number;
  overflowScore: number;
  status: string;
}

export interface HeatmapData {
  points: HeatmapDetectionPoint[];
  totalDataPoints: number;
  averageIntensity: number;
  maxIntensity: number;
  lastUpdated: string;
}

// Analytics-specific data types
export interface DailyDetectionData {
  date: string;
  detections: number;
  averageConfidence: number;
  overflowScore: number;
  status: string;
}

export interface AreaStats {
  area: string;
  detections: number;
  averageConfidence: number;
  status: string;
  lastDetection: string;
}

export interface AnalyticsData {
  dailyDetections: DailyDetectionData[];
  areaStats: AreaStats[];
  collectionEfficiency: number;
  recyclingRate: number;
  wasteCollected: number;
  totalActiveAreas: number;
}

// API response types
export interface GarbageDetectionApiResponse {
  reports: GarbageOverflowReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  lastUpdated: string;
}

export interface DashboardApiResponse {
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
  lastUpdated: string;
}

export interface HeatmapApiResponse {
  data: HeatmapData;
  lastUpdated: string;
}

export interface AnalyticsApiResponse {
  data: AnalyticsData;
  lastUpdated: string;
}

// Filter and query types
export interface DetectionFilters {
  status?: 'LOW_OVERFLOW' | 'MEDIUM_OVERFLOW' | 'HIGH_OVERFLOW' | 'CRITICAL_OVERFLOW' | 'All';
  dateRange?: {
    start: string;
    end: string;
  };
  area?: string;
  minConfidence?: number;
  maxConfidence?: number;
}

export interface HeatmapFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  minIntensity?: number;
  maxIntensity?: number;
  area?: string;
}
