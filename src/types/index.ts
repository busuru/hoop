export interface TrainingSession {
  id: string;
  date: string;
  type: 'skills' | 'conditioning' | 'shooting' | 'game-prep';
  duration: number;
  completed: boolean;
  exercises: string[];
  notes?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'shooting' | 'dribbling' | 'defense' | 'passing' | 'footwork';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
  recommendedDuration?: number;
  videoId?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'agility' | 'flexibility';
  duration: number;
  instructions: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string; // Short purpose/description
  reps?: string; // e.g., '1–2 sets', '8–12 reps'
  recommendedDuration?: number; // in seconds, for timer
  tips?: string[]; // Key coaching tips
  videoId?: string; // YouTube video ID for the drill
  isFavorite?: boolean; // For local UI state
  isDone?: boolean; // For mark as done
}

export interface ProgressMetric {
  id: string;
  date: string;
  metric: string;
  value: number;
  unit: string;
}

export interface Stretch {
  id: string;
  name: string;
  type: 'warm-up' | 'cool-down' | 'maintenance';
  duration: number;
  description?: string; // Short purpose/description
  instructions: string[];
  targetAreas: string[];
  videoId?: string; // YouTube video ID for the drill
  recommendedDuration?: number; // in seconds
  tips?: string[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
}

export interface FavoriteVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  bio?: string;
  location?: string;
  birthday?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  // Game stats
  xp: number;
  level: number;
  streak: number;
}