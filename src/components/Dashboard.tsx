import React, { useState, useEffect } from 'react';
import { Play, Calendar, TrendingUp, Award, Clock, CheckCircle, Bell, BookOpen, BarChart3, Trophy, ChevronRight, Edit3, Target } from 'lucide-react';
import VideoOfTheDay from './VideoOfTheDay';
import CoachTips, { getTodaysTip } from './CoachTips';
import EditProfileModal from './EditProfileModal';
import { UserProfile } from '../types';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

// Simple Fire icon replacement
const Fire = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.3 13.4 6.4 12.5 7.1C13.4 7.8 14 8.9 14 10.1C14 11.1 13.6 12 12.9 12.6C13.8 13.2 14.4 14.2 14.4 15.4C14.4 17.4 12.8 19 10.8 19C8.8 19 7.2 17.4 7.2 15.4C7.2 14.2 7.8 13.2 8.7 12.6C8 12 7.6 11.1 7.6 10.1C7.6 8.9 8.2 7.8 9.1 7.1C8.2 6.4 7.6 5.3 7.6 4C7.6 2.9 8.5 2 9.6 2H12Z"/>
  </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
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

  const [todaySchedule, setTodaySchedule] = useState<Array<{
    id: string;
    time: string;
    title: string;
    category: string;
    completed: boolean;
    color: string;
  }>>([]);

  // Load today's schedule from Planner
  useEffect(() => {
    const loadTodaysSchedule = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const savedSessions = localStorage.getItem('plannedSessions');
        
        if (savedSessions) {
          const sessions = JSON.parse(savedSessions);
          const todaysSessions = Array.isArray(sessions) ? sessions.filter((session: any) => {
            return session.date === today;
          }) : [];

          const formattedSessions = todaysSessions.map((session: any, index: number) => ({
            id: session.id || `session-${index}`,
            time: session.time || 'All Day',
            title: session.name || 'Training Session',
            category: session.type || 'training',
            completed: session.completed || false,
            color: session.type === 'skills' ? 'bg-orange-500' : 
                   session.type === 'strength' ? 'bg-purple-500' :
                   session.type === 'cardio' ? 'bg-red-500' : 'bg-blue-500'
          }));

          setTodaySchedule(formattedSessions);
        }
      } catch (error) {
        console.error('Error loading today\'s schedule:', error);
      }
    };

    // Initial load
    loadTodaysSchedule();

    // Set up storage event listener to update when Planner data changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plannedSessions') {
        loadTodaysSchedule();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [weeklyStats, setWeeklyStats] = useState({
    hoursThisWeek: 0,
    categories: [
      { name: 'Shooting', progress: 0, color: 'text-orange-500' },
      { name: 'Cardio', progress: 0, color: 'text-red-500' },
      { name: 'Strength', progress: 0, color: 'text-purple-500' },
      { name: 'Agility', progress: 0, color: 'text-green-500' }
    ],
    improvements: [
      { metric: 'Shooting', change: '+0%', positive: true },
      { metric: 'Speed', change: '+0%', positive: true },
      { metric: 'Endurance', change: '+0%', positive: true }
    ]
  });

  // Calculate weekly stats from Planner data
  useEffect(() => {
    const calculateWeeklyStats = () => {
      try {
        const savedSessions = localStorage.getItem('plannedSessions');
        if (!savedSessions) return;

        const sessions = JSON.parse(savedSessions);
        if (!Array.isArray(sessions)) return;

        // Get date range for current week (Sunday to Saturday)
        const now = new Date();
        const firstDay = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6); // Saturday

        // Filter sessions for current week
        const weekSessions = sessions.filter((session: any) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= firstDay && sessionDate <= lastDay;
        });

        // Calculate total hours
        const totalHours = weekSessions.reduce((sum: number, session: any) => {
          return sum + (parseFloat(session.duration) || 0);
        }, 0);

        // Calculate hours by category
        const categoryHours: Record<string, number> = {
          'shooting': 0,
          'cardio': 0,
          'strength': 0,
          'agility': 0
        };

        weekSessions.forEach((session: any) => {
          const type = (session.type || '').toLowerCase();
          if (type in categoryHours) {
            categoryHours[type] += parseFloat(session.duration) || 0;
          }
        });

        // Calculate percentages
        const totalCategoryHours = Object.values(categoryHours).reduce((sum, hours) => sum + hours, 1);
        const categoryPercentages = Object.entries(categoryHours).map(([category, hours]) => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          progress: Math.round((hours / totalCategoryHours) * 100),
          color: `text-${category === 'shooting' ? 'orange' : category === 'cardio' ? 'red' : category === 'strength' ? 'purple' : 'green'}-500`
        }));

        // Calculate improvements (simplified - in a real app, this would compare with previous weeks)
        const improvements = [
          { metric: 'Shooting', change: `+${Math.floor(Math.random() * 20)}%`, positive: true },
          { metric: 'Speed', change: `+${Math.floor(Math.random() * 15)}%`, positive: true },
          { metric: 'Endurance', change: `+${Math.floor(Math.random() * 25)}%`, positive: true }
        ];

        setWeeklyStats({
          hoursThisWeek: parseFloat(totalHours.toFixed(1)),
          categories: categoryPercentages,
          improvements
        });
      } catch (error) {
        console.error('Error calculating weekly stats:', error);
      }
    };

    // Initial calculation
    calculateWeeklyStats();

    // Update when Planner data changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plannedSessions') {
        calculateWeeklyStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [badges] = useState([
    { id: 1, name: 'Week Warrior', icon: '🔥', earned: true },
    { id: 2, name: 'Sharpshooter', icon: '🎯', earned: true },
    { id: 3, name: 'Iron Will', icon: '💪', earned: false },
    { id: 4, name: 'Speed Demon', icon: '⚡', earned: false }
  ]);

  const [notifications, setNotifications] = useState<Array<{ id: string | number; type: string; message: string; time: string }>>([]);

  const formatRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const rebuildNotifications = () => {
    try {
      const now = new Date();
      const todayISO = now.toISOString().split('T')[0];

      const plannerRaw = localStorage.getItem('plannedSessions');
      const sessions = plannerRaw ? JSON.parse(plannerRaw) : [];
      const todaySessions = Array.isArray(sessions)
        ? sessions.filter((s: any) => s.date === todayISO)
        : [];

      const reminders = todaySessions
        .filter((s: any) => !s.completed)
        .map((s: any) => ({
          id: `reminder-${s.id}`,
          type: 'reminder',
          message: `Reminder: ${s.name || 'Training Session'} ${s.time ? `at ${s.time}` : 'today'}`,
          time: 'today'
        }));

      const progressRaw = localStorage.getItem('userProgress');
      const userProgress = progressRaw ? JSON.parse(progressRaw) : null;
      const badgesRaw = localStorage.getItem('badges');
      const badges = badgesRaw ? JSON.parse(badgesRaw) : [];

      const progressNotes: Array<{ id: string; type: string; message: string; time: string }> = [];
      if (userProgress?.streak) {
        progressNotes.push({
          id: 'progress-streak',
          type: 'progress',
          message: `Streak: ${userProgress.streak} day${userProgress.streak === 1 ? '' : 's'} strong. Keep it going!`,
          time: 'today'
        });
      }
      const earnedBadges = Array.isArray(badges) ? badges.filter((b: any) => b.earnedAt || b.earned) : [];
      earnedBadges.slice(-2).forEach((b: any, i: number) => {
        progressNotes.push({
          id: `badge-${b.id || i}`,
          type: 'achievement',
          message: `Unlocked badge: ${b.name || 'New Badge'}!`,
          time: b.earnedAt ? formatRelativeTime(new Date(b.earnedAt)) : 'recently'
        });
      });

      const tip = getTodaysTip();
      const tipNote = {
        id: `tip-${tip.id}`,
        type: 'tip',
        message: `Coach tip – ${tip.title}: ${tip.content}`,
        time: 'today'
      };

      const combined = [...reminders, ...progressNotes, tipNote];
      setNotifications(combined);
    } catch (err) {
      console.error('Error building notifications:', err);
    }
  };

  useEffect(() => {
    rebuildNotifications();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || ['plannedSessions', 'userProgress', 'badges', 'weeklySummaries', 'lastTipDate', 'lastTipId'].includes(e.key)) {
        rebuildNotifications();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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

  // Navigation handlers for Quick Actions
  const handleStartWorkout = () => {
    // Try to find the most recent incomplete session from planner
    const plannedSessions = JSON.parse(localStorage.getItem('plannedSessions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todaySession = plannedSessions.find((session: any) => 
      session.date === today && !session.completed
    );
    
    if (todaySession) {
      // If there's a session today, go to planner
      onNavigate?.('planner');
    } else {
      // Otherwise, go to skills library to start a workout
      onNavigate?.('skills');
    }
  };

  const handleResumeLastSession = () => {
    // Find the most recent incomplete session
    const plannedSessions = JSON.parse(localStorage.getItem('plannedSessions') || '[]');
    const incompleteSession = plannedSessions
      .filter((session: any) => !session.completed)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (incompleteSession) {
      onNavigate?.('planner');
    } else {
      // No incomplete sessions, go to planner to create one
      onNavigate?.('planner');
    }
  };

  const toggleTaskComplete = (id: string) => {
    try {
      // Update local state
      setTodaySchedule(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));

      // Update Planner's localStorage data
      const savedSessions = localStorage.getItem('plannedSessions');
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions);
        const updatedSessions = sessions.map((session: any) => {
          if (session.id === id) {
            return { ...session, completed: !session.completed };
          }
          return session;
        });
        localStorage.setItem('plannedSessions', JSON.stringify(updatedSessions));
        
        // Trigger storage event to sync across tabs
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const getProgressPercentage = () => ((user.xp ?? 0) / maxXp) * 100;

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
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
    } else {
      // Save default to localStorage if none exists
      localStorage.setItem('userProfile', JSON.stringify(user));
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
                {/* ✅ REMOVED DUPLICATE AVATAR IMAGE */}
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
                <h2 
                  onClick={() => onNavigate?.('planner')} 
                  className="text-2xl font-bold text-gray-800 flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="text-orange-500" />
                  Today's Schedule
                </h2>
                <button 
                  onClick={() => onNavigate?.('planner')}
                  className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {todaySchedule.map((task) => (
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
                <button 
                  onClick={handleStartWorkout}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <Play size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Start Workout</span>
                </button>
                
                <button 
                  onClick={handleResumeLastSession}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <Play size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Resume Last Session</span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('exercises')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <BookOpen size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Exercise Library</span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('planner')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <Calendar size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Open Planner</span>
                </button>
              </div>
              
              {/* Additional Quick Actions Row */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={() => onNavigate?.('progress')}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <BarChart3 size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">View Progress</span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('skills')}
                  className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  <Target size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-semibold">Skills Library</span>
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
              
              <VideoOfTheDay />
              
              <div className="mt-6">
                <CoachTips />
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