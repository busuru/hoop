import React, { useState, useEffect } from 'react';
import { Play, Calendar, TrendingUp, Award, Zap, Target, Dumbbell, Clock, CheckCircle, Bell, User, BookOpen, BarChart3, Lightbulb, Trophy, Star, ChevronRight, Plus, Edit3 } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { UserProfile } from '../types';

// Simple Fire icon replacement
const Fire = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.3 13.4 6.4 12.5 7.1C13.4 7.8 14 8.9 14 10.1C14 11.1 13.6 12 12.9 12.6C13.8 13.2 14.4 14.2 14.4 15.4C14.4 17.4 12.8 19 10.8 19C8.8 19 7.2 17.4 7.2 15.4C7.2 14.2 7.8 13.2 8.7 12.6C8 12 7.6 11.1 7.6 10.1C7.6 8.9 8.2 7.8 9.1 7.1C8.2 6.4 7.6 5.3 7.6 4C7.6 2.9 8.5 2 9.6 2H12Z"/>
  </svg>
);

const Dashboard: React.FC = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'Alex Jordan',
    avatarUrl: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    email: 'alex.jordan@example.com',
    bio: 'Passionate basketball player working on improving my game every day.',
    location: 'Los Angeles, CA',
    streak: 7,
    level: 5,
    xp: 1400
  });

  const maxXp = 2000;

  const [todaySchedule, setTodaySchedule] = useState([
    { id: 1, time: '7:00 AM', title: 'Morning Cardio', category: 'cardio', completed: true, color: 'bg-red-500' },
    { id: 2, time: '4:00 PM', title: 'Shooting Practice', category: 'shooting', completed: false, color: 'bg-orange-500' },
    { id: 3, time: '6:00 PM', title: 'Strength Training', category: 'strength', completed: false, color: 'bg-purple-500' },
    { id: 4, time: '7:30 PM', title: 'Agility Drills', category: 'agility', completed: false, color: 'bg-green-500' }
  ]);

  const [weeklyStats] = useState({
    hoursThisWeek: 12.5,
    categories: [
      { name: 'Shooting', progress: 85, color: 'text-orange-500' },
      { name: 'Cardio', progress: 70, color: 'text-red-500' },
      { name: 'Strength', progress: 60, color: 'text-purple-500' },
      { name: 'Agility', progress: 90, color: 'text-green-500' }
    ],
    improvements: [
      { metric: 'Shooting', change: '+12%', positive: true },
      { metric: 'Speed', change: '+8%', positive: true },
      { metric: 'Endurance', change: '+15%', positive: true }
    ]
  });

  const [badges] = useState([
    { id: 1, name: 'Week Warrior', icon: '🔥', earned: true },
    { id: 2, name: 'Sharpshooter', icon: '🎯', earned: true },
    { id: 3, name: 'Iron Will', icon: '💪', earned: false },
    { id: 4, name: 'Speed Demon', icon: '⚡', earned: false }
  ]);

  const [notifications] = useState([
    { id: 1, type: 'reminder', message: 'Don\'t forget your 4 PM shooting practice!', time: '2 hours ago' },
    { id: 2, type: 'achievement', message: 'Congratulations! You\'ve earned the Week Warrior badge!', time: '1 day ago' },
    { id: 3, type: 'tip', message: 'Coach tip: Focus on your follow-through for better accuracy', time: '2 days ago' }
  ]);

  const motivationalQuotes = [
    "Grind now, shine later 💪",
    "Champions are made in practice 🏀",
    "Every shot you don't take is a miss 🎯",
    "Hard work beats talent when talent doesn't work hard 🔥",
    "The only way to get better is to practice 💯"
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    // Rotate quotes every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = motivationalQuotes.indexOf(prev);
        return motivationalQuotes[(currentIndex + 1) % motivationalQuotes.length];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleTaskComplete = (id: number) => {
    setTodaySchedule(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'from-amber-600 to-amber-400';
      case 'Silver': return 'from-gray-400 to-gray-200';
      case 'Gold': return 'from-yellow-500 to-yellow-300';
      default: return 'from-gray-400 to-gray-200';
    }
  };

  const getProgressPercentage = () => (user.xp / maxXp) * 100;

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  // Load user profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUser(prev => ({ ...prev, ...parsedProfile }));
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-purple-600/30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* User Info */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="relative block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full transition-all group-hover:scale-105"
                  title="Edit Profile"
                >
                  <img 
                    src={user.avatarUrl || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                    <Edit3 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <img 
                  src={user.avatarUrl || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2">
                  <Fire size={16} />
                </div>
              </div>
              
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Edit Profile"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
                {user.bio && (
                  <p className="text-white/90 text-sm mb-2 max-w-md">{user.bio}</p>
                )}
                <div className="flex items-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Fire className="text-orange-400" size={20} />
                    <span>{user.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={20} />
                    <span>Level {user.level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress Ring */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressPercentage() / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-sm font-bold">{Math.round(getProgressPercentage())}%</div>
                    <div className="text-xs">XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 text-white text-xl font-semibold animate-pulse">
              {currentQuote}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Planner Snapshot */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-orange-500" />
                  Today's Schedule
                </h2>
                <button className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {todaySchedule.map((task, index) => (
                  <div 
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-orange-500'
                        }`}
                      >
                        {task.completed && <CheckCircle size={16} />}
                      </button>
                      <div className={`w-3 h-3 rounded-full ${task.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        <span className="text-sm text-gray-500">{task.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{task.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress & Analytics Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-purple-500" />
                Weekly Progress
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hours Trained */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={24} />
                    <span className="text-3xl font-bold">{weeklyStats.hoursThisWeek}h</span>
                  </div>
                  <p className="text-blue-100">Hours This Week</p>
                </div>

                {/* Category Progress */}
                <div className="space-y-4">
                  {weeklyStats.categories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 transition-all duration-1000`}
                            style={{ width: `${category.progress}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${category.color}`}>
                          {category.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {weeklyStats.improvements.map((improvement) => (
                  <div 
                    key={improvement.metric}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    <TrendingUp size={16} />
                    {improvement.metric} {improvement.change}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg">
                  <Play size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Start Workout</span>
                </button>
                
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg">
                  <Calendar size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Open Planner</span>
                </button>
                
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg">
                  <BookOpen size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Exercise Library</span>
                </button>
                
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg">
                  <Plus size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Add Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Video of the Day */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Play className="text-red-500" />
                Video of the Day
              </h2>
              
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop"
                  alt="Basketball training video"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play size={24} className="text-white ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-yellow-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Tip of the Day</h4>
                    <p className="text-yellow-700 text-sm">
                      Keep your shooting elbow directly under the ball for better accuracy and consistency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamification & Rewards */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" />
                Achievements
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      badge.earned 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <div className="text-xs font-semibold">{badge.name}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Next Milestone</h4>
                <p className="text-blue-600 text-sm">Complete 3 more strength sessions to unlock "Iron Will" badge!</p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="text-blue-500" />
                Notifications
              </h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-orange-400"
                  >
                    <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleProfileSave}
        initialProfile={user}
      />
    </div>
  );
};

export default Dashboard;