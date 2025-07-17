export interface OfflineStatus {
  isOnline: boolean;
  isInstalled: boolean;
  lastSync: Date | null;
  pendingChanges: number;
}

export interface SyncMessage {
  type: 'SYNC_STARTED' | 'SYNC_COMPLETE' | 'NAVIGATE' | 'UPDATE_AVAILABLE';
  message?: string;
  url?: string;
}

class OfflineService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isOnline = navigator.onLine;
  private listeners: ((status: OfflineStatus) => void)[] = [];
  private syncListeners: ((message: SyncMessage) => void)[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));

    // Check if running in StackBlitz environment
    const isStackBlitz = window.self !== window.top && 
                        (window.location.hostname.includes('stackblitz') || 
                         window.location.hostname.includes('webcontainer'));

    // Register service worker
    if ('serviceWorker' in navigator && !isStackBlitz) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

        // Check for updates
        this.swRegistration.addEventListener('updatefound', () => {
          console.log('Service Worker update found');
          this.syncListeners.forEach(listener => listener({
            type: 'UPDATE_AVAILABLE',
            message: 'A new version is available'
          }));
        });

        // Handle service worker state changes
        this.swRegistration.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed');
          window.location.reload();
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else if (isStackBlitz) {
      console.log('Service Worker registration skipped in StackBlitz environment');
    }

    // Initial status update
    this.updateStatus();
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    this.updateStatus();
    
    if (isOnline && this.swRegistration) {
      // Trigger background sync when coming back online
      this.triggerBackgroundSync();
    }
  }

  private updateStatus() {
    const status: OfflineStatus = {
      isOnline: this.isOnline,
      isInstalled: this.isInstalled(),
      lastSync: this.getLastSync(),
      pendingChanges: this.getPendingChanges()
    };

    this.listeners.forEach(listener => listener(status));
  }

  private handleServiceWorkerMessage(data: SyncMessage) {
    console.log('Service Worker message received:', data);
    this.syncListeners.forEach(listener => listener(data));

    if (data.type === 'SYNC_COMPLETE') {
      this.setLastSync(new Date());
      this.updateStatus();
    }
  }

  // Public methods
  public getStatus(): OfflineStatus {
    return {
      isOnline: this.isOnline,
      isInstalled: this.isInstalled(),
      lastSync: this.getLastSync(),
      pendingChanges: this.getPendingChanges()
    };
  }

  public addStatusListener(listener: (status: OfflineStatus) => void) {
    this.listeners.push(listener);
    // Immediately call with current status
    listener(this.getStatus());
  }

  public removeStatusListener(listener: (status: OfflineStatus) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  public addSyncListener(listener: (message: SyncMessage) => void) {
    this.syncListeners.push(listener);
  }

  public removeSyncListener(listener: (message: SyncMessage) => void) {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  public async installApp(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const prompt = await this.getInstallPrompt();
      if (prompt) {
        await prompt.prompt();
        const result = await prompt.userChoice;
        return result.outcome === 'accepted';
      }
      return false;
    } catch (error) {
      console.error('Install failed:', error);
      return false;
    }
  }

  public async updateApp(): Promise<void> {
    if (this.swRegistration && this.swRegistration.waiting) {
      // Send message to service worker to skip waiting
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  public async cacheAppData(data: any): Promise<void> {
    if (this.swRegistration && this.swRegistration.active) {
      this.swRegistration.active.postMessage({
        type: 'CACHE_DATA',
        data
      });
    }
  }

  public async triggerBackgroundSync(): Promise<void> {
    if (this.swRegistration && 'sync' in (this.swRegistration as any)) {
      try {
        await (this.swRegistration as any).sync.register('background-sync');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  public async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared');
    }
  }

  public async getCacheSize(): Promise<number> {
    if (!('caches' in window)) {
      return 0;
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  // Helper methods
  private isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  private getLastSync(): Date | null {
    const lastSync = localStorage.getItem('lastSync');
    return lastSync ? new Date(lastSync) : null;
  }

  private setLastSync(date: Date): void {
    localStorage.setItem('lastSync', date.toISOString());
  }

  private getPendingChanges(): number {
    const pending = localStorage.getItem('pendingChanges');
    return pending ? parseInt(pending, 10) : 0;
  }

  private setPendingChanges(count: number): void {
    localStorage.setItem('pendingChanges', count.toString());
  }

  private async getInstallPrompt(): Promise<any> {
    return new Promise((resolve) => {
      const checkPrompt = () => {
        const prompt = (window as any).deferredPrompt;
        if (prompt) {
          resolve(prompt);
        } else {
          setTimeout(checkPrompt, 100);
        }
      };
      checkPrompt();
    });
  }

  // Utility methods for offline data management
  public saveOfflineData(key: string, data: any): void {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  public getOfflineData(key: string): any {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error reading offline data:', error);
      return null;
    }
  }

  public clearOfflineData(key?: string): void {
    if (key) {
      localStorage.removeItem(`offline_${key}`);
    } else {
      // Clear all offline data
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('offline_')) {
          localStorage.removeItem(k);
        }
      });
    }
  }

  public getOfflineDataKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(k => k.startsWith('offline_'))
      .map(k => k.replace('offline_', ''));
  }

  public isDataStale(key: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const age = Date.now() - parsed.timestamp;
        return age > maxAge;
      }
      return true;
    } catch (error) {
      return true;
    }
  }
}

// Create singleton instance
export const offlineService = new OfflineService();

// Export for use in components
export default offlineService; 