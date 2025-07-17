import { Skill, Exercise, Stretch } from '../types';

export const skills: Skill[] = [
  {
    id: '1',
    name: 'Crossover Dribble',
    category: 'dribbling',
    difficulty: 'intermediate',
    description: 'A fundamental dribbling move to change direction and beat defenders',
    instructions: [
      'Start in a low athletic stance with ball in right hand',
      'Dribble ball low across your body to left hand',
      'Use your right hand to push ball firmly across',
      'Step with left foot as ball crosses over',
      'Keep head up and eyes forward',
      'Practice at different speeds'
    ],
    tips: [
      'Keep the dribble low and tight',
      'Sell the fake with your eyes and shoulders',
      'Use your off-hand to protect the ball'
    ]
  },
  {
    id: '2',
    name: 'Jump Shot Form',
    category: 'shooting',
    difficulty: 'beginner',
    description: 'Proper shooting form is the foundation of consistent scoring',
    instructions: [
      'Square your feet to the basket',
      'Ball in shooting hand, guide hand on side',
      'Elbow directly under the ball',
      'Lift the ball with legs and core',
      'Snap wrist down on release',
      'Follow through with index finger pointing down'
    ],
    tips: [
      'Use BEEF: Balance, Eyes, Elbow, Follow-through',
      'Practice form shooting close to the basket first',
      'Keep consistent routine before every shot'
    ]
  },
  {
    id: '3',
    name: 'Defensive Slide',
    category: 'defense',
    difficulty: 'beginner',
    description: 'Basic defensive movement to stay in front of offensive players',
    instructions: [
      'Start in low defensive stance',
      'Hands up and active',
      'Step with outside foot first',
      'Slide feet without crossing them',
      'Keep chest up and eyes on opponent',
      'Stay low throughout the movement'
    ],
    tips: [
      'Never cross your feet when sliding',
      'Keep your center of gravity low',
      'Anticipate the offensive player\'s movement'
    ]
  },
  {
    id: '4',
    name: 'Pivot Footwork',
    category: 'footwork',
    difficulty: 'beginner',
    description: 'Essential footwork for creating space and protecting the ball',
    instructions: [
      'Establish pivot foot (usually non-dominant)',
      'Keep pivot foot planted at all times',
      'Use free foot to step in different directions',
      'Practice front pivots and reverse pivots',
      'Keep ball protected during pivot',
      'Read the defense and choose best option'
    ],
    tips: [
      'Keep your pivot foot heel down',
      'Practice pivoting in both directions',
      'Use pivots to create passing angles'
    ]
  }
];

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Cone Dribbling',
    category: 'agility',
    duration: 10,
    difficulty: 'beginner',
    instructions: [
      'Set up 5 cones in a straight line, 3 feet apart',
      'Dribble through cones using crossover moves',
      'Keep head up throughout the drill',
      'Focus on ball control and speed',
      'Complete 3 sets in each direction'
    ],
    equipment: ['Basketball', 'Cones']
  },
  {
    id: '2',
    name: 'Wall Shooting',
    category: 'strength',
    duration: 15,
    difficulty: 'beginner',
    description: 'Improves shooting form & strength through repetition.',
    instructions: [
      'Stand 3 feet from a wall with a basketball.',
      'Use your shooting hand to shoot the ball against the wall, focusing on form.',
      'Keep your elbow under the ball and follow through after each shot.',
      'Repeat for 50–100 shots, maintaining consistent rhythm and form.',
      'Focus on proper hand placement and a soft touch.'
    ],
    recommendedDuration: 10,
    reps: '50–100 shots',
    tips: [
      'Focus on follow-through, keep elbow under ball.',
      'Use legs for power, not just arms.',
      'Watch your wrist snap and finger placement.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: '3',
    name: 'Suicide Sprints',
    category: 'cardio',
    duration: 12,
    difficulty: 'intermediate',
    description: 'Classic basketball conditioning drill for speed and endurance.',
    instructions: [
      'Start on the baseline.',
      'Sprint to free-throw line, touch ground, sprint back.',
      'Sprint to half-court line, touch ground, sprint back.',
      'Sprint to far free-throw line, touch ground, sprint back.',
      'Sprint to far baseline and back.'
    ],
    reps: '1–2 full sets',
    tips: [
      'Stay low when turning.',
      'Touch line with hand.',
      'Keep chest up.'
    ],
    videoId: '', // To be fetched dynamically
    equipment: ['Basketball court']
  },
  {
    id: '4',
    name: 'Lateral Bounds',
    category: 'agility',
    duration: 8,
    difficulty: 'intermediate',
    instructions: [
      'Start in athletic stance',
      'Jump laterally to right, landing on right foot',
      'Hold landing for 2 seconds',
      'Jump laterally to left, landing on left foot',
      'Focus on single-leg stability',
      'Complete 10 bounds each direction'
    ],
    equipment: ['Open space']
  },
  {
    id: 'cardio-1',
    name: 'Jump Rope',
    category: 'cardio',
    duration: 5,
    difficulty: 'beginner',
    description: 'Improves foot speed, coordination, and cardiovascular fitness.',
    instructions: [
      'Hold rope handles at hip height.',
      'Jump with both feet together, turning rope with wrists.',
      'Land softly on balls of feet.',
      'Keep a steady rhythm.'
    ],
    recommendedDuration: 60,
    reps: '60 seconds',
    tips: [
      'Keep elbows close to sides.',
      'Jump low to the ground.',
      'Breathe steadily.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-2',
    name: 'High Knees',
    category: 'cardio',
    duration: 3,
    difficulty: 'beginner',
    description: 'Boosts heart rate and warms up lower body.',
    instructions: [
      'Stand tall, arms at sides.',
      'Run in place, driving knees up toward chest.',
      'Pump arms for momentum.'
    ],
    recommendedDuration: 30,
    reps: '30 seconds',
    tips: [
      'Keep core engaged.',
      'Land softly.',
      'Lift knees to hip height.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-3',
    name: 'Butt Kicks',
    category: 'cardio',
    duration: 3,
    difficulty: 'beginner',
    description: 'Warms up hamstrings and improves running form.',
    instructions: [
      'Stand tall, arms at sides.',
      'Jog in place, kicking heels up to glutes.',
      'Keep quick, light steps.'
    ],
    recommendedDuration: 30,
    reps: '30 seconds',
    tips: [
      'Keep chest up.',
      'Don’t arch lower back.',
      'Stay light on feet.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-4',
    name: 'Jump Squats',
    category: 'cardio',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Builds explosive power and elevates heart rate.',
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower into squat, then jump up explosively.',
      'Land softly and repeat.'
    ],
    reps: '8–12 reps',
    tips: [
      'Keep knees behind toes.',
      'Land softly to absorb impact.',
      'Use arms for momentum.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-5',
    name: 'Skater Jumps (Lateral Bounds)',
    category: 'cardio',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Improves lateral quickness and balance.',
    instructions: [
      'Start on one foot, bend knee slightly.',
      'Jump sideways to opposite foot, swinging arms.',
      'Land softly and repeat side to side.'
    ],
    reps: '10–16 reps',
    tips: [
      'Stay low and balanced.',
      'Land on whole foot.',
      'Keep chest up.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-6',
    name: 'Box Jumps',
    category: 'cardio',
    duration: 5,
    difficulty: 'intermediate',
    description: 'Develops lower body explosiveness.',
    instructions: [
      'Stand in front of sturdy box or platform.',
      'Bend knees, swing arms, jump onto box.',
      'Land softly, step down and repeat.'
    ],
    reps: '8–10 reps',
    tips: [
      'Use a safe, stable box.',
      'Land with knees slightly bent.',
      'Don’t let knees cave in.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-7',
    name: 'Shuttle Runs',
    category: 'cardio',
    duration: 5,
    difficulty: 'intermediate',
    description: 'Boosts speed, agility, and conditioning.',
    instructions: [
      'Set up two markers 10–20 meters apart.',
      'Sprint to far marker, touch ground, sprint back.',
      'Repeat for set time or reps.'
    ],
    recommendedDuration: 30,
    reps: '30 seconds',
    tips: [
      'Stay low when turning.',
      'Touch line with hand.',
      'Accelerate out of turns.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-8',
    name: 'Mountain Climbers',
    category: 'cardio',
    duration: 3,
    difficulty: 'beginner',
    description: 'Full-body cardio and core activation.',
    instructions: [
      'Start in push-up position.',
      'Drive knees toward chest alternately.',
      'Keep hips low and back flat.'
    ],
    recommendedDuration: 30,
    reps: '30 seconds',
    tips: [
      'Move quickly but with control.',
      'Don’t let hips rise.',
      'Breathe steadily.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-9',
    name: 'Burpees',
    category: 'cardio',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Intense full-body conditioning drill.',
    instructions: [
      'Stand tall, squat down, place hands on floor.',
      'Jump feet back to push-up position.',
      'Do a push-up, jump feet forward, explode up.'
    ],
    reps: '8–12 reps',
    tips: [
      'Keep core tight.',
      'Land softly on jumps.',
      'Maintain good push-up form.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-10',
    name: 'Defensive Slides',
    category: 'cardio',
    duration: 4,
    difficulty: 'beginner',
    description: 'Basketball-specific movement for lateral quickness.',
    instructions: [
      'Start in low defensive stance.',
      'Slide laterally to one side, touch line, slide back.',
      'Repeat for set time or reps.'
    ],
    recommendedDuration: 30,
    reps: '30 seconds',
    tips: [
      'Never cross your feet.',
      'Stay low and balanced.',
      'Keep chest up.'
    ],
    videoId: ''
  },
  {
    id: 'cardio-11',
    name: 'Continuous Fast-break Drill',
    category: 'cardio',
    duration: 6,
    difficulty: 'advanced',
    description: 'Simulates game-speed fast-breaks for conditioning.',
    instructions: [
      'Start at baseline with ball.',
      'Sprint full court for layup, sprint back.',
      'Repeat continuously for set time.'
    ],
    recommendedDuration: 60,
    reps: '60 seconds',
    tips: [
      'Go at game speed.',
      'Focus on finishing layups.',
      'Push yourself on sprints.'
    ],
    videoId: ''
  },
  // --- Flexibility Drills ---
  {
    id: 'flex-1',
    name: 'Standing Quad Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Stretches the front of the thigh to improve knee and hip mobility for running and jumping.',
    instructions: [
      'Stand tall and hold onto a wall or chair for balance.',
      'Bend your right knee and grab your right ankle with your right hand.',
      'Pull your heel gently toward your glutes until you feel a stretch in your thigh.',
      'Keep knees together and stand upright.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your knees close together.',
      'Don’t arch your lower back.',
      'Breathe deeply and relax your shoulders.'
    ],
    videoId: ''
  },
  {
    id: 'flex-2',
    name: 'Seated Hamstring Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves flexibility in the back of the thigh for better stride and injury prevention.',
    instructions: [
      'Sit on the floor with both legs extended straight.',
      'Reach forward toward your toes, keeping your back straight.',
      'Hold the stretch without bouncing.',
      'You should feel a stretch in your hamstrings.',
      'Hold, then relax.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds',
    tips: [
      'Don’t round your back.',
      'Reach with your chest, not your head.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-3',
    name: 'Hip Flexor Lunge Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Opens up the hips and relieves tightness from running and jumping.',
    instructions: [
      'Step your right foot forward into a lunge position.',
      'Lower your left knee to the ground.',
      'Push your hips forward gently until you feel a stretch in the front of your left hip.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your torso upright.',
      'Don’t let your front knee go past your toes.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-4',
    name: 'Calf Stretch (against wall)',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Stretches the calf muscles for better ankle mobility and explosive movement.',
    instructions: [
      'Stand facing a wall, place your hands on the wall at shoulder height.',
      'Step your right foot back, keeping it straight and heel on the ground.',
      'Lean forward until you feel a stretch in your right calf.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your back leg straight.',
      'Don’t bounce.',
      'Press your heel into the ground.'
    ],
    videoId: ''
  },
  {
    id: 'flex-5',
    name: 'Groin Stretch (Butterfly stretch)',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves inner thigh flexibility for lateral movement and injury prevention.',
    instructions: [
      'Sit on the floor, bring the soles of your feet together.',
      'Let your knees fall out to the sides.',
      'Hold your feet with your hands and gently press your knees toward the floor.',
      'Hold the stretch.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds',
    tips: [
      'Keep your back straight.',
      'Don’t force your knees down.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-6',
    name: 'Figure Four Stretch (Glute stretch)',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Targets the glutes and outer hips for better mobility and balance.',
    instructions: [
      'Lie on your back, cross your right ankle over your left knee.',
      'Grab the back of your left thigh and gently pull it toward your chest.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your head and shoulders relaxed.',
      'Don’t force the stretch.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-7',
    name: 'Shoulder Cross-Body Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Stretches the shoulder and upper back for better shooting and passing range.',
    instructions: [
      'Stand or sit tall.',
      'Bring your right arm across your chest.',
      'Use your left hand to gently pull your right arm closer to your chest.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your shoulders relaxed.',
      'Don’t twist your torso.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-8',
    name: 'Triceps Overhead Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Stretches the triceps and shoulders for better shooting and rebounding reach.',
    instructions: [
      'Raise your right arm overhead and bend the elbow.',
      'Use your left hand to gently press your right elbow toward your head.',
      'Hold, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds each side',
    tips: [
      'Keep your head neutral.',
      'Don’t arch your back.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'flex-9',
    name: 'Cat-Cow Stretch (spinal mobility)',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves spinal mobility and posture for better movement on the court.',
    instructions: [
      'Start on hands and knees in tabletop position.',
      'Inhale, arch your back (cow), look up.',
      'Exhale, round your back (cat), tuck chin to chest.',
      'Repeat slowly.'
    ],
    recommendedDuration: 30,
    reps: 'Repeat 5–8 times',
    tips: [
      'Move slowly and with control.',
      'Coordinate movement with breath.',
      'Don’t force the range of motion.'
    ],
    videoId: ''
  },
  {
    id: 'flex-10',
    name: 'Child’s Pose (spinal & hip flexibility)',
    category: 'flexibility',
    duration: 2,
    difficulty: 'beginner',
    description: 'Stretches the back and hips for recovery and flexibility.',
    instructions: [
      'Start on hands and knees.',
      'Sit your hips back toward your heels, arms extended forward.',
      'Rest your forehead on the floor.',
      'Hold the stretch.'
    ],
    recommendedDuration: 30,
    reps: 'Hold 30 seconds',
    tips: [
      'Relax your neck and shoulders.',
      'Breathe deeply into your back.',
      'Don’t force your hips to your heels.'
    ],
    videoId: ''
  },
  {
    id: 'flex-11',
    name: 'World’s Greatest Stretch',
    category: 'flexibility',
    duration: 2,
    difficulty: 'intermediate',
    description: 'Dynamic full-body stretch for mobility, injury prevention, and warm-up.',
    instructions: [
      'Start in a high plank position.',
      'Step your right foot outside your right hand.',
      'Lower your left knee to the ground.',
      'Rotate your right arm up toward the ceiling, opening your chest.',
      'Return to plank and switch sides.'
    ],
    recommendedDuration: 40,
    reps: 'Repeat 3–5 times each side',
    tips: [
      'Move slowly and with control.',
      'Keep your back leg straight when possible.',
      'Breathe deeply.'
    ],
    videoId: ''
  },
  {
    id: 'agility-1',
    name: 'Cone Dribbling',
    category: 'agility',
    duration: 10,
    difficulty: 'beginner',
    description: 'Improves ball control, footwork, and dribbling speed in game-like situations.',
    instructions: [
      'Set up 5 cones in a straight line, 3 feet apart.',
      'Start at one end with a basketball.',
      'Dribble through the cones using crossovers or other moves.',
      'Keep your head up and stay low.',
      'Dribble back to the start after the last cone.'
    ],
    recommendedDuration: 60,
    reps: '60 seconds or 3 sets',
    tips: [
      'Keep knees bent and hips low.',
      'Eyes up while dribbling.',
      'Use both hands equally.'
    ],
    videoId: ''
  },
  {
    id: 'agility-2',
    name: 'Lateral Bounds',
    category: 'agility',
    duration: 8,
    difficulty: 'intermediate',
    description: 'Enhances lateral explosiveness and single-leg stability for defense and quick changes of direction.',
    instructions: [
      'Start in an athletic stance on one foot.',
      'Jump laterally to the opposite foot, landing softly.',
      'Hold the landing for 1-2 seconds.',
      'Repeat side to side for the set duration.'
    ],
    recommendedDuration: 30,
    reps: '10–12 reps each side',
    tips: [
      'Land softly and with control.',
      'Don’t let your knee cave in.',
      'Swing arms for balance.'
    ],
    videoId: ''
  },
  {
    id: 'agility-3',
    name: 'T-Drill',
    category: 'agility',
    duration: 5,
    difficulty: 'intermediate',
    description: 'Teaches rapid change of direction and improves footwork for defense and transition.',
    instructions: [
      'Set up 4 cones in a T shape.',
      'Sprint forward to the middle cone, shuffle left, touch cone, shuffle right, touch cone, shuffle back to middle, backpedal to start.'
    ],
    recommendedDuration: 30,
    reps: '3–5 reps',
    tips: [
      'Stay low and balanced.',
      'Touch each cone with your hand.',
      'Keep quick feet.'
    ],
    videoId: ''
  },
  {
    id: 'agility-4',
    name: 'Zig-Zag Cone Drill',
    category: 'agility',
    duration: 5,
    difficulty: 'beginner',
    description: 'Improves first-step quickness and change of direction.',
    instructions: [
      'Set up cones in a zig-zag pattern.',
      'Sprint from cone to cone, planting and pushing off each foot.',
      'Focus on sharp cuts and quick acceleration.'
    ],
    recommendedDuration: 30,
    reps: '2–3 sets',
    tips: [
      'Stay low on cuts.',
      'Explode out of each change of direction.',
      'Use arms for balance.'
    ],
    videoId: ''
  },
  {
    id: 'agility-5',
    name: '5-10-5 Shuttle Drill',
    category: 'agility',
    duration: 5,
    difficulty: 'intermediate',
    description: 'Builds acceleration, deceleration, and lateral quickness.',
    instructions: [
      'Set up 3 cones in a straight line, 5 yards apart.',
      'Start at the middle cone, sprint to the right cone, then all the way to the far left cone, then back to the middle.'
    ],
    recommendedDuration: 30,
    reps: '3–5 reps',
    tips: [
      'Touch the line at each turn.',
      'Stay low and keep your center of gravity.',
      'Accelerate out of each turn.'
    ],
    videoId: ''
  },
  {
    id: 'agility-6',
    name: 'Ladder Quick Feet',
    category: 'agility',
    duration: 4,
    difficulty: 'beginner',
    description: 'Improves foot speed and coordination for defense and transition.',
    instructions: [
      'Lay out an agility ladder on the ground.',
      'Step quickly in and out of each box with both feet.',
      'Move down the ladder as fast as possible.'
    ],
    recommendedDuration: 20,
    reps: '2–3 sets',
    tips: [
      'Stay on the balls of your feet.',
      'Keep arms bent and pumping.',
      'Look forward, not down.'
    ],
    videoId: ''
  },
  {
    id: 'agility-7',
    name: 'Ladder In & Out',
    category: 'agility',
    duration: 4,
    difficulty: 'beginner',
    description: 'Develops lateral quickness and coordination.',
    instructions: [
      'Start at the end of the ladder.',
      'Step both feet in, then both feet out, moving laterally down the ladder.'
    ],
    recommendedDuration: 20,
    reps: '2–3 sets',
    tips: [
      'Stay light on your feet.',
      'Move quickly but with control.',
      'Keep hips low.'
    ],
    videoId: ''
  },
  {
    id: 'agility-8',
    name: 'Figure 8 Runs',
    category: 'agility',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Improves agility and body control when changing direction.',
    instructions: [
      'Set up two cones 10 feet apart.',
      'Run in a figure 8 pattern around the cones as quickly as possible.'
    ],
    recommendedDuration: 30,
    reps: '2–3 sets',
    tips: [
      'Lean into the turns.',
      'Keep your steps short and quick.',
      'Stay low.'
    ],
    videoId: ''
  },
  {
    id: 'agility-9',
    name: 'Closeout Drill',
    category: 'agility',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Trains defensive footwork and closing out on shooters.',
    instructions: [
      'Start under the basket.',
      'Sprint to the three-point line, chop your feet, and get into a defensive stance.'
    ],
    recommendedDuration: 20,
    reps: '3–5 reps',
    tips: [
      'Chop feet as you approach the line.',
      'Hands up on closeout.',
      'Stay balanced.'
    ],
    videoId: ''
  },
  {
    id: 'agility-10',
    name: 'Reaction Drill',
    category: 'agility',
    duration: 4,
    difficulty: 'intermediate',
    description: 'Improves reaction time and first-step quickness.',
    instructions: [
      'Have a partner or coach call out a direction or point.',
      'React instantly and sprint or shuffle in that direction.'
    ],
    recommendedDuration: 20,
    reps: '2–3 sets',
    tips: [
      'Stay on your toes.',
      'React as quickly as possible.',
      'Keep your head up.'
    ],
    videoId: ''
  },
  {
    id: 'strength-1',
    name: 'Push-Ups',
    category: 'strength',
    duration: 5,
    difficulty: 'beginner',
    description: 'Builds chest, shoulder, and core strength for basketball.',
    instructions: [
      'Start in a plank position with hands under shoulders.',
      'Lower your body until your chest nearly touches the floor.',
      'Push back up to the starting position.',
      'Keep your body straight throughout.'
    ],
    recommendedDuration: 1,
    reps: '2–3 sets of 10–15 reps',
    tips: [
      'Keep elbows at 45 degrees.',
      'Engage your core.',
      'Breathe out as you push up.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-2',
    name: 'Plank Hold',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves core strength and stability.',
    instructions: [
      'Start in a forearm plank position.',
      'Keep your body in a straight line from head to heels.',
      'Hold for the recommended time.'
    ],
    recommendedDuration: 30,
    reps: '3 sets of 30 seconds',
    tips: [
      'Don’t let hips sag or rise.',
      'Keep neck neutral.',
      'Breathe steadily.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-3',
    name: 'Lunges',
    category: 'strength',
    duration: 3,
    difficulty: 'beginner',
    description: 'Builds leg strength and balance for explosive moves.',
    instructions: [
      'Stand tall, step forward with one leg.',
      'Lower your hips until both knees are bent at 90 degrees.',
      'Push back to the starting position and switch legs.'
    ],
    recommendedDuration: 2,
    reps: '2–3 sets of 10–12 reps per leg',
    tips: [
      'Keep your front knee over your ankle.',
      'Don’t let your back knee touch the floor.',
      'Keep your torso upright.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-4',
    name: 'Bodyweight Squats',
    category: 'strength',
    duration: 3,
    difficulty: 'beginner',
    description: 'Strengthens legs and glutes for jumping and defense.',
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower your body as if sitting back into a chair.',
      'Keep your chest up and knees behind toes.',
      'Return to standing.'
    ],
    recommendedDuration: 2,
    reps: '2–3 sets of 12–15 reps',
    tips: [
      'Keep weight on your heels.',
      'Don’t let knees cave in.',
      'Go as low as comfortable.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-5',
    name: 'Glute Bridges',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Activates glutes and strengthens hips for power.',
    instructions: [
      'Lie on your back, knees bent, feet flat on floor.',
      'Lift hips until knees, hips, and shoulders form a straight line.',
      'Squeeze glutes at the top, then lower.'
    ],
    recommendedDuration: 1,
    reps: '2–3 sets of 12–15 reps',
    tips: [
      'Don’t overextend your back.',
      'Pause at the top for 1–2 seconds.',
      'Keep feet flat.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-6',
    name: 'Single-Leg Romanian Deadlifts (bodyweight)',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves balance and hamstring strength.',
    instructions: [
      'Stand on one leg, slight bend in knee.',
      'Hinge at the hips, lowering torso and lifting back leg.',
      'Return to start and repeat, then switch legs.'
    ],
    recommendedDuration: 2,
    reps: '2–3 sets of 8–10 reps per leg',
    tips: [
      'Keep back flat.',
      'Move slowly and with control.',
      'Don’t let hips rotate.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-7',
    name: 'Calf Raises',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Builds calf strength for jumping and sprinting.',
    instructions: [
      'Stand with feet hip-width apart.',
      'Rise up onto the balls of your feet.',
      'Lower back down with control.'
    ],
    recommendedDuration: 1,
    reps: '2–3 sets of 15–20 reps',
    tips: [
      'Pause at the top for 1 second.',
      'Keep movements slow and controlled.',
      'Hold onto a wall for balance if needed.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-8',
    name: 'Superman Hold (back strength)',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Strengthens lower back and improves posture.',
    instructions: [
      'Lie face down, arms extended in front.',
      'Lift arms, chest, and legs off the ground.',
      'Hold for the recommended time, then lower.'
    ],
    recommendedDuration: 30,
    reps: '3 sets of 20–30 seconds',
    tips: [
      'Don’t overextend your neck.',
      'Squeeze glutes and back muscles.',
      'Breathe steadily.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-9',
    name: 'Russian Twists (core strength)',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Improves core strength and rotational power.',
    instructions: [
      'Sit on the floor, knees bent, feet lifted slightly.',
      'Lean back slightly, hold hands together in front.',
      'Twist torso to each side, tapping the floor.'
    ],
    recommendedDuration: 1,
    reps: '2–3 sets of 16–20 twists',
    tips: [
      'Keep back straight.',
      'Move with control, not speed.',
      'Breathe out as you twist.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-10',
    name: 'Side Plank (core & stability)',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Builds core strength and improves stability.',
    instructions: [
      'Lie on your side, elbow under shoulder.',
      'Lift hips to form a straight line from head to feet.',
      'Hold for the recommended time, then switch sides.'
    ],
    recommendedDuration: 30,
    reps: '3 sets of 20–30 seconds per side',
    tips: [
      'Don’t let hips sag.',
      'Keep neck in line with spine.',
      'Breathe steadily.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  },
  {
    id: 'strength-11',
    name: 'Wall Sits (isometric leg strength)',
    category: 'strength',
    duration: 2,
    difficulty: 'beginner',
    description: 'Builds isometric leg strength for defense and rebounding.',
    instructions: [
      'Stand with back against a wall, feet shoulder-width apart.',
      'Slide down until knees are at 90 degrees.',
      'Hold for the recommended time.'
    ],
    recommendedDuration: 30,
    reps: '3 sets of 30–45 seconds',
    tips: [
      'Keep knees above ankles.',
      'Don’t let knees collapse inward.',
      'Keep back flat against the wall.'
    ],
    videoId: '',
    isFavorite: false,
    isDone: false
  }
];

export const stretches: Stretch[] = [
  {
    id: '1',
    name: 'Leg Swings',
    type: 'warm-up',
    duration: 2,
    instructions: [
      'Stand tall next to a wall or sturdy support.',
      'Swing your right leg forward and backward in a controlled motion.',
      'Keep your leg straight and core engaged.',
      'Complete 10–15 swings each direction.',
      'Switch to left leg and repeat.'
    ],
    targetAreas: ['Hip flexors', 'Hamstrings', 'Glutes'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Activates hips and legs before play.',
      'Keep your core tight for balance.',
      'Move slowly and with control.',
      'Don’t swing too high too early.'
    ]
  },
  {
    id: '2',
    name: 'Calf Stretch',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Stand facing a wall, place your hands on the wall at shoulder height.',
      'Step your right foot back 2–3 feet, keeping your heel on the ground.',
      'Bend your left knee and lean forward until you feel a stretch in your right calf.',
      'Hold for 20–30 seconds, then switch legs.'
    ],
    targetAreas: ['Calves', 'Achilles tendon'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Helps release tension in calves after training or games.',
      'Keep your back heel on the floor.',
      'Don’t bounce—hold the stretch steady.',
      'Breathe deeply throughout.'
    ]
  },
  {
    id: '3',
    name: 'Hip Circles',
    type: 'warm-up',
    duration: 2,
    instructions: [
      'Stand with hands on hips and feet shoulder-width apart.',
      'Lift your right knee to waist height.',
      'Rotate your knee in large circles—10 forward, 10 backward.',
      'Switch to left leg and repeat.'
    ],
    targetAreas: ['Hip flexors', 'Glutes', 'Core'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Loosens hips and prepares for movement.',
      'Keep your upper body tall.',
      'Move slowly and deliberately.',
      'Don’t let your knee drop below hip height.'
    ]
  },
  {
    id: '4',
    name: 'Shoulder Rolls',
    type: 'maintenance',
    duration: 2,
    description: 'Helps loosen shoulder joints and maintain mobility',
    instructions: [
      'Stand tall with arms relaxed at your sides',
      'Slowly roll your shoulders forward in large, controlled circles',
      'Complete 10 forward rolls, focusing on full range of motion',
      'Pause briefly, then roll shoulders backward 10 times',
      'Keep your neck relaxed and breathe deeply throughout',
      'Feel the stretch in your shoulder blades and upper back'
    ],
    targetAreas: ['Shoulders', 'Upper back'],
    recommendedDuration: 60,
    tips: [
      'Keep movements controlled, don\'t rush',
      'Breathe deeply and rhythmically',
      'Focus on smooth, circular motions',
      'Don\'t let your shoulders creep up toward your ears'
    ],
    videoId: ''
  },
  {
    id: 'warmup-1',
    name: 'Arm Circles (forward & backward)',
    type: 'warm-up',
    duration: 2,
    instructions: [
      'Stand tall with arms extended out to sides.',
      'Make small circles forward for 15 seconds.',
      'Gradually make the circles larger.',
      'Reverse direction and repeat backward.'
    ],
    targetAreas: ['Shoulders', 'Arms'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Loosens shoulder joints and upper body.',
      'Keep shoulders relaxed.',
      'Move slowly and with control.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'warmup-2',
    name: 'Walking Lunges',
    type: 'warm-up',
    duration: 2,
    instructions: [
      'Stand tall, step forward with right leg into a lunge.',
      'Lower hips until both knees are at 90 degrees.',
      'Push off back foot and step forward with left leg.',
      'Continue alternating for 10–12 reps each leg.'
    ],
    targetAreas: ['Quads', 'Glutes', 'Hip flexors'],
    videoId: '',
    recommendedDuration: 40,
    tips: [
      'Prepares legs and hips for dynamic movement.',
      'Keep your torso upright.',
      'Don’t let your front knee go past your toes.',
      'Step with control.'
    ]
  },
  {
    id: 'warmup-3',
    name: 'Torso Twists',
    type: 'warm-up',
    duration: 1,
    instructions: [
      'Stand with feet shoulder-width apart, arms out to sides.',
      'Twist your torso to the right, then left, keeping hips facing forward.',
      'Repeat for 20–30 seconds.'
    ],
    targetAreas: ['Core', 'Obliques', 'Back'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Warms up core and improves rotational mobility.',
      'Move smoothly, don’t jerk.',
      'Keep hips stable.',
      'Breathe out as you twist.'
    ]
  },
  {
    id: 'warmup-4',
    name: 'Ankle Bounces',
    type: 'warm-up',
    duration: 1,
    instructions: [
      'Stand tall, feet hip-width apart.',
      'Bounce lightly on the balls of your feet.',
      'Keep knees soft and land gently.',
      'Continue for 20–30 seconds.'
    ],
    targetAreas: ['Ankles', 'Calves'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Activates ankles and calves for jumping and running.',
      'Stay light on your feet.',
      'Keep bounces quick and controlled.',
      'Don’t let heels touch the ground.'
    ]
  },
  {
    id: 'warmup-5',
    name: 'High Knees (dynamic warm-up)',
    type: 'warm-up',
    duration: 1,
    instructions: [
      'Stand tall, arms at sides.',
      'Run in place, driving knees up toward chest.',
      'Pump arms for momentum.',
      'Continue for 20–30 seconds.'
    ],
    targetAreas: ['Hip flexors', 'Quads', 'Core'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Raises heart rate and warms up lower body.',
      'Keep core engaged.',
      'Land softly.',
      'Lift knees to hip height.'
    ]
  },
  {
    id: 'warmup-6',
    name: 'Butt Kicks (dynamic warm-up)',
    type: 'warm-up',
    duration: 1,
    instructions: [
      'Stand tall, arms at sides.',
      'Jog in place, kicking heels up to glutes.',
      'Keep quick, light steps.',
      'Continue for 20–30 seconds.'
    ],
    targetAreas: ['Hamstrings', 'Glutes'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Warms up hamstrings and improves running form.',
      'Keep chest up.',
      'Don’t arch lower back.',
      'Stay light on feet.'
    ]
  },
  {
    id: 'warmup-7',
    name: 'Knee Hugs (dynamic stretch)',
    type: 'warm-up',
    duration: 1,
    instructions: [
      'Stand tall, lift right knee toward chest.',
      'Grab shin and gently pull knee closer.',
      'Release and step forward, switch legs.',
      'Continue alternating for 10–12 reps each leg.'
    ],
    targetAreas: ['Glutes', 'Hip flexors'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Stretches glutes and hip flexors dynamically.',
      'Keep torso upright.',
      'Pull gently, don’t force.',
      'Move with control.'
    ]
  },
  {
    id: 'warmup-8',
    name: 'World’s Greatest Stretch (dynamic full-body)',
    type: 'warm-up',
    duration: 2,
    instructions: [
      'Start in a lunge position with right foot forward.',
      'Place left hand on ground, right elbow inside right foot.',
      'Rotate right arm up toward ceiling, opening chest.',
      'Return hand to ground, step forward and switch sides.'
    ],
    targetAreas: ['Hips', 'Hamstrings', 'Back', 'Shoulders'],
    videoId: '',
    recommendedDuration: 40,
    tips: [
      'Dynamic stretch for hips, hamstrings, and thoracic spine.',
      'Move slowly and with control.',
      'Reach as far as comfortable.',
      'Breathe deeply throughout.'
    ]
  },
  {
    id: 'cooldown-1',
    name: 'Standing Quad Stretch',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Stand tall, hold onto a wall or chair for balance if needed.',
      'Bend your right knee and grab your right ankle behind you.',
      'Pull your heel gently toward your glutes until you feel a stretch in your quad.',
      'Hold for 20–30 seconds, then switch legs.'
    ],
    targetAreas: ['Quads', 'Hip flexors'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Releases tension in quads after sprints or jumping.',
      'Keep knees close together.',
      'Stand tall, don’t arch your back.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-2',
    name: 'Seated Hamstring Stretch',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Sit on the floor with both legs extended straight.',
      'Reach forward toward your toes, keeping your back straight.',
      'Hold for 20–30 seconds, feeling the stretch in your hamstrings.'
    ],
    targetAreas: ['Hamstrings', 'Lower back'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Releases tension in hamstrings after running.',
      'Don’t round your back.',
      'Reach as far as comfortable.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-3',
    name: 'Groin Stretch (Butterfly stretch)',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Sit on the floor, bring the soles of your feet together.',
      'Let your knees fall out to the sides.',
      'Hold your feet with your hands and gently press your knees toward the floor.',
      'Hold for 20–30 seconds.'
    ],
    targetAreas: ['Groin', 'Hips'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Opens up the groin and hips after activity.',
      'Keep your back straight.',
      'Don’t force your knees down.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-4',
    name: 'Figure Four Stretch (Glute stretch)',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Lie on your back, bend both knees and place feet flat on the floor.',
      'Cross your right ankle over your left knee.',
      'Grab the back of your left thigh and gently pull it toward your chest.',
      'Hold for 20–30 seconds, then switch sides.'
    ],
    targetAreas: ['Glutes', 'Hips'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Stretches glutes and hips after intense play.',
      'Keep your head and shoulders relaxed.',
      'Don’t force the stretch.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-5',
    name: 'Child’s Pose (back & hips)',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Kneel on the floor, sit back on your heels.',
      'Reach your arms forward and lower your forehead to the ground.',
      'Hold for 20–30 seconds, feeling the stretch in your back and hips.'
    ],
    targetAreas: ['Back', 'Hips', 'Shoulders'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Relaxes back and hips after games.',
      'Let your chest sink toward the floor.',
      'Relax your neck and shoulders.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-6',
    name: 'Cat-Cow Stretch (spinal mobility & relaxation)',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Start on hands and knees, wrists under shoulders, knees under hips.',
      'Inhale, arch your back (cow), lifting your head and tailbone.',
      'Exhale, round your back (cat), tucking chin and pelvis.',
      'Repeat slowly for 20–30 seconds.'
    ],
    targetAreas: ['Spine', 'Back', 'Core'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Improves spinal mobility and relaxation.',
      'Move slowly and with your breath.',
      'Don’t force the range of motion.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-7',
    name: 'Upper Back Stretch (hug yourself stretch)',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Stand or sit tall, cross your right arm over your left and hug your shoulders.',
      'Gently pull your shoulders forward to feel a stretch in your upper back.',
      'Hold for 20–30 seconds, then switch arms.'
    ],
    targetAreas: ['Upper back', 'Shoulders'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Releases tension in upper back and shoulders.',
      'Keep your chin tucked slightly.',
      'Relax your neck.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'cooldown-8',
    name: 'Triceps Overhead Stretch',
    type: 'cool-down',
    duration: 2,
    instructions: [
      'Stand or sit tall, reach your right arm overhead and bend the elbow.',
      'Use your left hand to gently pull your right elbow behind your head.',
      'Hold for 20–30 seconds, then switch arms.'
    ],
    targetAreas: ['Triceps', 'Shoulders'],
    videoId: '',
    recommendedDuration: 30,
    tips: [
      'Stretches triceps and shoulders after shooting.',
      'Keep your biceps close to your ear.',
      'Don’t arch your back.',
      'Breathe deeply.'
    ]
  },
  {
    id: 'maintenance-1',
    name: 'Foam Rolling Calves',
    type: 'maintenance',
    duration: 3,
    description: 'Releases tight calves and improves ankle mobility',
    instructions: [
      'Sit on the floor with legs extended straight',
      'Place foam roller under your calves',
      'Lift your hips off the ground using your hands',
      'Roll slowly from ankle to knee, focusing on tight spots',
      'Hold on tender areas for 10-15 seconds',
      'Roll for 30-45 seconds per leg'
    ],
    targetAreas: ['Calves', 'Ankles'],
    recommendedDuration: 90,
    tips: [
      'Move slowly, don\'t overdo pressure',
      'Breathe deeply and relax into the pressure',
      'Focus on areas that feel particularly tight',
      'Don\'t roll directly over bones or joints'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-2',
    name: 'Foam Rolling Quads',
    type: 'maintenance',
    duration: 3,
    description: 'Releases tight quads and improves recovery',
    instructions: [
      'Lie face down on the floor',
      'Place foam roller under your thighs',
      'Support your upper body with your forearms',
      'Roll slowly from hip to knee, covering all quad muscles',
      'Hold on tender spots for 10-15 seconds',
      'Roll for 30-45 seconds per leg'
    ],
    targetAreas: ['Quadriceps', 'Hip flexors'],
    recommendedDuration: 90,
    tips: [
      'Keep your core engaged to maintain control',
      'Roll slowly and methodically',
      'Don\'t rush through the movement',
      'Focus on areas that feel tight or sore'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-3',
    name: 'Foam Rolling IT Band',
    type: 'maintenance',
    duration: 3,
    description: 'Releases tension in the iliotibial band',
    instructions: [
      'Lie on your side with foam roller under your hip',
      'Support your upper body with your forearm',
      'Roll slowly from hip to knee along the outside of your thigh',
      'Hold on tender areas for 10-15 seconds',
      'Roll for 30-45 seconds per leg'
    ],
    targetAreas: ['IT Band', 'Hip', 'Knee'],
    recommendedDuration: 90,
    tips: [
      'This can be intense - start with gentle pressure',
      'Breathe deeply and relax into the stretch',
      'Don\'t roll directly over the knee',
      'Focus on the area between hip and knee'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-4',
    name: 'Foam Rolling Back',
    type: 'maintenance',
    duration: 4,
    description: 'Releases tension in upper and lower back muscles',
    instructions: [
      'Sit on the floor with foam roller behind you',
      'Lean back and place roller under your upper back',
      'Cross arms over chest and lift hips off ground',
      'Roll slowly from upper back to mid-back',
      'Hold on tender spots for 10-15 seconds',
      'Roll for 45-60 seconds total'
    ],
    targetAreas: ['Upper back', 'Mid-back', 'Shoulders'],
    recommendedDuration: 120,
    tips: [
      'Keep your core engaged for control',
      'Roll slowly and don\'t rush',
      'Avoid rolling directly on your spine',
      'Focus on the muscles on either side of your spine'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-5',
    name: 'Hip Flexor Stretch (deep stretch)',
    type: 'maintenance',
    duration: 3,
    description: 'Deep stretch for tight hip flexors and improved hip mobility',
    instructions: [
      'Start in a low lunge position with right foot forward',
      'Lower your left knee to the ground behind you',
      'Keep your right knee directly over your right ankle',
      'Gently press your hips forward until you feel a stretch',
      'Hold for 20-30 seconds, breathing deeply',
      'Switch sides and repeat'
    ],
    targetAreas: ['Hip flexors', 'Quads', 'Glutes'],
    recommendedDuration: 60,
    tips: [
      'Keep your back straight and core engaged',
      'Don\'t let your front knee go past your toes',
      'Breathe deeply and relax into the stretch',
      'You should feel the stretch in the front of your hip'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-6',
    name: 'Lying Spinal Twist',
    type: 'maintenance',
    duration: 3,
    description: 'Improves spinal mobility and releases back tension',
    instructions: [
      'Lie on your back with arms extended out to sides',
      'Bend your knees and place feet flat on the floor',
      'Slowly drop both knees to the right side',
      'Keep your shoulders flat on the ground',
      'Hold for 20-30 seconds, breathing deeply',
      'Return to center and repeat on left side'
    ],
    targetAreas: ['Spine', 'Lower back', 'Obliques'],
    recommendedDuration: 60,
    tips: [
      'Keep your shoulders flat on the ground',
      'Breathe deeply and relax into the twist',
      'Don\'t force the movement beyond comfort',
      'Feel the stretch along your spine and sides'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-7',
    name: 'Piriformis Stretch (glute stretch)',
    type: 'maintenance',
    duration: 3,
    description: 'Targets the piriformis muscle for glute and hip relief',
    instructions: [
      'Lie on your back with knees bent and feet flat',
      'Cross your right ankle over your left knee',
      'Grab behind your left thigh with both hands',
      'Gently pull your left knee toward your chest',
      'Hold for 20-30 seconds, feeling stretch in right glute',
      'Switch sides and repeat'
    ],
    targetAreas: ['Piriformis', 'Glutes', 'Hips'],
    recommendedDuration: 60,
    tips: [
      'Keep your head and shoulders relaxed on the ground',
      'Don\'t force the stretch - go to comfortable tension',
      'Breathe deeply throughout the stretch',
      'You should feel the stretch in your glute, not your knee'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-8',
    name: 'Ankle Circles',
    type: 'maintenance',
    duration: 2,
    description: 'Improves ankle mobility and range of motion',
    instructions: [
      'Sit or stand with legs extended in front of you',
      'Point your toes and make small circles with your ankles',
      'Rotate clockwise for 10-15 circles',
      'Then rotate counterclockwise for 10-15 circles',
      'Repeat with the other ankle',
      'Focus on full range of motion'
    ],
    targetAreas: ['Ankles', 'Calves'],
    recommendedDuration: 60,
    tips: [
      'Move slowly and with control',
      'Focus on full range of motion',
      'Don\'t rush through the movement',
      'Feel the movement in your ankle joint'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-9',
    name: 'Neck Stretch (lateral)',
    type: 'maintenance',
    duration: 2,
    description: 'Releases tension in neck and shoulder muscles',
    instructions: [
      'Sit or stand tall with shoulders relaxed',
      'Slowly tilt your head toward your right shoulder',
      'Hold for 15-20 seconds, feeling stretch on left side',
      'Return to center and tilt toward left shoulder',
      'Hold for 15-20 seconds',
      'Keep your shoulders down throughout'
    ],
    targetAreas: ['Neck', 'Shoulders', 'Upper back'],
    recommendedDuration: 40,
    tips: [
      'Keep your shoulders relaxed and down',
      'Don\'t force the stretch beyond comfort',
      'Breathe deeply throughout',
      'Feel the stretch along the side of your neck'
    ],
    videoId: ''
  },
  {
    id: 'maintenance-10',
    name: 'Cat-Cow Stretch (spinal mobility)',
    type: 'maintenance',
    duration: 3,
    description: 'Improves spinal mobility and releases back tension',
    instructions: [
      'Start on hands and knees, wrists under shoulders, knees under hips',
      'Inhale and arch your back (cow), lifting head and tailbone',
      'Exhale and round your back (cat), tucking chin and pelvis',
      'Move slowly and rhythmically with your breath',
      'Repeat for 10-15 cycles',
      'Focus on smooth, controlled movement'
    ],
    targetAreas: ['Spine', 'Back', 'Core'],
    recommendedDuration: 90,
    tips: [
      'Move slowly and with your breath',
      'Don\'t force the range of motion',
      'Keep your movements smooth and controlled',
      'Feel the movement throughout your entire spine'
    ],
    videoId: ''
  }
];

export const trainingTypes = [
  { id: 'skills', name: 'Skills Training', color: 'bg-blue-500' },
  { id: 'conditioning', name: 'Conditioning', color: 'bg-red-500' },
  { id: 'shooting', name: 'Shooting', color: 'bg-orange-500' },
  { id: 'game-prep', name: 'Game Prep', color: 'bg-purple-500' }
];

// Defense subcategories and drills
export interface DefenseDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subcategory: string;
}

export interface DefenseSubcategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: DefenseDrill[];
}

export const defenseSubcategories: DefenseSubcategory[] = [
  {
    id: 'stance-fundamentals',
    name: 'Defensive Stance & Fundamentals',
    description: 'Low stance, balance, hand positioning, and defensive basics.',
    color: 'bg-blue-600',
    drills: [
      { id: 'low-stance', name: 'Low Stance', description: 'Maintain a low, athletic stance for quick movement.', difficulty: 'beginner', subcategory: 'stance-fundamentals' },
      { id: 'balance', name: 'Balance Drills', description: 'Improve balance for better defensive reactions.', difficulty: 'beginner', subcategory: 'stance-fundamentals' },
      { id: 'hand-positioning', name: 'Hand Positioning', description: 'Proper hand placement to contest shots and passes.', difficulty: 'beginner', subcategory: 'stance-fundamentals' },
      { id: 'stance-switch', name: 'Stance Switch', description: 'Quickly switch between defensive stances.', difficulty: 'intermediate', subcategory: 'stance-fundamentals' }
    ]
  },
  {
    id: 'on-ball-defense',
    name: 'On-Ball Defense',
    description: 'Defensive slide, closeout technique, hand-checking, forcing baseline.',
    color: 'bg-green-600',
    drills: [
      { id: 'defensive-slide', name: 'Defensive Slide', description: 'Basic defensive movement to stay in front of offensive players.', difficulty: 'beginner', subcategory: 'on-ball-defense' },
      { id: 'closeout', name: 'Closeout Technique', description: 'Approach shooters under control and contest shots.', difficulty: 'intermediate', subcategory: 'on-ball-defense' },
      { id: 'hand-checking', name: 'Hand-Checking', description: 'Legal use of hands to guide offensive players.', difficulty: 'intermediate', subcategory: 'on-ball-defense' },
      { id: 'force-baseline', name: 'Forcing Baseline', description: 'Angle your body to force the ball handler toward the baseline.', difficulty: 'advanced', subcategory: 'on-ball-defense' }
    ]
  },
  {
    id: 'off-ball-defense',
    name: 'Off-Ball Defense',
    description: 'Deny stance, help defense, defending screens, rotations.',
    color: 'bg-purple-600',
    drills: [
      { id: 'deny-stance', name: 'Deny Stance', description: 'Prevent your man from receiving the ball.', difficulty: 'intermediate', subcategory: 'off-ball-defense' },
      { id: 'help-defense', name: 'Help Defense', description: 'Provide help when a teammate is beaten.', difficulty: 'intermediate', subcategory: 'off-ball-defense' },
      { id: 'defending-screens', name: 'Defending Screens', description: 'Navigate and fight through screens.', difficulty: 'advanced', subcategory: 'off-ball-defense' },
      { id: 'rotations', name: 'Rotations', description: 'Rotate quickly to cover open players.', difficulty: 'advanced', subcategory: 'off-ball-defense' }
    ]
  },
  {
    id: 'transition-defense',
    name: 'Transition Defense',
    description: 'Sprinting back, stopping the ball, matching up in transition.',
    color: 'bg-yellow-600',
    drills: [
      { id: 'sprint-back', name: 'Sprinting Back', description: 'Quickly get back on defense after a turnover.', difficulty: 'beginner', subcategory: 'transition-defense' },
      { id: 'stop-ball', name: 'Stopping the Ball', description: 'Identify and stop the ball handler in transition.', difficulty: 'intermediate', subcategory: 'transition-defense' },
      { id: 'match-up', name: 'Matching Up', description: 'Find and guard a player in transition.', difficulty: 'intermediate', subcategory: 'transition-defense' }
    ]
  },
  {
    id: 'rebounding',
    name: 'Rebounding Footwork & Techniques',
    description: 'Box out, timing the jump, securing the ball.',
    color: 'bg-red-600',
    drills: [
      { id: 'box-out', name: 'Box Out', description: 'Seal your opponent to secure the rebound.', difficulty: 'beginner', subcategory: 'rebounding' },
      { id: 'timing-jump', name: 'Timing the Jump', description: 'Jump at the right moment to grab the rebound.', difficulty: 'intermediate', subcategory: 'rebounding' },
      { id: 'secure-ball', name: 'Securing the Ball', description: 'Hold the ball tightly after rebounding.', difficulty: 'beginner', subcategory: 'rebounding' }
    ]
  },
  {
    id: 'advanced-defense',
    name: 'Advanced & Game Situations',
    description: 'Trap defense, double team footwork, switching defense, defensive communication drills.',
    color: 'bg-indigo-600',
    drills: [
      { id: 'trap-defense', name: 'Trap Defense', description: 'Trap the ball handler with two defenders.', difficulty: 'advanced', subcategory: 'advanced-defense' },
      { id: 'double-team', name: 'Double Team Footwork', description: 'Proper footwork for double teaming.', difficulty: 'advanced', subcategory: 'advanced-defense' },
      { id: 'switching-defense', name: 'Switching Defense', description: 'Switch assignments on screens and cuts.', difficulty: 'advanced', subcategory: 'advanced-defense' },
      { id: 'defensive-communication', name: 'Defensive Communication', description: 'Verbal and non-verbal cues for team defense.', difficulty: 'intermediate', subcategory: 'advanced-defense' }
    ]
  }
];

// Passing subcategories and drills
export interface PassingDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subcategory: string;
}

export interface PassingSubcategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: PassingDrill[];
}

export const passingSubcategories: PassingSubcategory[] = [
  {
    id: 'fundamentals',
    name: 'Passing Fundamentals',
    description: 'Chest pass, bounce pass, overhead pass, proper hand placement.',
    color: 'bg-yellow-600',
    drills: [
      { id: 'chest-pass', name: 'Chest Pass', description: 'Basic two-handed pass from chest to chest.', difficulty: 'beginner', subcategory: 'fundamentals' },
      { id: 'bounce-pass', name: 'Bounce Pass', description: 'Pass the ball by bouncing it once to a teammate.', difficulty: 'beginner', subcategory: 'fundamentals' },
      { id: 'overhead-pass', name: 'Overhead Pass', description: 'Pass the ball over the head for longer distances.', difficulty: 'beginner', subcategory: 'fundamentals' },
      { id: 'hand-placement', name: 'Proper Hand Placement', description: 'Correct hand positioning for accurate passing.', difficulty: 'beginner', subcategory: 'fundamentals' }
    ]
  },
  {
    id: 'moving-passing',
    name: 'Moving & Off-the-Dribble Passing',
    description: 'Push pass, one-handed pass, shovel pass while moving.',
    color: 'bg-green-600',
    drills: [
      { id: 'push-pass', name: 'Push Pass', description: 'Quick pass using one or both hands while moving.', difficulty: 'intermediate', subcategory: 'moving-passing' },
      { id: 'one-handed-pass', name: 'One-Handed Pass', description: 'Pass with one hand for speed and deception.', difficulty: 'intermediate', subcategory: 'moving-passing' },
      { id: 'shovel-pass', name: 'Shovel Pass', description: 'Short, underhand pass while on the move.', difficulty: 'intermediate', subcategory: 'moving-passing' }
    ]
  },
  {
    id: 'advanced-passes',
    name: 'Advanced Passes',
    description: 'Behind-the-back pass, no-look pass, wrap-around pass, hook pass.',
    color: 'bg-purple-600',
    drills: [
      { id: 'behind-back-pass', name: 'Behind-the-Back Pass', description: 'Pass the ball behind your back to a teammate.', difficulty: 'advanced', subcategory: 'advanced-passes' },
      { id: 'no-look-pass', name: 'No-Look Pass', description: 'Pass without looking directly at the receiver.', difficulty: 'advanced', subcategory: 'advanced-passes' },
      { id: 'wrap-around-pass', name: 'Wrap-Around Pass', description: 'Pass around a defender using body positioning.', difficulty: 'advanced', subcategory: 'advanced-passes' },
      { id: 'hook-pass', name: 'Hook Pass', description: 'Pass using a hooking arm motion over a defender.', difficulty: 'advanced', subcategory: 'advanced-passes' }
    ]
  },
  {
    id: 'pressure-passing',
    name: 'Passing Under Pressure',
    description: 'Passing out of double team, skip pass over defense, quick release pass.',
    color: 'bg-red-600',
    drills: [
      { id: 'double-team-pass', name: 'Passing Out of Double Team', description: 'Find open teammates when double-teamed.', difficulty: 'advanced', subcategory: 'pressure-passing' },
      { id: 'skip-pass', name: 'Skip Pass', description: 'Pass over the defense to the opposite side.', difficulty: 'intermediate', subcategory: 'pressure-passing' },
      { id: 'quick-release-pass', name: 'Quick Release Pass', description: 'Release the ball quickly to avoid turnovers.', difficulty: 'intermediate', subcategory: 'pressure-passing' }
    ]
  },
  {
    id: 'game-situation',
    name: 'Game Situation Passing',
    description: 'Pick and roll passes, outlet pass, drive and kick, post-entry pass.',
    color: 'bg-blue-600',
    drills: [
      { id: 'pick-roll-pass', name: 'Pick and Roll Pass', description: 'Pass to a rolling teammate after a screen.', difficulty: 'intermediate', subcategory: 'game-situation' },
      { id: 'outlet-pass', name: 'Outlet Pass', description: 'Long pass to start a fast break.', difficulty: 'intermediate', subcategory: 'game-situation' },
      { id: 'drive-kick', name: 'Drive and Kick', description: 'Drive to the basket and pass to an open shooter.', difficulty: 'intermediate', subcategory: 'game-situation' },
      { id: 'post-entry-pass', name: 'Post-Entry Pass', description: 'Pass into the post to a big man.', difficulty: 'intermediate', subcategory: 'game-situation' }
    ]
  },
  {
    id: 'partner-team',
    name: 'Partner & Team Drills',
    description: 'Two-man passing drills, passing relay, passing on the move with cones.',
    color: 'bg-indigo-600',
    drills: [
      { id: 'two-man-drill', name: 'Two-Man Passing Drill', description: 'Practice passing with a partner.', difficulty: 'beginner', subcategory: 'partner-team' },
      { id: 'passing-relay', name: 'Passing Relay', description: 'Team relay passing for speed and accuracy.', difficulty: 'intermediate', subcategory: 'partner-team' },
      { id: 'move-cones', name: 'Passing on the Move with Cones', description: 'Pass while moving around cones.', difficulty: 'intermediate', subcategory: 'partner-team' }
    ]
  }
];

// Layup subcategories and drills
export interface LayupDrill {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subcategory: string;
}

export interface LayupSubcategory {
  id: string;
  name: string;
  description: string;
  color: string;
  drills: LayupDrill[];
}

export const layupSubcategories: LayupSubcategory[] = [
  {
    id: 'basic-layups',
    name: 'Basic Layups',
    description: 'Right hand layup, left hand layup, one-step layup, two-step layup.',
    color: 'bg-green-600',
    drills: [
      { id: 'right-hand-layup', name: 'Right Hand Layup', description: 'Standard layup using the right hand on the right side.', difficulty: 'beginner', subcategory: 'basic-layups' },
      { id: 'left-hand-layup', name: 'Left Hand Layup', description: 'Standard layup using the left hand on the left side.', difficulty: 'beginner', subcategory: 'basic-layups' },
      { id: 'one-step-layup', name: 'One-Step Layup', description: 'Layup off a single step for quick finishing.', difficulty: 'beginner', subcategory: 'basic-layups' },
      { id: 'two-step-layup', name: 'Two-Step Layup', description: 'Layup using the classic two-step approach.', difficulty: 'beginner', subcategory: 'basic-layups' }
    ]
  },
  {
    id: 'reverse-spin-layups',
    name: 'Reverse & Spin Layups',
    description: 'Reverse layup, spin layup, reverse off the glass.',
    color: 'bg-blue-600',
    drills: [
      { id: 'reverse-layup', name: 'Reverse Layup', description: 'Layup finished on the opposite side of the rim.', difficulty: 'intermediate', subcategory: 'reverse-spin-layups' },
      { id: 'spin-layup', name: 'Spin Layup', description: 'Layup using a spin move to evade defenders.', difficulty: 'intermediate', subcategory: 'reverse-spin-layups' },
      { id: 'reverse-off-glass', name: 'Reverse Off the Glass', description: 'Reverse layup using the backboard for protection.', difficulty: 'intermediate', subcategory: 'reverse-spin-layups' }
    ]
  },
  {
    id: 'euro-advanced-footwork',
    name: 'Euro Step & Advanced Footwork',
    description: 'Euro step layup, pro hop layup, stride stop layup.',
    color: 'bg-purple-600',
    drills: [
      { id: 'euro-step-layup', name: 'Euro Step Layup', description: 'Layup using a side-step to evade defenders.', difficulty: 'advanced', subcategory: 'euro-advanced-footwork' },
      { id: 'pro-hop-layup', name: 'Pro Hop Layup', description: 'Layup using a hop step to split defenders.', difficulty: 'advanced', subcategory: 'euro-advanced-footwork' },
      { id: 'stride-stop-layup', name: 'Stride Stop Layup', description: 'Layup using a stride stop for balance and control.', difficulty: 'intermediate', subcategory: 'euro-advanced-footwork' }
    ]
  },
  {
    id: 'floaters-runners',
    name: 'Floaters & Runners',
    description: 'High floater, teardrop, runner in the lane.',
    color: 'bg-yellow-600',
    drills: [
      { id: 'high-floater', name: 'High Floater', description: 'Soft, high-arcing shot over taller defenders.', difficulty: 'intermediate', subcategory: 'floaters-runners' },
      { id: 'teardrop', name: 'Teardrop', description: 'Quick, soft shot released before shot blockers can react.', difficulty: 'intermediate', subcategory: 'floaters-runners' },
      { id: 'runner-lane', name: 'Runner in the Lane', description: 'Running shot in the paint, often off one foot.', difficulty: 'intermediate', subcategory: 'floaters-runners' }
    ]
  },
  {
    id: 'finishing-contact',
    name: 'Finishing Through Contact',
    description: 'Power layup, off-hand layup under pressure, finishing with body contact.',
    color: 'bg-red-600',
    drills: [
      { id: 'power-layup', name: 'Power Layup', description: 'Strong layup through contact, using the body for protection.', difficulty: 'advanced', subcategory: 'finishing-contact' },
      { id: 'off-hand-pressure', name: 'Off-Hand Layup Under Pressure', description: 'Layup with the non-dominant hand while absorbing contact.', difficulty: 'advanced', subcategory: 'finishing-contact' },
      { id: 'body-contact-finish', name: 'Finishing with Body Contact', description: 'Layup finished while absorbing or initiating contact.', difficulty: 'advanced', subcategory: 'finishing-contact' }
    ]
  },
  {
    id: 'creative-pro-moves',
    name: 'Creative & Pro Moves',
    description: 'Up-and-under, jelly layup, scoop layup, inside hand finish.',
    color: 'bg-indigo-600',
    drills: [
      { id: 'up-and-under', name: 'Up-and-Under', description: 'Fake shot, step through, and finish under the rim.', difficulty: 'advanced', subcategory: 'creative-pro-moves' },
      { id: 'jelly-layup', name: 'Jelly Layup', description: 'Stylish layup with a high degree of difficulty and flair.', difficulty: 'advanced', subcategory: 'creative-pro-moves' },
      { id: 'scoop-layup', name: 'Scoop Layup', description: 'Underhand layup with a scooping motion.', difficulty: 'intermediate', subcategory: 'creative-pro-moves' },
      { id: 'inside-hand-finish', name: 'Inside Hand Finish', description: 'Layup finished with the hand closest to the rim.', difficulty: 'intermediate', subcategory: 'creative-pro-moves' }
    ]
  }
];