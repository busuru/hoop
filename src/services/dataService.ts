import offlineService from './offlineService';

export interface DataResponse<T> {
  data: T;
  offline: boolean;
  timestamp: Date;
}

class DataService {
  private cache = new Map<string, DataResponse<any>>();

  // Fetch data with offline fallback
  async fetchData<T>(key: string, fetchFn: () => Promise<T>): Promise<DataResponse<T>> {
    try {
      // Try to fetch fresh data
      const data = await fetchFn();
      const response: DataResponse<T> = {
        data,
        offline: false,
        timestamp: new Date()
      };

      // Cache the response
      this.cache.set(key, response);
      offlineService.saveOfflineData(key, response);

      return response;
    } catch (error) {
      console.log(`Network failed for ${key}, trying offline data`);
      
      // Try to get cached data
      const cached = this.getCachedData<T>(key);
      if (cached) {
        return {
          ...cached,
          offline: true
        };
      }

      // Return empty data if nothing is cached
      throw new Error(`No data available for ${key}`);
    }
  }

  // Get cached data
  getCachedData<T>(key: string): DataResponse<T> | null {
    // Try memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key) as DataResponse<T>;
    }

    // Try offline storage
    const offlineData = offlineService.getOfflineData(key);
    if (offlineData) {
      const response: DataResponse<T> = {
        data: offlineData.data,
        offline: true,
        timestamp: new Date(offlineData.timestamp)
      };
      this.cache.set(key, response);
      return response;
    }

    return null;
  }

  // Check if data is stale
  isDataStale(key: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    const cached = this.getCachedData(key);
    if (!cached) return true;

    const age = Date.now() - cached.timestamp.getTime();
    return age > maxAge;
  }

  // Clear cache for specific key
  clearCache(key: string): void {
    this.cache.delete(key);
    offlineService.clearOfflineData(key);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
    offlineService.clearOfflineData();
  }

  // Get cache info
  getCacheInfo(): { keys: string[]; size: number } {
    return {
      keys: Array.from(this.cache.keys()),
      size: this.cache.size
    };
  }

  // Preload data for offline use
  async preloadData<T>(key: string, fetchFn: () => Promise<T>): Promise<void> {
    try {
      const data = await fetchFn();
      const response: DataResponse<T> = {
        data,
        offline: false,
        timestamp: new Date()
      };

      this.cache.set(key, response);
      offlineService.saveOfflineData(key, response);
      
      console.log(`Data preloaded for ${key}`);
    } catch (error) {
      console.error(`Failed to preload data for ${key}:`, error);
    }
  }

  // Batch preload multiple data sources
  async preloadMultipleData(dataSources: Array<{ key: string; fetchFn: () => Promise<any> }>): Promise<void> {
    const promises = dataSources.map(({ key, fetchFn }) => 
      this.preloadData(key, fetchFn)
    );

    await Promise.allSettled(promises);
  }
}

// Create singleton instance
export const dataService = new DataService();

// Export for use in components
export default dataService; 