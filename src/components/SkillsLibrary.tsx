import React, { useState, useEffect } from 'react';
import { BookOpen, Filter, Star, Users, Target, Dribbble as Dribble, Shield, Search, Play, Heart, X, Youtube, Clock, User, ArrowLeft, Shuffle, Move } from 'lucide-react';
import { skills, defenseSubcategories, DefenseSubcategory, DefenseDrill } from '../data/basketballData';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { Skill, YouTubeVideo, FavoriteVideo } from '../types';
import { passingSubcategories, PassingSubcategory, PassingDrill } from '../data/basketballData';
import { layupSubcategories, LayupSubcategory, LayupDrill } from '../data/basketballData';

interface ShootingDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subcategory: string;
}

interface ShootingSubcategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: ShootingDrill[];
}

interface FootworkDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subcategory: string;
}

interface FootworkSubcategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: FootworkDrill[];
}

interface DribbleMove {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DribbleCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  moves: DribbleMove[];
}

const SkillsLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  // Shooting-specific states
  const [showShootingDetails, setShowShootingDetails] = useState(false);
  const [selectedShootingSubcategory, setSelectedShootingSubcategory] = useState<ShootingSubcategory | null>(null);
  const [selectedShootingDrill, setSelectedShootingDrill] = useState<ShootingDrill | null>(null);
  const [shootingSearchQuery, setShootingSearchQuery] = useState('');
  const [shootingVideos, setShootingVideos] = useState<YouTubeVideo[]>([]);
  const [shootingFavorites, setShootingFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyShootingDrill, setDailyShootingDrill] = useState<ShootingDrill | null>(null);

  // Footwork-specific states
  const [showFootworkDetails, setShowFootworkDetails] = useState(false);
  const [selectedFootworkSubcategory, setSelectedFootworkSubcategory] = useState<FootworkSubcategory | null>(null);
  const [selectedFootworkDrill, setSelectedFootworkDrill] = useState<FootworkDrill | null>(null);
  const [footworkSearchQuery, setFootworkSearchQuery] = useState('');
  const [footworkVideos, setFootworkVideos] = useState<YouTubeVideo[]>([]);
  const [footworkFavorites, setFootworkFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyFootworkDrill, setDailyFootworkDrill] = useState<FootworkDrill | null>(null);

  // Defense-specific states
  const [showDefenseDetails, setShowDefenseDetails] = useState(false);
  const [selectedDefenseSubcategory, setSelectedDefenseSubcategory] = useState<DefenseSubcategory | null>(null);
  const [selectedDefenseDrill, setSelectedDefenseDrill] = useState<DefenseDrill | null>(null);
  const [defenseSearchQuery, setDefenseSearchQuery] = useState('');
  const [defenseVideos, setDefenseVideos] = useState<YouTubeVideo[]>([]);
  const [defenseFavorites, setDefenseFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyDefenseDrill, setDailyDefenseDrill] = useState<DefenseDrill | null>(null);

  // Passing-specific states
  const [showPassingDetails, setShowPassingDetails] = useState(false);
  const [selectedPassingSubcategory, setSelectedPassingSubcategory] = useState<PassingSubcategory | null>(null);
  const [selectedPassingDrill, setSelectedPassingDrill] = useState<PassingDrill | null>(null);
  const [passingSearchQuery, setPassingSearchQuery] = useState('');
  const [passingVideos, setPassingVideos] = useState<YouTubeVideo[]>([]);
  const [passingFavorites, setPassingFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyPassingDrill, setDailyPassingDrill] = useState<PassingDrill | null>(null);

  // Layups-specific states
  const [showLayupsDetails, setShowLayupsDetails] = useState(false);
  const [selectedLayupSubcategory, setSelectedLayupSubcategory] = useState<LayupSubcategory | null>(null);
  const [selectedLayupDrill, setSelectedLayupDrill] = useState<LayupDrill | null>(null);
  const [layupSearchQuery, setLayupSearchQuery] = useState('');
  const [layupVideos, setLayupVideos] = useState<YouTubeVideo[]>([]);
  const [layupFavorites, setLayupFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyLayupDrill, setDailyLayupDrill] = useState<LayupDrill | null>(null);

  // Dribbling-specific states
  const [showDribblingDetails, setShowDribblingDetails] = useState(false);
  const [selectedDribbleCategory, setSelectedDribbleCategory] = useState<DribbleCategory | null>(null);
  const [selectedDribbleMove, setSelectedDribbleMove] = useState<DribbleMove | null>(null);
  const [dribbleSearchQuery, setDribbleSearchQuery] = useState('');
  const [dribbleVideos, setDribbleVideos] = useState<YouTubeVideo[]>([]);
  const [dribbleFavorites, setDribbleFavorites] = useState<FavoriteVideo[]>([]);
  const [dailyDribbleMove, setDailyDribbleMove] = useState<DribbleMove | null>(null);

  // Shared states
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Skills', icon: BookOpen },
    { id: 'shooting', name: 'Shooting', icon: Target },
    { id: 'dribbling', name: 'Dribbling', icon: Dribble },
    { id: 'defense', name: 'Defense', icon: Shield },
    { id: 'passing', name: 'Passing', icon: Users },
    { id: 'footwork', name: 'Footwork', icon: Move },
    { id: 'layups', name: 'Layups', icon: Move }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const shootingSubcategories: ShootingSubcategory[] = [
    {
      id: 'form-fundamentals',
      name: 'Form & Fundamentals',
      description: 'Master the basics of proper shooting form and technique',
      color: 'bg-blue-500',
      drills: [
        { id: 'basic-form', name: 'Basic Shooting Form', description: 'Learn proper hand placement, stance, and follow-through', difficulty: 'beginner', subcategory: 'form-fundamentals' },
        { id: 'wall-shooting', name: 'Wall Shooting', description: 'Practice form without a basket using a wall', difficulty: 'beginner', subcategory: 'form-fundamentals' },
        { id: 'one-handed-form', name: 'One-Handed Form Shooting', description: 'Develop proper shooting hand mechanics', difficulty: 'beginner', subcategory: 'form-fundamentals' },
        { id: 'follow-through', name: 'Follow-Through Drills', description: 'Perfect your wrist snap and finger placement', difficulty: 'beginner', subcategory: 'form-fundamentals' },
        { id: 'balance-shooting', name: 'Balance & Footwork', description: 'Improve shooting balance and foot positioning', difficulty: 'intermediate', subcategory: 'form-fundamentals' }
      ]
    },
    {
      id: 'off-dribble',
      name: 'Off the Dribble',
      description: 'Shooting while in motion and coming off the dribble',
      color: 'bg-green-500',
      drills: [
        { id: 'pull-up-jumper', name: 'Pull-Up Jumper', description: 'Stop and shoot coming off the dribble', difficulty: 'intermediate', subcategory: 'off-dribble' },
        { id: 'one-dribble-pullup', name: 'One-Dribble Pull-Up', description: 'Single dribble into immediate shot', difficulty: 'intermediate', subcategory: 'off-dribble' },
        { id: 'step-back-jumper', name: 'Step Back Jumper', description: 'Create space with a step back before shooting', difficulty: 'advanced', subcategory: 'off-dribble' },
        { id: 'side-step-shot', name: 'Side Step Shot', description: 'Step to the side off the dribble for a clean look', difficulty: 'intermediate', subcategory: 'off-dribble' },
        { id: 'hesitation-shot', name: 'Hesitation Shot', description: 'Use hesitation move before pulling up', difficulty: 'advanced', subcategory: 'off-dribble' }
      ]
    },
    {
      id: 'off-screens',
      name: 'Off Screens / Movement',
      description: 'Shooting while coming off screens and in motion',
      color: 'bg-purple-500',
      drills: [
        { id: 'curl-shot', name: 'Curl Shot', description: 'Curl around screen for catch and shoot', difficulty: 'intermediate', subcategory: 'off-screens' },
        { id: 'flare-screen-shot', name: 'Flare Screen Shot', description: 'Flare to the outside off a screen', difficulty: 'intermediate', subcategory: 'off-screens' },
        { id: 'pin-down-shot', name: 'Pin Down Shot', description: 'Come off a pin down screen for a shot', difficulty: 'intermediate', subcategory: 'off-screens' },
        { id: 'elevator-shot', name: 'Elevator Shot', description: 'Split two screeners for a quick shot', difficulty: 'advanced', subcategory: 'off-screens' },
        { id: 'transition-shot', name: 'Transition Shot', description: 'Catch and shoot in transition', difficulty: 'intermediate', subcategory: 'off-screens' }
      ]
    },
    {
      id: 'advanced-moves',
      name: 'Advanced Moves',
      description: 'Complex shooting techniques and advanced footwork',
      color: 'bg-red-500',
      drills: [
        { id: 'fadeaway-shot', name: 'Fadeaway Shot', description: 'Lean back while shooting to avoid defender', difficulty: 'advanced', subcategory: 'advanced-moves' },
        { id: 'turnaround-jumper', name: 'Turnaround Jumper', description: 'Turn and shoot over your shoulder', difficulty: 'advanced', subcategory: 'advanced-moves' },
        { id: 'step-through-shot', name: 'Step Through Shot', description: 'Fake and step through for a shot', difficulty: 'advanced', subcategory: 'advanced-moves' },
        { id: 'pump-fake-shot', name: 'Pump Fake Shot', description: 'Use pump fake to get defender off feet', difficulty: 'intermediate', subcategory: 'advanced-moves' },
        { id: 'jab-step-shot', name: 'Jab Step Shot', description: 'Jab step to create space before shooting', difficulty: 'intermediate', subcategory: 'advanced-moves' }
      ]
    },
    {
      id: 'specialty-shots',
      name: 'Specialty Shots',
      description: 'Unique shots for specific game situations',
      color: 'bg-yellow-500',
      drills: [
        { id: 'hook-shot', name: 'Hook Shot', description: 'Sweeping hook shot with one hand', difficulty: 'intermediate', subcategory: 'specialty-shots' },
        { id: 'floater', name: 'Floater', description: 'Soft touch shot over taller defenders', difficulty: 'intermediate', subcategory: 'specialty-shots' },
        { id: 'bank-shot', name: 'Bank Shot', description: 'Use the backboard for close-range shots', difficulty: 'beginner', subcategory: 'specialty-shots' },
        { id: 'runner', name: 'Runner', description: 'Running one-handed shot in the lane', difficulty: 'intermediate', subcategory: 'specialty-shots' },
        { id: 'contested-shot', name: 'Contested Shot', description: 'Shooting with a hand in your face', difficulty: 'advanced', subcategory: 'specialty-shots' }
      ]
    },
    {
      id: 'game-combo',
      name: 'Game-like & Combo Drills',
      description: 'Realistic game scenarios and combination drills',
      color: 'bg-indigo-500',
      drills: [
        { id: 'catch-shoot', name: 'Catch and Shoot', description: 'Quick release off the catch', difficulty: 'beginner', subcategory: 'game-combo' },
        { id: 'shot-fake-drive', name: 'Shot Fake to Drive', description: 'Fake shot then drive to basket', difficulty: 'intermediate', subcategory: 'game-combo' },
        { id: 'triple-threat-shot', name: 'Triple Threat Shot', description: 'Shoot from triple threat position', difficulty: 'beginner', subcategory: 'game-combo' },
        { id: 'closeout-shot', name: 'Closeout Shot', description: 'Shoot against a closing defender', difficulty: 'intermediate', subcategory: 'game-combo' },
        { id: 'game-speed-shooting', name: 'Game Speed Shooting', description: 'Practice shots at game pace', difficulty: 'advanced', subcategory: 'game-combo' }
      ]
    }
  ];

  const footworkSubcategories: FootworkSubcategory[] = [
    {
      id: 'basic-fundamentals',
      name: 'Basic Footwork Fundamentals',
      description: 'Master the foundation of basketball footwork',
      color: 'bg-blue-500',
      drills: [
        { id: 'triple-threat-stance', name: 'Triple Threat Stance', description: 'Perfect your ready position for shooting, passing, or driving', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'jab-step', name: 'Jab Step', description: 'Use your non-pivot foot to create space and read defense', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'pivot-footwork', name: 'Pivot Footwork', description: 'Master front and reverse pivots for ball protection', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'athletic-stance', name: 'Athletic Stance', description: 'Develop proper body positioning and balance', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'foot-positioning', name: 'Foot Positioning', description: 'Learn optimal foot placement for different situations', difficulty: 'beginner', subcategory: 'basic-fundamentals' }
      ]
    },
    {
      id: 'attack-drive',
      name: 'Attack & Drive Footwork',
      description: 'Explosive footwork for attacking the basket',
      color: 'bg-green-500',
      drills: [
        { id: 'first-step-explosion', name: 'First Step Explosion', description: 'Develop explosive first step to beat defenders', difficulty: 'intermediate', subcategory: 'attack-drive' },
        { id: 'drop-step', name: 'Drop Step', description: 'Post move to create space and get to the basket', difficulty: 'intermediate', subcategory: 'attack-drive' },
        { id: 'rip-through-move', name: 'Rip-Through Move', description: 'Rip the ball through to create driving angle', difficulty: 'intermediate', subcategory: 'attack-drive' },
        { id: 'crossover-step', name: 'Crossover Step', description: 'Step across defender\'s body to drive opposite direction', difficulty: 'intermediate', subcategory: 'attack-drive' },
        { id: 'drive-step', name: 'Drive Step', description: 'Perfect your driving mechanics and footwork', difficulty: 'intermediate', subcategory: 'attack-drive' }
      ]
    },
    {
      id: 'finishing-footwork',
      name: 'Finishing Footwork',
      description: 'Footwork for finishing around the basket',
      color: 'bg-purple-500',
      drills: [
        { id: 'euro-step', name: 'Euro Step', description: 'Two-step move to avoid defenders when finishing', difficulty: 'intermediate', subcategory: 'finishing-footwork' },
        { id: 'pro-hop', name: 'Pro Hop', description: 'Two-foot landing for strong finish at the rim', difficulty: 'intermediate', subcategory: 'finishing-footwork' },
        { id: 'stride-stop', name: 'Stride Stop', description: 'One-two step landing for quick shots or passes', difficulty: 'beginner', subcategory: 'finishing-footwork' },
        { id: 'jump-stop', name: 'Jump Stop', description: 'Two-foot landing for balanced finishing position', difficulty: 'beginner', subcategory: 'finishing-footwork' },
        { id: 'reverse-layup-footwork', name: 'Reverse Layup Footwork', description: 'Footwork for finishing on the opposite side', difficulty: 'intermediate', subcategory: 'finishing-footwork' }
      ]
    },
    {
      id: 'perimeter-shooting',
      name: 'Perimeter & Shooting Footwork',
      description: 'Footwork for perimeter shooting and shot preparation',
      color: 'bg-red-500',
      drills: [
        { id: 'one-two-step-shot', name: '1-2 Step into Shot', description: 'Right-left footwork for quick shot preparation', difficulty: 'intermediate', subcategory: 'perimeter-shooting' },
        { id: 'hop-step-shot', name: 'Hop Step into Shot', description: 'Two-foot landing for balanced shooting position', difficulty: 'intermediate', subcategory: 'perimeter-shooting' },
        { id: 'relocation-footwork', name: 'Relocation Footwork', description: 'Move to open spots for better shooting angles', difficulty: 'intermediate', subcategory: 'perimeter-shooting' },
        { id: 'catch-shoot-footwork', name: 'Catch and Shoot Footwork', description: 'Quick footwork for immediate shot release', difficulty: 'beginner', subcategory: 'perimeter-shooting' },
        { id: 'step-back-footwork', name: 'Step Back Footwork', description: 'Create space with backward step before shooting', difficulty: 'advanced', subcategory: 'perimeter-shooting' }
      ]
    },
    {
      id: 'defensive-footwork',
      name: 'Defensive Footwork',
      description: 'Footwork for effective defensive positioning',
      color: 'bg-yellow-500',
      drills: [
        { id: 'defensive-slide', name: 'Defensive Slide', description: 'Lateral movement to stay in front of offensive player', difficulty: 'beginner', subcategory: 'defensive-footwork' },
        { id: 'closeout-footwork', name: 'Closeout Footwork', description: 'Approach shooter with proper footwork and balance', difficulty: 'intermediate', subcategory: 'defensive-footwork' },
        { id: 'drop-step-defense', name: 'Drop Step Defense', description: 'Defensive footwork to maintain position in post', difficulty: 'intermediate', subcategory: 'defensive-footwork' },
        { id: 'retreat-step', name: 'Retreat Step', description: 'Step back to maintain proper defensive distance', difficulty: 'beginner', subcategory: 'defensive-footwork' },
        { id: 'help-recovery', name: 'Help and Recovery', description: 'Footwork for helping teammates and recovering', difficulty: 'intermediate', subcategory: 'defensive-footwork' }
      ]
    },
    {
      id: 'advanced-combos',
      name: 'Advanced Moves & Combos',
      description: 'Complex footwork patterns and combinations',
      color: 'bg-indigo-500',
      drills: [
        { id: 'spin-move-footwork', name: 'Spin Move Footwork', description: 'Footwork for executing effective spin moves', difficulty: 'advanced', subcategory: 'advanced-combos' },
        { id: 'behind-back-step', name: 'Behind-the-Back Step', description: 'Footwork coordination with behind-the-back dribble', difficulty: 'advanced', subcategory: 'advanced-combos' },
        { id: 'step-back-advanced', name: 'Advanced Step Back', description: 'Multiple step back variations and footwork', difficulty: 'advanced', subcategory: 'advanced-combos' },
        { id: 'step-through', name: 'Step Through', description: 'Footwork for step-through moves in the post', difficulty: 'advanced', subcategory: 'advanced-combos' },
        { id: 'combo-footwork', name: 'Combination Footwork', description: 'Chain multiple footwork moves together', difficulty: 'advanced', subcategory: 'advanced-combos' }
      ]
    }
  ];

  const passingSubcategories: PassingSubcategory[] = [
    {
      id: 'basic-fundamentals',
      name: 'Basic Passing Fundamentals',
      description: 'Master the foundation of basketball passing',
      color: 'bg-yellow-500',
      drills: [
        { id: 'bounce-pass', name: 'Bounce Pass', description: 'Practice bouncing the ball to a teammate', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'chest-pass', name: 'Chest Pass', description: 'Practice passing the ball with chest', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'behind-the-back-pass', name: 'Behind-the-Back Pass', description: 'Practice passing the ball behind your back', difficulty: 'intermediate', subcategory: 'basic-fundamentals' },
        { id: 'overhead-pass', name: 'Overhead Pass', description: 'Practice passing the ball over your head', difficulty: 'intermediate', subcategory: 'basic-fundamentals' },
        { id: 'spin-pass', name: 'Spin Pass', description: 'Practice passing the ball while spinning', difficulty: 'intermediate', subcategory: 'basic-fundamentals' }
      ]
    },
    {
      id: 'advanced-technique',
      name: 'Advanced Passing Technique',
      description: 'Develop advanced passing skills for various game situations',
      color: 'bg-green-500',
      drills: [
        { id: 'behind-the-back-dribble-pass', name: 'Behind-the-Back Dribble Pass', description: 'Practice passing the ball while dribbling behind your back', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'spin-dribble-pass', name: 'Spin Dribble Pass', description: 'Practice passing the ball while spinning and dribbling', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'fakespin-dribble-pass', name: 'Fake Spin Dribble Pass', description: 'Practice passing the ball while faking a spin and dribbling', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'double-dribble-pass', name: 'Double Dribble Pass', description: 'Practice passing the ball while dribbling twice', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'behind-the-back-dribble-shot', name: 'Behind-the-Back Dribble Shot', description: 'Practice passing the ball while dribbling behind your back and shooting', difficulty: 'intermediate', subcategory: 'advanced-technique' }
      ]
    },
    {
      id: 'game-strategy',
      name: 'Game Strategy and Situational Passing',
      description: 'Learn how to pass effectively in different game situations',
      color: 'bg-purple-500',
      drills: [
        { id: 'screen-pass', name: 'Screen Pass', description: 'Practice passing the ball through a screen', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'pick-and-roll-pass', name: 'Pick-and-Roll Pass', description: 'Practice passing the ball to a teammate in a pick-and-roll situation', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'high-low-pass', name: 'High-Low Pass', description: 'Practice passing the ball between teammates in a high-low motion', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'cross-court-pass', name: 'Cross-Court Pass', description: 'Practice passing the ball across the court', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'cut-and-shoot', name: 'Cut-and-Shoot', description: 'Practice cutting to an open spot and shooting', difficulty: 'intermediate', subcategory: 'game-strategy' }
      ]
    },
    {
      id: 'fast-break-passing',
      name: 'Fast Break Passing',
      description: 'Develop quick passing skills for fast break situations',
      color: 'bg-red-500',
      drills: [
        { id: 'fast-break-bounce-pass', name: 'Fast Break Bounce Pass', description: 'Practice passing the ball quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-passing' },
        { id: 'fast-break-chest-pass', name: 'Fast Break Chest Pass', description: 'Practice passing the ball quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-passing' },
        { id: 'fast-break-behind-the-back-pass', name: 'Fast Break Behind-the-Back Pass', description: 'Practice passing the ball quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-passing' },
        { id: 'fast-break-overhead-pass', name: 'Fast Break Overhead Pass', description: 'Practice passing the ball quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-passing' },
        { id: 'fast-break-spin-pass', name: 'Fast Break Spin Pass', description: 'Practice passing the ball quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-passing' }
      ]
    },
    {
      id: 'late-game-passing',
      name: 'Late Game Passing',
      description: 'Develop effective passing skills in the fourth quarter',
      color: 'bg-indigo-500',
      drills: [
        { id: 'late-game-screen-pass', name: 'Late Game Screen Pass', description: 'Practice passing the ball through a screen in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-passing' },
        { id: 'late-game-pick-and-roll-pass', name: 'Late Game Pick-and-Roll Pass', description: 'Practice passing the ball to a teammate in a pick-and-roll situation in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-passing' },
        { id: 'late-game-high-low-pass', name: 'Late Game High-Low Pass', description: 'Practice passing the ball between teammates in a high-low motion in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-passing' },
        { id: 'late-game-cross-court-pass', name: 'Late Game Cross-Court Pass', description: 'Practice passing the ball across the court in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-passing' },
        { id: 'late-game-cut-and-shoot', name: 'Late Game Cut-and-Shoot', description: 'Practice cutting to an open spot and shooting in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-passing' }
      ]
    }
  ];

  const layupSubcategories: LayupSubcategory[] = [
    {
      id: 'basic-fundamentals',
      name: 'Basic Layup Fundamentals',
      description: 'Master the foundation of basketball layup technique',
      color: 'bg-green-500',
      drills: [
        { id: 'layup-form', name: 'Layup Form', description: 'Learn proper layup form and follow-through', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'catch-and-shoot', name: 'Catch and Shoot', description: 'Practice laying the ball up and shooting', difficulty: 'beginner', subcategory: 'basic-fundamentals' },
        { id: 'dribble-drive', name: 'Dribble Drive', description: 'Practice dribbling while driving to the basket', difficulty: 'intermediate', subcategory: 'basic-fundamentals' },
        { id: 'step-back-layup', name: 'Step Back Layup', description: 'Practice step-back layup form', difficulty: 'intermediate', subcategory: 'basic-fundamentals' },
        { id: 'fade-away-layup', name: 'Fade Away Layup', description: 'Practice fade-away layup form', difficulty: 'intermediate', subcategory: 'basic-fundamentals' }
      ]
    },
    {
      id: 'advanced-technique',
      name: 'Advanced Layup Technique',
      description: 'Develop advanced layup skills for various game situations',
      color: 'bg-indigo-500',
      drills: [
        { id: 'spin-layup', name: 'Spin Layup', description: 'Practice spinning layup form', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'reverse-layup', name: 'Reverse Layup', description: 'Practice reverse layup form', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'floater-layup', name: 'Floater Layup', description: 'Practice shooting over taller defenders', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'hook-layup', name: 'Hook Layup', description: 'Practice hook layup form', difficulty: 'intermediate', subcategory: 'advanced-technique' },
        { id: 'fade-away-layup', name: 'Fade Away Layup', description: 'Practice fade-away layup form', difficulty: 'intermediate', subcategory: 'advanced-technique' }
      ]
    },
    {
      id: 'game-strategy',
      name: 'Game Strategy and Situational Layups',
      description: 'Learn how to use layups effectively in different game situations',
      color: 'bg-purple-500',
      drills: [
        { id: 'screen-layup', name: 'Screen Layup', description: 'Practice laying the ball up through a screen', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'pick-and-roll-layup', name: 'Pick-and-Roll Layup', description: 'Practice laying the ball up to a teammate in a pick-and-roll situation', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'high-low-layup', name: 'High-Low Layup', description: 'Practice passing the ball between teammates in a high-low motion', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'cross-court-layup', name: 'Cross-Court Layup', description: 'Practice laying the ball up across the court', difficulty: 'intermediate', subcategory: 'game-strategy' },
        { id: 'cut-and-layup', name: 'Cut-and-Layup', description: 'Practice cutting to an open spot and laying the ball up', difficulty: 'intermediate', subcategory: 'game-strategy' }
      ]
    },
    {
      id: 'fast-break-layup',
      name: 'Fast Break Layup',
      description: 'Develop quick layup skills for fast break situations',
      color: 'bg-red-500',
      drills: [
        { id: 'fast-break-bounce-layup', name: 'Fast Break Bounce Layup', description: 'Practice laying the ball up quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-layup' },
        { id: 'fast-break-chest-layup', name: 'Fast Break Chest Layup', description: 'Practice laying the ball up quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-layup' },
        { id: 'fast-break-behind-the-back-layup', name: 'Fast Break Behind-the-Back Layup', description: 'Practice laying the ball up quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-layup' },
        { id: 'fast-break-overhead-layup', name: 'Fast Break Overhead Layup', description: 'Practice laying the ball up quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-layup' },
        { id: 'fast-break-spin-layup', name: 'Fast Break Spin Layup', description: 'Practice laying the ball up quickly after a fast break', difficulty: 'intermediate', subcategory: 'fast-break-layup' }
      ]
    },
    {
      id: 'late-game-layup',
      name: 'Late Game Layup',
      description: 'Develop effective layup skills in the fourth quarter',
      color: 'bg-indigo-500',
      drills: [
        { id: 'late-game-screen-layup', name: 'Late Game Screen Layup', description: 'Practice laying the ball up through a screen in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-layup' },
        { id: 'late-game-pick-and-roll-layup', name: 'Late Game Pick-and-Roll Layup', description: 'Practice laying the ball up to a teammate in a pick-and-roll situation in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-layup' },
        { id: 'late-game-high-low-layup', name: 'Late Game High-Low Layup', description: 'Practice passing the ball between teammates in a high-low motion in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-layup' },
        { id: 'late-game-cross-court-layup', name: 'Late Game Cross-Court Layup', description: 'Practice laying the ball up across the court in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-layup' },
        { id: 'late-game-cut-and-layup', name: 'Late Game Cut-and-Layup', description: 'Practice cutting to an open spot and laying the ball up in the fourth quarter', difficulty: 'intermediate', subcategory: 'late-game-layup' }
      ]
    }
  ];

  const dribbleCategories: DribbleCategory[] = [
    {
      id: 'change-direction',
      name: 'Change-of-Direction Dribbles',
      description: 'Master moves that help you change direction and beat defenders',
      color: 'bg-blue-500',
      moves: [
        { id: 'crossover', name: 'Crossover', description: 'Basic move to change direction quickly', difficulty: 'beginner' },
        { id: 'behind-back', name: 'Behind-the-Back', description: 'Dribble behind your back to change direction', difficulty: 'intermediate' },
        { id: 'between-legs', name: 'Between-the-Legs', description: 'Dribble through your legs for protection and direction change', difficulty: 'intermediate' },
        { id: 'spin-move', name: 'Spin Move', description: 'Use your body to spin and change direction', difficulty: 'intermediate' },
        { id: 'in-out', name: 'In & Out', description: 'Fake going inside then go outside', difficulty: 'beginner' },
        { id: 'shamgod', name: 'Shamgod', description: 'Advanced move popularized by God Shammgod', difficulty: 'advanced' }
      ]
    },
    {
      id: 'protection-escape',
      name: 'Protection & Escape Dribbles',
      description: 'Protect the ball and escape from defensive pressure',
      color: 'bg-green-500',
      moves: [
        { id: 'retreat-dribble', name: 'Retreat Dribble', description: 'Step back to create space', difficulty: 'beginner' },
        { id: 'pullback-dribble', name: 'Pullback Dribble', description: 'Pull the ball back to reset', difficulty: 'beginner' },
        { id: 'body-wrap', name: 'Body Wrap Dribble', description: 'Wrap the ball around your body for protection', difficulty: 'intermediate' }
      ]
    },
    {
      id: 'speed-combo',
      name: 'Speed & Combo Dribbles',
      description: 'Fast-paced combinations to overwhelm defenders',
      color: 'bg-red-500',
      moves: [
        { id: 'double-crossover', name: 'Double Crossover', description: 'Two quick crossovers in succession', difficulty: 'intermediate' },
        { id: 'cross-behind', name: 'Cross + Behind', description: 'Crossover followed by behind-the-back', difficulty: 'advanced' },
        { id: 'cross-spin', name: 'Cross + Spin', description: 'Crossover into a spin move', difficulty: 'advanced' },
        { id: 'killer-crossover', name: 'Killer Crossover', description: 'Explosive crossover with maximum deception', difficulty: 'advanced' }
      ]
    },
    {
      id: 'rhythm-creative',
      name: 'Rhythm & Creative Dribbles',
      description: 'Develop rhythm and creativity in your ball handling',
      color: 'bg-purple-500',
      moves: [
        { id: 'v-dribble', name: 'V-Dribble', description: 'Create a V pattern with your dribble', difficulty: 'beginner' },
        { id: 'figure-eight', name: 'Figure-Eight Dribble', description: 'Dribble in a figure-eight pattern', difficulty: 'intermediate' },
        { id: 'low-pound', name: 'Low Pound Dribbles', description: 'Keep the ball low with quick pounds', difficulty: 'beginner' },
        { id: 'two-ball', name: 'Two-Ball Dribble', description: 'Practice with two basketballs simultaneously', difficulty: 'advanced' }
      ]
    },
    {
      id: 'advanced-pro',
      name: 'Advanced/Pro Dribbles',
      description: 'Elite moves used by professional players',
      color: 'bg-orange-500',
      moves: [
        { id: 'hesitation', name: 'Hesitation Dribble', description: 'Pause to freeze the defender then explode', difficulty: 'intermediate' },
        { id: 'snatch-back', name: 'Snatch Back', description: 'Quickly snatch the ball back to create space', difficulty: 'advanced' },
        { id: 'wrap-dribble', name: 'Wrap Dribble', description: 'Wrap the ball around your leg', difficulty: 'advanced' },
        { id: 'crab-dribble', name: 'Crab Dribble', description: 'Low, wide stance dribbling like a crab', difficulty: 'advanced' }
      ]
    }
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const savedShootingFavorites = localStorage.getItem('basketball-shooting-favorites');
    if (savedShootingFavorites) {
      setShootingFavorites(JSON.parse(savedShootingFavorites));
    }

    const savedFootworkFavorites = localStorage.getItem('basketball-footwork-favorites');
    if (savedFootworkFavorites) {
      setFootworkFavorites(JSON.parse(savedFootworkFavorites));
    }

    const stored = localStorage.getItem('defenseFavorites');
    if (stored) setDefenseFavorites(JSON.parse(stored));

    const storedPassingFavorites = localStorage.getItem('passingFavorites');
    if (storedPassingFavorites) {
      setPassingFavorites(JSON.parse(storedPassingFavorites));
    }

    const storedLayupFavorites = localStorage.getItem('layupFavorites');
    if (storedLayupFavorites) {
      setLayupFavorites(JSON.parse(storedLayupFavorites));
    }

    const storedDribbleFavorites = localStorage.getItem('dribbleFavorites');
    if (storedDribbleFavorites) {
      setDribbleFavorites(JSON.parse(storedDribbleFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('basketball-shooting-favorites', JSON.stringify(shootingFavorites));
  }, [shootingFavorites]);

  useEffect(() => {
    localStorage.setItem('basketball-footwork-favorites', JSON.stringify(footworkFavorites));
  }, [footworkFavorites]);

  useEffect(() => {
    localStorage.setItem('defenseFavorites', JSON.stringify(defenseFavorites));
  }, [defenseFavorites]);

  useEffect(() => {
    localStorage.setItem('passingFavorites', JSON.stringify(passingFavorites));
  }, [passingFavorites]);

  useEffect(() => {
    localStorage.setItem('layupFavorites', JSON.stringify(layupFavorites));
  }, [layupFavorites]);

  useEffect(() => {
    localStorage.setItem('dribbleFavorites', JSON.stringify(dribbleFavorites));
  }, [dribbleFavorites]);

  // Set daily drills
  useEffect(() => {
    const today = new Date().toDateString();
    
    // Daily shooting drill
    const savedDailyShootingDrill = localStorage.getItem('daily-shooting-drill');
    const savedShootingDate = localStorage.getItem('daily-shooting-drill-date');

    if (savedShootingDate !== today || !savedDailyShootingDrill) {
      const allShootingDrills = shootingSubcategories.flatMap(sub => sub.drills);
      const randomShootingDrill = allShootingDrills[Math.floor(Math.random() * allShootingDrills.length)];
      setDailyShootingDrill(randomShootingDrill);
      localStorage.setItem('daily-shooting-drill', JSON.stringify(randomShootingDrill));
      localStorage.setItem('daily-shooting-drill-date', today);
    } else {
      setDailyShootingDrill(JSON.parse(savedDailyShootingDrill));
    }

    // Daily footwork drill
    const savedDailyFootworkDrill = localStorage.getItem('daily-footwork-drill');
    const savedFootworkDate = localStorage.getItem('daily-footwork-drill-date');

    if (savedFootworkDate !== today || !savedDailyFootworkDrill) {
      const allFootworkDrills = footworkSubcategories.flatMap(sub => sub.drills);
      const randomFootworkDrill = allFootworkDrills[Math.floor(Math.random() * allFootworkDrills.length)];
      setDailyFootworkDrill(randomFootworkDrill);
      localStorage.setItem('daily-footwork-drill', JSON.stringify(randomFootworkDrill));
      localStorage.setItem('daily-footwork-drill-date', today);
    } else {
      setDailyFootworkDrill(JSON.parse(savedDailyFootworkDrill));
    }

    // Daily defense drill
    const stored = localStorage.getItem('dailyDefenseDrill');
    const storedDate = localStorage.getItem('dailyDefenseDrillDate');
    if (stored && storedDate === today) {
      setDailyDefenseDrill(JSON.parse(stored));
    } else {
      // Flatten all drills
      const allDrills = defenseSubcategories.flatMap(sub => sub.drills);
      const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
      setDailyDefenseDrill(randomDrill);
      localStorage.setItem('dailyDefenseDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyDefenseDrillDate', today);
    }

    // Daily passing drill
    const savedDailyPassingDrill = localStorage.getItem('dailyPassingDrill');
    const savedPassingDate = localStorage.getItem('dailyPassingDrillDate');
    if (savedPassingDate !== today || !savedDailyPassingDrill) {
      const allPassingDrills = passingSubcategories.flatMap(sub => sub.drills);
      const randomPassingDrill = allPassingDrills[Math.floor(Math.random() * allPassingDrills.length)];
      setDailyPassingDrill(randomPassingDrill);
      localStorage.setItem('dailyPassingDrill', JSON.stringify(randomPassingDrill));
      localStorage.setItem('dailyPassingDrillDate', today);
    } else {
      setDailyPassingDrill(JSON.parse(savedDailyPassingDrill));
    }

    // Daily layup drill
    const storedLayup = localStorage.getItem('dailyLayupDrill');
    const storedLayupDate = localStorage.getItem('dailyLayupDrillDate');
    if (storedLayup && storedLayupDate === today) {
      setDailyLayupDrill(JSON.parse(storedLayup));
    } else {
      const allDrills = layupSubcategories.flatMap(sub => sub.drills);
      const randomLayupDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
      setDailyLayupDrill(randomLayupDrill);
      localStorage.setItem('dailyLayupDrill', JSON.stringify(randomLayupDrill));
      localStorage.setItem('dailyLayupDrillDate', today);
    }

    // Daily dribble move
    const storedDribble = localStorage.getItem('dailyDribbleMove');
    const storedDribbleDate = localStorage.getItem('dailyDribbleMoveDate');
    if (storedDribble && storedDribbleDate === today) {
      setDailyDribbleMove(JSON.parse(storedDribble));
    } else {
      const allMoves = dribbleCategories.flatMap(cat => cat.moves);
      const randomDribbleMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      setDailyDribbleMove(randomDribbleMove);
      localStorage.setItem('dailyDribbleMove', JSON.stringify(randomDribbleMove));
      localStorage.setItem('dailyDribbleMoveDate', today);
    }
  }, []);

  const filteredSkills = skills.filter(skill => {
    const categoryMatch = selectedCategory === 'all' || skill.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || skill.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleShootingSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const searchQuery = `${query} basketball shooting tutorial`;
      const response = await searchYouTubeVideos(searchQuery);
      const videoData: YouTubeVideo[] = response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      
      setShootingVideos(videoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleFootworkSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const searchQuery = `${query} basketball footwork tutorial`;
      const response = await searchYouTubeVideos(searchQuery);
      const videoData: YouTubeVideo[] = response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      
      setFootworkVideos(videoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleShootingDrillSelect = async (drill: ShootingDrill) => {
    setSelectedShootingDrill(drill);
    await handleShootingSearch(`how to do ${drill.name}`);
  };

  const handleFootworkDrillSelect = async (drill: FootworkDrill) => {
    setSelectedFootworkDrill(drill);
    await handleFootworkSearch(`how to do ${drill.name}`);
  };

  const toggleShootingFavorite = (video: YouTubeVideo) => {
    const isAlreadyFavorite = shootingFavorites.some(fav => fav.videoId === video.id);
    
    if (isAlreadyFavorite) {
      setShootingFavorites(shootingFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setShootingFavorites([...shootingFavorites, newFavorite]);
    }
  };

  const toggleFootworkFavorite = (video: YouTubeVideo) => {
    const isAlreadyFavorite = footworkFavorites.some(fav => fav.videoId === video.id);
    
    if (isAlreadyFavorite) {
      setFootworkFavorites(footworkFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setFootworkFavorites([...footworkFavorites, newFavorite]);
    }
  };

  const isShootingFavorite = (videoId: string) => {
    return shootingFavorites.some(fav => fav.videoId === videoId);
  };

  const isFootworkFavorite = (videoId: string) => {
    return footworkFavorites.some(fav => fav.videoId === videoId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryConfig = categories.find(c => c.id === category);
    return categoryConfig?.icon || BookOpen;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const goBackFromShooting = () => {
    if (selectedShootingDrill) {
      setSelectedShootingDrill(null);
      setShootingVideos([]);
      setError(null);
    } else if (selectedShootingSubcategory) {
      setSelectedShootingSubcategory(null);
    } else {
      setShowShootingDetails(false);
    }
  };

  const goBackFromFootwork = () => {
    if (selectedFootworkDrill) {
      setSelectedFootworkDrill(null);
      setFootworkVideos([]);
      setError(null);
    } else if (selectedFootworkSubcategory) {
      setSelectedFootworkSubcategory(null);
    } else {
      setShowFootworkDetails(false);
    }
  };

  const generateNewDailyShootingDrill = () => {
    const allDrills = shootingSubcategories.flatMap(sub => sub.drills);
    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
    setDailyShootingDrill(randomDrill);
    localStorage.setItem('daily-shooting-drill', JSON.stringify(randomDrill));
    localStorage.setItem('daily-shooting-drill-date', new Date().toDateString());
  };

  const generateNewDailyFootworkDrill = () => {
    const allDrills = footworkSubcategories.flatMap(sub => sub.drills);
    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
    setDailyFootworkDrill(randomDrill);
    localStorage.setItem('daily-footwork-drill', JSON.stringify(randomDrill));
    localStorage.setItem('daily-footwork-drill-date', new Date().toDateString());
  };

  // Defense search handler
  const handleDefenseSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos(query);
      setDefenseVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Drill select handler
  const handleDefenseDrillSelect = async (drill: DefenseDrill) => {
    setSelectedDefenseDrill(drill);
    setSelectedVideo(null);
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos(drill.name + ' basketball defense');
      setDefenseVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Favorite logic
  const toggleDefenseFavorite = (video: YouTubeVideo) => {
    if (defenseFavorites.some(fav => fav.videoId === video.id)) {
      setDefenseFavorites(defenseFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setDefenseFavorites([...defenseFavorites, newFavorite]);
    }
  };
  const isDefenseFavorite = (videoId: string) => defenseFavorites.some(fav => fav.videoId === videoId);

  // Navigation
  const goBackFromDefense = () => {
    if (selectedDefenseDrill) {
      setSelectedDefenseDrill(null);
      setSelectedVideo(null);
      setDefenseVideos([]);
    } else if (selectedDefenseSubcategory) {
      setSelectedDefenseSubcategory(null);
    } else {
      setShowDefenseDetails(false);
    }
  };

  // Handle category clicks
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'shooting') {
      setShowShootingDetails(true);
      setShowFootworkDetails(false);
      setShowDefenseDetails(false);
    } else if (categoryId === 'footwork') {
      setShowFootworkDetails(true);
      setShowShootingDetails(false);
      setShowDefenseDetails(false);
    } else if (categoryId === 'defense') {
      setShowDefenseDetails(true);
      setShowShootingDetails(false);
      setShowFootworkDetails(false);
    } else if (categoryId === 'passing') {
      setShowPassingDetails(true);
      setShowShootingDetails(false);
      setShowFootworkDetails(false);
      setShowDefenseDetails(false);
    } else if (categoryId === 'layups') {
      setShowLayupsDetails(true);
      setShowShootingDetails(false);
      setShowFootworkDetails(false);
      setShowDefenseDetails(false);
      setShowPassingDetails(false);
      setShowDribblingDetails(false);
    } else if (categoryId === 'dribbling') {
      setShowDribblingDetails(true);
      setShowShootingDetails(false);
      setShowFootworkDetails(false);
      setShowDefenseDetails(false);
      setShowPassingDetails(false);
      setShowLayupsDetails(false);
    } else {
      setSelectedCategory(categoryId);
      setShowShootingDetails(false);
      setShowFootworkDetails(false);
      setShowDefenseDetails(false);
      setShowPassingDetails(false);
      setShowLayupsDetails(false);
      setShowDribblingDetails(false);
      setSelectedShootingSubcategory(null);
      setSelectedFootworkSubcategory(null);
      setSelectedDefenseSubcategory(null);
      setSelectedPassingSubcategory(null);
      setSelectedLayupSubcategory(null);
      setSelectedDribbleCategory(null);
      setSelectedShootingDrill(null);
      setSelectedFootworkDrill(null);
      setSelectedDefenseDrill(null);
      setSelectedPassingDrill(null);
      setSelectedLayupDrill(null);
      setSelectedDribbleMove(null);
      setSelectedVideo(null);
    }
  };

  const generateNewDailyDefenseDrill = () => {
    const allDrills = defenseSubcategories.flatMap(sub => sub.drills);
    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
    setDailyDefenseDrill(randomDrill);
    localStorage.setItem('dailyDefenseDrill', JSON.stringify(randomDrill));
    localStorage.setItem('dailyDefenseDrillDate', new Date().toDateString());
  };

  // Passing search handler
  const handlePassingSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos(query + ' basketball passing');
      setPassingVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Drill select handler
  const handlePassingDrillSelect = async (drill: PassingDrill) => {
    setSelectedPassingDrill(drill);
    setSelectedVideo(null);
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos('how to ' + drill.name + ' basketball passing');
      setPassingVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Favorite logic
  const togglePassingFavorite = (video: YouTubeVideo) => {
    if (passingFavorites.some(fav => fav.videoId === video.id)) {
      setPassingFavorites(passingFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setPassingFavorites([...passingFavorites, newFavorite]);
    }
  };
  const isPassingFavorite = (videoId: string) => passingFavorites.some(fav => fav.videoId === videoId);

  // Navigation
  const goBackFromPassing = () => {
    if (selectedPassingDrill) {
      setSelectedPassingDrill(null);
      setSelectedVideo(null);
      setPassingVideos([]);
    } else if (selectedPassingSubcategory) {
      setSelectedPassingSubcategory(null);
    } else {
      setShowPassingDetails(false);
    }
  };

  const generateNewDailyPassingDrill = () => {
    const allDrills = passingSubcategories.flatMap(sub => sub.drills);
    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
    setDailyPassingDrill(randomDrill);
    localStorage.setItem('dailyPassingDrill', JSON.stringify(randomDrill));
    localStorage.setItem('dailyPassingDrillDate', new Date().toDateString());
  };

  // Layup search handler
  const handleLayupSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos(query + ' basketball layup');
      setLayupVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Drill select handler
  const handleLayupDrillSelect = async (drill: LayupDrill) => {
    setSelectedLayupDrill(drill);
    setSelectedVideo(null);
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos('how to ' + drill.name + ' basketball layup');
      setLayupVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Favorite logic
  const toggleLayupFavorite = (video: YouTubeVideo) => {
    if (layupFavorites.some(fav => fav.videoId === video.id)) {
      setLayupFavorites(layupFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setLayupFavorites([...layupFavorites, newFavorite]);
    }
  };
  const isLayupFavorite = (videoId: string) => layupFavorites.some(fav => fav.videoId === videoId);

  // Navigation
  const goBackFromLayups = () => {
    if (selectedLayupDrill) {
      setSelectedLayupDrill(null);
      setSelectedVideo(null);
      setLayupVideos([]);
    } else if (selectedLayupSubcategory) {
      setSelectedLayupSubcategory(null);
    } else {
      setShowLayupsDetails(false);
    }
  };

  const generateNewDailyLayupDrill = () => {
    const allDrills = layupSubcategories.flatMap(sub => sub.drills);
    const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
    setDailyLayupDrill(randomDrill);
    localStorage.setItem('dailyLayupDrill', JSON.stringify(randomDrill));
    localStorage.setItem('dailyLayupDrillDate', new Date().toDateString());
  };

  // Dribbling search handler
  const handleDribbleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos(query + ' basketball dribble move');
      setDribbleVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Move select handler
  const handleDribbleMoveSelect = async (move: DribbleMove) => {
    setSelectedDribbleMove(move);
    setSelectedVideo(null);
    setLoading(true);
    setError(null);
    try {
      const res = await searchYouTubeVideos('how to do ' + move.name + ' basketball dribble move');
      setDribbleVideos(res.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      })));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Favorite logic
  const toggleDribbleFavorite = (video: YouTubeVideo) => {
    if (dribbleFavorites.some(fav => fav.videoId === video.id)) {
      setDribbleFavorites(dribbleFavorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setDribbleFavorites([...dribbleFavorites, newFavorite]);
    }
  };
  const isDribbleFavorite = (videoId: string) => dribbleFavorites.some(fav => fav.videoId === videoId);

  // Navigation
  const goBackFromDribbling = () => {
    if (selectedDribbleMove) {
      setSelectedDribbleMove(null);
      setSelectedVideo(null);
      setDribbleVideos([]);
    } else if (selectedDribbleCategory) {
      setSelectedDribbleCategory(null);
    } else {
      setShowDribblingDetails(false);
    }
  };

  const generateNewDailyDribbleMove = () => {
    const allMoves = dribbleCategories.flatMap(cat => cat.moves);
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    setDailyDribbleMove(randomMove);
    localStorage.setItem('dailyDribbleMove', JSON.stringify(randomMove));
    localStorage.setItem('dailyDribbleMoveDate', new Date().toDateString());
  };

  // UI rendering for Defense section
  const renderDefenseSection = () => {
    // Daily Defense Drill Card (styled like shooting)
    const dailyCard = dailyDefenseDrill && !selectedDefenseSubcategory && !selectedDefenseDrill && (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Defense Challenge</h3>
              <p className="text-sm text-gray-600">Daily drill to improve your defense</p>
            </div>
          </div>
          <button
            onClick={generateNewDailyDefenseDrill}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            title="Generate new drill"
          >
            <Shuffle size={20} />
          </button>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{dailyDefenseDrill.name}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyDefenseDrill.difficulty)}`}>{dailyDefenseDrill.difficulty}</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{dailyDefenseDrill.description}</p>
          <button
            onClick={() => handleDefenseDrillSelect(dailyDefenseDrill)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Start Challenge →
          </button>
        </div>
      </div>
    );

    // Search Bar
    const searchBar = !selectedDefenseDrill && (
      <div className="flex items-center mb-6">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Search defensive moves or drills..."
          value={defenseSearchQuery}
          onChange={e => setDefenseSearchQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleDefenseSearch(defenseSearchQuery); }}
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded-r"
          onClick={() => handleDefenseSearch(defenseSearchQuery)}
        >
          <Search size={18} />
        </button>
      </div>
    );

    // Back Button
    const backBtn = (selectedDefenseSubcategory || selectedDefenseDrill) && (
      <button className="mb-4 flex items-center text-blue-600" onClick={goBackFromDefense}>
        <ArrowLeft className="mr-1" size={18} /> Back
      </button>
    );

    // Subcategories Grid
    const subcategoryGrid = !selectedDefenseSubcategory && !selectedDefenseDrill && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defenseSubcategories.map(sub => (
          <div
            key={sub.id}
            onClick={() => setSelectedDefenseSubcategory(sub)}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-lg ${sub.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                <Shield size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{sub.name}</h3>
                <p className="text-sm text-gray-600">{sub.drills.length} drills</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{sub.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {sub.drills.slice(0, 3).map((drill, index) => (
                  <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>{drill.difficulty}</span>
                ))}
              </div>
              <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">Explore →</span>
            </div>
          </div>
        ))}
      </div>
    );

    // Drills Grid
    const drillGrid = selectedDefenseSubcategory && !selectedDefenseDrill && (
      <div>
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromDefense}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${selectedDefenseSubcategory.color} flex items-center justify-center text-white`}>
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedDefenseSubcategory.name}</h2>
              <p className="text-gray-600">{selectedDefenseSubcategory.description}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDefenseSubcategory.drills.map(drill => (
            <div
              key={drill.id}
              onClick={() => handleDefenseDrillSelect(drill)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Play size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>{drill.difficulty}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{drill.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Watch tutorials</span>
                <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">Learn →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    // Drill Videos Grid
    const videoGrid = selectedDefenseDrill && !selectedVideo && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromDefense}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedDefenseDrill.name}</h2>
              <p className="text-gray-600">Video tutorials and instructions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedDefenseDrill.difficulty)}`}>{selectedDefenseDrill.difficulty}</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-600">{selectedDefenseSubcategory?.name}</span>
            </div>
          </div>
          <p className="text-gray-700">{selectedDefenseDrill.description}</p>
        </div>
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Finding tutorial videos...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <X size={12} className="text-white" />
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        {!loading && defenseVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defenseVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDefenseFavorite(video);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDefenseFavorite(video.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                    }`}
                  >
                    <Star size={16} fill={isDefenseFavorite(video.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {truncateTitle(video.title)}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <User size={14} />
                    <span className="truncate">{video.channelTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // Video Player (reuse existing)
    const videoPlayer = selectedVideo && (
      <div className="w-full flex flex-col items-center">
        <button className="mb-2 flex items-center text-blue-600 self-start" onClick={() => setSelectedVideo(null)}>
          <ArrowLeft className="mr-1" size={18} /> Back to Videos
        </button>
        <div className="w-full aspect-video mb-2">
          <iframe
            className="w-full h-60 rounded"
            src={`https://www.youtube.com/embed/${selectedVideo.id}`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="font-bold text-lg mb-1">{selectedVideo.title}</div>
        <div className="text-sm opacity-80 mb-2">{selectedVideo.channelTitle}</div>
        <button
          className={`px-4 py-2 rounded ${isDefenseFavorite(selectedVideo.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => toggleDefenseFavorite(selectedVideo)}
        >
          {isDefenseFavorite(selectedVideo.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    );

    // Main Defense Section Render
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {backBtn}
        {dailyCard}
        {searchBar}
        {subcategoryGrid}
        {drillGrid}
        {videoGrid}
        {videoPlayer}
      </div>
    );
  };

  // Shooting Details View (existing code)
  if (showShootingDetails) {
    // Video Tutorials View
    if (selectedShootingDrill) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromShooting}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedShootingDrill.name}</h2>
                <p className="text-gray-600">Video tutorials and instructions</p>
              </div>
            </div>
          </div>

          {/* Drill Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedShootingDrill.difficulty)}`}>
                  {selectedShootingDrill.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">{selectedShootingSubcategory?.name}</span>
              </div>
            </div>
            <p className="text-gray-700">{selectedShootingDrill.description}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutorial videos...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && shootingVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shootingVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShootingFavorite(video);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isShootingFavorite(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Heart size={16} fill={isShootingFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {truncateTitle(video.title)}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Drill Selection View
    if (selectedShootingSubcategory) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromShooting}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedShootingSubcategory.color} flex items-center justify-center text-white`}>
                <Target size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedShootingSubcategory.name}</h2>
                <p className="text-gray-600">{selectedShootingSubcategory.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedShootingSubcategory.drills.map((drill) => (
              <div
                key={drill.id}
                onClick={() => handleShootingDrillSelect(drill)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
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
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{drill.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Watch tutorials</span>
                  <span className="text-orange-600 text-sm font-medium group-hover:text-orange-700">
                    Learn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main Shooting View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromShooting}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shooting Skills</h2>
              <p className="text-gray-600">Master every aspect of basketball shooting</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyShootingDrill && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Shooting Challenge</h3>
                  <p className="text-sm text-gray-600">Daily drill to improve your shooting</p>
                </div>
              </div>
              <button
                onClick={generateNewDailyShootingDrill}
                className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                title="Generate new drill"
              >
                <Shuffle size={20} />
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dailyShootingDrill.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyShootingDrill.difficulty)}`}>
                  {dailyShootingDrill.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{dailyShootingDrill.description}</p>
              <button
                onClick={() => handleShootingDrillSelect(dailyShootingDrill)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Search Shooting Tutorials</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleShootingSearch(shootingSearchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={shootingSearchQuery}
                onChange={(e) => setShootingSearchQuery(e.target.value)}
                placeholder="Search for shooting moves (e.g., step back jumper, fadeaway)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !shootingSearchQuery.trim()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results */}
          {shootingVideos.length > 0 && !selectedShootingDrill && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shootingVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShootingFavorite(video);
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isShootingFavorite(video.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                      >
                        <Heart size={12} fill={isShootingFavorite(video.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {truncateTitle(video.title, 50)}
                      </h5>
                      <p className="text-xs text-gray-600">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shootingSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() => setSelectedShootingSubcategory(subcategory)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${subcategory.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Target size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-600">{subcategory.drills.length} drills</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {subcategory.drills.slice(0, 3).map((drill, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
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

  // Footwork Details View
  if (showFootworkDetails) {
    // Video Tutorials View
    if (selectedFootworkDrill) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromFootwork}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Move size={20} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedFootworkDrill.name}</h2>
                <p className="text-gray-600">Video tutorials and instructions</p>
              </div>
            </div>
          </div>

          {/* Drill Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedFootworkDrill.difficulty)}`}>
                  {selectedFootworkDrill.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">{selectedFootworkSubcategory?.name}</span>
              </div>
            </div>
            <p className="text-gray-700">{selectedFootworkDrill.description}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutorial videos...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && footworkVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {footworkVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFootworkFavorite(video);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isFootworkFavorite(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Heart size={16} fill={isFootworkFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {truncateTitle(video.title)}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Drill Selection View
    if (selectedFootworkSubcategory) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromFootwork}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedFootworkSubcategory.color} flex items-center justify-center text-white`}>
                <Move size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedFootworkSubcategory.name}</h2>
                <p className="text-gray-600">{selectedFootworkSubcategory.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedFootworkSubcategory.drills.map((drill) => (
              <div
                key={drill.id}
                onClick={() => handleFootworkDrillSelect(drill)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
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
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{drill.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Watch tutorials</span>
                  <span className="text-orange-600 text-sm font-medium group-hover:text-orange-700">
                    Learn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main Footwork View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromFootwork}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Move size={20} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Footwork Skills</h2>
              <p className="text-gray-600">Master every aspect of basketball footwork</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyFootworkDrill && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Move size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Footwork Drill</h3>
                  <p className="text-sm text-gray-600">Today's focus for better footwork</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const allDrills = footworkSubcategories.flatMap(sub => sub.drills);
                  const randomDrill = allDrills[Math.floor(Math.random() * allDrills.length)];
                  setDailyFootworkDrill(randomDrill);
                  localStorage.setItem('daily-footwork-drill', JSON.stringify(randomDrill));
                  localStorage.setItem('daily-footwork-drill-date', new Date().toDateString());
                }}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                title="Generate new drill"
              >
                <Shuffle size={20} />
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dailyFootworkDrill.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyFootworkDrill.difficulty)}`}>
                  {dailyFootworkDrill.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{dailyFootworkDrill.description}</p>
              <button
                onClick={() => handleFootworkDrillSelect(dailyFootworkDrill)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Search Footwork Tutorials</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleFootworkSearch(footworkSearchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={footworkSearchQuery}
                onChange={(e) => setFootworkSearchQuery(e.target.value)}
                placeholder="Search for footwork moves (e.g., euro step, jab step, pivot)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !footworkSearchQuery.trim()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results */}
          {footworkVideos.length > 0 && !selectedFootworkDrill && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {footworkVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFootworkFavorite(video);
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isFootworkFavorite(video.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                      >
                        <Heart size={12} fill={isFootworkFavorite(video.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {truncateTitle(video.title, 50)}
                      </h5>
                      <p className="text-xs text-gray-600">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {footworkSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() => setSelectedFootworkSubcategory(subcategory)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${subcategory.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Move size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-600">{subcategory.drills.length} drills</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {subcategory.drills.slice(0, 3).map((drill, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
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

  // Dribbling Details View
  if (showDribblingDetails) {
    // Video Tutorials View
    if (selectedDribbleMove) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromDribbling}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Dribble size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDribbleMove.name}</h2>
                <p className="text-gray-600">Video tutorials and instructions</p>
              </div>
            </div>
          </div>

          {/* Move Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedDribbleMove.difficulty)}`}>
                  {selectedDribbleMove.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">{selectedDribbleCategory?.name}</span>
              </div>
            </div>
            <p className="text-gray-700">{selectedDribbleMove.description}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutorial videos...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && dribbleVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dribbleVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDribbleFavorite(video);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isDribbleFavorite(video.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Star size={16} fill={isDribbleFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {truncateTitle(video.title)}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Move Selection View
    if (selectedDribbleCategory) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromDribbling}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedDribbleCategory.color} flex items-center justify-center text-white`}>
                <Dribble size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDribbleCategory.name}</h2>
                <p className="text-gray-600">{selectedDribbleCategory.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedDribbleCategory.moves.map((move) => (
              <div
                key={move.id}
                onClick={() => handleDribbleMoveSelect(move)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Play size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{move.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(move.difficulty)}`}>
                        {move.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{move.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Watch tutorials</span>
                  <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    Learn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main Dribbling View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromDribbling}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Dribble size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dribbling Skills</h2>
              <p className="text-gray-600">Master every aspect of basketball dribbling</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyDribbleMove && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Dribble size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Dribble Move</h3>
                  <p className="text-sm text-gray-600">Daily move to improve your ball handling</p>
                </div>
              </div>
              <button
                onClick={generateNewDailyDribbleMove}
                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                title="Generate new move"
              >
                <Shuffle size={20} />
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dailyDribbleMove.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyDribbleMove.difficulty)}`}>
                  {dailyDribbleMove.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{dailyDribbleMove.description}</p>
              <button
                onClick={() => handleDribbleMoveSelect(dailyDribbleMove)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Search Dribble Tutorials</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleDribbleSearch(dribbleSearchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={dribbleSearchQuery}
                onChange={(e) => setDribbleSearchQuery(e.target.value)}
                placeholder="Search for dribble moves (e.g., crossover, behind the back, spin move)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !dribbleSearchQuery.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results */}
          {dribbleVideos.length > 0 && !selectedDribbleMove && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dribbleVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDribbleFavorite(video);
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isDribbleFavorite(video.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                      >
                        <Heart size={12} fill={isDribbleFavorite(video.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {truncateTitle(video.title, 50)}
                      </h5>
                      <p className="text-xs text-gray-600">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dribbleCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedDribbleCategory(category)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Dribble size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.moves.length} moves</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {category.moves.slice(0, 3).map((move, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(move.difficulty)}`}>
                      {move.difficulty}
                    </span>
                  ))}
                </div>
                <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Defense Details View
  if (showDefenseDetails) {
    return renderDefenseSection();
  }

  // Passing Details View
  if (showPassingDetails) {
    // Video Tutorials View
    if (selectedPassingDrill) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromPassing}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPassingDrill.name}</h2>
                <p className="text-gray-600">Video tutorials and instructions</p>
              </div>
            </div>
          </div>

          {/* Drill Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedPassingDrill.difficulty)}`}>
                  {selectedPassingDrill.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">{selectedPassingSubcategory?.name}</span>
              </div>
            </div>
            <p className="text-gray-700">{selectedPassingDrill.description}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutorial videos...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && passingVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passingVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePassingFavorite(video);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isPassingFavorite(video.id)
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Star size={16} fill={isPassingFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {truncateTitle(video.title)}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Drill Selection View
    if (selectedPassingSubcategory) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromPassing}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedPassingSubcategory.color} flex items-center justify-center text-white`}>
                <Users size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPassingSubcategory.name}</h2>
                <p className="text-gray-600">{selectedPassingSubcategory.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedPassingSubcategory.drills.map((drill) => (
              <div
                key={drill.id}
                onClick={() => handlePassingDrillSelect(drill)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Play size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                        {drill.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{drill.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Watch tutorials</span>
                  <span className="text-yellow-600 text-sm font-medium group-hover:text-yellow-700">
                    Learn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main Passing View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromPassing}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Passing Skills</h2>
              <p className="text-gray-600">Master every aspect of basketball passing</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyPassingDrill && (
          <div className="bg-gradient-to-r from-yellow-50 to-indigo-50 rounded-xl border border-yellow-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Passing Drill</h3>
                  <p className="text-sm text-gray-600">Daily drill to improve your passing</p>
                </div>
              </div>
              <button
                onClick={generateNewDailyPassingDrill}
                className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors"
                title="Generate new drill"
              >
                <Shuffle size={20} />
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dailyPassingDrill.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyPassingDrill.difficulty)}`}>{dailyPassingDrill.difficulty}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{dailyPassingDrill.description}</p>
              <button
                onClick={() => handlePassingDrillSelect(dailyPassingDrill)}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Search Passing Tutorials</h3>
          <form onSubmit={(e) => { e.preventDefault(); handlePassingSearch(passingSearchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={passingSearchQuery}
                onChange={(e) => setPassingSearchQuery(e.target.value)}
                placeholder="Search for passing moves or drills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !passingSearchQuery.trim()}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results */}
          {passingVideos.length > 0 && !selectedPassingDrill && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {passingVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePassingFavorite(video);
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isPassingFavorite(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                        <Heart size={12} fill={isPassingFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {truncateTitle(video.title, 50)}
                      </h5>
                      <p className="text-xs text-gray-600">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                  </div>
                  
        {/* Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {passingSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() => setSelectedPassingSubcategory(subcategory)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${subcategory.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Users size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-600">{subcategory.drills.length} drills</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {subcategory.drills.slice(0, 3).map((drill, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                  ))}
                </div>
                <span className="text-yellow-600 text-sm font-medium group-hover:text-yellow-700">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Layups Details View
  if (showLayupsDetails) {
    // Video Tutorials View
    if (selectedLayupDrill) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromLayups}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Move size={20} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLayupDrill.name}</h2>
                <p className="text-gray-600">Video tutorials and instructions</p>
              </div>
            </div>
          </div>

          {/* Drill Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedLayupDrill.difficulty)}`}>
                  {selectedLayupDrill.difficulty}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-600">{selectedLayupSubcategory?.name}</span>
              </div>
            </div>
            <p className="text-gray-700">{selectedLayupDrill.description}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutorial videos...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X size={12} className="text-white" />
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && layupVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layupVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayupFavorite(video);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isLayupFavorite(video.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                      }`}
                    >
                      <Star size={16} fill={isLayupFavorite(video.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {truncateTitle(video.title)}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span className="truncate">{video.channelTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Drill Selection View
    if (selectedLayupSubcategory) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={goBackFromLayups}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedLayupSubcategory.color} flex items-center justify-center text-white`}>
                <Move size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLayupSubcategory.name}</h2>
                <p className="text-gray-600">{selectedLayupSubcategory.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedLayupSubcategory.drills.map((drill) => (
              <div
                key={drill.id}
                onClick={() => handleLayupDrillSelect(drill)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Play size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                        {drill.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{drill.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Watch tutorials</span>
                  <span className="text-green-600 text-sm font-medium group-hover:text-green-700">
                    Learn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Main Layups View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBackFromLayups}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Move size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Layup Skills</h2>
              <p className="text-gray-600">Master every aspect of basketball layups</p>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyLayupDrill && (
          <div className="bg-gradient-to-r from-green-50 to-indigo-50 rounded-xl border border-green-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <Move size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Today's Layup Drill</h3>
                  <p className="text-sm text-gray-600">Daily drill to improve your layups</p>
                </div>
              </div>
              <button
                onClick={generateNewDailyLayupDrill}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                title="Generate new drill"
              >
                <Shuffle size={20} />
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dailyLayupDrill.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dailyLayupDrill.difficulty)}`}>{dailyLayupDrill.difficulty}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{dailyLayupDrill.description}</p>
              <button
                onClick={() => handleLayupDrillSelect(dailyLayupDrill)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Search Layup Tutorials</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleLayupSearch(layupSearchQuery); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={layupSearchQuery}
                onChange={(e) => setLayupSearchQuery(e.target.value)}
                placeholder="Search for layup moves or drills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !layupSearchQuery.trim()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results */}
          {layupVideos.length > 0 && !selectedLayupDrill && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Search Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layupVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play size={16} className="text-white ml-1" />
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayupFavorite(video);
                        }}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isLayupFavorite(video.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                      >
                        <Heart size={12} fill={isLayupFavorite(video.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {truncateTitle(video.title, 50)}
                      </h5>
                      <p className="text-xs text-gray-600">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layupSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() => setSelectedLayupSubcategory(subcategory)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${subcategory.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Move size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-600">{subcategory.drills.length} drills</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {subcategory.drills.slice(0, 3).map((drill, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                      {drill.difficulty}
                    </span>
                  ))}
                </div>
                <span className="text-green-600 text-sm font-medium group-hover:text-green-700">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular Skills Library View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills Library</h2>
        <p className="text-gray-600">Master fundamental basketball skills with step-by-step tutorials</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id && !showShootingDetails && !showFootworkDetails && !showDefenseDetails && !showPassingDetails && !showLayupsDetails
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => {
          const Icon = getCategoryIcon(skill.category);
          return (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{skill.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {skill.instructions.length} steps
                </div>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  {React.createElement(getCategoryIcon(selectedSkill.category), { size: 24, className: 'text-orange-600' })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedSkill.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 capitalize">{selectedSkill.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedSkill.difficulty)}`}>
                      {selectedSkill.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedSkill.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                <ol className="space-y-2">
                  {selectedSkill.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pro Tips</h4>
                <ul className="space-y-2">
                  {selectedSkill.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Youtube size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{selectedVideo.title}</h3>
                  <p className="text-sm text-gray-600">{selectedVideo.channelTitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (showShootingDetails) {
                      toggleShootingFavorite(selectedVideo);
                    } else if (showFootworkDetails) {
                      toggleFootworkFavorite(selectedVideo);
                    } else if (showDefenseDetails) {
                      toggleDefenseFavorite(selectedVideo);
                    } else if (showPassingDetails) {
                      togglePassingFavorite(selectedVideo);
                    } else if (showLayupsDetails) {
                      toggleLayupFavorite(selectedVideo);
                    } else if (showDribblingDetails) {
                      toggleDribbleFavorite(selectedVideo);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    (showShootingDetails && isShootingFavorite(selectedVideo.id)) || 
                    (showFootworkDetails && isFootworkFavorite(selectedVideo.id)) ||
                    (showDefenseDetails && isDefenseFavorite(selectedVideo.id)) ||
                    (showPassingDetails && isPassingFavorite(selectedVideo.id)) ||
                    (showLayupsDetails && isLayupFavorite(selectedVideo.id)) ||
                    (showDribblingDetails && isDribbleFavorite(selectedVideo.id))
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={16} fill={
                    (showShootingDetails && isShootingFavorite(selectedVideo.id)) || 
                    (showFootworkDetails && isFootworkFavorite(selectedVideo.id)) ||
                    (showDefenseDetails && isDefenseFavorite(selectedVideo.id)) ||
                    (showPassingDetails && isPassingFavorite(selectedVideo.id)) ||
                    (showLayupsDetails && isLayupFavorite(selectedVideo.id)) ||
                    (showDribblingDetails && isDribbleFavorite(selectedVideo.id))
                      ? 'currentColor' : 'none'
                  } />
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsLibrary;