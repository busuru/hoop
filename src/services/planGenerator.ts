import { skills, exercises } from '../data/basketballData';
import { Stretch } from '../types';

export interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  availableTime: number; // minutes per session
  frequency: number; // sessions per week
  focusAreas: string[];
  equipment: string[];
  injuries?: string[];
  preferences: {
    intensity: 'low' | 'medium' | 'high';
    sessionType: 'skills' | 'strength' | 'conditioning' | 'mixed';
    warmupTime: number;
    cooldownTime: number;
  };
}

export interface GeneratedSession {
  id: string;
  name: string;
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  focus: string;
  drills: Array<{
    id: string;
    name: string;
    category: string;
    duration: number;
    sets?: number;
    reps?: number;
    restTime?: number;
    notes?: string;
  }>;
  warmup: Array<{
    id: string;
    name: string;
    duration: number;
  }>;
  cooldown: Array<{
    id: string;
    name: string;
    duration: number;
  }>;
  totalTime: number;
  difficulty: number; // 1-10
  calories: number;
  description: string;
  tips: string[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  sessions: GeneratedSession[];
  progression: 'linear' | 'periodic' | 'maintenance';
  restDays: number[];
  goals: string[];
  difficulty: number;
  totalSessions: number;
}

class PlanGenerator {
  private skillDrills = skills;
  private strengthExercises = exercises;
  private stretchData: Stretch[] = [];

  constructor() {
    // Load stretch data if available
    try {
      const stretchModule = require('../data/basketballData');
      this.stretchData = stretchModule.stretches || [];
    } catch (error) {
      console.log('Stretch data not available for plan generation');
    }
  }

  // Generate a complete training plan
  generateTrainingPlan(profile: UserProfile, weeks: number = 4): TrainingPlan {
    const sessions: GeneratedSession[] = [];
    const totalSessions = profile.frequency * weeks;

    for (let week = 1; week <= weeks; week++) {
      for (let session = 1; session <= profile.frequency; session++) {
        const sessionPlan = this.generateSession(profile, week, session);
        sessions.push(sessionPlan);
      }
    }

    return {
      id: `plan-${Date.now()}`,
      name: `${profile.skillLevel.charAt(0).toUpperCase() + profile.skillLevel.slice(1)} ${profile.preferences.sessionType} Training Plan`,
      description: `A ${weeks}-week training plan focused on ${profile.focusAreas.join(', ')}`,
      duration: weeks,
      sessions,
      progression: this.determineProgression(profile),
      restDays: this.calculateRestDays(profile.frequency),
      goals: profile.goals,
      difficulty: this.calculatePlanDifficulty(profile),
      totalSessions
    };
  }

  // Generate a single session
  generateSession(profile: UserProfile, week: number, sessionNumber: number): GeneratedSession {
    const sessionType = this.determineSessionType(profile, week, sessionNumber);
    const intensity = this.calculateIntensity(profile, week);
    const availableTime = profile.availableTime;
    
    // Calculate time distribution
    const warmupTime = profile.preferences.warmupTime;
    const cooldownTime = profile.preferences.cooldownTime;
    const mainWorkoutTime = availableTime - warmupTime - cooldownTime;

    // Generate workout components
    const warmup = this.generateWarmup(warmupTime, profile);
    const mainDrills = this.generateMainWorkout(mainWorkoutTime, sessionType, intensity, profile);
    const cooldown = this.generateCooldown(cooldownTime, profile);

    const totalTime = warmupTime + mainWorkoutTime + cooldownTime;
    const difficulty = this.calculateSessionDifficulty(intensity, profile.skillLevel);
    const calories = this.estimateCalories(totalTime, intensity, profile);

    return {
      id: `session-${week}-${sessionNumber}-${Date.now()}`,
      name: this.generateSessionName(sessionType, week, sessionNumber),
      type: sessionType,
      duration: totalTime,
      intensity,
      focus: this.determineFocus(sessionType, profile.focusAreas),
      drills: mainDrills,
      warmup,
      cooldown,
      totalTime,
      difficulty,
      calories,
      description: this.generateSessionDescription(sessionType, intensity, profile),
      tips: this.generateSessionTips(sessionType, intensity, profile)
    };
  }

