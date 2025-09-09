import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import OfflineStatus from './components/OfflineStatus';
import offlineService from './services/offlineService';

// Lazy load components to avoid initial load issues
const Planner = React.lazy(() => import('./components/Planner'));
const SkillsLibrary = React.lazy(() => import('./components/SkillsLibrary'));
const ExerciseLibrary = React.lazy(() => import('./components/ExerciseLibrary'));
const StretchingRoutines = React.lazy(() => import('./components/StretchingRoutines'));
const VideoLearning = React.lazy(() => import('./components/VideoLearning'));

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App component mounted');
    
    // Initialize offline service and cache app data
    const initializeOffline = async () => {
      try {
        console.log('Initializing app...');
        setLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize app');
        setLoading(false);
      }
    };

    initializeOffline();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Basketball Trainer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 font-semibold mb-2">Something went wrong</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'progress':
          return <Progress />;
        case 'planner':
          return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading Planner...</div>}>
              <Planner />
            </React.Suspense>
          );
        case 'skills':
          return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading Skills...</div>}>
              <SkillsLibrary />
            </React.Suspense>
          );
        case 'exercises':
          return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading Exercises...</div>}>
              <ExerciseLibrary />
            </React.Suspense>
          );
        case 'stretches':
          return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading Stretches...</div>}>
              <StretchingRoutines />
            </React.Suspense>
          );
        case 'videos':
          return (
            <React.Suspense fallback={<div className="p-8 text-center">Loading Videos...</div>}>
              <VideoLearning />
            </React.Suspense>
          );
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-8 text-center">
          <p className="text-red-600">Error loading content. Please try again.</p>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
  };

  console.log('Rendering App with activeTab:', activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      <OfflineStatus />
    </div>
  );
}

export default App;