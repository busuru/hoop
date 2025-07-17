import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { skills } from '../data/basketballData';
import { exercises } from '../data/basketballData';
import { Stretch } from '../types';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Search, 
  Clock, 
  Target, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Grid,
  Calendar as CalendarIcon,
  Bell,
  BellOff,
  Settings,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Star,
  Zap,
  Moon,
  Sun,
  Filter,
  BarChart3,
  Trophy,
  Flame,
  Users,
  FileText,
  Play,
  Shuffle,
  Sliders,
  Timer,
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react';
import UserProfileModal from './UserProfileModal';
import PlanPreview from './PlanPreview';
import planGenerator, { UserProfile, TrainingPlan } from '../services/planGenerator';

// --- Data Models ---
export interface DrillInSession {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  instructions: string[];
  tips: string[];
  videoId: string;
  recommendedDuration?: number;
  timer?: number;
  isDone: boolean;
  isFavorite: boolean;
}

export interface PlannerSession {
  id: string;
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:mm
  type: string; // category id
  drills: DrillInSession[];
  duration: number; // minutes
  notes: string;
  isDone: boolean;
  isFavorite: boolean;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderMinutes: number; // minutes before session
  sound: boolean;
  vibration: boolean;
  message: string;
}

// Enhanced data models for new features
export interface CustomDrill {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  videoUrl?: string;
  category: string;
  duration: number;
  sets?: number;
  reps?: number;
  createdBy: string;
  createdAt: Date;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sessions: PlannerSession[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // days
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  plannedSessions: number;
  completedSessions: number;
  totalPlannedDuration: number;
  totalCompletedDuration: number;
  categoryBreakdown: { [key: string]: number };
  caloriesBurned: number;
  streak: number;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  reward: string;
  isCompleted: boolean;
}

export interface UserProgress {
  userId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredDays: string[];
  sessionsPerWeek: number;
  averageSessionDuration: number;
  difficultyAdjustment: number; // -2 to +2 scale
  completedSessions: PlannerSession[];
  badges: Badge[];
  streak: number;
  totalCaloriesBurned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: string;
}

export interface TeamSession {
  id: string;
  name: string;
  date: string;
  time: string;
  participants: string[];
  maxParticipants: number;
  session: PlannerSession;
  isPublic: boolean;
  joinCode: string;
}

// Placeholder categories/colors
const CATEGORIES = [
  { id: 'skill', label: 'Skill', color: 'bg-blue-500' },
  { id: 'shooting', label: 'Shooting', color: 'bg-orange-500' },
  { id: 'agility', label: 'Agility', color: 'bg-purple-500' },
  { id: 'cardio', label: 'Cardio', color: 'bg-pink-500' },
  { id: 'strength', label: 'Strength', color: 'bg-green-500' },
  { id: 'recovery', label: 'Recovery', color: 'bg-yellow-500' },
  { id: 'stretch', label: 'Stretch', color: 'bg-teal-500' },
  { id: 'custom', label: 'Custom', color: 'bg-gray-500' },
];

// Helper to flatten all drills from skills, exercises, stretches
function getAllDrills() {
  // Map all to a common structure
  const skillDrills = skills.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    type: 'skill',
    description: s.description,
    instructions: s.instructions,
    tips: s.tips,
    videoId: '',
    recommendedDuration: undefined,
    isFavorite: false,
    isDone: false
  }));
  const exerciseDrills = exercises.map(e => ({
    id: e.id,
    name: e.name,
    category: e.category,
    type: 'exercise',
    description: e.description || '',
    instructions: e.instructions,
    tips: e.tips || [],
    videoId: e.videoId || '',
    recommendedDuration: e.recommendedDuration || e.duration,
    isFavorite: e.isFavorite || false,
    isDone: e.isDone || false
  }));
  // For stretches, you may need to import them if not already
  let stretchDrills: any[] = [];
  try {
    // @ts-ignore
    const { stretches } = require('../data/basketballData');
    stretchDrills = stretches.map((s: Stretch) => ({
      id: s.id,
      name: s.name,
      category: s.type,
      type: 'stretch',
      description: s.description || '',
      instructions: s.instructions,
      tips: s.tips || [],
      videoId: s.videoId || '',
      recommendedDuration: s.recommendedDuration || s.duration,
      isFavorite: false,
      isDone: false
    }));
  } catch {}
  return [...skillDrills, ...exerciseDrills, ...stretchDrills];
}

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const Planner: React.FC = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessions, setSessions] = useState<PlannerSession[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<PlannerSession | null>(null);
  const [dailyDrill, setDailyDrill] = useState<DrillInSession | null>(null);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [modalDay, setModalDay] = useState('');
  const [allDrills] = useState(getAllDrills());
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);
  const [profileForPlan, setProfileForPlan] = useState<UserProfile | null>(null);
  
  // Enhanced feature states
  const [darkMode, setDarkMode] = useState(false);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCustomDrillModal, setShowCustomDrillModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showIntensitySlider, setShowIntensitySlider] = useState(false);
  const [showTimeBudgetModal, setShowTimeBudgetModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('');
  const [intensityLevel, setIntensityLevel] = useState(1); // 0.5 to 2.0
  const [timeBudget, setTimeBudget] = useState(60); // minutes
  const [scenario, setScenario] = useState<'indoor' | 'outdoor' | 'gym' | 'any'>('any');
  
  // Data states
  const [customDrills, setCustomDrills] = useState<CustomDrill[]>([]);
  const [planTemplates, setPlanTemplates] = useState<PlanTemplate[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [teamSessions, setTeamSessions] = useState<TeamSession[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  
  // Notification states
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [globalNotificationSettings, setGlobalNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    reminderMinutes: 15,
    sound: true,
    vibration: true,
    message: "Time for your basketball training session!"
  });

  // Enhanced templates data
  const templates = [
    {
      id: 'beginner',
      name: 'Beginner Training',
      description: 'Perfect for new players',
      sessions: 3,
      duration: 7,
      difficulty: 'beginner' as const,
      category: 'general',
      tags: ['beginner', 'fundamentals']
    },
    {
      id: 'intermediate',
      name: 'Intermediate Training',
      description: 'For players with some experience',
      sessions: 5,
      duration: 7,
      difficulty: 'intermediate' as const,
      category: 'general',
      tags: ['intermediate', 'skills']
    },
    {
      id: 'advanced',
      name: 'Advanced Training',
      description: 'For experienced players',
      sessions: 6,
      duration: 7,
      difficulty: 'advanced' as const,
      category: 'general',
      tags: ['advanced', 'performance']
    },
    {
      id: 'shooting-focused',
      name: 'Shooting Mastery',
      description: 'Focus on shooting accuracy and form',
      sessions: 4,
      duration: 7,
      difficulty: 'intermediate' as const,
      category: 'shooting',
      tags: ['shooting', 'accuracy']
    },
    {
      id: 'defense-focused',
      name: 'Defensive Skills',
      description: 'Improve defensive positioning and footwork',
      sessions: 3,
      duration: 7,
      difficulty: 'intermediate' as const,
      category: 'defense',
      tags: ['defense', 'footwork']
    }
  ];

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('plannerSessions');
    if (stored) setSessions(JSON.parse(stored));
    
    const storedSettings = localStorage.getItem('plannerNotificationSettings');
    if (storedSettings) setGlobalNotificationSettings(JSON.parse(storedSettings));
    
    // Load enhanced data
    const storedCustomDrills = localStorage.getItem('customDrills');
    if (storedCustomDrills) setCustomDrills(JSON.parse(storedCustomDrills));
    
    const storedTemplates = localStorage.getItem('planTemplates');
    if (storedTemplates) setPlanTemplates(JSON.parse(storedTemplates));
    
    const storedProgress = localStorage.getItem('userProgress');
    if (storedProgress) setUserProgress(JSON.parse(storedProgress));
    
    const storedChallenges = localStorage.getItem('challenges');
    if (storedChallenges) setChallenges(JSON.parse(storedChallenges));
    
    const storedBadges = localStorage.getItem('badges');
    if (storedBadges) setBadges(JSON.parse(storedBadges));
    
    const storedTeamSessions = localStorage.getItem('teamSessions');
    if (storedTeamSessions) setTeamSessions(JSON.parse(storedTeamSessions));
    
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) setDarkMode(JSON.parse(storedDarkMode));
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    
    // Check offline status
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  }, []);
  
  useEffect(() => {
    localStorage.setItem('plannerSessions', JSON.stringify(sessions));
  }, [sessions]);
  
  useEffect(() => {
    localStorage.setItem('plannerNotificationSettings', JSON.stringify(globalNotificationSettings));
  }, [globalNotificationSettings]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Basketball Trainer', {
          body: 'Notifications enabled! You\'ll now receive reminders for your training sessions.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Schedule notification for a session
  const scheduleSessionNotification = (session: PlannerSession) => {
    if (!globalNotificationSettings.enabled || notificationPermission !== 'granted') {
      return;
    }

    const sessionDate = new Date(`${session.date}T${session.time}`);
    const notificationTime = new Date(sessionDate.getTime() - (globalNotificationSettings.reminderMinutes * 60 * 1000));
    
    // Don't schedule if the time has already passed
    if (notificationTime <= new Date()) {
      return;
    }

    const timeUntilNotification = notificationTime.getTime() - Date.now();
    
    setTimeout(() => {
      showSessionNotification(session);
    }, timeUntilNotification);
  };

  // Show notification for a session
  const showSessionNotification = (session: PlannerSession) => {
    if (notificationPermission !== 'granted') return;

    const notification = new Notification('Basketball Training Reminder', {
      body: `${session.name} starts in ${globalNotificationSettings.reminderMinutes} minutes!\n${session.drills.length} drills • ${session.duration} minutes`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `session-${session.id}`,
      requireInteraction: true
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      // Could navigate to the specific session here
    };

    // Add sound if enabled
    if (globalNotificationSettings.sound) {
      playNotificationSound();
    }

    // Add vibration if enabled and supported
    if (globalNotificationSettings.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.play().catch(() => {
        // Fallback: create a simple beep
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        gainNode.gain.setValueAtTime(0.1, context.currentTime);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
      });
    } catch (error) {
      console.log('Could not play notification sound');
    }
  };

  // Schedule notifications for all upcoming sessions
  const scheduleAllNotifications = () => {
    const now = new Date();
    const upcomingSessions = sessions.filter(session => {
      const sessionDate = new Date(`${session.date}T${session.time}`);
      return sessionDate > now && !session.isDone;
    });

    upcomingSessions.forEach(session => {
      scheduleSessionNotification(session);
    });
  };

  // Schedule notifications when sessions change
  useEffect(() => {
    if (globalNotificationSettings.enabled && notificationPermission === 'granted') {
      scheduleAllNotifications();
    }
  }, [sessions, globalNotificationSettings, notificationPermission]);

  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const totalDays = 42; // 6 weeks * 7 days
    
    for (let i = 0; i < totalDays; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getSessionsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    if (direction === 'prev') {
      newWeek.setDate(newWeek.getDate() - 7);
    } else {
      newWeek.setDate(newWeek.getDate() + 7);
    }
    setCurrentWeek(newWeek);
  };

  const formatWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const handleApplyTemplate = (template: any) => {
    // Implementation for applying templates
    console.log('Applying template:', template);
  };

  const handleAddDrillToSession = (drill: any) => {
    // Implementation for adding drill to session
    console.log('Adding drill to session:', drill);
  };

  // Add/Edit Session
  const openAddSession = (isoDate: string) => {
    setEditingSession(null);
    setModalDay(isoDate);
    setShowAddModal(true);
  };
  const openEditSession = (session: PlannerSession) => {
    setEditingSession(session);
    setModalDay(session.date);
    setShowAddModal(true);
  };
  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  // Save session (add or update)
  const handleSaveSession = (session: PlannerSession) => {
    if (editingSession) {
      setSessions(sessions.map(s => (s.id === session.id ? session : s)));
    } else {
      setSessions([...sessions, session]);
    }
    
    // Schedule notification for the new/updated session
    if (globalNotificationSettings.enabled && notificationPermission === 'granted') {
      scheduleSessionNotification(session);
    }
    
    setShowAddModal(false);
    setEditingSession(null);
  };

  // Get ISO dates for current week (starting today)
  const getWeekDates = () => {
    const today = new Date();
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      week.push(d.toISOString().slice(0, 10));
    }
    return week;
  };

  // Handle drag & drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'drill') {
      // Reorder drills within a session (handled in modal)
      return;
    }

    if (type === 'session') {
      // Move session between days
      const sourceDay = source.droppableId;
      const destDay = destination.droppableId;
      const sessionId = result.draggableId;

      if (sourceDay === destDay) {
        // Reorder within same day
        const daySessions = getSessionsForDay(new Date(sourceDay));
        const [movedSession] = daySessions.splice(source.index, 1);
        daySessions.splice(destination.index, 0, movedSession);
        
        // Update sessions array
        const otherSessions = sessions.filter(s => s.date !== sourceDay);
        setSessions([...otherSessions, ...daySessions]);
      } else {
        // Move to different day
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          const updatedSession = { ...session, date: destDay };
          const otherSessions = sessions.filter(s => s.id !== sessionId);
          setSessions([...otherSessions, updatedSession]);
        }
      }
    }
  };

  // Copy session to another day
  const copySession = (session: PlannerSession, targetDate: string) => {
    const newSession = {
      ...session,
      id: Date.now().toString(),
      date: targetDate,
    };
    setSessions([...sessions, newSession]);
  };

  // Handler to open the user profile modal
  const handleOpenAutoGenerate = () => {
    setShowUserProfileModal(true);
  };

  // Handler to generate plan from user profile
  const handleGeneratePlan = (profile: UserProfile) => {
    setProfileForPlan(profile);
    const plan = planGenerator.generateTrainingPlan(profile, 4); // 4 weeks default
    setGeneratedPlan(plan);
    setShowUserProfileModal(false);
  };

  // Handler to apply generated plan to planner
  const handleApplyPlan = (plan: TrainingPlan) => {
    // Flatten all sessions into planner sessions
    const newSessions = plan.sessions.map((session, idx) => ({
      id: session.id,
      name: session.name,
      date: getDateForSession(idx, plan),
      time: '17:00',
      type: session.type,
      drills: session.drills.map(drill => ({
        id: drill.id,
        name: drill.name,
        category: drill.category,
        type: 'exercise',
        description: drill.notes || '',
        instructions: [drill.notes || 'Follow the drill instructions'],
        tips: [],
        videoId: '',
        recommendedDuration: drill.duration,
        timer: drill.duration,
        isDone: false,
        isFavorite: false
      })),
      duration: session.duration,
      notes: session.description,
      isDone: false,
      isFavorite: false
    }));
    setSessions(newSessions);
    setGeneratedPlan(null);
  };

  // Helper to assign dates to sessions (spread over weeks)
  const getDateForSession = (idx: number, plan: TrainingPlan) => {
    const start = new Date();
    const dayOffset = idx;
    const date = new Date(start);
    date.setDate(start.getDate() + dayOffset);
    return date.toISOString().slice(0, 10);
  };

  // Enhanced functionality handlers
  const handleAddCustomDrill = (drill: CustomDrill) => {
    setCustomDrills([...customDrills, drill]);
    localStorage.setItem('customDrills', JSON.stringify([...customDrills, drill]));
    setShowCustomDrillModal(false);
  };

  const handleSaveTemplate = (template: PlanTemplate) => {
    setPlanTemplates([...planTemplates, template]);
    localStorage.setItem('planTemplates', JSON.stringify([...planTemplates, template]));
    setShowTemplates(false);
  };

  const handleExportPlan = () => {
    const planData = {
      sessions,
      customDrills,
      planTemplates,
      userProgress,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `basketball-training-plan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleCreateTeamSession = (teamSession: TeamSession) => {
    setTeamSessions([...teamSessions, teamSession]);
    localStorage.setItem('teamSessions', JSON.stringify([...teamSessions, teamSession]));
    setShowTeamModal(false);
  };

  const handleGenerateWeeklySummary = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const completedSessions = weekSessions.filter(s => s.isDone);
    const totalPlannedDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalCompletedDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);

    const categoryBreakdown = weekSessions.reduce((acc, session) => {
      acc[session.type] = (acc[session.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const caloriesBurned = totalCompletedDuration * 8; // Rough estimate: 8 calories per minute

    const summary: WeeklySummary = {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      plannedSessions: weekSessions.length,
      completedSessions: completedSessions.length,
      totalPlannedDuration,
      totalCompletedDuration,
      categoryBreakdown,
      caloriesBurned,
      streak: userProgress?.streak || 0,
      challenges: challenges.filter(c => c.type === 'weekly')
    };

    setWeeklySummaries([...weeklySummaries, summary]);
    localStorage.setItem('weeklySummaries', JSON.stringify([...weeklySummaries, summary]));
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Filter sessions based on search and filters
  const getFilteredSessions = () => {
    let filtered = sessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.drills.some(drill => 
          drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drill.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(session => session.type === filterCategory);
    }

    // Time range filter
    if (filterTimeRange) {
      const today = new Date();
      const todayISO = today.toISOString().split('T')[0];
      
      switch (filterTimeRange) {
        case 'today':
          filtered = filtered.filter(session => session.date === todayISO);
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          filtered = filtered.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= weekStart && sessionDate <= weekEnd;
          });
          break;
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          filtered = filtered.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= monthStart && sessionDate <= monthEnd;
          });
          break;
        case 'completed':
          filtered = filtered.filter(session => session.isDone);
          break;
        case 'pending':
          filtered = filtered.filter(session => !session.isDone);
          break;
      }
    }

    return filtered;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Training Planner</h1>
                <p className="text-gray-600">Plan and organize your basketball training sessions</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Enhanced Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Auto-generate Plan Button */}
                  <button
                    onClick={handleOpenAutoGenerate}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Auto-generate personalized plan"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Auto-Generate</span>
                  </button>
                  
                  {/* Weekly Summary Button */}
                  <button
                    onClick={() => {
                      handleGenerateWeeklySummary();
                      setShowWeeklySummary(true);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="View weekly summary"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Summary</span>
                  </button>
                  
                  {/* Templates Button */}
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Load plan templates"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Templates</span>
                  </button>
                  
                  {/* Custom Drill Button */}
                  <button
                    onClick={() => setShowCustomDrillModal(true)}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Add custom drill"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Custom Drill</span>
                  </button>
                  
                  {/* Team Mode Button */}
                  <button
                    onClick={() => setShowTeamModal(true)}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Team training sessions"
                  >
                    <Users className="w-4 h-4" />
                    <span>Team</span>
                  </button>
                  
                  {/* Export Button */}
                  <button
                    onClick={handleExportPlan}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Export plan"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={handleDarkModeToggle}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    title="Toggle dark mode"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
                {/* Notification Status */}
                <div className="flex items-center gap-2">
                  {notificationPermission === 'granted' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Bell className="w-5 h-5" />
                      <span className="text-sm font-medium">Notifications On</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <BellOff className="w-5 h-5" />
                      <span className="text-sm font-medium">Notifications Off</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowNotificationSettings(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Notification Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setView('weekly')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      view === 'weekly' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Weekly
                  </button>
                  <button
                    onClick={() => setView('monthly')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      view === 'monthly' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Monthly
                  </button>
                </div>

                <button
                  onClick={() => openAddSession(getTodayISO())}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Session
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search sessions, drills, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                
                <select
                  value={filterTimeRange}
                  onChange={(e) => setFilterTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                    setFilterTimeRange('');
                  }}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Clear filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {view === 'weekly' && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous Week
                </button>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {formatWeekRange()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentWeek.getFullYear()}
                  </p>
                </div>
                
                <button
                  onClick={() => navigateWeek('next')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Next Week
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {view === 'monthly' && (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous Month
                </button>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {formatMonthYear(currentMonth)}
                  </h2>
                </div>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Next Month
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Calendar View */}
          {view === 'weekly' && (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-6">
              {getWeekDays().map((day, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4">
                  <div className={`text-center mb-3 pb-2 border-b ${
                    isToday(day) ? 'border-blue-500' : 'border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-2xl font-bold ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>
                  
                  <Droppable droppableId={day.toISOString().split('T')[0]}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] ${
                          snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg' : ''
                        }`}
                      >
                        {getSessionsForDay(day).map((session, sessionIndex) => (
                          <Draggable
                            key={session.id}
                            draggableId={session.id}
                            index={sessionIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-2 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                                  session.type === 'skill' ? 'border-blue-500 bg-blue-50' :
                                  session.type === 'shooting' ? 'border-orange-500 bg-orange-50' :
                                  session.type === 'agility' ? 'border-purple-500 bg-purple-50' :
                                  session.type === 'cardio' ? 'border-pink-500 bg-pink-50' :
                                  session.type === 'strength' ? 'border-green-500 bg-green-50' :
                                  session.type === 'recovery' ? 'border-yellow-500 bg-yellow-50' :
                                  session.type === 'stretch' ? 'border-teal-500 bg-teal-50' :
                                  'border-gray-500 bg-gray-50'
                                } ${snapshot.isDragging ? 'shadow-lg rotate-1' : 'shadow-sm'} ${
                                  session.isDone ? 'opacity-75' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-gray-800 text-sm">
                                        {session.name}
                                      </h4>
                                      {session.isDone && (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      )}
                                      {session.isFavorite && (
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">
                                      {session.duration} min • {session.drills.length} drills • {session.time}
                                    </p>
                                    {session.notes && (
                                      <p className="text-xs text-gray-500 italic mb-2">
                                        "{session.notes}"
                                      </p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {session.duration}min
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {session.drills.length} drills
                                      </span>
                                      {session.notifications?.enabled && (
                                        <span className="flex items-center gap-1 text-blue-600">
                                          <Bell className="w-3 h-3" />
                                          {session.notifications.reminderMinutes}min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => openEditSession(session)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit session"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => copySession(session, day.toISOString().split('T')[0])}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Copy session"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSession(session.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete session"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => {
                                          const updatedSession = { ...session, isDone: !session.isDone };
                                          handleSaveSession(updatedSession);
                                        }}
                                        className={`p-1 transition-colors ${
                                          session.isDone 
                                            ? 'text-green-600 hover:text-green-700' 
                                            : 'text-gray-400 hover:text-green-600'
                                        }`}
                                        title={session.isDone ? 'Mark as pending' : 'Mark as done'}
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          const updatedSession = { ...session, isFavorite: !session.isFavorite };
                                          handleSaveSession(updatedSession);
                                        }}
                                        className={`p-1 transition-colors ${
                                          session.isFavorite 
                                            ? 'text-yellow-500 hover:text-yellow-600' 
                                            : 'text-gray-400 hover:text-yellow-500'
                                        }`}
                                        title={session.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                      >
                                        <Star className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          // TODO: Implement play session functionality
                                          console.log('Play session:', session.name);
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Start session"
                                      >
                                        <Play className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          )}

          {view === 'monthly' && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Month Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getMonthDays().map((day, index) => {
                  const daySessions = getSessionsForDay(day);
                  const isCurrentMonthDay = isCurrentMonth(day);
                  const isTodayDate = isToday(day);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 ${
                        !isCurrentMonthDay ? 'bg-gray-50' : 'bg-white'
                      } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        !isCurrentMonthDay ? 'text-gray-400' :
                        isTodayDate ? 'text-blue-600' : 'text-gray-800'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {daySessions.slice(0, 2).map((session, sessionIndex) => (
                          <div
                            key={session.id}
                            className={`text-xs p-1 rounded truncate ${
                              session.type === 'skill' ? 'bg-blue-100 text-blue-800' :
                              session.type === 'shooting' ? 'bg-orange-100 text-orange-800' :
                              session.type === 'agility' ? 'bg-purple-100 text-purple-800' :
                              session.type === 'cardio' ? 'bg-pink-100 text-pink-800' :
                              session.type === 'strength' ? 'bg-green-100 text-green-800' :
                              session.type === 'recovery' ? 'bg-yellow-100 text-yellow-800' :
                              session.type === 'stretch' ? 'bg-teal-100 text-teal-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                            title={`${session.name} (${session.duration}min)`}
                          >
                            {session.name}
                          </div>
                        ))}
                        {daySessions.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{daySessions.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced Daily Drill Suggestion */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Today's Focus</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Generate a random drill suggestion
                    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
                    setDailyDrill(randomDrill);
                  }}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  title="Get a random drill suggestion"
                >
                  <Shuffle className="w-4 h-4" />
                  Surprise Me
                </button>
                <button
                  onClick={() => setShowDrillModal(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            
            {dailyDrill ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{dailyDrill.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{dailyDrill.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dailyDrill.recommendedDuration || dailyDrill.timer || 0} sec
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {dailyDrill.category}
                      </span>
                      {dailyDrill.isFavorite && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          Favorite
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Add to today's session
                          const today = getTodayISO();
                          const todaySessions = sessions.filter(s => s.date === today);
                          if (todaySessions.length > 0) {
                            const updatedSession = {
                              ...todaySessions[0],
                              drills: [...todaySessions[0].drills, dailyDrill]
                            };
                            handleSaveSession(updatedSession);
                          } else {
                            // Create new session for today
                            const newSession: PlannerSession = {
                              id: Date.now().toString(),
                              name: `Training Session - ${dailyDrill.category}`,
                              date: today,
                              time: '17:00',
                              type: dailyDrill.category,
                              drills: [dailyDrill],
                              duration: Math.ceil((dailyDrill.recommendedDuration || dailyDrill.timer || 300) / 60),
                              notes: `Added from daily suggestion: ${dailyDrill.name}`,
                              isDone: false,
                              isFavorite: false
                            };
                            handleSaveSession(newSession);
                          }
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add to Today
                      </button>
                      <button
                        onClick={() => {
                          const updatedDrill = { ...dailyDrill, isFavorite: !dailyDrill.isFavorite };
                          setDailyDrill(updatedDrill);
                        }}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          dailyDrill.isFavorite
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${dailyDrill.isFavorite ? 'fill-current' : ''}`} />
                        {dailyDrill.isFavorite ? 'Favorited' : 'Favorite'}
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement timer functionality
                          console.log('Start timer for:', dailyDrill.name);
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Timer className="w-3 h-3" />
                        Start Timer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No daily drill selected</p>
                <button
                  onClick={() => {
                    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
                    setDailyDrill(randomDrill);
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Get a suggestion
                </button>
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.type === 'skill').length}
                </div>
                <div className="text-sm text-green-700">Skill Sessions</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {sessions.filter(s => s.type === 'shooting').length}
                </div>
                <div className="text-sm text-orange-700">Shooting Sessions</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {sessions.filter(s => s.type === 'agility').length}
                </div>
                <div className="text-sm text-purple-700">Agility Sessions</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sessions.reduce((total, session) => total + session.duration, 0)}
                </div>
                <div className="text-sm text-blue-700">Total Minutes</div>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Training Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                      <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{template.sessions} sessions</span>
                      <span>{template.duration} days</span>
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add/Edit Session Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingSession ? 'Edit Session' : 'Add New Session'}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Name
                      </label>
                      <input
                        type="text"
                        value={editingSession?.name || ''}
                        onChange={(e) => setEditingSession(prev => 
                          prev ? {...prev, name: e.target.value} : null
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Morning Skills Training"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Type
                      </label>
                      <select
                        value={editingSession?.type || ''}
                        onChange={(e) => setEditingSession(prev => 
                          prev ? {...prev, type: e.target.value as string} : null
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={editingSession?.date || ''}
                        onChange={(e) => setEditingSession(prev => 
                          prev ? {...prev, date: e.target.value} : null
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={editingSession?.duration || ''}
                        onChange={(e) => setEditingSession(prev => 
                          prev ? {...prev, duration: parseInt(e.target.value) || 0} : null
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editingSession?.notes || ''}
                      onChange={(e) => setEditingSession(prev => 
                        prev ? {...prev, notes: e.target.value} : null
                      )}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any notes about this session..."
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingSession(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // This will be handled by the form submission
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editingSession ? 'Update Session' : 'Add Session'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Drill Selection Modal */}
          {showDrillModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Select Drills</h2>
                    <button
                      onClick={() => setShowDrillModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search drills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allDrills.filter(d =>
                      (!searchTerm || d.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                      (editingSession?.type === 'custom' || d.category === editingSession?.type || d.type === editingSession?.type)
                    ).map((drill) => (
                      <div
                        key={drill.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => handleAddDrillToSession(drill)}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{drill.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{drill.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{drill.recommendedDuration || drill.timer || 0} sec</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            drill.category === 'skill' ? 'bg-blue-100 text-blue-800' :
                            drill.category === 'shooting' ? 'bg-orange-100 text-orange-800' :
                            drill.category === 'agility' ? 'bg-purple-100 text-purple-800' :
                            drill.category === 'cardio' ? 'bg-pink-100 text-pink-800' :
                            drill.category === 'strength' ? 'bg-green-100 text-green-800' :
                            drill.category === 'recovery' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {drill.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings Modal */}
          {showNotificationSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                    <button
                      onClick={() => setShowNotificationSettings(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Permission Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {notificationPermission === 'granted' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <span className="font-medium text-gray-800">
                        {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Notifications Disabled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {notificationPermission === 'granted' 
                        ? 'You\'ll receive reminders for your training sessions.'
                        : 'Enable notifications to get reminders for your training sessions.'
                      }
                    </p>
                    {notificationPermission !== 'granted' && (
                      <button
                        onClick={requestNotificationPermission}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Enable Notifications
                      </button>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={globalNotificationSettings.enabled}
                          onChange={(e) => setGlobalNotificationSettings(prev => ({
                            ...prev,
                            enabled: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Enable session reminders</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Time (minutes before session)
                      </label>
                      <select
                        value={globalNotificationSettings.reminderMinutes}
                        onChange={(e) => setGlobalNotificationSettings(prev => ({
                          ...prev,
                          reminderMinutes: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={globalNotificationSettings.sound}
                          onChange={(e) => setGlobalNotificationSettings(prev => ({
                            ...prev,
                            sound: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Play sound</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={globalNotificationSettings.vibration}
                          onChange={(e) => setGlobalNotificationSettings(prev => ({
                            ...prev,
                            vibration: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">Vibrate (mobile)</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Message
                      </label>
                      <textarea
                        value={globalNotificationSettings.message}
                        onChange={(e) => setGlobalNotificationSettings(prev => ({
                          ...prev,
                          message: e.target.value
                        }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Custom notification message..."
                      />
                    </div>
                  </div>

                  {/* Test Notification */}
                  {notificationPermission === 'granted' && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          new Notification('Basketball Training Reminder', {
                            body: globalNotificationSettings.message,
                            icon: '/favicon.ico',
                            badge: '/favicon.ico'
                          });
                          if (globalNotificationSettings.sound) playNotificationSound();
                          if (globalNotificationSettings.vibration && 'vibrate' in navigator) {
                            navigator.vibrate([200, 100, 200]);
                          }
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Test Notification
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* User Profile Modal for Plan Generation */}
        {showUserProfileModal && (
          <UserProfileModal
            isOpen={showUserProfileModal}
            onClose={() => setShowUserProfileModal(false)}
            onSave={handleGeneratePlan}
          />
        )}

        {/* Plan Preview Modal */}
        {generatedPlan && (
          <PlanPreview
            plan={generatedPlan}
            onClose={() => setGeneratedPlan(null)}
            onApply={handleApplyPlan}
            onEdit={() => {
              setShowUserProfileModal(true);
              setGeneratedPlan(null);
            }}
          />
        )}

        {/* Enhanced Modal Components */}
        
        {/* Weekly Summary Modal */}
        {showWeeklySummary && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Weekly Summary</h2>
                    <button
                      onClick={() => setShowWeeklySummary(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {weeklySummaries.length > 0 ? (
                    <div className="space-y-6">
                      {weeklySummaries.slice(-1).map((summary, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {summary.plannedSessions}
                              </div>
                              <div className="text-sm text-green-700">Planned Sessions</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {summary.completedSessions}
                              </div>
                              <div className="text-sm text-blue-700">Completed Sessions</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {summary.totalCompletedDuration}
                              </div>
                              <div className="text-sm text-purple-700">Minutes Completed</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {summary.caloriesBurned}
                              </div>
                              <div className="text-sm text-orange-700">Calories Burned</div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Category Breakdown</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(summary.categoryBreakdown).map(([category, count]) => (
                                <div key={category} className="bg-white rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold text-gray-800">{count}</div>
                                  <div className="text-sm text-gray-600 capitalize">{category}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Week of {summary.weekStart} to {summary.weekEnd}
                            </div>
                            <div className="text-sm text-gray-600">
                              Streak: {summary.streak} days
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No weekly summary available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Templates Modal */}
          {showTemplates && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Training Templates</h2>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => handleApplyTemplate(template)}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{template.sessions} sessions</span>
                          <span>{template.duration} days</span>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Drill Modal */}
          {showCustomDrillModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Add Custom Drill</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newDrill: CustomDrill = {
                      id: Date.now().toString(),
                      name: formData.get('name') as string,
                      description: formData.get('description') as string,
                      instructions: (formData.get('instructions') as string).split('\n').filter(line => line.trim()),
                      videoUrl: formData.get('videoUrl') as string,
                      category: formData.get('category') as string,
                      duration: parseInt(formData.get('duration') as string) || 0,
                      sets: parseInt(formData.get('sets') as string) || undefined,
                      reps: parseInt(formData.get('reps') as string) || undefined,
                      createdBy: 'user',
                      createdAt: new Date()
                    };
                    handleAddCustomDrill(newDrill);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Drill Name</label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Custom Drill Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          name="description"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe the drill..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions (one per line)</label>
                        <textarea
                          name="instructions"
                          rows={4}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Step 1: ...&#10;Step 2: ...&#10;Step 3: ..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            name="category"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select category</option>
                            {CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                          <input
                            name="duration"
                            type="number"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sets (optional)</label>
                          <input
                            name="sets"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reps (optional)</label>
                          <input
                            name="reps"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (optional)</label>
                        <input
                          name="videoUrl"
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCustomDrillModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add Drill
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Team Modal */}
          {showTeamModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Team Training Sessions</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Team functionality coming soon!</p>
                      <p className="text-sm">Create and join team training sessions</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowTeamModal(false)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Profile Modal */}
          {showUserProfileModal && (
            <UserProfileModal
              onClose={() => setShowUserProfileModal(false)}
              onGenerate={handleGeneratePlan}
            />
          )}

          {/* Session Modal */}
          {showAddModal && (
            <SessionModal
              session={editingSession}
              day={modalDay}
              onClose={() => {
                setShowAddModal(false);
                setEditingSession(null);
              }}
              onSave={handleSaveSession}
            />
          )}
        
    </DragDropContext>
  );
};

// --- Session Modal with Drag & Drop for Drills ---
interface SessionModalProps {
  session: PlannerSession | null;
  day: string;
  onClose: () => void;
  onSave: (session: PlannerSession) => void;
}
const SessionModal: React.FC<SessionModalProps> = ({ session, day, onClose, onSave }) => {
  const [type, setType] = useState(session?.type || 'skill');
  const [date, setDate] = useState(session?.date || day);
  const [time, setTime] = useState(session?.time || '17:00');
  const [duration, setDuration] = useState(session?.duration || 60);
  const [notes, setNotes] = useState(session?.notes || '');
  const [isDone, setIsDone] = useState(session?.isDone || false);
  const [isFavorite, setIsFavorite] = useState(session?.isFavorite || false);
  const [drills, setDrills] = useState<DrillInSession[]>(session?.drills || []);
  const [drillSearch, setDrillSearch] = useState('');
  const [allDrills, setAllDrills] = useState<any[]>([]);

  useEffect(() => {
    setAllDrills(getAllDrills());
  }, []);

  // Filter drills by search and type
  const filteredDrills = allDrills.filter(d =>
    (!drillSearch || d.name.toLowerCase().includes(drillSearch.toLowerCase())) &&
    (type === 'custom' || d.category === type || d.type === type)
  );

  // Add drill to session
  const addDrill = (drill: any) => {
    if (!drills.find(d => d.id === drill.id)) {
      setDrills([...drills, { ...drill, isDone: false, isFavorite: false }]);
    }
  };
  // Remove drill
  const removeDrill = (id: string) => {
    setDrills(drills.filter(d => d.id !== id));
  };
  // Toggle done/favorite
  const toggleDrillDone = (id: string) => {
    setDrills(drills.map(d => d.id === id ? { ...d, isDone: !d.isDone } : d));
  };
  const toggleDrillFavorite = (id: string) => {
    setDrills(drills.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  };
  // Reorder drills (drag & drop can be added later)
  const moveDrill = (from: number, to: number) => {
    if (to < 0 || to >= drills.length) return;
    const newDrills = [...drills];
    const [moved] = newDrills.splice(from, 1);
    newDrills.splice(to, 0, moved);
    setDrills(newDrills);
  };

  // Handle drill reordering
  const handleDrillDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(drills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDrills(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: PlannerSession = {
      id: session?.id || Date.now().toString(),
      name: session?.name || `Training Session - ${type}`,
      date,
      time,
      type,
      drills,
      duration,
      notes,
      isDone,
      isFavorite,
    };
    onSave(newSession);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="font-bold text-lg mb-4">{session ? 'Edit' : 'Add'} Session</div>
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Date</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-3 py-2" required />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Time</span>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border rounded px-3 py-2" required />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Type</span>
            <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </label>
          {/* Drill Search and Add */}
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Search drills..."
                value={drillSearch}
                onChange={e => setDrillSearch(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                type="button"
                className="bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium"
                onClick={() => setDrillSearch('')}
              >
                Clear
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto border rounded mb-2 bg-gray-50">
              {filteredDrills.slice(0, 10).map(drill => (
                <div key={drill.id} className="flex items-center justify-between px-2 py-1 hover:bg-orange-50 cursor-pointer" onClick={() => addDrill(drill)}>
                  <span className="text-sm">{drill.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{drill.category}</span>
                  <button type="button" className="ml-2 text-orange-600 text-xs">Add</button>
                </div>
              ))}
              {filteredDrills.length === 0 && <div className="text-xs text-gray-400 px-2 py-1">No drills found</div>}
            </div>
          </div>

          {/* Selected Drills List with Drag & Drop */}
          <div>
            <div className="font-medium mb-1">Drills in Session</div>
            {drills.length === 0 && <div className="text-xs text-gray-400">No drills added</div>}
            <Droppable droppableId="drills" type="drill">
              {(provided, snapshot) => (
                <ul 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-orange-50 rounded p-2' : ''}`}
                >
                  {drills.map((drill, idx) => (
                    <Draggable key={drill.id} draggableId={drill.id} index={idx}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-50 rounded p-2 flex flex-col gap-1 relative ${
                            snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                              ⋮⋮
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{drill.name}</span>
                            <span className="text-xs text-gray-500">{drill.category}</span>
                            <button type="button" className="ml-2 text-red-500 text-xs" onClick={() => removeDrill(drill.id)}>
                              Remove
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{drill.instructions?.[0]}</div>
                          {drill.videoId && (
                            <div className="mb-1">
                              <iframe
                                className="rounded"
                                width="100%"
                                height="120"
                                src={`https://www.youtube.com/embed/${drill.videoId}`}
                                title={drill.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          <div className="flex gap-2 items-center text-xs">
                            <span>Timer: {drill.recommendedDuration || drill.timer || 0} sec</span>
                            <button type="button" className={drill.isDone ? 'text-green-600' : 'text-gray-400'} onClick={() => toggleDrillDone(drill.id)}>
                              {drill.isDone ? '✓ Done' : 'Mark as Done'}
                            </button>
                            <button type="button" className={drill.isFavorite ? 'text-yellow-500' : 'text-gray-400'} onClick={() => toggleDrillFavorite(drill.id)}>
                              ★
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Duration (min)</span>
            <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} className="border rounded px-3 py-2" required />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Notes</span>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="border rounded px-3 py-2" rows={2} />
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isDone} onChange={e => setIsDone(e.target.checked)} />
              <span className="text-sm">Mark as Done</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isFavorite} onChange={e => setIsFavorite(e.target.checked)} />
              <span className="text-sm">Favorite</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <button type="button" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-orange-600 text-white">Save</button>
        </div>
      </form>
    </div>
  );
};

export default Planner; 