'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { HeatmapPoint, HeatmapConfig } from '@/types/heatmap';

// Install leaflet.heat plugin
import 'leaflet.heat';

interface HeatmapLayerProps extends HeatmapConfig {
  points: HeatmapPoint[];
}

export default function HeatmapLayer({ 
  points, 
  radius = 20, 
  max = 100, 
  minOpacity = 0.3, 
  blur = 15,
  gradient 
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    // Convert points to the format expected by leaflet.heat
    const heatmapPoints = points.map(point => [
      point.lat,
      point.lng,
      point.intensity / max // Normalize intensity
    ]);

    // Create heatmap layer
    const heatmapLayer = (L as any).heatLayer(heatmapPoints, {
      radius,
      max,
      minOpacity,
      blur,
      gradient
    });

    // Add to map
    heatmapLayer.addTo(map);

    // Cleanup function
    return () => {
      map.removeLayer(heatmapLayer);
    };
  }, [map, points, radius, max, minOpacity, blur, gradient]);

  return null;
}
