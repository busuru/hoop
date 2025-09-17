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
  recommendedRepetitions?: number;
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
  // Shooting — Form & Technique
  {
    id: 'shooting-form-beef',
    name: 'Form Shooting (BEEF)',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Close-range form reps focusing on Balance, Eyes, Elbow, Follow-through.',
    instructions: [
      'Stand close to the rim (3–6 feet) with balanced stance.',
      'Focus eyes on the target (back rim or center).',
      'Keep shooting elbow under the ball; guide hand on the side.',
      'Hold follow-through with wrist snap and fingers down.',
      'Make 10 per spot; rotate 3–5 spots around the lane.'
    ],
    tips: [
      'Move only as far as you can maintain perfect form.',
      'Land in the same footprints to stay balanced.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-one-hand-form',
    name: 'One-Hand Form Shot',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Isolate the shooting release by removing the guide hand.',
    instructions: [
      'Stand 3–6 feet from the basket.',
      'Support ball briefly with guide hand, then remove to shoot one-handed.',
      'Emphasize straight elbow extension and soft wrist snap.',
      'Complete 30 controlled reps.'
    ],
    tips: [
      'Keep shoulders square; avoid drifting.',
      'Ball should rotate with clean backspin.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-wall-drill',
    name: 'Wall Shooting Drill',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Refine arc and release by shooting to a wall target.',
    instructions: [
      'Stand 6–10 feet from a wall; mark a small target above eye level.',
      'Shoot to hit the target softly; focus on arc and follow-through.',
      'Work for 60 seconds continuous reps.'
    ],
    tips: [
      'Aim for a consistent peak arc point.',
      'Minimize off-hand influence.'
    ],
    recommendedDuration: 60
  },
  {
    id: 'shooting-one-knee-form',
    name: 'One-Knee Form Shooting',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Kneeling position to isolate upper-body mechanics and release.',
    instructions: [
      'Kneel on one knee 3–6 feet from the rim; square shoulders.',
      'Shoot smooth one-hand form shots while holding follow-through.',
      'Complete 3 sets of 10 reps per side.'
    ],
    tips: [
      'Keep core engaged to avoid leaning.',
      'Match release path straight to target.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-two-ball-form',
    name: 'Two-Ball Form Shooting',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Alternate form shots with two balls to reinforce symmetry and rhythm.',
    instructions: [
      'Hold two balls; alternate quick one-hand form shots.',
      'Work in 30-second rounds; maintain mechanics and arc.',
      'Rest briefly and repeat 2–4 rounds.'
    ],
    tips: [
      'Keep releases identical on both sides.',
      'Prioritize quality over speed.'
    ],
    recommendedDuration: 120
  },
  // Shooting — Spot Shooting
  {
    id: 'shooting-five-spot',
    name: '5-Spot Shooting',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Shoot from five arc spots; accumulate consistent makes per location.',
    instructions: [
      'Use five spots: both corners, both wings, top of key.',
      'Shoot until 5 makes per spot; record totals.',
      'Rotate around the arc twice if time allows.'
    ],
    tips: [
      'Hold follow-through; track make percentage.',
      'Step into shots with same footwork each rep.'
    ],
    recommendedDuration: 600
  },
  {
    id: 'shooting-around-the-world',
    name: 'Around the World',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Sequential spot shooting, repeat on miss before advancing.',
    instructions: [
      'Progress around 7–10 marked spots.',
      'Advance on make; repeat same spot on miss.',
      'Complete one or two full circuits.'
    ],
    tips: [
      'Stay composed; control pace.',
      'Use consistent pre-shot routine.'
    ],
    recommendedDuration: 600
  },
  {
    id: 'shooting-nike-54321',
    name: 'Nike 5-4-3-2-1 Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Decreasing makes required per spot across the arc.',
    instructions: [
      'Start at corner with 5 makes; move to next spot with 4; continue down to 1.',
      'Record total time or misses.',
      'Repeat in reverse if time allows.'
    ],
    tips: [
      'Focus on rhythm as volume decreases.',
      'Step into shot the same way every time.'
    ],
    recommendedDuration: 480
  },
  {
    id: 'shooting-corner-3',
    name: 'Corner 3 Drill',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'High-volume corner three-pointers with game footwork.',
    instructions: [
      'Alternate corners; shoot 10–30 reps per side.',
      'Use hop or 1-2 footwork; catch on inside foot.',
      'Track makes and time.'
    ],
    tips: [
      'Stay out of the short corner; maintain spacing.',
      'Hands ready and low dip into power.'
    ],
    recommendedDuration: 480
  },
  // Shooting — Catch and Shoot
  {
    id: 'shooting-catch-and-shoot',
    name: 'Catch & Shoot Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Partner or self-pass into immediate catch-and-shoot reps.',
    instructions: [
      'Work 2–3 minute rounds from arc spots.',
      'Show hands; step into the pass and release quickly.',
      'Rotate spots every 30–45 seconds.'
    ],
    tips: [
      'Square in the air; land balanced.',
      'Minimize dip if release is late.'
    ],
    recommendedDuration: 180
  },
  {
    id: 'shooting-closeout-cns',
    name: 'Closeout Catch & Shoot',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Simulate a defender closeout, then shoot on the catch.',
    instructions: [
      'Partner or coach calls closeout; shot on catch from wing/corner.',
      'Use 1-2 or hop footwork; high quick release.',
      'Work both sides evenly.'
    ],
    tips: [
      'Eyes to rim early.',
      'Beat the closeout with decisive footwork.'
    ],
    recommendedDuration: 180
  },
  {
    id: 'shooting-rapid-fire-spot',
    name: 'Rapid Fire Spot Shooting',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Fast partner passes, immediate release to build rhythm and conditioning.',
    instructions: [
      '60–90 second rounds at designated spot.',
      'No dribbles; instant rise into shot.',
      'Track makes per round.'
    ],
    tips: [
      'Keep base under shoulders at all times.',
      'Recover balance before next catch.'
    ],
    recommendedDuration: 90
  },
  {
    id: 'shooting-relocate-and-shoot',
    name: 'Relocate & Shoot',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Catch, take a relocation step, and shoot again to mimic game movement.',
    instructions: [
      'Catch at spot, pass out, relocate one step, re-catch, and shoot.',
      'Go 5–8 reps each direction from wings and corners.'
    ],
    tips: [
      'Stay connected to the 3-point line on relocations.',
      'Turn hips and shoulders to target before catch.'
    ],
    recommendedDuration: 240
  },
  // Shooting — Off the Dribble
  {
    id: 'shooting-one-dribble-pullup',
    name: 'One-Dribble Pull-Up',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Drive once, stop on balance, and pull up. Train both directions.',
    instructions: [
      'From triple-threat, take one hard dribble and stop on two feet.',
      'Rise straight up; complete 8–12 reps each side.'
    ],
    tips: [
      'Ball and feet stop at the same time.',
      'High pickup into tight pocket before release.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-two-dribble-pullup',
    name: 'Two-Dribble Pull-Up',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Longer drive into controlled pull-up jumper.',
    instructions: [
      'Take two dribbles into space and stop on balance.',
      'Shoot 8–12 reps each side from mid-range and arc.'
    ],
    tips: [
      'Keep shoulders level on stop.',
      'Decelerate into shot pocket efficiently.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-crossover-to-jumper',
    name: 'Crossover → Jumper',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Execute a crossover dribble into a quick pull-up.',
    instructions: [
      'Crossover to create space, two-step stop, shoot.',
      'Complete 6–10 reps each direction.'
    ],
    tips: [
      'Sell the first move; protect the ball on crossover.',
      'Rise immediately after the second step.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-step-back',
    name: 'Step-Back Jumper',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Create space with a controlled step-back before release.',
    instructions: [
      'Drive to defender, plant, step back on outside foot, square, shoot.',
      'Work both sides for 6–10 quality reps.'
    ],
    tips: [
      'Keep center of mass over base to avoid drifting.',
      'Land softly and balanced after the shot.'
    ],
    recommendedDuration: 240
  },
  // Shooting — Movement & Off-Screen
  {
    id: 'shooting-curl',
    name: 'Curl Shooting Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Curl off an imaginary or guided screen into immediate catch-and-shoot.',
    instructions: [
      'Start below screen, curl tight to catch on the move.',
      'Square mid-air; shoot 6–10 reps each side.'
    ],
    tips: [
      'Read the angle—tight curl if defender trails.',
      'Hands up early to the target.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-flare',
    name: 'Flare Shooting Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Flare away from the screen for space and shoot on the catch.',
    instructions: [
      'Set up screen, flare to open space, catch and shoot.',
      '6–10 reps each side from wing and slot.'
    ],
    tips: [
      'Backpedal with hips low; keep vision on the ball.',
      'Plant outside foot to square quickly.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-pick-and-pop',
    name: 'Pick-and-Pop Shooting',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Simulate screen action with a pop to space for a quick jumper.',
    instructions: [
      'Set screen angle, pop to space, catch in pocket, shoot.',
      'Repeat from slot and wing 6–10 reps.'
    ],
    tips: [
      'Open to the ball on the pop.',
      'Show hands and be ready on the catch.'
    ],
    recommendedDuration: 240
  },
  // Shooting — Transition & Fast Break
  {
    id: 'shooting-transition-spot',
    name: 'Transition Spot Shooting',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Sprint into spots in transition and shoot on the catch.',
    instructions: [
      'Start at baseline, sprint to arc spots, catch and shoot.',
      'Emphasize deceleration into balance; repeat 8–12 reps.'
    ],
    tips: [
      'Lower your hips before the catch to absorb speed.',
      'Land on two, then rise.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-3-man-weave',
    name: '3-Man Weave Shooting',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Classic fast-break weave ending in a shot.',
    instructions: [
      'Execute 3-man weave up the floor; finish with jumper or layup.',
      'Alternate finishers; keep spacing and timing.'
    ],
    tips: [
      'Pass ahead; fill lanes wide.',
      'Call names and communicate.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-sprint-catch-shoot',
    name: 'Sprint-Catch-Shoot',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Sprint from baseline to arc, catch, and shoot immediately.',
    instructions: [
      'Start baseline, sprint to spot, set feet and fire.',
      'Repeat 8–12 reps from multiple spots.'
    ],
    tips: [
      'Control breathing; exhale on release.',
      'Quick stop before the catch.'
    ],
    recommendedDuration: 240
  },
  // Shooting — Free Throws
  {
    id: 'shooting-routine-free-throws',
    name: 'Routine Free Throws',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Establish a consistent pre-shot routine and rhythm at the line.',
    instructions: [
      'Choose a routine (dribbles/breath); repeat every attempt.',
      'Shoot sets of 10; log makes.'
    ],
    tips: [
      'Same routine under all conditions.',
      'Focus eyes on a single rim target point.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-pressure-free-throws',
    name: 'Pressure Free Throws',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Shoot free throws under fatigue or simulated pressure.',
    instructions: [
      'Sprint or perform a quick conditioning set, then shoot 2–3 free throws.',
      'Track percentage under fatigue.'
    ],
    tips: [
      'Slow down the breath before release.',
      'Trust your routine.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-game-winner-free-throws',
    name: 'Game-Winner Free Throws',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Simulate last-second pressure and game-winning attempts.',
    instructions: [
      'Set score/time scenario; shoot 2–3 attempts as "game winners".',
      'Reset scenario on miss and repeat.'
    ],
    tips: [
      'Visualization helps simulate crowd and pressure.',
      'Short routine to beat the buzzer.'
    ],
    recommendedDuration: 180
  },
  // Shooting — Layups & Finishes
  {
    id: 'finishing-mikan',
    name: 'Mikan Drill',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Alternate right/left hand finishes under the rim to build touch.',
    instructions: [
      'Finish alternating hands without dribbling for 30–60 seconds.',
      'Keep ball high; finish off the glass.'
    ],
    tips: [
      'Use soft touch and correct angles.',
      'Small, quick footwork.'
    ],
    recommendedDuration: 60
  },
  {
    id: 'finishing-reverse-mikan',
    name: 'Reverse Mikan Drill',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Finish on opposite side of the rim to practice reverse layups.',
    instructions: [
      'Finish alternating reverse layups for 30–60 seconds.',
      'Use the rim to protect the ball.'
    ],
    tips: [
      'Eyes on the backboard box.',
      'Shield with body on finish.'
    ],
    recommendedDuration: 60
  },
  {
    id: 'finishing-euro-step',
    name: 'Euro-Step Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Practice Euro-step footwork and controlled finishes.',
    instructions: [
      'Plant outside foot, long step across, counter step and finish.',
      '6–10 reps each side.'
    ],
    tips: [
      'Sell the first step; protect the ball.',
      'Gather strong through contact.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'finishing-floater',
    name: 'Floater Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Short-range floaters over length with soft arc.',
    instructions: [
      'From lane line, one dribble into high-arc floater.',
      '8–12 reps each side.'
    ],
    tips: [
      'Soft touch; push through fingers.',
      'Aim higher than the rim.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'finishing-reverse-through-contact',
    name: 'Reverse Finish Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Practice reverse finishes absorbing contact.',
    instructions: [
      'Attack baseline, finish reverse using rim for protection.',
      '6–10 reps each side; add pad contact if available.'
    ],
    tips: [
      'Keep eyes on the glass; extend away from shot-blockers.',
      'Protect with off-hand and shoulders.'
    ],
    recommendedDuration: 240
  },
  // Shooting — Special / Advanced
  {
    id: 'shooting-fadeaway',
    name: 'Fadeaway Shooting',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Controlled fadeaway jumpers off the post or face-up.',
    instructions: [
      'Establish post or mid-post, drop step to fade, square in air, shoot.',
      '6–10 reps each shoulder.'
    ],
    tips: [
      'Small, controlled fade; don’t drift excessively.',
      'High release point.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-turnaround',
    name: 'Turnaround Jumper',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Post move into a balanced turnaround jumper.',
    instructions: [
      'Catch with back to basket, shoulder fake, pivot to turnaround jumper.',
      '6–10 reps each side.'
    ],
    tips: [
      'Strong base on pivot; elevate straight up.',
      'Sight the rim early during turn.'
    ],
    recommendedDuration: 240
  },
  {
    id: 'shooting-hook-shot',
    name: 'Hook Shot Drill',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Right and left hand hook shots with soft touch and high arc.',
    instructions: [
      'Inside pivot, step across, release with shoulder turn to protect.',
      '8–12 reps each hand.'
    ],
    tips: [
      'Use off-hand and shoulder to shield.',
      'Aim to drop the ball softly over the rim.'
    ],
    recommendedDuration: 300
  },
  // Shooting — Competitive / Challenges
  {
    id: 'shooting-knockout',
    name: 'Knockout',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Group elimination shooting game emphasizing speed and accuracy.',
    instructions: [
      'Players line up; first two shoot; make to pass ball on; miss risks elimination.',
      'Continue until one winner remains.'
    ],
    tips: [
      'Quick, controlled pace; don’t rush mechanics.',
      'Use bank shots strategically.'
    ],
    recommendedDuration: 600
  },
  {
    id: 'shooting-21-game',
    name: '21 (Game)',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Competitive scoring game to 21 with free throws and put-backs.',
    instructions: [
      'Players play vs. all; standard 1s/2s scoring, free throws after makes.',
      'First to 21 wins; add penalties for misses if desired.'
    ],
    tips: [
      'Shot selection matters; play at game pace.',
      'Track wins across sessions.'
    ],
    recommendedDuration: 900
  },
  {
    id: 'shooting-3pt-contest',
    name: '3-Point Contest',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Timed 3-point challenge across racks and spots.',
    instructions: [
      'Shoot 5 balls per rack across 5 racks (or 5 spots).',
      'Timed round; track makes and score.'
    ],
    tips: [
      'Maintain consistent tempo between balls.',
      'Locate seams early for clean grip.'
    ],
    recommendedDuration: 180
  },
  {
    id: 'shooting-beat-the-pro',
    name: 'Beat the Pro',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Simulate scoring versus an imaginary opponent with a target score.',
    instructions: [
      'Assign points to makes/misses; opponent gains on your misses.',
      'Race to a target score (e.g., 21).'
    ],
    tips: [
      'Choose a fair scoring system; track progress over days.',
      'Stay locked on mechanics under pressure.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-beat-the-clock',
    name: 'Beat the Clock',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Make as many shots as possible under time pressure.',
    instructions: [
      'Set timer (60–120s); shoot from designated spots.',
      'Record makes and attempt to beat your best.'
    ],
    tips: [
      'Keep a steady pace; avoid rushed footwork.',
      'Rebound quickly or use a partner.'
    ],
    recommendedDuration: 120
  },
  // Shooting — Conditioning Shooting
  {
    id: 'shooting-shoot-and-sprint',
    name: 'Shoot & Sprint',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Make a shot, sprint baseline, and repeat to blend conditioning and shooting.',
    instructions: [
      'Choose a spot; make 1 shot, sprint baseline and back, repeat.',
      'Work in sets of 6–10 makes.'
    ],
    tips: [
      'Control breathing and footwork when fatigued.',
      'Keep mechanics tight even as pace rises.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-hit-and-run',
    name: 'Hit & Run Drill',
    category: 'shooting',
    difficulty: 'intermediate',
    description: 'Shoot, sprint to next spot, and repeat as fast as possible.',
    instructions: [
      'Layout 4–5 spots; shoot one, sprint to next, continue.',
      'Complete 2–3 circuits; track time and makes.'
    ],
    tips: [
      'Decelerate into balance at each spot.',
      'Keep passes ready if training with partner.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-circuit',
    name: 'Shooting Circuit',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Combine dribbling, finishing, and shooting into a continuous circuit.',
    instructions: [
      'Design a 3–5 station loop (dribble move → pull-up → finish → spot 3).',
      'Run continuous rounds for quality reps under fatigue.'
    ],
    tips: [
      'Limit stations to maintain quality.',
      'Track total makes per round.'
    ],
    recommendedDuration: 600
  },
  // Shooting — Progression & Weak-Hand
  {
    id: 'shooting-weak-hand-only',
    name: 'Weak-Hand Only Shooting',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Force weak-hand usage to balance touch and control.',
    instructions: [
      'Close-range weak-hand shots for 2–3 rounds.',
      'Progress outward as mechanics hold.'
    ],
    tips: [
      'Keep guide hand off the ball.',
      'Emphasize arc and soft release.'
    ],
    recommendedDuration: 300
  },
  {
    id: 'shooting-daily-progression',
    name: 'Daily Progression Plan',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Structured distance and speed progression for daily improvement.',
    instructions: [
      'Start with form shots, progress to mid-range, then arc.',
      'Finish with timed catch-and-shoot and free throws.'
    ],
    tips: [
      'Advance only when make % stays high.',
      'Log volume and accuracy daily.'
    ],
    recommendedDuration: 900
  },
  {
    id: 'shooting-high-volume-challenge',
    name: 'High-Volume Challenge (200 Shots)',
    category: 'shooting',
    difficulty: 'advanced',
    description: 'Complete 200-shot session: form, spot, off-dribble, and competitive.',
    instructions: [
      '50 form shots, 50 spot shots, 50 off-dribble pull-ups, 50 competitive shots.',
      'Record makes by segment and total.'
    ],
    tips: [
      'Segment the workout with short rests.',
      'Maintain mechanics even late in the session.'
    ],
    recommendedDuration: 1800
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
  // Flexibility Exercises
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the quadriceps muscles in the front of the thigh.',
    instructions: [
      'Stand tall with feet hip-width apart.',
      'Bend your right knee, bringing your heel toward your buttock.',
      'Grasp your right ankle with your right hand.',
      'Gently pull your heel closer to your buttock while keeping your knees together and your torso upright.',
      'Hold for 20-30 seconds, then switch legs.'
    ],
    tips: [
      'Keep your knees close together throughout the stretch.',
      'Avoid arching your back or leaning forward.',
      'If you can\'t reach your ankle, use a towel or resistance band around your foot.',
      'For better balance, hold onto a wall or chair with your free hand.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'seated-hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the hamstring muscles at the back of the thigh.',
    instructions: [
      'Sit on the floor with both legs extended straight in front of you.',
      'Keep your back straight and chest lifted.',
      'Reach forward toward your toes, keeping your knees straight but not locked.',
      'Hold for 20-30 seconds, then relax.'
    ],
    tips: [
      'Reach from your hips, not your lower back.',
      'If you can\'t reach your toes, use a towel or resistance band around your feet.',
      'Keep your feet flexed to enhance the stretch.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'hip-flexor-lunge-stretch',
    name: 'Hip Flexor Lunge Stretch',
    category: 'flexibility',
    difficulty: 'intermediate',
    duration: 30,
    description: 'Targets the hip flexor muscles at the front of the hip.',
    instructions: [
      'Start in a lunge position with your right foot forward and left knee on the ground.',
      'Keep your torso upright and your right knee directly above your right ankle.',
      'Gently push your hips forward until you feel a stretch in the front of your left hip.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    tips: [
      'Engage your core to prevent arching your lower back.',
      'For a deeper stretch, lift your left arm overhead and lean slightly to the right.',
      'Keep your back knee on a mat or towel for comfort.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'calf-stretch',
    name: 'Calf Stretch (Wall)',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the calf muscles in the lower leg.',
    instructions: [
      'Stand facing a wall with your hands on the wall at shoulder height.',
      'Step one foot back, keeping it straight and your heel on the ground.',
      'Bend your front knee while keeping your back leg straight and your heel down.',
      'Lean into the wall until you feel a stretch in your calf.',
      'Hold for 20-30 seconds, then switch legs.'
    ],
    tips: [
      'Keep your back heel flat on the ground.',
      'For a deeper stretch, step your back foot further behind you.',
      'To target the soleus muscle, slightly bend your back knee.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'groin-stretch',
    name: 'Groin Stretch (Butterfly)',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the inner thigh and groin muscles.',
    instructions: [
      'Sit on the floor with the soles of your feet together and knees bent out to the sides.',
      'Hold your feet with your hands and sit up tall.',
      'Gently press your knees toward the floor while keeping your back straight.',
      'Hold for 20-30 seconds.'
    ],
    tips: [
      'Keep your back straight - don\'t round your spine.',
      'For a deeper stretch, bring your feet closer to your body.',
      'You can use your elbows to gently press your knees down.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'figure-four-stretch',
    name: 'Figure Four Stretch',
    category: 'flexibility',
    difficulty: 'intermediate',
    duration: 30,
    description: 'Targets the glutes and outer hip muscles.',
    instructions: [
      'Lie on your back with your knees bent and feet flat on the floor.',
      'Cross your right ankle over your left thigh, just above the knee.',
      'Thread your right hand through the space between your legs and interlace your hands behind your left thigh.',
      'Gently pull your left leg toward your chest until you feel a stretch in your right glute.',
      'Hold for 20-30 seconds, then switch sides.'
    ],
    tips: [
      'Keep your head and shoulders relaxed on the floor.',
      'For a deeper stretch, pull your leg closer to your chest.',
      'If you can\'t reach your thigh, use a towel or band around your thigh.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'shoulder-cross-body-stretch',
    name: 'Shoulder Cross-Body Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the back of the shoulder and upper back.',
    instructions: [
      'Stand or sit tall with good posture.',
      'Bring your right arm across your body at chest height.',
      'Use your left hand to gently pull your right arm closer to your chest.',
      'Hold for 20-30 seconds, then switch arms.'
    ],
    tips: [
      'Keep your shoulders relaxed and down, away from your ears.',
      'For a deeper stretch, gently press your arm closer to your chest.',
      'Keep your spine long and avoid hunching your shoulders.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'triceps-overhead-stretch',
    name: 'Triceps Overhead Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 30,
    description: 'Stretches the triceps and shoulder muscles.',
    instructions: [
      'Stand or sit tall with good posture.',
      'Raise your right arm overhead, then bend your elbow so your hand reaches down your back.',
      'Use your left hand to gently push your right elbow back and down.',
      'Hold for 20-30 seconds, then switch arms.'
    ],
    tips: [
      'Keep your head in line with your spine - don\'t let your head jut forward.',
      'Engage your core to maintain good posture.',
      'For a deeper stretch, gently pull your elbow behind your head.'
    ],
    recommendedDuration: 30,
    recommendedRepetitions: 2
  },
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Stretch',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 60,
    description: 'A gentle flow between two poses that warms up the spine and stretches the back, neck, and core.',
    instructions: [
      'Start on your hands and knees in a tabletop position with your wrists under your shoulders and knees under your hips.',
      'For Cow Pose: Inhale as you drop your belly toward the floor, lift your chin and chest, and look up toward the ceiling.',
      'For Cat Pose: Exhale as you draw your belly to your spine and round your back toward the ceiling, tucking your chin to your chest.',
      'Continue flowing between Cat and Cow for 5-10 breaths.'
    ],
    tips: [
      'Move slowly and with control, coordinating your breath with movement.',
      'Keep your shoulders relaxed away from your ears.',
      'Engage your core throughout the movement.'
    ],
    recommendedDuration: 60,
    recommendedRepetitions: 1
  },
  {
    id: 'childs-pose',
    name: 'Child\'s Pose',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 45,
    description: 'A restful pose that stretches the hips, thighs, and ankles while reducing stress and fatigue.',
    instructions: [
      'Kneel on the floor with your big toes touching and knees hip-width apart.',
      'Sit back on your heels and fold forward, extending your arms in front of you.',
      'Rest your forehead on the floor and relax your entire body.',
      'Hold for 30-45 seconds, breathing deeply.'
    ],
    tips: [
      'If your forehead doesn\'t reach the floor, rest it on a block or stacked hands.',
      'For a deeper stretch, walk your hands to one side for a side stretch, then switch sides.',
      'Keep your arms active by pressing your palms into the floor.'
    ],
    recommendedDuration: 45,
    recommendedRepetitions: 1
  },
  {
    id: 'worlds-greatest-stretch',
    name: 'World\'s Greatest Stretch',
    category: 'flexibility',
    difficulty: 'intermediate',
    duration: 45,
    description: 'A dynamic stretch that targets multiple muscle groups including hips, hamstrings, and thoracic spine.',
    instructions: [
      'Start in a high plank position.',
      'Step your right foot to the outside of your right hand, coming into a low lunge.',
      'Place your left hand on the floor and rotate your right arm up toward the ceiling, following your hand with your eyes.',
      'Return your right hand to the floor and step back to plank.',
      'Repeat on the other side.',
      'Continue alternating for 4-6 reps per side.'
    ],
    tips: [
      'Keep your back knee off the ground for more challenge.',
      'Engage your core throughout the movement.',
      'Move slowly and with control, focusing on form.'
    ],
    recommendedDuration: 45,
    recommendedRepetitions: 1
  },
  // Other exercises...
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    category: 'flexibility',
    duration: 30,
    difficulty: 'beginner',
    description: 'Stretch the front of your thighs while standing',
    instructions: [
      'Stand tall and hold onto a wall or chair for balance',
      'Bend one knee and bring your heel toward your glutes',
      'Grab your ankle and gently pull it closer',
      'Keep knees close together and push hips forward slightly',
      'Hold for 30 seconds, then switch legs'
    ],
    recommendedDuration: 30,
    tips: [
      'Keep your standing leg slightly bent',
      'Engage your core for balance',
      'Avoid arching your back'
    ]
  },
  {
    id: 'seated-hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    category: 'flexibility',
    duration: 40,
    difficulty: 'beginner',
    description: 'Deep stretch for the back of your thighs',
    instructions: [
      'Sit on the floor with both legs extended straight',
      'Keep your back straight and hinge at the hips',
      'Reach forward toward your toes',
      'Hold for 30-40 seconds',
      'Relax and repeat'
    ],
    recommendedDuration: 40,
    tips: [
      'Keep your back straight, don\'t round it',
      'Reach from your hips, not your shoulders',
      'Breathe deeply and relax into the stretch'
    ]
  },
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
    id: 'wall-shooting',
    name: 'Wall Shooting',
    category: 'strength',
    duration: 300,
    difficulty: 'beginner',
    description: 'Builds shooting form and upper body strength',
    instructions: [
      'Stand 2-3 feet from a wall',
      'Hold shooting form with ball in hand',
      'Shoot the ball against the wall with proper form',
      'Focus on follow-through and rotation',
      'Catch and repeat'
    ],
    equipment: ['Basketball'],
    recommendedDuration: 300,
    tips: [
      'Keep elbow under the ball',
      'Use legs for power',
      'Hold follow-through on every shot'
    ]
  },
  {
    id: 'plank-hold',
    name: 'Plank Hold',
    category: 'strength',
    duration: 180,
    difficulty: 'beginner',
    description: 'Builds core strength and stability',
    instructions: [
      'Start in push-up position on forearms',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Hold position without letting hips sag'
    ],
    recommendedDuration: 180,
    tips: [
      'Keep neck neutral',
      'Don\'t let hips rise or sag',
      'Breathe steadily throughout'
    ]
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'strength',
    duration: 240,
    difficulty: 'beginner',
    description: 'Builds leg strength and balance',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with right foot',
      'Lower until both knees form 90-degree angles',
      'Push back to start',
      'Alternate legs'
    ],
    reps: '3 sets of 10-12 per leg',
    recommendedDuration: 240,
    tips: [
      'Keep front knee behind toes',
      'Maintain upright torso',
      'Control the movement both ways'
    ]
  },
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    category: 'strength',
    duration: 300,
    difficulty: 'beginner',
    description: 'Fundamental lower body strength exercise',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower into squat position',
      'Keep chest up and weight in heels',
      'Return to standing position'
    ],
    reps: '3 sets of 15-20',
    recommendedDuration: 300,
    tips: [
      'Go as low as comfortable',
      'Keep knees tracking over toes',
      'Engage core throughout'
    ]
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    category: 'strength',
    duration: 180,
    difficulty: 'beginner',
    description: 'Targets glutes and hamstrings',
    instructions: [
      'Lie on back with knees bent',
      'Feet flat on ground, arms at sides',
      'Lift hips toward ceiling',
      'Squeeze glutes at top',
      'Lower with control'
    ],
    reps: '3 sets of 12-15',
    recommendedDuration: 180,
    tips: [
      'Don\'t hyperextend back',
      'Squeeze glutes at top',
      'Keep feet flat on ground'
    ]
  },
  {
    id: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlifts',
    category: 'strength',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Improves balance and hamstring strength',
    instructions: [
      'Stand on one leg, slight bend in knee',
      'Hinge at hips, keeping back straight',
      'Extend free leg straight back',
      'Lower until parallel to ground',
      'Return to start position'
    ],
    reps: '3 sets of 8-10 per leg',
    recommendedDuration: 300,
    tips: [
      'Keep back flat',
      'Move slowly with control',
      'Engage core for balance'
    ]
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'strength',
    duration: 180,
    difficulty: 'beginner',
    description: 'Strengthens calf muscles for jumping',
    instructions: [
      'Stand with feet hip-width apart',
      'Raise up onto toes',
      'Hold briefly at top',
      'Lower slowly'
    ],
    reps: '3 sets of 15-20',
    recommendedDuration: 180,
    tips: [
      'Control the movement',
      'Squeeze calves at top',
      'Use wall for balance if needed'
    ]
  },
  {
    id: 'superman-hold',
    name: 'Superman Hold',
    category: 'strength',
    duration: 180,
    difficulty: 'intermediate',
    description: 'Strengthens lower back and core',
    instructions: [
      'Lie face down on mat',
      'Extend arms forward',
      'Lift arms and legs off ground',
      'Hold position',
      'Keep head in neutral position'
    ],
    recommendedDuration: 180,
    tips: [
      'Engage glutes and back',
      'Don\'t strain neck',
      'Breathe steadily'
    ]
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'strength',
    duration: 240,
    difficulty: 'intermediate',
    description: 'Builds rotational core strength',
    instructions: [
      'Sit on floor with knees bent',
      'Lean back slightly, lift feet off ground',
      'Twist torso to touch floor beside you',
      'Alternate sides'
    ],
    reps: '3 sets of 20 (10 per side)',
    recommendedDuration: 240,
    tips: [
      'Keep back straight',
      'Move slowly with control',
      'Engage core throughout'
    ]
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'strength',
    duration: 180,
    difficulty: 'intermediate',
    description: 'Builds core and shoulder stability',
    instructions: [
      'Lie on side with legs straight',
      'Prop up on forearm, elbow under shoulder',
      'Lift hips off ground',
      'Form straight line from head to feet',
      'Hold position'
    ],
    recommendedDuration: 180,
    tips: [
      'Don\'t let hips sag',
      'Keep body in straight line',
      'Breathe steadily'
    ]
  },
  {
    id: 'wall-sits',
    name: 'Wall Sits',
    category: 'strength',
    duration: 300,
    difficulty: 'beginner',
    description: 'Isometric leg strength builder',
    instructions: [
      'Stand with back against wall',
      'Slide down until knees are at 90 degrees',
      'Keep back flat against wall',
      'Hold position'
    ],
    recommendedDuration: 300,
    tips: [
      'Keep knees over ankles',
      'Engage core',
      'Start with shorter holds and progress'
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
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'cardio',
    duration: 300,
    difficulty: 'beginner',
    description: 'Classic cardio exercise for footwork and endurance',
    instructions: [
      'Hold rope handles at hip level',
      'Jump just high enough to clear the rope',
      'Use wrists to rotate the rope, not arms',
      'Maintain a steady rhythm',
      'Keep jumps low and land softly'
    ],
    reps: '3-5 sets of 30-60 seconds',
    recommendedDuration: 300,
    tips: [
      'Start with basic jumps, then progress to variations',
      'Keep core engaged',
      'Land on balls of your feet'
    ]
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'cardio',
    duration: 180,
    difficulty: 'beginner',
    description: 'Dynamic exercise to improve running form and coordination',
    instructions: [
      'Stand with feet hip-width apart',
      'Drive one knee up towards chest',
      'Quickly switch legs',
      'Pump arms in sync with legs',
      'Maintain tall posture'
    ],
    reps: '3-4 sets of 20-30 seconds',
    recommendedDuration: 180,
    tips: [
      'Focus on form over speed initially',
      'Land softly on balls of feet',
      'Engage core throughout movement'
    ]
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'cardio',
    duration: 180,
    difficulty: 'beginner',
    description: 'Running drill to improve hamstring flexibility and running form',
    instructions: [
      'Jog in place',
      'Kick heels up to touch glutes',
      'Keep knees pointing down',
      'Maintain quick, controlled movements',
      'Use arms in running motion'
    ],
    reps: '3-4 sets of 20-30 seconds',
    recommendedDuration: 180,
    tips: [
      'Keep torso upright',
      'Focus on quick leg turnover',
      'Avoid arching back'
    ]
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    category: 'cardio',
    duration: 240,
    difficulty: 'intermediate',
    description: 'Explosive lower body exercise for power and endurance',
    instructions: [
      'Start in squat position',
      'Lower into a squat',
      'Explode upward into a jump',
      'Land softly and immediately lower into next squat',
      'Maintain control throughout movement'
    ],
    reps: '3 sets of 10-15 reps',
    recommendedDuration: 240,
    tips: [
      'Land softly to absorb impact',
      'Keep knees aligned with toes',
      'Engage core for stability'
    ]
  },
  {
    id: 'skater-jumps',
    name: 'Skater Jumps (Lateral Bounds)',
    category: 'cardio',
    duration: 240,
    difficulty: 'intermediate',
    description: 'Lateral movement exercise for agility and power',
    instructions: [
      'Start in athletic stance',
      'Leap sideways to the right',
      'Land on right foot with left foot behind',
      'Immediately push off to the left',
      'Maintain control and balance'
    ],
    reps: '3 sets of 10-12 reps per side',
    recommendedDuration: 240,
    tips: [
      'Land softly with bent knees',
      'Keep chest up and core engaged',
      'Focus on controlled movements'
    ]
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    category: 'cardio',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Plyometric exercise for explosive power',
    instructions: [
      'Stand facing box with feet shoulder-width apart',
      'Swing arms back and bend knees',
      'Explode upward, swinging arms forward',
      'Land softly on box with both feet',
      'Step down carefully'
    ],
    reps: '3-4 sets of 5-8 reps',
    recommendedDuration: 300,
    tips: [
      'Start with a low box',
      'Focus on soft landings',
      'Maintain control throughout movement'
    ]
  },
  {
    id: 'shuttle-runs',
    name: 'Shuttle Runs',
    category: 'cardio',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Basketball-specific conditioning drill',
    instructions: [
      'Set up cones 5-10 yards apart',
      'Sprint to first cone and touch the ground',
      'Sprint back to start',
      'Sprint to second cone and back',
      'Continue pattern with increasing distances'
    ],
    reps: '4-6 sets with 30-60s rest',
    recommendedDuration: 300,
    tips: [
      'Focus on quick direction changes',
      'Stay low when changing directions',
      'Maintain good running form'
    ]
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Full-body cardio exercise with core engagement',
    instructions: [
      'Start in high plank position',
      'Bring one knee toward chest',
      'Quickly switch legs',
      'Maintain steady breathing',
      'Keep hips level and core engaged'
    ],
    reps: '3-4 sets of 20-30 seconds',
    recommendedDuration: 300,
    tips: [
      'Keep shoulders over wrists',
      'Maintain a straight line from head to heels',
      'Control the movement'
    ]
  },
  // Agility Drills
  {
    id: 't-drill',
    name: 'T-Drill',
    category: 'agility',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Improves multi-directional speed and change of direction',
    instructions: [
      'Set up 4 cones in a T shape (5-10 yards apart)',
      'Sprint from base of T to top cone',
      'Shuffle left to side cone',
      'Shuffle right past center to far cone',
      'Shuffle back to center',
      'Backpedal to start'
    ],
    equipment: ['Cones'],
    recommendedDuration: 300,
    tips: [
      'Stay low in defensive stance during shuffles',
      'Use quick, controlled steps',
      'Keep hips square to direction of movement'
    ]
  },
  {
    id: 'zig-zag-cone',
    name: 'Zig-Zag Cone Drill',
    category: 'agility',
    duration: 240,
    difficulty: 'beginner',
    description: 'Improves lateral quickness and change of direction',
    instructions: [
      'Set up 5-6 cones in a straight line, 2-3 yards apart',
      'Start at first cone',
      'Sprint diagonally to second cone',
      'Change direction and sprint diagonally to third cone',
      'Continue zig-zagging through all cones'
    ],
    equipment: ['Cones'],
    recommendedDuration: 240,
    tips: [
      'Stay on balls of feet',
      'Use short, quick steps when changing direction',
      'Keep knees bent for better control'
    ]
  },
  {
    id: 'shuttle-drill',
    name: '5-10-5 Shuttle Drill',
    category: 'agility',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Tests lateral quickness and change of direction',
    instructions: [
      'Set up 3 cones in a line, 5 yards apart',
      'Start at middle cone',
      'Sprint 5 yards to right cone and touch line',
      'Sprint 10 yards to left cone and touch line',
      'Finish by sprinting back through middle cone'
    ],
    equipment: ['Cones'],
    recommendedDuration: 300,
    tips: [
      'Stay low in athletic stance',
      'Use quick, choppy steps when changing direction',
      'Touch the line with your hand'
    ]
  },
  {
    id: 'ladder-quick-feet',
    name: 'Ladder Quick Feet',
    category: 'agility',
    duration: 180,
    difficulty: 'beginner',
    description: 'Improves foot speed and coordination',
    instructions: [
      'Stand at one end of agility ladder',
      'Step into first square with right foot',
      'Bring left foot into same square',
      'Step right foot forward to next square',
      'Continue pattern down the ladder'
    ],
    equipment: ['Agility ladder'],
    recommendedDuration: 180,
    tips: [
      'Stay on balls of feet',
      'Keep knees slightly bent',
      'Use arms for balance and power'
    ]
  },
  {
    id: 'ladder-in-out',
    name: 'Ladder In & Out',
    category: 'agility',
    duration: 240,
    difficulty: 'intermediate',
    description: 'Enhances footwork and coordination',
    instructions: [
      'Stand facing ladder',
      'Step into first square with both feet',
      'Step out to the side with both feet',
      'Move forward to next square and repeat',
      'Continue pattern down the ladder'
    ],
    equipment: ['Agility ladder'],
    recommendedDuration: 240,
    tips: [
      'Stay light on feet',
      'Maintain quick, controlled movements',
      'Keep core engaged for balance'
    ]
  },
  {
    id: 'figure-8-runs',
    name: 'Figure 8 Runs',
    category: 'agility',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Improves change of direction and body control',
    instructions: [
      'Set up 2 cones 5-10 yards apart',
      'Run in a figure-8 pattern around the cones',
      'Maintain control through turns',
      'Keep head up and eyes forward'
    ],
    equipment: ['2 cones'],
    recommendedDuration: 300,
    tips: [
      'Stay low when changing direction',
      'Use arms to help with momentum',
      'Focus on quick, explosive movements'
    ]
  },
  {
    id: 'closeout-drill',
    name: 'Closeout Drill',
    category: 'agility',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Defensive footwork drill for closing out on shooters',
    instructions: [
      'Start in defensive stance under basket',
      'Coach/partner passes to wing',
      'Close out to shooter with high hands',
      'Break down into defensive stance',
      'Contest shot without fouling',
      'Recover to starting position'
    ],
    equipment: ['Basketball', 'Partner/coach'],
    recommendedDuration: 300,
    tips: [
      'Stay balanced when closing out',
      'Keep hands active to contest shot',
      'Don\'t jump on shot fakes'
    ]
  },
  {
    id: 'reaction-drill',
    name: 'Reaction Drill',
    category: 'agility',
    duration: 300,
    difficulty: 'advanced',
    description: 'Improves reaction time and quickness',
    instructions: [
      'Stand in athletic stance',
      'Partner/coach points in direction to move',
      'React quickly to visual cue',
      'Shuffle in that direction',
      'Return to center and repeat'
    ],
    equipment: ['Partner/coach'],
    recommendedDuration: 300,
    tips: [
      'Stay on balls of feet',
      'Keep knees bent and weight centered',
      'React quickly to cues'
    ]
  },
  {
    id: 'cone-dribbling',
    name: 'Cone Dribbling',
    category: 'agility',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Combines ball handling with agility',
    instructions: [
      'Set up cones in a straight line, 3-5 feet apart',
      'Dribble through cones using various moves',
      'Focus on quick changes of direction',
      'Keep ball low and controlled'
    ],
    equipment: ['Basketball', 'Cones'],
    recommendedDuration: 300,
    tips: [
      'Keep head up',
      'Use both hands equally',
      'Stay low in athletic stance'
    ]
  },
  {
    id: 'lateral-bounds',
    name: 'Lateral Bounds',
    category: 'agility',
    duration: 240,
    difficulty: 'intermediate',
    description: 'Improves lateral power and body control',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Push off right foot to leap to left',
      'Land on left foot and immediately push off to right',
      'Continue bounding side to side',
      'Use arms for momentum'
    ],
    recommendedDuration: 240,
    tips: [
      'Land softly on balls of feet',
      'Absorb landing with bent knees',
      'Maintain control throughout movement'
    ]
  },
  {
    id: 'defensive-slides',
    name: 'Defensive Slides',
    category: 'cardio',
    duration: 300,
    difficulty: 'intermediate',
    description: 'Basketball-specific defensive movement drill',
    instructions: [
      'Start in defensive stance',
      'Slide to the right by pushing off left foot',
      'Bring feet together without crossing',
      'Slide to the left by pushing off right foot',
      'Maintain low stance throughout'
    ],
    reps: '4-6 sets of 10-15 slides per side',
    recommendedDuration: 300,
    tips: [
      'Keep weight on balls of feet',
      'Don\'t let knees cave in',
      'Stay low in defensive stance'
    ]
  },
  {
    id: 'fast-break-drill',
    name: 'Continuous Fast-break Drill',
    category: 'cardio',
    duration: 600,
    difficulty: 'advanced',
    description: 'High-intensity basketball conditioning drill',
    instructions: [
      'Start under the basket',
      'Sprint to opposite free throw line and back',
      'Sprint to half court and back',
      'Sprint to opposite free throw line and back',
      'Sprint full court and back',
      'Repeat continuously for time'
    ],
    reps: '3-5 rounds with 1-2 minutes rest',
    recommendedDuration: 600,
    tips: [
      'Maintain good form when tired',
      'Focus on quick direction changes',
      'Stay low when changing directions'
    ]
  }
];

  
export const stretches: Stretch[] = [
  {
    id: 'hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    type: 'warm-up',
    duration: 30,
    description: 'Stretches the hamstring muscles at the back of the thigh',
    instructions: [
      'Sit on the ground with both legs extended',
      'Reach forward toward your toes',
      'Keep your back straight',
      'Hold for 20-30 seconds'
    ],
    targetAreas: ['hamstrings', 'lower back'],
    recommendedDuration: 30,
    tips: [
      'Don\'t bounce while stretching',
      'Keep knees slightly bent if needed',
      'Breathe deeply and relax into the stretch'
    ]
  },
  {
    id: 'quad-stretch',
    name: 'Standing Quad Stretch',
    type: 'warm-up',
    duration: 30,
    description: 'Stretches the quadriceps muscles',
    instructions: [
      'Stand on one leg',
      'Grab your other foot behind you',
      'Pull your heel toward your glutes',
      'Keep knees close together',
      'Hold for 20-30 seconds and switch'
    ],
    targetAreas: ['quadriceps', 'hip flexors'],
    recommendedDuration: 30,
    tips: [
      'Hold onto a wall for balance if needed',
      'Keep your torso upright',
      'Don\'t arch your back'
    ]
  },
  {
    id: 'shoulder-stretch',
    name: 'Cross-Body Shoulder Stretch',
    type: 'warm-up',
    duration: 25,
    description: 'Stretches the shoulder and upper back muscles',
    instructions: [
      'Bring one arm across your body',
      'Use your other arm to gently pull it closer',
      'Keep your shoulder down',
      'Hold for 20-25 seconds and switch'
    ],
    targetAreas: ['shoulders', 'upper back'],
    recommendedDuration: 25,
    tips: [
      'Keep your shoulders relaxed',
      'Don\'t pull too hard',
      'Breathe deeply during the stretch'
    ]
  },
  {
    id: 'foam-rolling-calves',
    name: 'Foam Rolling Calves',
    type: 'maintenance',
    duration: 60,
    description: 'Release tension in the calf muscles using a foam roller',
    instructions: [
      'Sit on the floor with legs extended',
      'Place foam roller under calves',
      'Cross one leg over the other',
      'Roll from ankle to below the knee',
      'Spend extra time on tender spots',
      'Repeat for 30 seconds per leg'
    ],
    targetAreas: ['calves', 'lower legs'],
    recommendedDuration: 60,
    tips: [
      'Keep core engaged',
      'Control the movement with your arms',
      'Don\'t roll over the knee or ankle joints'
    ]
  },
  {
    id: 'foam-rolling-quads',
    name: 'Foam Rolling Quads',
    type: 'maintenance',
    duration: 60,
    description: 'Release tension in the quadriceps muscles',
    instructions: [
      'Lie face down with foam roller under thighs',
      'Support upper body with forearms',
      'Roll from hip to just above knees',
      'Rotate legs inward and outward to target different areas',
      'Spend 30 seconds per leg'
    ],
    targetAreas: ['quadriceps', 'thighs'],
    recommendedDuration: 60,
    tips: [
      'Engage core to prevent arching back',
      'Go slowly over tender areas',
      'Breathe deeply to help release tension'
    ]
  },
  {
    id: 'foam-rolling-it-band',
    name: 'Foam Rolling IT Band',
    type: 'maintenance',
    duration: 90,
    description: 'Release tension in the iliotibial band',
    instructions: [
      'Lie on side with foam roller under hip',
      'Stack legs with bottom leg slightly bent',
      'Roll from hip to just above knee',
      'Support upper body with forearm and opposite hand',
      'Spend 30-45 seconds per side'
    ],
    targetAreas: ['IT band', 'outer thighs'],
    recommendedDuration: 90,
    tips: [
      'Go slowly, especially over tender spots',
      'Keep core engaged for stability',
      'Bend and straighten bottom leg to adjust pressure'
    ]
  },
  {
    id: 'foam-rolling-back',
    name: 'Foam Rolling Back',
    type: 'maintenance',
    duration: 120,
    description: 'Release tension in the upper and lower back',
    instructions: [
      'Sit with foam roller behind you',
      'Lean back onto roller at mid-back level',
      'Cross arms over chest or place hands behind head',
      'Roll from mid-back to upper back',
      'Bend knees and lift hips to adjust pressure',
      'Spend 1-2 minutes total'
    ],
    targetAreas: ['upper back', 'lower back', 'lats'],
    recommendedDuration: 120,
    tips: [
      'Avoid rolling the lower back directly',
      'Keep core engaged',
      'Go slowly and control the movement'
    ]
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Hip Flexor Stretch',
    type: 'maintenance',
    duration: 40,
    description: 'Deep stretch for the hip flexor muscles',
    instructions: [
      'Start in a lunge position with one knee down',
      'Keep front knee at 90 degrees',
      'Tuck pelvis under and lean forward slightly',
      'Raise arm on the same side as back leg and reach overhead',
      'Hold for 20 seconds per side'
    ],
    targetAreas: ['hip flexors', 'quads', 'psoas'],
    recommendedDuration: 40,
    tips: [
      'Keep torso upright',
      'Engage core throughout',
      'Don\'t let front knee go past toes'
    ]
  },
  {
    id: 'lying-spinal-twist',
    name: 'Lying Spinal Twist',
    type: 'maintenance',
    duration: 50,
    description: 'Gentle rotation for spinal mobility',
    instructions: [
      'Lie on back with arms out to sides in T position',
      'Bend knees and keep feet flat',
      'Slowly lower both knees to one side',
      'Keep shoulders on the ground',
      'Hold for 20-25 seconds per side'
    ],
    targetAreas: ['spine', 'lower back', 'glutes'],
    recommendedDuration: 50,
    tips: [
      'Breathe deeply into the stretch',
      'Keep both shoulders on the ground',
      'Move slowly and with control'
    ]
  },
  {
    id: 'piriformis-stretch',
    name: 'Piriformis Stretch',
    type: 'maintenance',
    duration: 45,
    description: 'Targeted stretch for the piriformis and glute muscles',
    instructions: [
      'Lie on back with both knees bent',
      'Cross right ankle over left thigh',
      'Grab behind left thigh and pull toward chest',
      'Keep head and shoulders relaxed',
      'Hold for 20-25 seconds per side'
    ],
    targetAreas: ['piriformis', 'glutes', 'hips'],
    recommendedDuration: 45,
    tips: [
      'Keep both feet flexed',
      'Don\'t force the stretch',
      'Keep hips square to the ceiling'
    ]
  },
  {
    id: 'ankle-circles',
    name: 'Ankle Circles',
    type: 'maintenance',
    duration: 40,
    description: 'Improve ankle mobility and circulation',
    instructions: [
      'Sit or lie down with legs extended',
      'Point and flex feet several times',
      'Rotate ankles in clockwise circles',
      'Reverse direction after 10-15 seconds',
      'Repeat for both ankles'
    ],
    targetAreas: ['ankles', 'feet', 'lower legs'],
    recommendedDuration: 40,
    tips: [
      'Make the circles as large as comfortable',
      'Keep movements slow and controlled',
      'Focus on full range of motion'
    ]
  },
  {
    id: 'neck-stretch',
    name: 'Neck Stretch (Lateral)',
    type: 'maintenance',
    duration: 30,
    description: 'Gentle stretch for the neck and upper traps',
    instructions: [
      'Sit or stand with good posture',
      'Gently tilt head toward one shoulder',
      'Hold for 10-15 seconds',
      'Use hand to apply gentle pressure if needed',
      'Repeat on other side'
    ],
    targetAreas: ['neck', 'upper traps', 'shoulders'],
    recommendedDuration: 30,
    tips: [
      'Keep shoulders relaxed and down',
      'Don\'t pull too hard',
      'Breathe deeply throughout'
    ]
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    type: 'maintenance',
    duration: 60,
    description: 'Improve spinal mobility and flexibility',
    instructions: [
      'Start on hands and knees in tabletop position',
      'For cow: arch back, lift head and tailbone',
      'For cat: round spine, tuck chin to chest',
      'Flow smoothly between positions',
      'Continue for 5-8 breaths'
    ],
    targetAreas: ['spine', 'core', 'back'],
    recommendedDuration: 60,
    tips: [
      'Move with your breath',
      'Keep shoulders away from ears',
      'Engage core throughout'
    ]
  },
  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    type: 'maintenance',
    duration: 30,
    description: 'Release tension in shoulders and upper back',
    instructions: [
      'Stand or sit with good posture',
      'Roll shoulders up, back, and down in circular motion',
      'Complete 5-6 rolls backward',
      'Reverse direction for 5-6 rolls forward'
    ],
    targetAreas: ['shoulders', 'upper back', 'neck'],
    recommendedDuration: 30,
    tips: [
      'Keep movements slow and controlled',
      'Breathe deeply',
      'Relax jaw and neck'
    ]
  },
  {
    id: 'calf-stretch',
    name: 'Calf Stretch',
    type: 'cool-down',
    duration: 30,
    description: 'Stretches the calf muscles and Achilles tendon',
    instructions: [
      'Stand facing a wall with hands on the wall at shoulder height',
      'Step one foot back, keeping it straight',
      'Keep both heels flat on the ground',
      'Bend front knee while keeping back leg straight',
      'Hold for 20-30 seconds per leg'
    ],
    targetAreas: ['calves', 'Achilles', 'ankles'],
    recommendedDuration: 30,
    tips: [
      'Keep back heel on the ground',
      'Don\'t let front knee go past toes',
      'For deeper stretch, step further back'
    ]
  },
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    type: 'cool-down',
    duration: 30,
    description: 'Stretches the front of the thigh',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Bend one knee, bringing heel toward buttock',
      'Hold ankle with hand',
      'Keep knees together and thighs parallel',
      'Hold for 20-30 seconds per leg'
    ],
    targetAreas: ['quadriceps', 'hip flexors'],
    recommendedDuration: 30,
    tips: [
      'Keep torso upright',
      'Engage core for balance',
      'Use a wall for support if needed'
    ]
  },
  {
    id: 'seated-hamstring-stretch',
    name: 'Seated Hamstring Stretch',
    type: 'cool-down',
    duration: 40,
    description: 'Gentle stretch for the back of the thighs',
    instructions: [
      'Sit on the floor with legs extended straight',
      'Keep back straight and chest lifted',
      'Hinge at hips and reach forward',
      'Hold for 20-30 seconds',
      'Keep feet flexed'
    ],
    targetAreas: ['hamstrings', 'lower back'],
    recommendedDuration: 40,
    tips: [
      'Don\'t round your back',
      'Reach from the hips, not the waist',
      'Breathe deeply into the stretch'
    ]
  },
  {
    id: 'groin-butterfly-stretch',
    name: 'Groin Stretch (Butterfly)',
    type: 'cool-down',
    duration: 45,
    description: 'Opens the hips and stretches inner thighs',
    instructions: [
      'Sit on the floor with knees bent and feet together',
      'Let knees fall outward, bringing soles of feet together',
      'Hold feet with hands',
      'Keep back straight and chest lifted',
      'Gently press knees toward floor',
      'Hold for 30-45 seconds'
    ],
    targetAreas: ['inner thighs', 'groin', 'hips'],
    recommendedDuration: 45,
    tips: [
      'Don\'t bounce',
      'Keep shoulders relaxed',
      'For deeper stretch, bring feet closer to body'
    ]
  },
  {
    id: 'figure-four-stretch',
    name: 'Figure Four Stretch',
    type: 'cool-down',
    duration: 40,
    description: 'Targets glutes and outer hips',
    instructions: [
      'Lie on back with knees bent and feet flat',
      'Cross right ankle over left thigh',
      'Thread right hand between legs and clasp hands behind left thigh',
      'Pull left leg toward chest',
      'Keep head and shoulders relaxed',
      'Hold for 20-30 seconds per side'
    ],
    targetAreas: ['glutes', 'hips', 'piriformis'],
    recommendedDuration: 40,
    tips: [
      'Keep both feet flexed',
      'Don\'t force the stretch',
      'Keep shoulders on the ground'
    ]
  },
  {
    id: 'childs-pose',
    name: 'Child\'s Pose',
    type: 'cool-down',
    duration: 60,
    description: 'Gentle stretch for back, hips, and shoulders',
    instructions: [
      'Start on hands and knees',
      'Sit back onto heels',
      'Fold forward, extending arms in front',
      'Rest forehead on the floor',
      'Hold for 30-60 seconds',
      'Breathe deeply into the back'
    ],
    targetAreas: ['back', 'hips', 'shoulders'],
    recommendedDuration: 60,
    tips: [
      'Keep arms extended or rest them by sides',
      'Let chest sink toward the floor',
      'Focus on deep breathing'
    ]
  },
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Stretch',
    type: 'cool-down',
    duration: 60,
    description: 'Improves spinal mobility and relieves tension',
    instructions: [
      'Start on hands and knees in tabletop position',
      'For cow: arch back, lift head and tailbone (inhale)',
      'For cat: round spine, tuck chin to chest (exhale)', 
      'Flow smoothly between positions',
      'Continue for 5-8 breaths'
    ],
    targetAreas: ['spine', 'core', 'back'],
    recommendedDuration: 60,
    tips: [
      'Move with your breath',
      'Keep shoulders away from ears',
      'Engage core throughout'
    ]
  },
  {
    id: 'upper-back-stretch',
    name: 'Upper Back Stretch',
    type: 'cool-down',
    duration: 30,
    description: 'Releases tension in upper back and shoulders',
    instructions: [
      'Stand or sit tall',
      'Hug yourself, placing right hand on left shoulder and left hand on right shoulder',
      'Gently squeeze shoulders forward',
      'Hold for 15-20 seconds',
      'Release and repeat'
    ],
    targetAreas: ['upper back', 'shoulders'],
    recommendedDuration: 30,
    tips: [
      'Keep chin slightly tucked',
      'Breathe deeply into the stretch',
      'Relax neck and jaw'
    ]
  },
  {
    id: 'triceps-overhead-stretch',
    name: 'Triceps Overhead Stretch',
    type: 'cool-down',
    duration: 25,
    description: 'Stretches the back of the arms and shoulders',
    instructions: [
      'Stand or sit tall',
      'Raise right arm overhead and bend elbow',
      'Reach right hand down center of back',
      'Use left hand to gently press on right elbow',
      'Hold for 15-20 seconds per arm'
    ],
    targetAreas: ['triceps', 'shoulders'],
    recommendedDuration: 25,
    tips: [
      'Keep spine long',
      'Don\'t force the stretch',
      'Keep shoulders relaxed and down'
    ]
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    type: 'warm-up',
    duration: 60,
    description: 'Dynamic warm-up for shoulders and upper body',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms straight out to sides at shoulder height',
      'Make small circles forward for 15 seconds',
      'Reverse direction for 15 seconds',
      'Make larger circles forward for 15 seconds',
      'Reverse direction for 15 seconds'
    ],
    targetAreas: ['shoulders', 'upper back', 'arms'],
    recommendedDuration: 60,
    tips: [
      'Keep core engaged',
      'Maintain good posture',
      'Control the movement throughout'
    ]
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    type: 'warm-up',
    duration: 90,
    description: 'Dynamic lower body warm-up',
    instructions: [
      'Stand tall with feet together',
      'Step forward with right leg, lowering into lunge',
      'Keep front knee over ankle',
      'Push off front foot to bring back leg forward',
      'Repeat with left leg',
      'Continue for 10-12 lunges per leg'
    ],
    targetAreas: ['quadriceps', 'glutes', 'hamstrings', 'hips'],
    recommendedDuration: 90,
    tips: [
      'Keep torso upright',
      'Engage core throughout',
      'Don\'t let front knee go past toes'
    ]
  },
  {
    id: 'torso-twists',
    name: 'Torso Twists',
    type: 'warm-up',
    duration: 45,
    description: 'Warms up the core and improves spinal mobility',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms out to sides at shoulder height',
      'Engage core and twist to the right, then left',
      'Keep hips facing forward',
      'Continue alternating for 30 seconds',
      'Bend knees slightly for stability'
    ],
    targetAreas: ['core', 'obliques', 'spine'],
    recommendedDuration: 45,
    tips: [
      'Keep movements controlled',
      'Engage core throughout',
      'Breathe naturally'
    ]
  },
  {
    id: 'ankle-bounces',
    name: 'Ankle Bounces',
    type: 'warm-up',
    duration: 30,
    description: 'Prepares ankles for movement',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Lift heels off ground, coming onto balls of feet',
      'Quickly bounce up and down',
      'Keep ankles loose and relaxed',
      'Continue for 30 seconds'
    ],
    targetAreas: ['ankles', 'calves'],
    recommendedDuration: 30,
    tips: [
      'Keep movements small and controlled',
      'Hold onto a wall for balance if needed',
      'Maintain good posture'
    ]
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    type: 'warm-up',
    duration: 45,
    description: 'Dynamic warm-up that elevates heart rate',
    instructions: [
      'Stand with feet hip-width apart',
      'Run in place, bringing knees up to hip height',
      'Pump arms in sync with legs',
      'Stay on balls of feet',
      'Continue for 30-45 seconds'
    ],
    targetAreas: ['quadriceps', 'hip flexors', 'core', 'shoulders'],
    recommendedDuration: 45,
    tips: [
      'Engage core throughout',
      'Land softly on balls of feet',
      'Keep back straight'
    ]
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    type: 'warm-up',
    duration: 45,
    description: 'Dynamic hamstring warm-up',
    instructions: [
      'Stand with feet hip-width apart',
      'Jog in place, kicking heels up toward glutes',
      'Keep knees pointing down',
      'Use arms in running motion',
      'Continue for 30-45 seconds'
    ],
    targetAreas: ['hamstrings', 'glutes', 'calves'],
    recommendedDuration: 45,
    tips: [
      'Keep torso upright',
      'Engage core',
      'Land softly on balls of feet'
    ]
  },
  {
    id: 'knee-hugs',
    name: 'Knee Hugs',
    type: 'warm-up',
    duration: 60,
    description: 'Dynamic stretch for glutes and hamstrings',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Lift right knee toward chest',
      'Hug knee with both hands',
      'Hold for 2-3 seconds',
      'Lower and repeat on left side',
      'Continue alternating for 30-45 seconds'
    ],
    targetAreas: ['glutes', 'hamstrings', 'hip flexors'],
    recommendedDuration: 60,
    tips: [
      'Keep standing leg slightly bent',
      'Engage core for balance',
      'Don\'t lean backward'
    ]
  },
  {
    id: 'worlds-greatest-stretch',
    name: 'World\'s Greatest Stretch',
    type: 'warm-up',
    duration: 90,
    description: 'Full-body dynamic stretch',
    instructions: [
      'Start in push-up position',
      'Step right foot outside right hand',
      'Place left hand on ground and rotate torso to right',
      'Reach right hand toward ceiling',
      'Hold for 2-3 seconds',
      'Return to push-up position and repeat on left side',
      'Continue alternating for 6-8 reps total'
    ],
    targetAreas: ['hips', 'hamstrings', 'chest', 'shoulders', 'spine'],
    recommendedDuration: 90,
    tips: [
      'Keep back leg straight',
      'Engage core throughout',
      'Move slowly and with control'
    ]
  },
  {
    id: 'leg-swings',
    name: 'Leg Swings',
    type: 'warm-up',
    duration: 60,
    description: 'Dynamic stretch for hips and hamstrings',
    instructions: [
      'Stand next to a wall or chair for support',
      'Swing right leg forward and backward',
      'Keep torso upright and core engaged',
      'Swing 10-12 times, then switch legs',
      'Then swing leg across body 10-12 times per side'
    ],
    targetAreas: ['hips', 'hamstrings', 'glutes'],
    recommendedDuration: 60,
    tips: [
      'Keep movements controlled',
      'Don\'t force the range of motion',
      'Engage core for stability'
    ]
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    type: 'warm-up',
    duration: 45,
    description: 'Loosens hip joints and warms up lower body',
    instructions: [
      'Stand with feet hip-width apart, hands on hips',
      'Make large circles with hips clockwise',
      'Keep upper body stable',
      'Complete 8-10 circles',
      'Reverse direction for 8-10 circles'
    ],
    targetAreas: ['hips', 'core', 'lower back'],
    recommendedDuration: 45,
    tips: [
      'Engage core throughout',
      'Keep movements controlled',
      'Breathe naturally'
    ]
  }
];

export const trainingTypes = [
  { id: 'skills', name: 'Skills Training', color: 'bg-blue-500' },
  { id: 'conditioning', name: 'Conditioning', color: 'bg-red-500' },
  { id: 'shooting', name: 'Shooting Practice', color: 'bg-orange-500' },
  { id: 'game-prep', name: 'Game Preparation', color: 'bg-green-500' }
];