import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Tip {
  id: number;
  title: string;
  content: string;
  category: 'shooting' | 'defense' | 'dribbling' | 'conditioning' | 'general';
  level: 'beginner' | 'intermediate' | 'advanced';
}

const TIPS: Tip[] = [
  {
    id: 1,
    title: 'Perfect Your Shooting Form',
    content: 'Keep your elbow under the ball and follow through with your wrist for better accuracy.',
    category: 'shooting',
    level: 'beginner'
  },
  {
    id: 2,
    title: 'Defensive Stance',
    content: 'Stay on the balls of your feet with knees bent and hands active to react quickly.',
    category: 'defense',
    level: 'beginner'
  },
  {
    id: 3,
    title: 'Ball Handling Drills',
    content: 'Practice dribbling with your head up to improve court awareness.',
    category: 'dribbling',
    level: 'intermediate'
  },
  {
    id: 4,
    title: 'Conditioning',
    content: 'Incorporate interval training to improve your on-court endurance.',
    category: 'conditioning',
    level: 'intermediate'
  },
  {
    id: 5,
    title: 'Mental Preparation',
    content: 'Visualize successful plays to improve in-game decision making.',
    category: 'general',
    level: 'advanced'
  }
];

export const getTodaysTip = (): Tip => {
  // Get a consistent tip for the day based on the date
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const tipIndex = dayOfYear % TIPS.length;
  
  // Check if we have a cached tip for today
  const lastTipDate = localStorage.getItem('lastTipDate');
  const lastTipId = localStorage.getItem('lastTipId');
  
  if (lastTipDate === now.toDateString() && lastTipId) {
    const cachedTip = TIPS.find(tip => tip.id === parseInt(lastTipId));
    if (cachedTip) return cachedTip;
  }
  
  // Get a new tip for today
  const tip = TIPS[tipIndex];
  
  // Cache the tip for today
  localStorage.setItem('lastTipDate', now.toDateString());
  localStorage.setItem('lastTipId', tip.id.toString());
  
  return tip;
};

const CoachTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<Tip>(getTodaysTip());
  const [showAllTips, setShowAllTips] = useState(false);
  const [tips, setTips] = useState<Tip[]>(TIPS);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shooting': return 'bg-orange-100 text-orange-800';
      case 'defense': return 'bg-blue-100 text-blue-800';
      case 'dribbling': return 'bg-green-100 text-green-800';
      case 'conditioning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-yellow-800 mb-1">Tip of the Day</h4>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(currentTip.category)}`}>
                  {currentTip.category.charAt(0).toUpperCase() + currentTip.category.slice(1)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(currentTip.level)}`}>
                  {currentTip.level.charAt(0).toUpperCase() + currentTip.level.slice(1)}
                </span>
              </div>
            </div>
            <h5 className="font-medium text-yellow-900 mb-1">{currentTip.title}</h5>
            <p className="text-yellow-700 text-sm">{currentTip.content}</p>
          </div>
        </div>
      </div>
      
      {showAllTips && (
        <div className="mt-4 space-y-3">
          <h5 className="text-sm font-medium text-gray-700">More Tips</h5>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {tips.filter(tip => tip.id !== currentTip.id).map((tip) => (
              <div 
                key={tip.id} 
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-yellow-300 cursor-pointer transition-colors"
                onClick={() => setCurrentTip(tip)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{tip.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(tip.category)}`}>
                    {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowAllTips(!showAllTips)}
        className="text-xs text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
      >
        {showAllTips ? (
          <>
            <ChevronLeft size={14} /> Hide Tips
          </>
        ) : (
          'View All Tips'
        )}
      </button>
    </div>
  );
};

export default CoachTips;
