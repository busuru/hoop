// src/services/ProgressService.ts
import type { PlannedSession, Drill } from '../components/Planner'; // Import both types

interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  plannedSessions: number;
  completedSessions: number;
  totalCompletedDuration: number;
  categoryBreakdown: Record<string, number>;
  sessions: PlannedSession[];
  xpEarned: number;
  xpPerSession: number;
  xpPerDrill: number;
}

interface UserProgress {
  streak: number;
  longestStreak: number;
  xp: number;
  level: number;
  mostMinutes: number;
  mostShots: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  earnedAt: string | null;
}

class ProgressService {
  // Main entry point — call this whenever sessions change
  static updateProgress(sessions: PlannedSession[]) {
    if (sessions.length === 0) {
      this.clearProgressData();
      return;
    }

    // 1. Generate weekly summaries
    const weeklySummaries = this.generateWeeklySummaries(sessions);
    localStorage.setItem('weeklySummaries', JSON.stringify(weeklySummaries));

    // 2. Calculate user progress
    const userProgress = this.calculateUserProgress(sessions);
    localStorage.setItem('userProgress', JSON.stringify(userProgress));

    // 3. Generate badges
    const badges = this.generateBadges(userProgress, sessions);
    localStorage.setItem('badges', JSON.stringify(badges));

    console.log('✅ Progress data updated');
  }

  private static generateWeeklySummaries(sessions: PlannedSession[]): WeeklySummary[] {
    const summaries: WeeklySummary[] = [];
    const sessionsByWeek = this.groupSessionsByWeek(sessions);

    for (const [weekKey, weekSessions] of Object.entries(sessionsByWeek)) {
      const weekStart = weekKey;
      const weekEnd = this.getWeekEndDate(weekStart);

      const completedSessions = weekSessions.filter(s => s.completed);
      const totalCompletedDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
      
      // Category breakdown (by drill category)
      const categoryBreakdown: Record<string, number> = {};
      completedSessions.forEach((session: PlannedSession) => {
        (session.drills || []).forEach((drill: Drill) => {
          const category = drill.category || 'Other';
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + drill.duration;
        });
      });

      // XP calculations
      const xpEarned = totalCompletedDuration * 2; // 2 XP per minute
      const xpPerSession = completedSessions.length > 0 ? Math.round(xpEarned / completedSessions.length) : 0;
      const totalDrills = completedSessions.reduce((sum, s) => sum + (s.drills?.length || 0), 0);
      const xpPerDrill = totalDrills > 0 ? Math.round(xpEarned / totalDrills) : 0;

      summaries.push({
        weekStart,
        weekEnd,
        plannedSessions: weekSessions.length,
        completedSessions: completedSessions.length,
        totalCompletedDuration,
        categoryBreakdown,
        sessions: weekSessions,
        xpEarned,
        xpPerSession,
        xpPerDrill
      });
    }

    return summaries.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }

  private static groupSessionsByWeek(sessions: PlannedSession[]) {
    const grouped: Record<string, PlannedSession[]> = {};

    sessions.forEach(session => {
      const weekStart = this.getWeekStartDate(session.date);
      if (!grouped[weekStart]) {
        grouped[weekStart] = [];
      }
      grouped[weekStart].push(session);
    });

    return grouped;
  }

  private static getWeekStartDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  private static getWeekEndDate(weekStart: string): string {
    const start = new Date(weekStart);
    const sunday = new Date(start);
    sunday.setDate(start.getDate() + 6);
    return sunday.toISOString().split('T')[0];
  }