  // Generate warmup exercises
  private generateWarmup(duration: number, profile: UserProfile) {
    const warmupExercises = this.stretchData.filter(s => s.type === 'Warm-up');
    const selected: any[] = [];
    let remainingTime = duration;

    // Add dynamic warmup
    const dynamicWarmups = [
      { name: 'Light Jogging', duration: Math.min(5, remainingTime) },
      { name: 'Arm Circles', duration: 2 },
      { name: 'Leg Swings', duration: 2 },
      { name: 'Hip Circles', duration: 2 }
    ];

    for (const warmup of dynamicWarmups) {
      if (remainingTime >= warmup.duration) {
        selected.push({
          id: `warmup-${warmup.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: warmup.name,
          duration: warmup.duration
        });
        remainingTime -= warmup.duration;
      }
    }

    // Add stretching warmups
    const availableStretches = warmupExercises.slice(0, Math.ceil(remainingTime / 2));
    for (const stretch of availableStretches) {
      if (remainingTime >= 2) {
        selected.push({
          id: stretch.id,
          name: stretch.name,
          duration: 2
        });
        remainingTime -= 2;
      }
    }

    return selected;
  }

  // Generate main workout drills
  private generateMainWorkout(duration: number, sessionType: string, intensity: string, profile: UserProfile) {
    const drills: any[] = [];
    let remainingTime = duration;

    switch (sessionType) {
      case 'skills':
        drills.push(...this.generateSkillsWorkout(remainingTime, intensity, profile));
        break;
      case 'strength':
        drills.push(...this.generateStrengthWorkout(remainingTime, intensity, profile));
        break;
      case 'conditioning':
        drills.push(...this.generateConditioningWorkout(remainingTime, intensity, profile));
        break;
      case 'mixed':
        drills.push(...this.generateMixedWorkout(remainingTime, intensity, profile));
        break;
    }

    return drills;
  }

  // Generate skills-focused workout
  private generateSkillsWorkout(duration: number, intensity: string, profile: UserProfile) {
    const drills: any[] = [];
    let remainingTime = duration;

    // Filter drills by skill level and focus areas
    const availableDrills = this.skillDrills.filter(drill => {
      const matchesLevel = this.matchesSkillLevel(drill, profile.skillLevel);
      const matchesFocus = profile.focusAreas.some(focus => 
        drill.category.toLowerCase().includes(focus.toLowerCase())
      );
      return matchesLevel && matchesFocus;
    });

    // Select drills based on intensity and time
    const drillCount = this.calculateDrillCount(remainingTime, intensity);
    const selectedDrills = this.selectRandomDrills(availableDrills, drillCount);

    for (const drill of selectedDrills) {
      const drillDuration = this.calculateDrillDuration(drill, intensity, profile);
      if (remainingTime >= drillDuration) {
        drills.push({
          id: drill.id,
          name: drill.name,
          category: drill.category,
          duration: drillDuration,
          sets: this.calculateSets(intensity),
          reps: this.calculateReps(drill, intensity),
          restTime: this.calculateRestTime(intensity),
          notes: this.generateDrillNotes(drill, profile)
        });
        remainingTime -= drillDuration;
      }
    }

    return drills;
  }

  // Generate strength-focused workout
  private generateStrengthWorkout(duration: number, intensity: string, profile: UserProfile) {
    const drills: any[] = [];
    let remainingTime = duration;

    const availableExercises = this.strengthExercises.filter(exercise => {
      const matchesLevel = this.matchesSkillLevel(exercise, profile.skillLevel);
      const hasEquipment = this.hasRequiredEquipment(exercise, profile.equipment);
      return matchesLevel && hasEquipment;
    });

    const exerciseCount = this.calculateExerciseCount(remainingTime, intensity);
    const selectedExercises = this.selectRandomDrills(availableExercises, exerciseCount);

    for (const exercise of selectedExercises) {
      const exerciseDuration = this.calculateExerciseDuration(exercise, intensity, profile);
      if (remainingTime >= exerciseDuration) {
        drills.push({
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          duration: exerciseDuration,
          sets: this.calculateStrengthSets(intensity),
          reps: this.calculateStrengthReps(intensity),
          restTime: this.calculateStrengthRestTime(intensity),
          notes: this.generateExerciseNotes(exercise, profile)
        });
        remainingTime -= exerciseDuration;
      }
    }

    return drills;
  }

  // Generate conditioning workout
  private generateConditioningWorkout(duration: number, intensity: string, profile: UserProfile) {
    const drills: any[] = [];
    let remainingTime = duration;

    // Mix of cardio and high-intensity drills
    const cardioDrills = [
      { name: 'Suicide Runs', duration: 5, category: 'Cardio' },
      { name: 'Ladder Drills', duration: 4, category: 'Agility' },
      { name: 'Box Jumps', duration: 3, category: 'Plyometrics' },
      { name: 'Burpees', duration: 3, category: 'Cardio' },
      { name: 'Mountain Climbers', duration: 3, category: 'Cardio' }
    ];

    const drillCount = Math.ceil(remainingTime / 4);
    const selectedCardio = this.selectRandomDrills(cardioDrills, drillCount);

    for (const drill of selectedCardio) {
      if (remainingTime >= drill.duration) {
        drills.push({
          id: `cardio-${drill.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: drill.name,
          category: drill.category,
          duration: drill.duration,
          sets: 3,
          reps: '30 seconds',
          restTime: 1,
          notes: 'Focus on form and maintain intensity'
        });
        remainingTime -= drill.duration;
      }
    }

    return drills;
  }

  // Generate mixed workout
  private generateMixedWorkout(duration: number, intensity: string, profile: UserProfile) {
    const drills: any[] = [];
    let remainingTime = duration;

    // Split time between skills, strength, and conditioning
    const skillsTime = Math.floor(remainingTime * 0.4);
    const strengthTime = Math.floor(remainingTime * 0.35);
    const conditioningTime = remainingTime - skillsTime - strengthTime;

    // Add skills drills
    const skillsDrills = this.generateSkillsWorkout(skillsTime, intensity, profile);
    drills.push(...skillsDrills);

    // Add strength exercises
    const strengthDrills = this.generateStrengthWorkout(strengthTime, intensity, profile);
    drills.push(...strengthDrills);

    // Add conditioning
    const conditioningDrills = this.generateConditioningWorkout(conditioningTime, intensity, profile);
    drills.push(...conditioningDrills);

    return drills;
  }

  // Generate cooldown exercises
  private generateCooldown(duration: number, profile: UserProfile) {
    const cooldownExercises = this.stretchData.filter(s => s.type === 'Cool-down');
    const selected: any[] = [];
    let remainingTime = duration;

    // Add static stretches
    const availableStretches = cooldownExercises.slice(0, Math.ceil(remainingTime / 2));
    for (const stretch of availableStretches) {
      if (remainingTime >= 2) {
        selected.push({
          id: stretch.id,
          name: stretch.name,
          duration: 2
        });
        remainingTime -= 2;
      }
    }

    // Add light walking if time remains
    if (remainingTime > 0) {
      selected.push({
        id: 'cooldown-walking',
        name: 'Light Walking',
        duration: remainingTime
      });
    }

    return selected;
  }

  // Helper methods
  private determineSessionType(profile: UserProfile, week: number, sessionNumber: number): string {
    if (profile.preferences.sessionType !== 'mixed') {
      return profile.preferences.sessionType;
    }

    // For mixed plans, rotate between session types
    const sessionTypes = ['skills', 'strength', 'conditioning'];
    const index = ((week - 1) * profile.frequency + sessionNumber - 1) % sessionTypes.length;
    return sessionTypes[index];
  }

  private calculateIntensity(profile: UserProfile, week: number): 'low' | 'medium' | 'high' {
    const baseIntensity = profile.preferences.intensity;
    
    // Progressive overload: increase intensity over weeks
    if (week <= 2) return baseIntensity;
    if (week <= 4 && baseIntensity !== 'high') return 'medium';
    if (week > 4 && baseIntensity !== 'high') return 'high';
    
    return baseIntensity;
  }

  private determineProgression(profile: UserProfile): 'linear' | 'periodic' | 'maintenance' {
    if (profile.skillLevel === 'beginner') return 'linear';
    if (profile.skillLevel === 'intermediate') return 'periodic';
    return 'maintenance';
  }

  private calculateRestDays(frequency: number): number[] {
    const days = [1, 2, 3, 4, 5, 6, 7];
    const restDays = [];
    
    for (let i = 1; i <= 7; i++) {
      if (!restDays.includes(i) && restDays.length < (7 - frequency)) {
        restDays.push(i);
      }
    }
    
    return restDays;
  }

  private calculatePlanDifficulty(profile: UserProfile): number {
    const baseDifficulty = {
      beginner: 3,
      intermediate: 6,
      advanced: 8
    }[profile.skillLevel];

    const intensityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    }[profile.preferences.intensity];

    return Math.min(10, Math.round(baseDifficulty * intensityMultiplier));
  }

