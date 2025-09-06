import { collection, getDocs, query, orderBy, limit, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ModelResult, ModelResultsResponse } from '@/types/garbage-detection';

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
   * Fetch model results with pagination
   */
  static async fetchModelResultsPaginated(
    pageSize: number = 100,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
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
