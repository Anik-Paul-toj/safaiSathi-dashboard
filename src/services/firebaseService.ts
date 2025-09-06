import { collection, getDocs, query, orderBy, limit, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ModelResult, ModelResultsResponse, AreaData } from '@/types/garbage-detection';

export class FirebaseService {
  /**
   * Fetch all documents from the model_results collection
   */
  static async fetchModelResults(): Promise<ModelResultsResponse> {
    try {
      const modelResultsRef = collection(db, 'model_results');
      const q = query(modelResultsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const results: ModelResult[] = [];
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        
        // Extract location object fields
        const location = data.location || {};
        
        // Handle confidence_scores array - calculate average if it's an array
        let confidenceScore = 0;
        if (data.confidence_scores && Array.isArray(data.confidence_scores)) {
          // Calculate average of confidence_scores array
          const sum = data.confidence_scores.reduce((acc: number, score: number) => acc + score, 0);
          confidenceScore = data.confidence_scores.length > 0 ? sum / data.confidence_scores.length : 0;
        } else if (data.confidence_score) {
          // Fallback to single confidence_score if array doesn't exist
          confidenceScore = data.confidence_score;
        }
        
        results.push({
          id: doc.id,
          latitude: location.latitude || data.latitude || 0,
          longitude: location.longitude || data.longitude || 0,
          confidence_score: confidenceScore,
          accuracy: location.accuracy || data.accuracy || 0,
          address: location.address || data.address || 'Unknown Address',
          timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
          model_version: data.model_version,
          image_url: data.image_url
        });
      });

      // Calculate average confidence
      const averageConfidence = results.length > 0 
        ? results.reduce((sum, result) => sum + result.confidence_score, 0) / results.length
        : 0;


      return {
        results,
        totalCount: results.length,
        averageConfidence,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching model results:', error);
      throw new Error('Failed to fetch model results from Firebase');
    }
  }

  /**
   * Fetch unique areas from model results
   */
  static async fetchUniqueAreas(): Promise<AreaData[]> {
    try {
      const modelResultsRef = collection(db, 'model_results');
      const q = query(modelResultsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const areaMap = new Map<string, { count: number; latestDetection: string }>();
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        const location = data.location || {};
        const address = location.address || data.address || 'Unknown Address';
        
        // Extract area from address (you can modify this logic based on your address format)
        const area = this.extractAreaFromAddress(address);
        
        if (areaMap.has(area)) {
          const existing = areaMap.get(area)!;
          areaMap.set(area, {
            count: existing.count + 1,
            latestDetection: existing.latestDetection > (data.createdAt || data.timestamp) 
              ? existing.latestDetection 
              : (data.createdAt || data.timestamp)
          });
        } else {
          areaMap.set(area, {
            count: 1,
            latestDetection: data.createdAt || data.timestamp || new Date().toISOString()
          });
        }
      });

      // Convert map to array and sort by detection count
      return Array.from(areaMap.entries())
        .map(([area, data]) => ({
          area,
          count: data.count,
          latestDetection: data.latestDetection
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching unique areas:', error);
      throw new Error('Failed to fetch unique areas from Firebase');
    }
  }

  /**
   * Extract area name from address string
   */
  private static extractAreaFromAddress(address: string): string {
    // Split address by comma and take the first meaningful part
    const parts = address.split(',').map(part => part.trim());
    
    // Look for common area indicators
    for (const part of parts) {
      if (part && 
          !part.includes('India') && 
          !part.includes('West Bengal') && 
          !part.includes('North 24 Parganas') &&
          !part.includes('Barrackpore') &&
          !part.match(/^\d+$/) && // Not just numbers
          part.length > 2) {
        return part;
      }
    }
    
    // Fallback to first non-empty part
    return parts.find(part => part && part.length > 2) || 'Unknown Area';
  }

  /**
   * Fetch model results for a specific area
   */
  static async fetchModelResultsByArea(area: string): Promise<ModelResultsResponse> {
    try {
      const modelResultsRef = collection(db, 'model_results');
      const q = query(modelResultsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const results: ModelResult[] = [];
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        const location = data.location || {};
        const address = location.address || data.address || 'Unknown Address';
        
        // Check if this result belongs to the specified area
        if (this.extractAreaFromAddress(address) === area) {
          // Handle confidence_scores array - calculate average if it's an array
          let confidenceScore = 0;
          if (data.confidence_scores && Array.isArray(data.confidence_scores)) {
            const sum = data.confidence_scores.reduce((acc: number, score: number) => acc + score, 0);
            confidenceScore = data.confidence_scores.length > 0 ? sum / data.confidence_scores.length : 0;
          } else if (data.confidence_score) {
            confidenceScore = data.confidence_score;
          }
          
          results.push({
            id: doc.id,
            latitude: location.latitude || data.latitude || 0,
            longitude: location.longitude || data.longitude || 0,
            confidence_score: confidenceScore,
            accuracy: location.accuracy || data.accuracy || 0,
            address: address,
            timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
            model_version: data.model_version,
            image_url: data.image_url
          });
        }
      });

      // Calculate average confidence
      const averageConfidence = results.length > 0 
        ? results.reduce((sum, result) => sum + result.confidence_score, 0) / results.length
        : 0;

      return {
        results,
        totalCount: results.length,
        averageConfidence,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching model results by area:', error);
      throw new Error('Failed to fetch model results by area from Firebase');
    }
  }

  /**
   * Fetch model results with pagination
   */
  static async fetchModelResultsPaginated(
    pageSize: number = 100
  ): Promise<ModelResultsResponse> {
    try {
      const modelResultsRef = collection(db, 'model_results');
      const q = query(
        modelResultsRef, 
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);
      const results: ModelResult[] = [];
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        
        // Extract location object fields
        const location = data.location || {};
        
        // Handle confidence_scores array - calculate average if it's an array
        let confidenceScore = 0;
        if (data.confidence_scores && Array.isArray(data.confidence_scores)) {
          // Calculate average of confidence_scores array
          const sum = data.confidence_scores.reduce((acc: number, score: number) => acc + score, 0);
          confidenceScore = data.confidence_scores.length > 0 ? sum / data.confidence_scores.length : 0;
        } else if (data.confidence_score) {
          // Fallback to single confidence_score if array doesn't exist
          confidenceScore = data.confidence_score;
        }
        
        results.push({
          id: doc.id,
          latitude: location.latitude || data.latitude || 0,
          longitude: location.longitude || data.longitude || 0,
          confidence_score: confidenceScore,
          accuracy: location.accuracy || data.accuracy || 0,
          address: location.address || data.address || 'Unknown Address',
          timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
          model_version: data.model_version,
          image_url: data.image_url
        });
      });

      const averageConfidence = results.length > 0 
        ? results.reduce((sum, result) => sum + result.confidence_score, 0) / results.length
        : 0;


      return {
        results,
        totalCount: results.length,
        averageConfidence,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching paginated model results:', error);
      throw new Error('Failed to fetch paginated model results from Firebase');
    }
  }
}
