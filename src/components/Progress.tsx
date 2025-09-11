import React, { useEffect, useState, useRef } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  Smile,
  Download,
  Lightbulb,
  Trophy,
  User,
  Star
} from 'lucide-react';
import './Progress.css';

// Types
interface DrillStat {
  name: string;
  times: number;
  last: string;
  total: number;
}

const Progress: React.FC = () => {
  // State
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<{ [date: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Ref for export
  const progressRef = useRef<HTMLDivElement>(null);

  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mood config
  const moodEmojis = ['😞', '😕', '😐', '🙂', '😃'];
  const moodLabels = ['Bad', 'Meh', 'Okay', 'Good', 'Great'];
  const COLORS = ['#fb923c', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'];

  // Load data from localStorage
  useEffect(() => {
    const loadProgressData = () => {
      try {
        // Load weekly summaries
        const summaries = JSON.parse(localStorage.getItem('weeklySummaries') || '[]');
        const { weekStart, weekEnd } = getCurrentWeekRange();
        let summary = summaries.find((w: any) => w.weekStart === weekStart && w.weekEnd === weekEnd);
        if (!summary && summaries.length > 0) summary = summaries[summaries.length - 1];
        setWeeklySummary(summary);

        // Load user progress
        const progress = JSON.parse(localStorage.getItem('userProgress') || 'null');
        setUserProgress(progress);

        // Load user profile (fallback)
        const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
        setProfile(prof);

        // Load badges
        const badgeArr = JSON.parse(localStorage.getItem('badges') || '[]');
        setBadges(badgeArr);

        // Load mood data
        const storedMood = JSON.parse(localStorage.getItem('moodTracking') || '{}');
        setMoodData(storedMood);

        setLoading(false);
      } catch (error) {
        console.error('Error loading progress data:', error);
        setLoading(false);
      }
    };

    loadProgressData();
  }, []);

  // Save mood data
  const setMoodForDay = (dateISO: string, mood: number) => {
    const updated = { ...moodData, [dateISO]: mood };
    setMoodData(updated);
    localStorage.setItem('moodTracking', JSON.stringify(updated));
  };

  // Export functions
  const handleExport = async (type: 'image' | 'pdf') => {
    if (!progressRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(progressRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? '#111827' : '#ffffff'
      });

      if (type === 'image') {
        const link = document.createElement('a');
        link.download = `basketball-progress-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`basketball-progress-${new Date().toISOString().split('T')[0]}.pdf`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Helper functions
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

  function getWeekDates(startISO: string) {
    const start = new Date(startISO);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  const weekDates = weeklySummary?.weekStart
    ? getWeekDates(weeklySummary.weekStart)
    : getWeekDates(getCurrentWeekRange().weekStart);

  const sessions = weeklySummary?.sessions ?? [];
  const getSessionsForDay = (iso: string) => {
    return sessions.filter((s: any) => s.date === iso);
  };

  // Drill stats
  function getDrillStats(): DrillStat[] {
    if (!sessions || sessions.length === 0) {
      return [
        { name: 'Jump Shot', times: 3, last: '2024-07-01', total: 45 },
        { name: 'Crossover Dribble', times: 2, last: '2024-07-03', total: 30 },
        { name: 'Suicide Sprints', times: 1, last: '2024-07-02', total: 15 },
      ];
    }
    const drillMap: Record<string, DrillStat> = {};
    sessions.forEach((session: any) => {
      (session.drills || []).forEach((drill: any) => {
        if (!drillMap[drill.name]) {
          drillMap[drill.name] = { name: drill.name, times: 0, last: '', total: 0 };
        }
        drillMap[drill.name].times += 1;
        drillMap[drill.name].total += drill.duration || 0;
        if (!drillMap[drill.name].last || session.date > drillMap[drill.name].last) {
          drillMap[drill.name].last = session.date;
        }
      });
    });
    return Object.values(drillMap).sort((a, b) => b.times - a.times);
  }
  const drillStats = getDrillStats();

  // Mood trend data
  const moodTrend = weekDates.map(date => {
    const iso = date.toISOString().slice(0, 10);
    return {
      name: date.toLocaleDateString(undefined, { weekday: 'short' }),
      Mood: moodData[iso] ?? null,
      iso,
    };
  });
  const hasMood = moodTrend.some(d => d.Mood !== null);
  const fallbackMood = [2, 3, 4, 3, 2, 1, 2];
  const moodTrendDisplay = hasMood
    ? moodTrend.map((d, i) => ({ ...d, Mood: d.Mood ?? 2 }))
    : weekDates.map((date, i) => ({
        name: date.toLocaleDateString(undefined, { weekday: 'short' }),
        Mood: fallbackMood[i],
        iso: date.toISOString().slice(0, 10),
      }));

  // Coaching insights
  function getCoachingInsights() {
    if (!weeklySummary || !drillStats || drillStats.length === 0) {
      return [
        'Keep up the good work! Try to log more sessions for deeper insights.',
      ];
    }
    const tips = [];
    const cat = weeklySummary.categoryBreakdown || {};

    if (cat.Passing !== undefined && cat.Passing < 30) {
      tips.push('Add more passing drills next week for better court vision.');
    }
    if (weeklySummary.completedSessions < weeklySummary.plannedSessions) {
      tips.push('Aim to complete all planned sessions for a stronger streak.');
    }
    if ((userProgress?.streak ?? 0) < 3) {
      tips.push('Build your streak by training on consecutive days!');
    }
    if (drillStats[0]?.times > 4) {
      tips.push(`Try mixing up your drills—${drillStats[0].name} is your most repeated!`);
    }
    if (tips.length === 0) {
      tips.push('Great job! Keep challenging yourself with new drills and goals.');
    }
    return tips;
  }
  const coachingInsights = getCoachingInsights();

  // Fallbacks
  const todayISO = new Date().toISOString().slice(0, 10);
  const totalMinutes = weeklySummary?.totalCompletedDuration ?? 315;
  const plannedSessions = weeklySummary?.plannedSessions ?? 7;
  const completedSessions = weeklySummary?.completedSessions ?? 6;
  const streak = (userProgress?.streak ?? profile?.streak) ?? 7;
  const xp = (userProgress?.xp ?? profile?.xp) ?? 1400;
  const level = (userProgress?.level ?? profile?.level) ?? 5;
  const categoryBreakdown = weeklySummary?.categoryBreakdown ?? { Shooting: 120, Agility: 90, Strength: 60, Cardio: 45 };
  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  // Weekly trend data
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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Chart theme colors
  const chartTheme = {
    textColor: isDarkMode ? '#f3f4f6' : '#111827',
    axisColor: isDarkMode ? '#9ca3af' : '#374151',
    tooltipBg: isDarkMode ? '#1f2937' : '#ffffff',
    tooltipBorder: isDarkMode ? '#374151' : '#e5e7eb',
  };

  return (
    <div ref={progressRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Summary Card */}
      <div className="bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900 dark:to-purple-900 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Progress</h2>
        <div className="flex items-center gap-4 mb-2">
          <Award className="text-orange-500" size={32} />
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Streak: <span className="text-orange-600">{streak} days</span>
          </span>
          <Trophy className="text-yellow-500" size={28} />
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Level: <span className="text-yellow-600">{level}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <BarChart3 className="text-purple-500" size={28} />
          <span className="text-lg text-gray-800 dark:text-gray-200">
            Total Minutes This Week: <span className="font-bold text-purple-700">{totalMinutes}</span>
          </span>
          <TrendingUp className="text-green-500" size={28} />
          <span className="text-lg text-gray-800 dark:text-gray-200">
            Sessions: <span className="font-bold text-green-700">{completedSessions}/{plannedSessions}</span>
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 w-full md:w-1/3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((xp / 2000) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">XP: {xp} / 2000</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <BarChart3 className="text-orange-400" /> Category Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{
                color: chartTheme.textColor,
              }}
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '0.5rem',
                color: chartTheme.textColor,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <TrendingUp className="text-green-400" /> Weekly Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <XAxis
              dataKey="name"
              tick={{ fill: chartTheme.textColor }}
              axisLine={{ stroke: chartTheme.axisColor }}
              tickLine={{ stroke: chartTheme.axisColor }}
            />
            <YAxis
              tick={{ fill: chartTheme.textColor }}
              axisLine={{ stroke: chartTheme.axisColor }}
              tickLine={{ stroke: chartTheme.axisColor }}
            />
            <Tooltip
              wrapperStyle={{
                color: chartTheme.textColor,
              }}
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                border: `1px solid ${chartTheme.tooltipBorder}`,
                borderRadius: '0.5rem',
                color: chartTheme.textColor,
              }}
            />
            <Legend
              wrapperStyle={{
                color: chartTheme.textColor,
              }}
            />
            <Bar dataKey="Minutes" fill="#fb923c" name="Minutes Trained" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Training Calendar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Calendar className="text-blue-400" /> Training Calendar
        </h3>
        <div className="flex justify-between items-center mb-4">
          {weekDates.map((date, idx) => {
            const iso = date.toISOString().slice(0, 10);
            const daySessions = getSessionsForDay(iso);
            const isToday = iso === todayISO;
            return (
              <button
                key={iso}
                onClick={() => setSelectedDay(iso)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all focus:outline-none border-2
                  ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' : 'border-transparent'}
                  ${daySessions.length > 0 ? 'bg-blue-50 text-blue-700 font-bold shadow dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}
                  hover:bg-blue-100 dark:hover:bg-blue-900/50`}
              >
                <span className="text-xs uppercase tracking-wide text-gray-800 dark:text-gray-200">
                  {date.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-lg text-gray-800 dark:text-gray-200">{date.getDate()}</span>
                {daySessions.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1"></span>}
              </button>
            );
          })}
        </div>
        {selectedDay && (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {new Date(selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <button className="text-xs text-blue-400 hover:underline" onClick={() => setSelectedDay(null)}>
                Close
              </button>
            </div>
            {getSessionsForDay(selectedDay).length > 0 ? (
              <ul className="space-y-2">
                {getSessionsForDay(selectedDay).map((session: any) => (
                  <li key={session.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-bold text-blue-700 dark:text-blue-300">{session.name || 'Session'}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{session.time || ''}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{session.drills?.length || 0} drills</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{session.duration || 0} min</span>
                      {session.drills && session.drills.length > 0 && (
                        <ul className="text-xs text-gray-700 dark:text-gray-300 mt-1">
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
              <div className="text-gray-400 dark:text-gray-500 text-sm">No session for this day.</div>
            )}
          </div>
        )}
      </div>

      {/* Personal Records */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <Trophy className="text-yellow-500 mb-2" size={32} />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Longest Streak</span>
          <span className="text-2xl text-orange-600 font-extrabold">{userProgress?.longestStreak ?? 14} days</span>
        </div>
        <div className="flex flex-col items-center">
          <BarChart3 className="text-purple-500 mb-2" size={32} />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Most Minutes</span>
          <span className="text-2xl text-purple-700 font-extrabold">{userProgress?.mostMinutes ?? 120}</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="text-pink-500 mb-2" size={32} />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Most Shots</span>
          <span className="text-2xl text-pink-700 font-extrabold">{userProgress?.mostShots ?? 500}</span>
        </div>
      </div>

      {/* Drill Stats */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <User className="text-gray-400" /> Drill Stats
        </h3>
        {drillStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4 text-left text-gray-800 dark:text-gray-200">Drill</th>
                  <th className="py-2 pr-4 text-left text-gray-800 dark:text-gray-200">Times Done</th>
                  <th className="py-2 pr-4 text-left text-gray-800 dark:text-gray-200">Last Practiced</th>
                  <th className="py-2 pr-4 text-left text-gray-800 dark:text-gray-200">Total Time (min)</th>
                </tr>
              </thead>
              <tbody>
                {drillStats.map(drill => (
                  <tr key={drill.name} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <td className="py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">{drill.name}</td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-200">{drill.times}</td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-200">{drill.last ? new Date(drill.last).toLocaleDateString() : '-'}</td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-200">{Math.round(drill.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 dark:text-gray-500">No drill stats available.</div>
        )}
      </div>

      {/* Mood Tracking */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Smile className="text-pink-400" /> Mood Tracking
        </h3>
        <div className="mb-4 flex items-center gap-4">
          <span className="font-semibold text-gray-800 dark:text-gray-100">How do you feel today?</span>
          {moodEmojis.map((emoji, idx) => (
            <button
              key={emoji}
              className={`text-2xl px-2 py-1 rounded-full transition-all focus:outline-none ${
                moodData[todayISO] === idx 
                  ? 'bg-pink-100 dark:bg-pink-900/50 scale-110' 
                  : 'hover:bg-pink-50 dark:hover:bg-pink-900/30'
              }`}
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodTrendDisplay}>
              <XAxis
                dataKey="name"
                tick={{ fill: chartTheme.textColor }}
                axisLine={{ stroke: chartTheme.axisColor }}
                tickLine={{ stroke: chartTheme.axisColor }}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(tick) => moodLabels[tick]}
                tick={{ fill: chartTheme.textColor }}
                axisLine={{ stroke: chartTheme.axisColor }}
                tickLine={{ stroke: chartTheme.axisColor }}
              />
              <Tooltip
                formatter={(value) => moodLabels[value as number]}
                wrapperStyle={{
                  color: chartTheme.textColor,
                }}
                contentStyle={{
                  backgroundColor: chartTheme.tooltipBg,
                  border: `1px solid ${chartTheme.tooltipBorder}`,
                  borderRadius: '0.5rem',
                  color: chartTheme.textColor,
                }}
              />
              <Line
                type="monotone"
                dataKey="Mood"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 4 }}
                name="Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gamification */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Award className="text-orange-400" /> Gamification
        </h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Badges */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Badges Earned</div>
            <div className="flex flex-wrap gap-3">
              {(badges.length > 0 ? badges : [
                { id: 'mock1', name: 'Streak Starter', icon: '🔥', description: '3-day streak' },
                { id: 'mock2', name: 'First Session', icon: '🏅', description: 'Completed first session' },
                { id: 'mock3', name: 'Sharpshooter', icon: '🎯', description: '100 shots made' },
              ]).map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-xl p-3 shadow hover:scale-105 transition-transform cursor-pointer"
                  title={badge.description}
                >
                  <span className="text-3xl mb-1">{badge.icon || '🏅'}</span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* XP Summary */}
          <div className="flex-1">
            <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">XP Summary</div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-800 dark:text-gray-200">
                XP this week: <span className="font-bold text-orange-500">{weeklySummary?.xpEarned ?? 120}</span>
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                XP per session: <span className="font-bold text-purple-500">{weeklySummary?.xpPerSession ?? 20}</span>
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                XP per drill: <span className="font-bold text-pink-500">{weeklySummary?.xpPerDrill ?? 5}</span>
              </span>
            </div>
          </div>
          {/* Level Progress */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Level Progress</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-purple-500 h-4 rounded-full transition-all animate-pulse"
                style={{ width: `${Math.min((xp / 2000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">XP: {xp} / 2000</span>
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">Level {level}</span>
          </div>
        </div>
      </div>

      {/* Coaching Insights */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Lightbulb className="text-yellow-400" /> Coaching Insights
        </h3>
        <ul className="space-y-2">
          {coachingInsights.map((tip, i) => (
            <li key={i} className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded p-3 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <Lightbulb className="text-yellow-400 dark:text-yellow-300" size={18} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="text-blue-400" />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">Export Progress</span>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-gradient-to-r from-orange-400 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
            onClick={() => handleExport('image')}
            disabled={exporting}
          >
            {exporting ? (
              <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
            ) : null}
            Export as Image
          </button>
          <button
            className="bg-gradient-to-r from-purple-400 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            {exporting ? (
              <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
            ) : null}
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Progress;