  private static calculateUserProgress(sessions: PlannedSession[]): UserProgress {
    const completedSessions = sessions.filter(s => s.completed);
    
    // Calculate streak
    const streak = this.calculateCurrentStreak(completedSessions);
    const longestStreak = this.calculateLongestStreak(completedSessions);
    
    // Calculate XP (2 XP per minute of completed training)
    const xp = completedSessions.reduce((sum, s) => sum + (s.duration * 2), 0);
    const level = Math.floor(xp / 2000) + 1; // Level up every 2000 XP
    
    // Records
    const mostMinutes = Math.max(...completedSessions.map(s => s.duration));
    const mostShots = completedSessions.reduce((sum: number, s: PlannedSession) => {
      const shootingDrills = (s.drills || []).filter((d: Drill) => 
        (d.category?.toLowerCase().includes('shoot') || 
        d.name?.toLowerCase().includes('shoot'))
      ).length;
      return sum + shootingDrills * 10; // Assume 10 shots per shooting drill
    }, 0);

    return {
      streak,
      longestStreak,
      xp,
      level,
      mostMinutes,
      mostShots
    };
  }

  private static calculateCurrentStreak(sessions: PlannedSession[]): number {
    if (sessions.length === 0) return 0;
    
    const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const sessionDate = new Date(sortedDates[i]);
      const diffInDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private static calculateLongestStreak(sessions: PlannedSession[]): number {
    if (sessions.length === 0) return 0;
    
    const uniqueDates = [...new Set(sessions.map(s => s.date))].sort();
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffInDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  }

  private static generateBadges(progress: UserProgress, sessions: PlannedSession[]): Badge[] {
    const badges: Badge[] = [];
    const now = new Date().toISOString();

    // Streak badges
    if (progress.streak >= 3) {
      badges.push({
        id: 'streak-3',
        name: '🔥 3-Day Streak',
        icon: '🔥',
        description: 'Trained for 3 consecutive days',
        category: 'streak',
        earnedAt: now
      });
    }
    if (progress.streak >= 7) {
      badges.push({
        id: 'streak-7',
        name: '🎯 7-Day Streak',
        icon: '🎯',
        description: 'Trained for 7 consecutive days',
        category: 'streak',
        earnedAt: now
      });
    }
    if (progress.streak >= 30) {
      badges.push({
        id: 'streak-30',
        name: '🏆 30-Day Streak',
        icon: '🏆',
        description: 'Trained for 30 consecutive days!',
        category: 'streak',
        earnedAt: now
      });
    }

    // First session badge
    if (sessions.length >= 1 && sessions.some(s => s.completed)) {
      badges.push({
        id: 'first-session',
        name: '🏅 First Session',
        icon: '🏅',
        description: 'Completed your first training session',
        category: 'milestone',
        earnedAt: now
      });
    }

    // Volume badges
    if (progress.xp >= 1000) {
      badges.push({
        id: 'xp-1000',
        name: '⭐ 1K XP',
        icon: '⭐',
        description: 'Earned 1,000 experience points',
        category: 'xp',
        earnedAt: now
      });
    }
    if (progress.xp >= 5000) {
      badges.push({
        id: 'xp-5000',
        name: '🌟 5K XP',
        icon: '🌟',
        description: 'Earned 5,000 experience points',
        category: 'xp',
        earnedAt: now
      });
    }

    // Shooting badges
    if (progress.mostShots >= 100) {
      badges.push({
        id: 'shots-100',
        name: '🏀 100 Shots',
        icon: '🏀',
        description: 'Practiced 100 shooting drills',
        category: 'shooting',
        earnedAt: now
      });
    }
    if (progress.mostShots >= 500) {
      badges.push({
        id: 'shots-500',
        name: '💯 500 Shots',
        icon: '💯',
        description: 'Practiced 500 shooting drills',
        category: 'shooting',
        earnedAt: now
      });
    }

    // Remove duplicates by id
    const uniqueBadges = Array.from(new Map(badges.map(badge => [badge.id, badge])).values());
    
    // Load existing badges from localStorage to preserve earnedAt dates
    const existingBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    const existingMap = new Map(existingBadges.map((b: Badge) => [b.id, b]));
    
    return uniqueBadges.map(badge => {
      const existingBadge = existingMap.get(badge.id);
      return {
        ...badge,
        earnedAt: existingBadge?.earnedAt || null
      };
    });
  }

  private static clearProgressData() {
    localStorage.removeItem('weeklySummaries');
    localStorage.removeItem('userProgress');
    localStorage.removeItem('badges');
  }
}

export default ProgressService;