  private calculateSessionDifficulty(intensity: string, skillLevel: string): number {
    const baseDifficulty = {
      beginner: 2,
      intermediate: 5,
      advanced: 7
    }[skillLevel];

    const intensityMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.3
    }[intensity];

    return Math.min(10, Math.round(baseDifficulty * intensityMultiplier));
  }

  private estimateCalories(duration: number, intensity: string, profile: UserProfile): number {
    const baseCaloriesPerMinute = {
      low: 4,
      medium: 6,
      high: 8
    }[intensity];

    return Math.round(duration * baseCaloriesPerMinute);
  }

  private generateSessionName(sessionType: string, week: number, sessionNumber: number): string {
    const typeNames = {
      skills: 'Skills Training',
      strength: 'Strength Training',
      conditioning: 'Conditioning',
      mixed: 'Mixed Training'
    };

    return `Week ${week} - ${typeNames[sessionType]} (Session ${sessionNumber})`;
  }

  private determineFocus(sessionType: string, focusAreas: string[]): string {
    if (sessionType === 'skills') {
      return focusAreas.join(', ');
    }
    return sessionType.charAt(0).toUpperCase() + sessionType.slice(1);
  }

  private generateSessionDescription(sessionType: string, intensity: string, profile: UserProfile): string {
    const descriptions = {
      skills: `Focus on improving your ${profile.focusAreas.join(', ')} with targeted drills and exercises.`,
      strength: 'Build strength and power with progressive resistance training.',
      conditioning: 'Improve cardiovascular fitness and endurance with high-intensity training.',
      mixed: 'Comprehensive workout combining skills, strength, and conditioning.'
    };

    return descriptions[sessionType];
  }

