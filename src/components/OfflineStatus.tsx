import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Trash2,
  Info
} from 'lucide-react';
import offlineService, { OfflineStatus as OfflineStatusType, SyncMessage } from '../services/offlineService';

const OfflineStatus: React.FC = () => {
  const [status, setStatus] = useState<OfflineStatusType>(offlineService.getStatus());
  const [showDetails, setShowDetails] = useState(false);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Listen for status changes
    const statusListener = (newStatus: OfflineStatusType) => {
      setStatus(newStatus);
    };

    // Listen for sync messages
    const syncListener = (message: SyncMessage) => {
      if (message.message) {
        setSyncMessage(message.message);
        setTimeout(() => setSyncMessage(null), 3000);
      }
    };

    // Listen for install prompt
    const handleBeforeInstallPrompt = () => {
      setShowInstallPrompt(true);
    };

    offlineService.addStatusListener(statusListener);
    offlineService.addSyncListener(syncListener);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Get initial cache size
    updateCacheSize();

    return () => {
      offlineService.removeStatusListener(statusListener);
      offlineService.removeSyncListener(syncListener);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const updateCacheSize = async () => {
    const size = await offlineService.getCacheSize();
    setCacheSize(size);
  };

  const handleInstall = async () => {
    const success = await offlineService.installApp();
    if (success) {
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = async () => {
    await offlineService.updateApp();
  };

  const handleClearCache = async () => {
    await offlineService.clearCache();
    await updateCacheSize();
  };

  const handleSync = async () => {
    await offlineService.triggerBackgroundSync();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatLastSync = (date: Date | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <>
      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2">
          {/* Online/Offline Indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg ${
            status.isOnline 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {status.isOnline ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {status.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Install Prompt */}
          {showInstallPrompt && !status.isInstalled && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg shadow-lg border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Install</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-200 transition-colors"
            title="Offline Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Message Toast */}
      {syncMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-800 rounded-lg shadow-lg border border-blue-200">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{syncMessage}</span>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Offline Settings</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Connection Status</span>
                  <div className={`flex items-center gap-2 ${
                    status.isOnline ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status.isOnline ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {status.isOnline ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">App Installation</span>
                  <div className={`flex items-center gap-2 ${
                    status.isInstalled ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {status.isInstalled ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {status.isInstalled ? 'Installed' : 'Not Installed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Sync</span>
                  <span className="text-sm text-gray-600">
                    {formatLastSync(status.lastSync)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Cache Size</span>
                  <span className="text-sm text-gray-600">
                    {formatBytes(cacheSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Pending Changes</span>
                  <span className="text-sm text-gray-600">
                    {status.pendingChanges}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {showInstallPrompt && !status.isInstalled && (
                  <button
                    onClick={handleInstall}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Install App
                  </button>
                )}

                <button
                  onClick={handleSync}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </button>

                <button
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </button>
              </div>

              {/* Offline Features Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Offline Features</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• View all drills and exercises</li>
                  <li>• Access training planner</li>
                  <li>• Use timers and trackers</li>
                  <li>• Save progress locally</li>
                  <li>• Receive notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineStatus; 