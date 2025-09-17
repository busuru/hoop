import React, { useState } from 'react';
import { Play, ArrowLeft } from 'lucide-react';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { YouTubeVideo } from '../types';

interface ShootingDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ShootingCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: ShootingDrill[];
}

const categories: ShootingCategory[] = [
  {
    id: 'form-technique',
    name: 'Form & Technique',
    description: 'Build rock-solid mechanics and a consistent release',
    color: 'bg-orange-500',
    drills: [
      { id: 'shooting-form-beef', name: 'Form Shooting (BEEF)', description: 'Close-range focus on Balance, Eyes, Elbow, Follow-through', difficulty: 'beginner' },
      { id: 'shooting-one-hand-form', name: 'One-Hand Form Shot', description: 'Isolate release by removing guide hand', difficulty: 'beginner' },
      { id: 'shooting-wall-drill', name: 'Wall Shooting Drill', description: 'Use a wall target to refine arc and release', difficulty: 'beginner' },
      { id: 'shooting-one-knee-form', name: 'One-Knee Form Shooting', description: 'Kneel to isolate upper-body mechanics', difficulty: 'beginner' },
      { id: 'shooting-two-ball-form', name: 'Two-Ball Form Shooting', description: 'Alternate form shots with two balls', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'spot-shooting',
    name: 'Spot Shooting',
    description: 'Master accuracy from key spots around the arc',
    color: 'bg-blue-500',
    drills: [
      { id: 'shooting-five-spot', name: '5-Spot Shooting', description: 'Shoot and tally makes from five arc spots', difficulty: 'beginner' },
      { id: 'shooting-around-the-world', name: 'Around the World', description: 'Advance on make; repeat on miss', difficulty: 'intermediate' },
      { id: 'shooting-nike-54321', name: 'Nike 5-4-3-2-1 Drill', description: 'Decreasing makes per spot across the arc', difficulty: 'intermediate' },
      { id: 'shooting-corner-3', name: 'Corner 3 Drill', description: 'High-volume corner threes with game footwork', difficulty: 'advanced' }
    ]
  },
  {
    id: 'catch-and-shoot',
    name: 'Catch-and-Shoot',
    description: 'Quick, balanced releases off the catch',
    color: 'bg-green-500',
    drills: [
      { id: 'shooting-catch-and-shoot', name: 'Catch & Shoot Drill', description: 'Partner/self-pass into immediate release', difficulty: 'intermediate' },
      { id: 'shooting-closeout-cns', name: 'Closeout Catch & Shoot', description: 'Simulate defender closeout on catch', difficulty: 'intermediate' },
      { id: 'shooting-rapid-fire-spot', name: 'Rapid Fire Spot Shooting', description: 'Fast passes; immediate release for rhythm', difficulty: 'intermediate' },
      { id: 'shooting-relocate-and-shoot', name: 'Relocate & Shoot', description: 'Catch, relocate a step, shoot again', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'off-the-dribble',
    name: 'Off-the-Dribble',
    description: 'Create separation and rise under control',
    color: 'bg-purple-500',
    drills: [
      { id: 'shooting-one-dribble-pullup', name: 'One-Dribble Pull-Up', description: 'Drive once, stop on balance, pull up', difficulty: 'intermediate' },
      { id: 'shooting-two-dribble-pullup', name: 'Two-Dribble Pull-Up', description: 'Longer drive into jumper', difficulty: 'intermediate' },
      { id: 'shooting-crossover-to-jumper', name: 'Crossover → Jumper', description: 'Crossover dribble into pull-up', difficulty: 'intermediate' },
      { id: 'shooting-step-back', name: 'Step-Back Jumper', description: 'Create space with controlled step back', difficulty: 'advanced' }
    ]
  },
  {
    id: 'movement-off-screen',
    name: 'Movement & Off-Screen',
    description: 'Shoot in motion off curls, flares, and pops',
    color: 'bg-pink-500',
    drills: [
      { id: 'shooting-curl', name: 'Curl Shooting Drill', description: 'Curl tight off screen into catch-and-shoot', difficulty: 'intermediate' },
      { id: 'shooting-flare', name: 'Flare Shooting Drill', description: 'Flare away from screen for catch-and-shoot', difficulty: 'intermediate' },
      { id: 'shooting-pick-and-pop', name: 'Pick-and-Pop Shooting', description: 'Simulate screen-and-pop into jumper', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'transition-fast-break',
    name: 'Transition & Fast Break',
    description: 'Sprint, decelerate, and shoot at speed',
    color: 'bg-red-500',
    drills: [
      { id: 'shooting-transition-spot', name: 'Transition Spot Shooting', description: 'Sprint into spots; catch and shoot', difficulty: 'advanced' },
      { id: 'shooting-3-man-weave', name: '3-Man Weave Shooting', description: 'Weave into jumper or layup finish', difficulty: 'intermediate' },
      { id: 'shooting-sprint-catch-shoot', name: 'Sprint-Catch-Shoot', description: 'Sprint from baseline to arc and fire', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'free-throws',
    name: 'Free Throws',
    description: 'Routines and pressure simulations from the line',
    color: 'bg-yellow-500',
    drills: [
      { id: 'shooting-routine-free-throws', name: 'Routine Free Throws', description: 'Build a consistent pre-shot routine', difficulty: 'beginner' },
      { id: 'shooting-pressure-free-throws', name: 'Pressure Free Throws', description: 'Shoot while fatigued/under pressure', difficulty: 'intermediate' },
      { id: 'shooting-game-winner-free-throws', name: 'Game-Winner Free Throws', description: 'Simulate last-second FT scenarios', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'layups-finishes',
    name: 'Layups & Finishes',
    description: 'Develop elite touch around the rim',
    color: 'bg-emerald-500',
    drills: [
      { id: 'finishing-mikan', name: 'Mikan Drill', description: 'Alternate right/left finishes under rim', difficulty: 'beginner' },
      { id: 'finishing-reverse-mikan', name: 'Reverse Mikan Drill', description: 'Reverse finishes using rim protection', difficulty: 'beginner' },
      { id: 'finishing-euro-step', name: 'Euro-Step Drill', description: 'Euro-step footwork into finish', difficulty: 'intermediate' },
      { id: 'finishing-floater', name: 'Floater Drill', description: 'Short-range floaters with high arc', difficulty: 'intermediate' },
      { id: 'finishing-reverse-through-contact', name: 'Reverse Finish Drill', description: 'Finish through contact on reverse', difficulty: 'intermediate' }
    ]
  },
  {
    id: 'special-advanced',
    name: 'Special / Advanced',
    description: 'Add difficult elite shots to your toolkit',
    color: 'bg-indigo-500',
    drills: [
      { id: 'shooting-fadeaway', name: 'Fadeaway Shooting', description: 'Controlled fadeaways off post/face-up', difficulty: 'advanced' },
      { id: 'shooting-turnaround', name: 'Turnaround Jumper', description: 'Post move into turnaround jumper', difficulty: 'advanced' },
      { id: 'shooting-hook-shot', name: 'Hook Shot Drill', description: 'Right & left hooks with soft touch', difficulty: 'advanced' }
    ]
  },
  {
    id: 'competitive',
    name: 'Competitive / Challenges',
    description: 'Gamified shooting for pressure and fun',
    color: 'bg-slate-600',
    drills: [
      { id: 'shooting-knockout', name: 'Knockout', description: 'Elimination shooting game (group)', difficulty: 'beginner' },
      { id: 'shooting-21-game', name: '21 — Competitive Game', description: 'Free throws and put-backs to 21', difficulty: 'beginner' },
      { id: 'shooting-3pt-contest', name: '3-Point Contest', description: 'Timed racks challenge', difficulty: 'intermediate' },
      { id: 'shooting-beat-the-pro', name: 'Beat the Pro', description: 'Simulate vs. imaginary opponent', difficulty: 'beginner' },
      { id: 'shooting-beat-the-clock', name: 'Beat the Clock', description: 'Make shots under time pressure', difficulty: 'beginner' }
    ]
  },
  {
    id: 'conditioning',
    name: 'Conditioning Shooting',
    description: 'Sustain mechanics under fatigue',
    color: 'bg-cyan-600',
    drills: [
      { id: 'shooting-shoot-and-sprint', name: 'Shoot & Sprint', description: 'Make 1, sprint baseline, repeat', difficulty: 'intermediate' },
      { id: 'shooting-hit-and-run', name: 'Hit & Run Drill', description: 'Shoot then run to next spot fast', difficulty: 'intermediate' },
      { id: 'shooting-circuit', name: 'Shooting Circuit', description: 'Stations combining dribble/finish/shoot', difficulty: 'advanced' }
    ]
  },
  {
    id: 'progression-weak-hand',
    name: 'Progression & Weak-Hand',
    description: 'Daily structure and weak-hand focus',
    color: 'bg-teal-600',
    drills: [
      { id: 'shooting-weak-hand-only', name: 'Weak-Hand Only Shooting', description: 'Force weak-hand usage and touch', difficulty: 'beginner' },
      { id: 'shooting-daily-progression', name: 'Daily Progression Plan', description: 'Distance/speed progression plan', difficulty: 'beginner' },
      { id: 'shooting-high-volume-challenge', name: 'High-Volume Challenge (200 Shots)', description: '200-shot session across themes', difficulty: 'advanced' }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700';
    case 'advanced': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const ShootingDrills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ShootingCategory | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<ShootingDrill | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (drill: ShootingDrill) => {
    setSelectedDrill(drill);
    setLoading(true);
    setError(null);
    try {
      const q = `${drill.name} basketball shooting drill tutorial`;
      const response = await searchYouTubeVideos(q);
      const videoData: YouTubeVideo[] = response.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      setVideos(videoData);
    } catch (e: any) {
      setError(e?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (selectedDrill) {
      setSelectedDrill(null);
      setVideos([]);
      setError(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shooting Drills</h2>
          <p className="text-gray-600">Explore categorized shooting work like form, spot, off-dribble, and more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-600">{cat.drills.length} drills</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {cat.drills.slice(0, 3).map((d, i) => (
                    <span key={i} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(d.difficulty)}`}>
                      {d.difficulty}
                    </span>
                  ))}
                </div>
                <span className="text-orange-600 text-sm font-medium group-hover:text-orange-700">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCategory && !selectedDrill) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={goBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} flex items-center justify-center text-white`}>
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.drills.map((drill) => (
            <div
              key={drill.id}
              onClick={() => handleSelect(drill)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Play size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                    {drill.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{drill.description}</p>
              <div className="flex items-center justify-end mt-3">
                <span className="text-orange-600 text-sm font-medium group-hover:text-orange-700">Learn →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={goBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Play size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedDrill?.name}</h2>
            <p className="text-gray-600">Video tutorials and instructions</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding tutorial videos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
              <div className="relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <button className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">No tutorial videos found</div>
      )}
    </div>
  );
};

export default ShootingDrills;