  private generateSessionTips(sessionType: string, intensity: string, profile: UserProfile): string[] {
    const tips = [
      'Stay hydrated throughout the session',
      'Focus on proper form over speed',
      'Listen to your body and rest when needed'
    ];

    if (intensity === 'high') {
      tips.push('Warm up thoroughly before starting');
      tips.push('Take adequate rest between sets');
    }

    if (profile.skillLevel === 'beginner') {
      tips.push('Start with lighter weights and focus on technique');
      tips.push('Don\'t hesitate to ask for help with form');
    }

    return tips;
  }

  private matchesSkillLevel(drill: any, skillLevel: string): boolean {
    // Simple skill level matching - can be enhanced with actual difficulty ratings
    return true; // For now, assume all drills are available
  }

  private hasRequiredEquipment(exercise: any, availableEquipment: string[]): boolean {
    // Check if user has required equipment
    return true; // For now, assume all equipment is available
  }

  private calculateDrillCount(duration: number, intensity: string): number {
    const baseCount = Math.floor(duration / 8);
    const intensityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    }[intensity];
    
    return Math.max(3, Math.round(baseCount * intensityMultiplier));
  }

  private calculateExerciseCount(duration: number, intensity: string): number {
    const baseCount = Math.floor(duration / 12);
    const intensityMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.3
    }[intensity];
    
    return Math.max(4, Math.round(baseCount * intensityMultiplier));
  }

  private selectRandomDrills(drills: any[], count: number): any[] {
    const shuffled = [...drills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private calculateDrillDuration(drill: any, intensity: string, profile: UserProfile): number {
    const baseDuration = drill.recommendedDuration || 5;
    const intensityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    }[intensity];
    
    return Math.round(baseDuration * intensityMultiplier);
  }

  private calculateExerciseDuration(exercise: any, intensity: string, profile: UserProfile): number {
    const baseDuration = exercise.recommendedDuration || 8;
    const intensityMultiplier = {
      low: 0.9,
      medium: 1.0,
      high: 1.1
    }[intensity];
    
    return Math.round(baseDuration * intensityMultiplier);
  }

  private calculateSets(intensity: string): number {
    return {
      low: 2,
      medium: 3,
      high: 4
    }[intensity];
  }

  private calculateReps(drill: any, intensity: string): number {
    const baseReps = 10;
    const intensityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.2
    }[intensity];
    
    return Math.round(baseReps * intensityMultiplier);
  }

  private calculateRestTime(intensity: string): number {
    return {
      low: 2,
      medium: 1.5,
      high: 1
    }[intensity];
  }

  private calculateStrengthSets(intensity: string): number {
    return {
      low: 2,
      medium: 3,
      high: 4
    }[intensity];
  }

  private calculateStrengthReps(intensity: string): number {
    return {
      low: 12,
      medium: 10,
      high: 8
    }[intensity];
  }

  private calculateStrengthRestTime(intensity: string): number {
    return {
      low: 2,
      medium: 2.5,
      high: 3
    }[intensity];
  }

  private generateDrillNotes(drill: any, profile: UserProfile): string {
    return `Focus on ${drill.category} technique. ${profile.skillLevel === 'beginner' ? 'Start slow and build up speed.' : 'Maintain consistent pace.'}`;
  }

  private generateExerciseNotes(exercise: any, profile: UserProfile): string {
    return `Control the movement throughout. ${profile.skillLevel === 'beginner' ? 'Use lighter weights to perfect form.' : 'Challenge yourself with appropriate weight.'}`;
  }
}

// Create singleton instance
export const planGenerator = new PlanGenerator();

// Export for use in components
export default planGenerator; 