import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import SkillsLibrary from './components/SkillsLibrary';
import ExerciseLibrary from './components/ExerciseLibrary';
import StretchingRoutines from './components/StretchingRoutines';
import VideoLearning from './components/VideoLearning';
import DribbleMoves from './components/DribbleMoves';
import Progress from './components/Progress';
import OfflineStatus from './components/OfflineStatus';
import offlineService from './services/offlineService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Initialize offline service and cache app data
    const initializeOffline = async () => {
      try {
        // Import and cache app data
        const { skills, exercises } = await import('./data/basketballData');
        let stretches: any[] = [];
        try {
          const stretchData = await import('./data/basketballData');
          stretches = stretchData.stretches || [];
        } catch (error) {
          console.log('Stretches data not available');
        }

        // Cache the data for offline use
        await offlineService.cacheAppData({
          drills: skills,
          exercises: exercises,
          stretches: stretches
        });

        // Save to offline storage
        offlineService.saveOfflineData('skills', skills);
        offlineService.saveOfflineData('exercises', exercises);
        offlineService.saveOfflineData('stretches', stretches);

        console.log('App data cached for offline use');
      } catch (error) {
        console.error('Error caching app data:', error);
      }
    };

    initializeOffline();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'progress':
        return <Progress />;
      case 'planner':
        return <Planner />;
      case 'skills':
        return <SkillsLibrary />;
      case 'exercises':
        return <ExerciseLibrary />;
      case 'stretches':
        return <StretchingRoutines />;
      case 'videos':
        return <VideoLearning />;
      case 'dribbles':
        return <DribbleMoves />;
      case 'progress':
        return <Progress />;
      default:
        return <Progress />;
    }
  };

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