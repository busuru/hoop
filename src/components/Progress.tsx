import React, { useEffect, useState, useRef } from 'react';
// Recharts imports (placeholders for now)
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Calendar, Award, TrendingUp, BarChart3, Smile, Download, Lightbulb, Trophy, User, Star } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import './Progress.css'; // For any custom animations (optional)

// Simple chart placeholder components
const SimpleChart = ({ data, type }: { data: any[], type: string }) => (
  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500">{type} Chart</p>
      <p className="text-sm text-gray-400">{data.length} data points</p>
    </div>
  </div>
);

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    weekStart: monday.toISOString().slice(0, 10),
    weekEnd: sunday.toISOString().slice(0, 10),
  };
}

const Progress: React.FC = () => {
  // State for dynamic hero summary
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);

  // Calendar view state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Mood tracking state
  const [moodData, setMoodData] = useState<{ [date: string]: number }>({});
  const moodEmojis = ['😞', '😕', '😐', '🙂', '😃'];
  const moodLabels = ['Bad', 'Meh', 'Okay', 'Good', 'Great'];

  const progressRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport(type: 'image' | 'pdf') {
    if (!progressRef.current) return;
    setExporting(true);
    try {
      // Placeholder for export functionality
      alert(`Export as ${type} - Feature coming soon!`);
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    // Load weekly summaries
    const summaries = JSON.parse(localStorage.getItem('weeklySummaries') || '[]');
    const { weekStart, weekEnd } = getCurrentWeekRange();
    let summary = summaries.find((w: any) => w.weekStart === weekStart && w.weekEnd === weekEnd);
    if (!summary && summaries.length > 0) summary = summaries[summaries.length - 1];
    setWeeklySummary(summary);

    // Load user progress
    const progress = JSON.parse(localStorage.getItem('userProgress') || 'null');
    setUserProgress(progress);

    // Load user profile (for XP, level, streak)
    const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
    setProfile(prof);

    // Load badges
    const badgeArr = JSON.parse(localStorage.getItem('badges') || '[]');
    setBadges(badgeArr);
  }, []);

  // Load mood data from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('moodTracking') || '{}');
    setMoodData(stored);
  }, []);

  // Save mood data to localStorage
  function setMoodForDay(dateISO: string, mood: number) {
    const updated = { ...moodData, [dateISO]: mood };
    setMoodData(updated);
    localStorage.setItem('moodTracking', JSON.stringify(updated));
  }

  // Prepare mood trend data for the week
  const weekDates = weeklySummary?.weekStart ? getWeekDates(weeklySummary.weekStart) : getWeekDates(getCurrentWeekRange().weekStart);
  const moodTrend = weekDates.map(date => {
    const iso = date.toISOString().slice(0, 10);
    return {
      name: date.toLocaleDateString(undefined, { weekday: 'short' }),
      Mood: moodData[iso] ?? null,
      iso,
    };
  });
  // Fallback: if no mood data, use mock
  const hasMood = moodTrend.some(d => d.Mood !== null);
  const fallbackMood = [2, 3, 4, 3, 2, 1, 2];
  const moodTrendDisplay = hasMood
    ? moodTrend.map((d, i) => ({ ...d, Mood: d.Mood ?? 2 }))
    : weekDates.map((date, i) => ({
        name: date.toLocaleDateString(undefined, { weekday: 'short' }),
        Mood: fallbackMood[i],
        iso: date.toISOString().slice(0, 10),
      }));

  const todayISO = new Date().toISOString().slice(0, 10);

  // Fallbacks if no data
  const totalMinutes = weeklySummary?.totalCompletedDuration ?? 315;
  const plannedSessions = weeklySummary?.plannedSessions ?? 7;
  const completedSessions = weeklySummary?.completedSessions ?? 6;
  const streak = (userProgress?.streak ?? profile?.streak) ?? 7;
  const xp = (userProgress?.xp ?? profile?.xp) ?? 1400;
  const level = (userProgress?.level ?? profile?.level) ?? 5;

  // Find streak badge
  const streakBadge = badges.find(b => b.category === 'streak');

  // Dynamic category breakdown for pie chart
  const categoryBreakdown = weeklySummary?.categoryBreakdown ?? {
    Shooting: 120,
    Agility: 90,
    Strength: 60,
    Cardio: 45,
  };
  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  // Dynamic trend data for the week (minutes trained per day)
  function getWeekDates(startISO: string) {
    const start = new Date(startISO);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }
  let trendData = [];
  if (weeklySummary?.weekStart && weeklySummary?.sessions) {
    const weekDates = getWeekDates(weeklySummary.weekStart);
    trendData = weekDates.map(date => {
      const iso = date.toISOString().slice(0, 10);
      const daySessions = weeklySummary.sessions?.filter((s: any) => s.date === iso) || [];
      const total = daySessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
      return {
        name: date.toLocaleDateString(undefined, { weekday: 'short' }),
        Minutes: total,
      };
    });
  } else {
    trendData = [
      { name: 'Mon', Minutes: 30 },
      { name: 'Tue', Minutes: 45 },
      { name: 'Wed', Minutes: 60 },
      { name: 'Thu', Minutes: 40 },
      { name: 'Fri', Minutes: 50 },
      { name: 'Sat', Minutes: 70 },
      { name: 'Sun', Minutes: 20 },
    ];
  }
  const COLORS = ['#fb923c', '#a78bfa', '#34d399', '#f472b6'];

  // Helper: get week dates and sessions
  const sessions = weeklySummary?.sessions ?? [];

  // Helper: get sessions for a given ISO date
  function getSessionsForDay(iso: string) {
    return sessions.filter((s: any) => s.date === iso);
  }

  // Drill-level stats aggregation
  function getDrillStats() {
    if (!sessions || sessions.length === 0) {
      // Fallback mock data
      return [
        { name: 'Jump Shot', times: 3, last: '2024-07-01', total: 45 },
        { name: 'Crossover Dribble', times: 2, last: '2024-07-03', total: 30 },
        { name: 'Suicide Sprints', times: 1, last: '2024-07-02', total: 15 },
      ];
    }
    const drillMap: Record<string, { name: string; times: number; last: string; total: number }> = {};
    sessions.forEach((session: any) => {
      (session.drills || []).forEach((drill: any) => {
        if (!drillMap[drill.name]) {
          drillMap[drill.name] = { name: drill.name, times: 0, last: '', total: 0 };
        }
        drillMap[drill.name].times += 1;
        drillMap[drill.name].total += drill.recommendedDuration || drill.duration || 0;
        if (!drillMap[drill.name].last || session.date > drillMap[drill.name].last) {
          drillMap[drill.name].last = session.date;
        }
      });
    });
    return Object.values(drillMap).sort((a, b) => b.times - a.times);
  }
  const drillStats = getDrillStats();

  // Smart coaching insights logic
  function getCoachingInsights() {
    if (!weeklySummary || !drillStats || drillStats.length === 0) {
      return [
        'Keep up the good work! Try to log more sessions for deeper insights.',
      ];
    }
    const tips = [];
    // Example: If a category is low, suggest more of it
    const cat = weeklySummary.categoryBreakdown || {};
    if (cat.Passing !== undefined && cat.Passing < 30) {
      tips.push('Add more passing drills next week for better court vision.');
    }
    // Example: If session completion is low
    if (weeklySummary.completedSessions < weeklySummary.plannedSessions) {
      tips.push('Aim to complete all planned sessions for a stronger streak.');
    }
    // Example: If streak is low
    if ((userProgress?.streak ?? 0) < 3) {
      tips.push('Build your streak by training on consecutive days!');
    }
    // Example: If a drill is repeated too often
    if (drillStats[0]?.times > 4) {
      tips.push(`Try mixing up your drills—${drillStats[0].name} is your most repeated!`);
    }
    if (tips.length === 0) {
      tips.push('Great job! Keep challenging yourself with new drills and goals.');
    }
    return tips;
  }
  const coachingInsights = getCoachingInsights();

  return (
    <div ref={progressRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Summary Card */}
      <div className="bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900 dark:to-purple-900 rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 animate-slide-up">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h2>
          <div className="flex items-center gap-4 mb-2">
            <Award className="text-orange-500" size={32} />
            <span className="text-lg font-semibold">Streak: <span className="text-orange-600">{streak} days</span></span>
            <Trophy className="text-yellow-500" size={28} />
            <span className="text-lg font-semibold">Level: <span className="text-yellow-600">{level}</span></span>
          </div>
          <div className="flex items-center gap-4">
            <BarChart3 className="text-purple-500" size={28} />
            <span className="text-lg">Total Minutes This Week: <span className="font-bold text-purple-700">{totalMinutes}</span></span>
            <TrendingUp className="text-green-500" size={28} />
            <span className="text-lg">Sessions: <span className="font-bold text-green-700">{completedSessions}/{plannedSessions}</span></span>
          </div>
        </div>
        {/* XP Progress Bar */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-purple-500 h-4 rounded-full transition-all" style={{ width: `${Math.min((xp / 2000) * 100, 100)}%` }}></div>
          </div>
          <span className="text-sm text-gray-700">XP: {xp} / 2000</span>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="text-orange-400" /> Category Breakdown</h3>
        <SimpleChart data={categoryData} type="Category Breakdown" />
      </div>

      {/* Weekly/Monthly Trend Graph */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-green-400" /> Weekly Trend</h3>
        <SimpleChart data={trendData} type="Weekly Trend" />
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="text-blue-400" /> Training Calendar</h3>
        <div className="flex justify-between items-center mb-4">
          {weekDates.map((date, idx) => {
            const iso = date.toISOString().slice(0, 10);
            const daySessions = getSessionsForDay(iso);
            const isToday = iso === new Date().toISOString().slice(0, 10);
            return (
              <button
                key={iso}
                onClick={() => setSelectedDay(iso)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all focus:outline-none border-2
                  ${isToday ? 'border-blue-500' : 'border-transparent'}
                  ${daySessions.length > 0 ? 'bg-blue-50 text-blue-700 font-bold shadow' : 'bg-gray-50 text-gray-400'}
                  hover:bg-blue-100`}
              >
                <span className="text-xs uppercase tracking-wide">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="text-lg">{date.getDate()}</span>
                {daySessions.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1"></span>}
              </button>
            );
          })}
        </div>
        {selectedDay && (
          <div className="bg-blue-50 rounded-xl p-4 mb-2 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-700">{new Date(selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <button className="text-xs text-blue-400 hover:underline" onClick={() => setSelectedDay(null)}>Close</button>
            </div>
            {getSessionsForDay(selectedDay).length > 0 ? (
              <ul className="space-y-2">
                {getSessionsForDay(selectedDay).map((session: any) => (
                  <li key={session.id} className="bg-white rounded-lg shadow p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-bold text-blue-700">{session.name || 'Session'}</span>
                      <span className="ml-2 text-xs text-gray-500">{session.time || ''}</span>
                      <div className="text-xs text-gray-500">{session.drills?.length || 0} drills</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-blue-600 font-semibold">{session.duration || 0} min</span>
                      {session.drills && session.drills.length > 0 && (
                        <ul className="text-xs text-gray-700 mt-1">
                          {session.drills.map((drill: any) => (
                            <li key={drill.id}>• {drill.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm">No session for this day.</div>
            )}
          </div>
        )}
      </div>

      {/* Personal Records & Milestones */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="flex flex-col items-center">
          <Trophy className="text-yellow-500 mb-2" size={32} />
          <span className="font-bold text-lg">Longest Streak</span>
          <span className="text-2xl text-orange-600 font-extrabold">{userProgress?.longestStreak ?? 14} days</span>
        </div>
        <div className="flex flex-col items-center">
          <BarChart3 className="text-purple-500 mb-2" size={32} />
          <span className="font-bold text-lg">Most Minutes</span>
          <span className="text-2xl text-purple-700 font-extrabold">{userProgress?.mostMinutes ?? 120}</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="text-pink-500 mb-2" size={32} />
          <span className="font-bold text-lg">Most Shots</span>
          <span className="text-2xl text-pink-700 font-extrabold">{userProgress?.mostShots ?? 500}</span>
        </div>
      </div>

      {/* Drill-level Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="text-gray-400" /> Drill Stats</h3>
        {drillStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 pr-4">Drill</th>
                  <th className="py-2 pr-4">Times Done</th>
                  <th className="py-2 pr-4">Last Practiced</th>
                  <th className="py-2 pr-4">Total Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {drillStats.map(drill => (
                  <tr key={drill.name} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-semibold text-gray-800">{drill.name}</td>
                    <td className="py-2 pr-4">{drill.times}</td>
                    <td className="py-2 pr-4">{drill.last ? new Date(drill.last).toLocaleDateString() : '-'}</td>
                    <td className="py-2 pr-4">{Math.round(drill.total / 60)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400">No drill stats available.</div>
        )}
      </div>

      {/* Mood Tracking */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Smile className="text-pink-400" /> Mood Tracking</h3>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-semibold">How do you feel today?</span>
          {moodEmojis.map((emoji, idx) => (
            <button
              key={emoji}
              className={`text-2xl px-2 py-1 rounded-full transition-all focus:outline-none ${moodData[todayISO] === idx ? 'bg-pink-100 scale-110' : 'hover:bg-pink-50'}`}
              onClick={() => setMoodForDay(todayISO, idx)}
              aria-label={moodLabels[idx]}
            >
              {emoji}
            </button>
          ))}
          {moodData[todayISO] !== undefined && (
            <span className="ml-2 text-pink-500 font-semibold">{moodLabels[moodData[todayISO]]}</span>
          )}
        </div>
        <div className="h-32">
          <SimpleChart data={moodTrendDisplay} type="Mood Trend" />
        </div>
      </div>

      {/* Gamification (badges, XP, progress bar) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-orange-400" /> Gamification</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Badges */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-gray-700">Badges Earned</div>
            <div className="flex flex-wrap gap-3">
              {(badges.length > 0 ? badges : [
                { id: 'mock1', name: 'Streak Starter', icon: '🔥', description: '3-day streak' },
                { id: 'mock2', name: 'First Session', icon: '🏅', description: 'Completed first session' },
                { id: 'mock3', name: 'Sharpshooter', icon: '🎯', description: '100 shots made' },
              ]).map(badge => (
                <div key={badge.id} className="flex flex-col items-center bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl p-3 shadow hover:scale-105 transition-transform cursor-pointer" title={badge.description}>
                  <span className="text-3xl mb-1">{badge.icon || '🏅'}</span>
                  <span className="text-xs font-bold text-orange-600">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* XP per session/drill summary */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-gray-700">XP Summary</div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">XP this week: <span className="font-bold text-orange-500">{weeklySummary?.xpEarned ?? 120}</span></span>
              <span className="text-sm">XP per session: <span className="font-bold text-purple-500">{weeklySummary?.xpPerSession ?? 20}</span></span>
              <span className="text-sm">XP per drill: <span className="font-bold text-pink-500">{weeklySummary?.xpPerDrill ?? 5}</span></span>
            </div>
          </div>
          {/* Progress bar to next level */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="font-semibold mb-2 text-gray-700">Level Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-gradient-to-r from-orange-400 to-purple-500 h-4 rounded-full transition-all animate-pulse" style={{ width: `${Math.min((xp / 2000) * 100, 100)}%` }}></div>
            </div>
            <span className="text-sm text-gray-700">XP: {xp} / 2000</span>
            <span className="text-xs text-yellow-600 font-bold">Level {level}</span>
          </div>
        </div>
      </div>

      {/* Smart Coaching Insights */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="text-yellow-400" /> Coaching Insights</h3>
        <ul className="space-y-2">
          {coachingInsights.map((tip, i) => (
            <li key={i} className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3 text-yellow-800 flex items-center gap-2 animate-fade-in">
              <Lightbulb className="text-yellow-400" size={18} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Export as PDF/Image */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <Download className="text-blue-400" />
          <span className="font-bold text-lg">Export Progress</span>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-gradient-to-r from-orange-400 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform flex items-center gap-2"
            onClick={() => handleExport('image')}
            disabled={exporting}
          >
            {exporting ? <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span> : null}
            Export as Image
          </button>
          <button
            className="bg-gradient-to-r from-purple-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform flex items-center gap-2"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            {exporting ? <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span> : null}
            Export as PDF
          </button>
        </div>
      </div>

      {/* Legacy Progress Tracker (optional) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 animate-fade-in">
        <ProgressTracker />
      </div>
    </div>
  );
};

export default Progress; 