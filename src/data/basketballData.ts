// Basketball training data
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
  description?: string;
  reps?: string;
  recommendedDuration?: number;
  tips?: string[];
  videoId?: string;
}

export interface Stretch {
  id: string;
  name: string;
  type: 'warm-up' | 'cool-down' | 'maintenance';
  duration: number;
  description?: string;
  instructions: string[];
  targetAreas: string[];
  videoId?: string;
  recommendedDuration?: number;
  tips?: string[];
}

export const skills: Skill[] = [
  {
    id: 'crossover-dribble',
    name: 'Crossover Dribble',
    category: 'dribbling',
    difficulty: 'beginner',
    description: 'Master the fundamental crossover move to change direction quickly',
    instructions: [
      'Start in athletic stance with ball in right hand',
      'Dribble ball low and hard across your body to left hand',
      'Step with left foot as ball crosses over',
      'Keep head up and eyes forward',
      'Practice alternating directions'
    ],
    tips: [
      'Keep the dribble low and controlled',
      'Use your off-hand to protect the ball',
      'Practice at game speed once comfortable'
    ],
    recommendedDuration: 300
  },
  {
    id: 'jump-shot-form',
    name: 'Jump Shot Form',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Develop proper shooting mechanics for consistent accuracy',
    instructions: [
      'Start with feet shoulder-width apart',
      'Hold ball with shooting hand under, guide hand on side',
      'Align shooting elbow under the ball',
      'Jump straight up and release at peak',
      'Follow through with wrist snap'
    ],
    tips: [
      'Keep shooting elbow aligned under the ball',
      'Use consistent follow-through',
      'Practice close to basket first'
    ],
    recommendedDuration: 600
  },
  {
    id: 'defensive-stance',
    name: 'Defensive Stance',
    category: 'defense',
    difficulty: 'beginner',
    description: 'Learn proper defensive positioning and footwork',
    instructions: [
      'Feet wider than shoulder-width apart',
      'Knees bent, weight on balls of feet',
      'Arms out wide, hands active',
      'Stay low and balanced',
      'Move with shuffle steps'
    ],
    tips: [
      'Keep your head up to see the whole court',
      'Stay between opponent and basket',
      'Use active hands to disrupt passes'
    ],
    recommendedDuration: 240
  }
];

export const exercises: Exercise[] = [
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'strength',
    duration: 180,
    difficulty: 'beginner',
    description: 'Build upper body and core strength',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches ground',
      'Push back up to starting position',
      'Keep body straight throughout movement'
    ],
    reps: '3 sets of 10-15 reps',
    recommendedDuration: 180,
    tips: [
      'Keep core engaged throughout',
      'Don\'t let hips sag or pike up',
      'Control the movement both up and down'
    ]
  },
  {
    id: 'squats',
    name: 'Squats',
    category: 'strength',
    duration: 240,
    difficulty: 'beginner',
    description: 'Strengthen legs and improve jumping power',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower hips back and down as if sitting in chair',
      'Keep chest up and knees behind toes',
      'Lower until thighs parallel to ground',
      'Drive through heels to return to start'
    ],
    reps: '3 sets of 12-20 reps',
    recommendedDuration: 240,
    tips: [
      'Keep weight on heels',
      'Don\'t let knees cave inward',
      'Go as low as mobility allows'
    ]
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Full-body cardio exercise for conditioning',
    instructions: [
      'Start standing, then squat down',
      'Place hands on ground and jump feet back to plank',
      'Do a push-up (optional)',
      'Jump feet back to squat position',
      'Jump up with arms overhead'
    ],
    reps: '3 sets of 8-12 reps',
    recommendedDuration: 300,
    tips: [
      'Maintain good form even when tired',
      'Modify by stepping instead of jumping',
      'Focus on smooth transitions'
    ]
  }
];

export const stretches: Stretch[] = [
  {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    type: 'cool-down',
    duration: 30,
    description: 'Stretch the back of your thighs',
    instructions: [
      'Sit on ground with one leg extended',
      'Reach forward toward your toes',
      'Hold stretch for 30 seconds',
      'Switch legs and repeat'
    ],
    targetAreas: ['hamstrings', 'lower back'],
    recommendedDuration: 30,
    tips: [
      'Don\'t bounce, hold steady',
      'Breathe deeply during stretch',
      'Stop if you feel pain'
    ]
  },
  {
    id: 'quad-stretch',
    name: 'Quad Stretch',
    type: 'cool-down',
    duration: 30,
    description: 'Stretch the front of your thighs',
    instructions: [
      'Stand on one leg',
      'Bend other knee and grab ankle behind you',
      'Pull heel toward glutes',
      'Hold for 30 seconds, switch legs'
    ],
    targetAreas: ['quadriceps', 'hip flexors'],
    recommendedDuration: 30,
    tips: [
      'Use wall for balance if needed',
      'Keep knees close together',
      'Don\'t arch your back'
    ]
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    type: 'warm-up',
    duration: 60,
    description: 'Warm up shoulders and arms',
    instructions: [
      'Extend arms out to sides',
      'Make small circles forward for 30 seconds',
      'Make small circles backward for 30 seconds',
      'Gradually increase circle size'
    ],
    targetAreas: ['shoulders', 'arms'],
    recommendedDuration: 60,
    tips: [
      'Start with small circles',
      'Keep arms straight',
      'Control the movement'
    ]
  }
];

export const trainingTypes = [
  { id: 'skills', name: 'Skills Training', color: 'bg-blue-500' },
  { id: 'conditioning', name: 'Conditioning', color: 'bg-red-500' },
  { id: 'shooting', name: 'Shooting Practice', color: 'bg-orange-500' },
  { id: 'game-prep', name: 'Game Preparation', color: 'bg-green-500' }
];