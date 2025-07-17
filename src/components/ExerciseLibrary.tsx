import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Filter, Clock, Star, Zap, Heart, Target, StretchVertical as Stretch, Search, Play, Pause, RotateCcw, CheckCircle, Video } from 'lucide-react';
import { exercises } from '../data/basketballData';
import { Exercise } from '../types';
import { searchYouTubeVideos } from '../services/youtubeApi';

const CARDIO_COLOR = 'bg-gradient-to-br from-red-100 to-orange-100 text-red-700';
const FLEX_COLOR = 'bg-gradient-to-br from-green-100 to-blue-100 text-green-700';
const AGILITY_COLOR = 'bg-gradient-to-br from-purple-100 to-yellow-100 text-purple-700';

const ExerciseLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [cardioSearch, setCardioSearch] = useState('');
  const [favoriteCardio, setFavoriteCardio] = useState<string[]>([]);
  const [doneCardio, setDoneCardio] = useState<string[]>([]);
  const [cardioVideo, setCardioVideo] = useState<{[id: string]: string}>({});
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const timerRef = useRef<any>(null);
  const [dailyCardio, setDailyCardio] = useState<Exercise | null>(null);
  const [flexSearch, setFlexSearch] = useState('');
  const [favoriteFlex, setFavoriteFlex] = useState<string[]>([]);
  const [doneFlex, setDoneFlex] = useState<string[]>([]);
  const [flexVideo, setFlexVideo] = useState<{[id: string]: string}>({});
  const [flexVideoLoading, setFlexVideoLoading] = useState(false);
  const [flexVideoError, setFlexVideoError] = useState(false);
  const [flexTimer, setFlexTimer] = useState<number>(0);
  const [flexTimerRunning, setFlexTimerRunning] = useState(false);
  const [flexTimerEnded, setFlexTimerEnded] = useState(false);
  const flexTimerRef = useRef<any>(null);
  const [dailyFlex, setDailyFlex] = useState<Exercise | null>(null);
  const [agilitySearch, setAgilitySearch] = useState('');
  const [favoriteAgility, setFavoriteAgility] = useState<string[]>([]);
  const [doneAgility, setDoneAgility] = useState<string[]>([]);
  const [agilityVideo, setAgilityVideo] = useState<{[id: string]: string}>({});
  const [agilityVideoLoading, setAgilityVideoLoading] = useState(false);
  const [agilityVideoError, setAgilityVideoError] = useState(false);
  const [agilityTimer, setAgilityTimer] = useState<number>(0);
  const [agilityTimerRunning, setAgilityTimerRunning] = useState(false);
  const [agilityTimerEnded, setAgilityTimerEnded] = useState(false);
  const agilityTimerRef = useRef<any>(null);
  const [dailyAgility, setDailyAgility] = useState<Exercise | null>(null);
  const [strengthSearch, setStrengthSearch] = useState('');
  const [favoriteStrength, setFavoriteStrength] = useState<string[]>([]);
  const [doneStrength, setDoneStrength] = useState<string[]>([]);
  const [strengthVideo, setStrengthVideo] = useState<{[id: string]: string}>({});
  const [strengthVideoLoading, setStrengthVideoLoading] = useState(false);
  const [strengthVideoError, setStrengthVideoError] = useState(false);
  const [strengthTimer, setStrengthTimer] = useState<number>(0);
  const [strengthTimerRunning, setStrengthTimerRunning] = useState(false);
  const [strengthTimerEnded, setStrengthTimerEnded] = useState(false);
  const strengthTimerRef = useRef<any>(null);
  const [dailyStrength, setDailyStrength] = useState<Exercise | null>(null);

  // Cardio drills only
  const cardioDrills = exercises.filter(e => e.category === 'cardio');

  // Daily Cardio Drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyCardioDrill');
    const storedDate = localStorage.getItem('dailyCardioDrillDate');
    if (stored && storedDate === today) {
      setDailyCardio(JSON.parse(stored));
    } else {
      const randomDrill = cardioDrills[Math.floor(Math.random() * cardioDrills.length)];
      setDailyCardio(randomDrill);
      localStorage.setItem('dailyCardioDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyCardioDrillDate', today);
    }
  }, [cardioDrills.length]);

  // Flexibility drills only
  const flexibilityDrills = exercises.filter(e => e.category === 'flexibility');

  // Daily Flexibility Drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyFlexDrill');
    const storedDate = localStorage.getItem('dailyFlexDrillDate');
    if (stored && storedDate === today) {
      setDailyFlex(JSON.parse(stored));
    } else {
      const randomDrill = flexibilityDrills[Math.floor(Math.random() * flexibilityDrills.length)];
      setDailyFlex(randomDrill);
      localStorage.setItem('dailyFlexDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyFlexDrillDate', today);
    }
  }, [flexibilityDrills.length]);

  // Agility drills only
  const agilityDrills = exercises.filter(e => e.category === 'agility');

  // Daily Agility Drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyAgilityDrill');
    const storedDate = localStorage.getItem('dailyAgilityDrillDate');
    if (stored && storedDate === today) {
      setDailyAgility(JSON.parse(stored));
    } else {
      const randomDrill = agilityDrills[Math.floor(Math.random() * agilityDrills.length)];
      setDailyAgility(randomDrill);
      localStorage.setItem('dailyAgilityDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyAgilityDrillDate', today);
    }
  }, [agilityDrills.length]);

  // Strength drills only
  const strengthDrills = exercises.filter(e => e.category === 'strength');

  // Daily Strength Drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyStrengthDrill');
    const storedDate = localStorage.getItem('dailyStrengthDrillDate');
    if (stored && storedDate === today) {
      setDailyStrength(JSON.parse(stored));
    } else {
      const randomDrill = strengthDrills[Math.floor(Math.random() * strengthDrills.length)];
      setDailyStrength(randomDrill);
      localStorage.setItem('dailyStrengthDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyStrengthDrillDate', today);
    }
  }, [strengthDrills.length]);

  // Cardio favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteCardio');
    if (fav) setFavoriteCardio(JSON.parse(fav));
    const done = localStorage.getItem('doneCardio');
    if (done) setDoneCardio(JSON.parse(done));
    const cachedVideos = localStorage.getItem('cardioVideoCache');
    if (cachedVideos) setCardioVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteCardio', JSON.stringify(favoriteCardio));
  }, [favoriteCardio]);
  useEffect(() => {
    localStorage.setItem('doneCardio', JSON.stringify(doneCardio));
  }, [doneCardio]);
  useEffect(() => {
    localStorage.setItem('cardioVideoCache', JSON.stringify(cardioVideo));
  }, [cardioVideo]);

  // Flex favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteFlex');
    if (fav) setFavoriteFlex(JSON.parse(fav));
    const done = localStorage.getItem('doneFlex');
    if (done) setDoneFlex(JSON.parse(done));
    const cachedVideos = localStorage.getItem('flexVideoCache');
    if (cachedVideos) setFlexVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteFlex', JSON.stringify(favoriteFlex));
  }, [favoriteFlex]);
  useEffect(() => {
    localStorage.setItem('doneFlex', JSON.stringify(doneFlex));
  }, [doneFlex]);
  useEffect(() => {
    localStorage.setItem('flexVideoCache', JSON.stringify(flexVideo));
  }, [flexVideo]);

  // Agility favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteAgility');
    if (fav) setFavoriteAgility(JSON.parse(fav));
    const done = localStorage.getItem('doneAgility');
    if (done) setDoneAgility(JSON.parse(done));
    const cachedVideos = localStorage.getItem('agilityVideoCache');
    if (cachedVideos) setAgilityVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteAgility', JSON.stringify(favoriteAgility));
  }, [favoriteAgility]);
  useEffect(() => {
    localStorage.setItem('doneAgility', JSON.stringify(doneAgility));
  }, [doneAgility]);
  useEffect(() => {
    localStorage.setItem('agilityVideoCache', JSON.stringify(agilityVideo));
  }, [agilityVideo]);

  // Strength favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteStrength');
    if (fav) setFavoriteStrength(JSON.parse(fav));
    const done = localStorage.getItem('doneStrength');
    if (done) setDoneStrength(JSON.parse(done));
    const cachedVideos = localStorage.getItem('strengthVideoCache');
    if (cachedVideos) setStrengthVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteStrength', JSON.stringify(favoriteStrength));
  }, [favoriteStrength]);
  useEffect(() => {
    localStorage.setItem('doneStrength', JSON.stringify(doneStrength));
  }, [doneStrength]);
  useEffect(() => {
    localStorage.setItem('strengthVideoCache', JSON.stringify(strengthVideo));
  }, [strengthVideo]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && timerRunning) {
      setTimerRunning(false);
      setTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, timerRunning]);
  useEffect(() => {
    if (selectedExercise) {
      setTimer(selectedExercise.recommendedDuration || 30);
      setTimerRunning(false);
      setTimerEnded(false);
    }
  }, [selectedExercise]);

  // Flex timer logic
  useEffect(() => {
    if (flexTimerRunning && flexTimer > 0) {
      flexTimerRef.current = setTimeout(() => setFlexTimer(flexTimer - 1), 1000);
    } else if (flexTimer === 0 && flexTimerRunning) {
      setFlexTimerRunning(false);
      setFlexTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (flexTimerRef.current) clearTimeout(flexTimerRef.current); };
  }, [flexTimer, flexTimerRunning]);
  useEffect(() => {
    if (selectedExercise && selectedExercise.category === 'flexibility') {
      setFlexTimer(selectedExercise.recommendedDuration || 30);
      setFlexTimerRunning(false);
      setFlexTimerEnded(false);
    }
  }, [selectedExercise]);

  // Agility timer logic
  useEffect(() => {
    if (agilityTimerRunning && agilityTimer > 0) {
      agilityTimerRef.current = setTimeout(() => setAgilityTimer(agilityTimer - 1), 1000);
    } else if (agilityTimer === 0 && agilityTimerRunning) {
      setAgilityTimerRunning(false);
      setAgilityTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (agilityTimerRef.current) clearTimeout(agilityTimerRef.current); };
  }, [agilityTimer, agilityTimerRunning]);
  useEffect(() => {
    if (selectedExercise && selectedExercise.category === 'agility') {
      setAgilityTimer(selectedExercise.recommendedDuration || 30);
      setAgilityTimerRunning(false);
      setAgilityTimerEnded(false);
    }
  }, [selectedExercise]);

  // Strength timer logic
  useEffect(() => {
    if (strengthTimerRunning && strengthTimer > 0) {
      strengthTimerRef.current = setTimeout(() => setStrengthTimer(strengthTimer - 1), 1000);
    } else if (strengthTimer === 0 && strengthTimerRunning) {
      setStrengthTimerRunning(false);
      setStrengthTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (strengthTimerRef.current) clearTimeout(strengthTimerRef.current); };
  }, [strengthTimer, strengthTimerRunning]);
  useEffect(() => {
    if (selectedExercise && selectedExercise.category === 'strength') {
      setStrengthTimer(selectedExercise.recommendedDuration || 30);
      setStrengthTimerRunning(false);
      setStrengthTimerEnded(false);
    }
  }, [selectedExercise]);

  // Cardio search filter
  const filteredCardio = cardioDrills.filter(drill =>
    drill.name.toLowerCase().includes(cardioSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(cardioSearch.toLowerCase())))
  );

  // Flexibility search filter
  const filteredFlex = flexibilityDrills.filter(drill =>
    drill.name.toLowerCase().includes(flexSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(flexSearch.toLowerCase())))
  );

  // Agility search filter
  const filteredAgility = agilityDrills.filter(drill =>
    drill.name.toLowerCase().includes(agilitySearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(agilitySearch.toLowerCase())))
  );

  // Strength search filter
  const filteredStrength = strengthDrills.filter(drill =>
    drill.name.toLowerCase().includes(strengthSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(strengthSearch.toLowerCase())))
  );

  // Favorite/Done logic
  const toggleFavorite = (id: string) => {
    setFavoriteCardio(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const toggleDone = (id: string) => {
    setDoneCardio(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isFavorite = (id: string) => favoriteCardio.includes(id);
  const isDone = (id: string) => doneCardio.includes(id);

  // Favorite/Done logic for Flexibility
  const toggleFavoriteFlex = (id: string) => {
    setFavoriteFlex(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const toggleDoneFlex = (id: string) => {
    setDoneFlex(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isFavoriteFlex = (id: string) => favoriteFlex.includes(id);
  const isDoneFlex = (id: string) => doneFlex.includes(id);

  // Favorite/Done logic for Agility
  const toggleFavoriteAgility = (id: string) => {
    setFavoriteAgility(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const toggleDoneAgility = (id: string) => {
    setDoneAgility(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isFavoriteAgility = (id: string) => favoriteAgility.includes(id);
  const isDoneAgility = (id: string) => doneAgility.includes(id);

  // Favorite/Done logic for Strength
  const toggleFavoriteStrength = (id: string) => {
    setFavoriteStrength(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const toggleDoneStrength = (id: string) => {
    setDoneStrength(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isFavoriteStrength = (id: string) => favoriteStrength.includes(id);
  const isDoneStrength = (id: string) => doneStrength.includes(id);

  // Fetch YouTube video for a drill (with fallback)
  const fetchCardioVideo = async (drill: Exercise) => {
    setVideoLoading(true);
    setVideoError(false);
    let found = '';
    try {
      const cache = cardioVideo[drill.id];
      if (cache) {
        setVideoLoading(false);
        return;
      }
      const res = await searchYouTubeVideos(drill.name);
      for (const item of res.items) {
        if (item.id.videoId) {
          found = item.id.videoId;
          break;
        }
      }
      if (!found && res.items.length > 0) {
        found = res.items[0].id.videoId;
      }
      if (found) {
        setCardioVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setVideoError(true);
      }
    } catch {
      setVideoError(true);
    }
    setVideoLoading(false);
  };

  // Fetch YouTube video for a drill (with fallback) for Flexibility
  const fetchFlexVideo = async (drill: Exercise) => {
    setFlexVideoLoading(true);
    setFlexVideoError(false);
    let found = '';
    try {
      const cache = flexVideo[drill.id];
      if (cache) {
        setFlexVideoLoading(false);
        return;
      }
      const res = await searchYouTubeVideos(drill.name);
      for (const item of res.items) {
        if (item.id.videoId) {
          found = item.id.videoId;
          break;
        }
      }
      if (!found && res.items.length > 0) {
        found = res.items[0].id.videoId;
      }
      if (found) {
        setFlexVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setFlexVideoError(true);
      }
    } catch {
      setFlexVideoError(true);
    }
    setFlexVideoLoading(false);
  };

  // Fetch YouTube video for a drill (with fallback) for Agility
  const fetchAgilityVideo = async (drill: Exercise) => {
    setAgilityVideoLoading(true);
    setAgilityVideoError(false);
    let found = '';
    try {
      const cache = agilityVideo[drill.id];
      if (cache) {
        setAgilityVideoLoading(false);
        return;
      }
      const res = await searchYouTubeVideos(drill.name);
      for (const item of res.items) {
        if (item.id.videoId) {
          found = item.id.videoId;
          break;
        }
      }
      if (!found && res.items.length > 0) {
        found = res.items[0].id.videoId;
      }
      if (found) {
        setAgilityVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setAgilityVideoError(true);
      }
    } catch {
      setAgilityVideoError(true);
    }
    setAgilityVideoLoading(false);
  };

  // Fetch YouTube video for a strength drill (with fallback)
  const fetchStrengthVideo = async (drill: Exercise) => {
    setStrengthVideoLoading(true);
    setStrengthVideoError(false);
    let found = '';
    try {
      const cache = strengthVideo[drill.id];
      if (cache) {
        setStrengthVideoLoading(false);
        return;
      }
      const res = await searchYouTubeVideos(drill.name);
      for (const item of res.items) {
        if (item.id.videoId) {
          found = item.id.videoId;
          break;
        }
      }
      if (!found && res.items.length > 0) {
        found = res.items[0].id.videoId;
      }
      if (found) {
        setStrengthVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setStrengthVideoError(true);
      }
    } catch {
      setStrengthVideoError(true);
    }
    setStrengthVideoLoading(false);
  };

  // Cardio accent icon
  const CardioIcon = () => <Heart size={18} className="text-red-500" />;

  // Flexibility accent icon
  const FlexAccentIcon = () => <Stretch size={18} className="text-green-500" />;

  // Agility accent icon
  const AgilityAccentIcon = () => <Zap size={18} className="text-purple-500" />;

  // Strength accent icon
  const StrengthAccentIcon = () => <Dumbbell size={18} className="text-blue-500" />;

  const categories = [
    { id: 'all', name: 'All Exercises', icon: Dumbbell },
    { id: 'strength', name: 'Strength', icon: Dumbbell },
    { id: 'cardio', name: 'Cardio', icon: Heart },
    { id: 'agility', name: 'Agility', icon: Zap },
    { id: 'flexibility', name: 'Flexibility', icon: Stretch }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

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
    return categoryConfig?.icon || Dumbbell;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-blue-100 text-blue-600';
      case 'cardio': return 'bg-red-100 text-red-600';
      case 'agility': return 'bg-purple-100 text-purple-600';
      case 'flexibility': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // UI rendering
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exercise Library</h2>
        <p className="text-gray-600">Build strength, improve conditioning, and enhance your basketball performance</p>
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
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
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

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => {
          const Icon = getCategoryIcon(exercise.category);
          return (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(exercise.category)}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{exercise.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{exercise.duration} min</span>
                </div>
                {exercise.equipment && (
                  <div className="text-sm text-gray-500">
                    {exercise.equipment.length} items
                  </div>
                )}
              </div>
              
              <button className="w-full text-orange-600 hover:text-orange-700 text-sm font-medium text-left">
                View Instructions →
              </button>
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && selectedExercise.category !== 'cardio' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(selectedExercise.category)}`}>
                  {React.createElement(getCategoryIcon(selectedExercise.category), { size: 24 })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedExercise.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 capitalize">{selectedExercise.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-gray-600">{selectedExercise.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target size={18} className="text-gray-400" />
                  <span className="text-gray-600 capitalize">{selectedExercise.difficulty}</span>
                </div>
              </div>
              
              {selectedExercise.equipment && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Equipment Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.equipment.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                <ol className="space-y-3">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === 'flexibility' && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Stretch size={20} className="text-green-600" />
            <h3 className="text-xl font-semibold text-green-700">Flexibility Drills</h3>
          </div>
          {/* Daily Flexibility Drill */}
          {dailyFlex && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-green-200 to-blue-100 text-green-900 shadow flex items-center justify-between">
              <div>
                <div className="font-bold text-base mb-1">Today's Flexibility Drill</div>
                <div className="font-semibold">{dailyFlex.name}</div>
                <div className="text-sm opacity-80">{dailyFlex.instructions?.[0]}</div>
              </div>
              <button
                className={`ml-2 ${isFavoriteFlex(dailyFlex.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteFlex(dailyFlex.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteFlex(dailyFlex.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
          )}
          {/* Flexibility Search Bar */}
          <div className="flex items-center mb-4">
            <input
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
              type="text"
              placeholder="Search flexibility drills..."
              value={flexSearch}
              onChange={e => setFlexSearch(e.target.value)}
            />
            <span className="bg-green-600 text-white px-3 py-2 rounded-r">
              <Search size={18} />
            </span>
          </div>
          {/* Flexibility Drills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlex.map(drill => (
              <div
                key={drill.id}
                onClick={() => { setSelectedExercise(drill); fetchFlexVideo(drill); }}
                className={`bg-white rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all cursor-pointer relative ${isDoneFlex(drill.id) ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${FLEX_COLOR}`}>
                      <Stretch size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                      <p className="text-sm text-gray-600">Flexibility</p>
                    </div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteFlex(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={e => { e.stopPropagation(); toggleFavoriteFlex(drill.id); }}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteFlex(drill.id) ? 'currentColor' : 'none'} size={20} />
                  </button>
                </div>
                <div className="mb-2 text-gray-700 text-sm">{drill.description}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} />
                  <span>{drill.recommendedDuration ? `${drill.recommendedDuration}s` : `${drill.duration} min`}</span>
                  {drill.reps && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{drill.reps}</span>}
                </div>
                <button className="w-full text-green-600 hover:text-green-700 text-sm font-medium text-left">
                  View Details →
                </button>
                {isDoneFlex(drill.id) && (
                  <CheckCircle size={20} className="absolute top-2 right-2 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'agility' && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-purple-600" />
            <h3 className="text-xl font-semibold text-purple-700">Agility Drills</h3>
          </div>
          {/* Daily Agility Drill */}
          {dailyAgility && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-purple-200 to-yellow-100 text-purple-900 shadow flex items-center justify-between">
              <div>
                <div className="font-bold text-base mb-1">Today's Agility Drill</div>
                <div className="font-semibold">{dailyAgility.name}</div>
                <div className="text-sm opacity-80">{dailyAgility.instructions?.[0]}</div>
              </div>
              <button
                className={`ml-2 ${isFavoriteAgility(dailyAgility.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteAgility(dailyAgility.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteAgility(dailyAgility.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
          )}
          {/* Agility Search Bar */}
          <div className="flex items-center mb-4">
            <input
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
              type="text"
              placeholder="Search agility drills..."
              value={agilitySearch}
              onChange={e => setAgilitySearch(e.target.value)}
            />
            <span className="bg-purple-600 text-white px-3 py-2 rounded-r">
              <Search size={18} />
            </span>
          </div>
          {/* Agility Drills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgility.map(drill => (
              <div
                key={drill.id}
                onClick={() => { setSelectedExercise(drill); fetchAgilityVideo(drill); }}
                className={`bg-white rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all cursor-pointer relative ${isDoneAgility(drill.id) ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${AGILITY_COLOR}`}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                      <p className="text-sm text-gray-600">Agility</p>
                    </div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteAgility(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={e => { e.stopPropagation(); toggleFavoriteAgility(drill.id); }}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteAgility(drill.id) ? 'currentColor' : 'none'} size={20} />
                  </button>
                </div>
                <div className="mb-2 text-gray-700 text-sm">{drill.description}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} />
                  <span>{drill.recommendedDuration ? `${drill.recommendedDuration}s` : `${drill.duration} min`}</span>
                  {drill.reps && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{drill.reps}</span>}
                </div>
                <button className="w-full text-purple-600 hover:text-purple-700 text-sm font-medium text-left">
                  View Details →
                </button>
                {isDoneAgility(drill.id) && (
                  <CheckCircle size={20} className="absolute top-2 right-2 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategory === 'strength' && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell size={20} className="text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-700">Strength Drills</h3>
          </div>
          {/* Daily Strength Drill */}
          {dailyStrength && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-200 to-indigo-100 text-blue-900 shadow flex items-center justify-between">
              <div>
                <div className="font-bold text-base mb-1">Today's Strength Drill</div>
                <div className="font-semibold">{dailyStrength.name}</div>
                <div className="text-sm opacity-80">{dailyStrength.instructions?.[0]}</div>
              </div>
              <button
                className={`ml-2 ${isFavoriteStrength(dailyStrength.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteStrength(dailyStrength.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteStrength(dailyStrength.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
          )}
          {/* Strength Search Bar */}
          <div className="flex items-center mb-4">
            <input
              className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
              type="text"
              placeholder="Search strength drills..."
              value={strengthSearch}
              onChange={e => setStrengthSearch(e.target.value)}
            />
            <span className="bg-blue-600 text-white px-3 py-2 rounded-r">
              <Search size={18} />
            </span>
          </div>
          {/* Strength Drills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStrength.map(drill => (
              <div
                key={drill.id}
                onClick={() => { setSelectedExercise(drill); fetchStrengthVideo(drill); }}
                className={`bg-white rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all cursor-pointer relative ${isDoneStrength(drill.id) ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor('strength')}`}>
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{drill.name}</h3>
                      <p className="text-sm text-gray-600">Strength</p>
                    </div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteStrength(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={e => { e.stopPropagation(); toggleFavoriteStrength(drill.id); }}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteStrength(drill.id) ? 'currentColor' : 'none'} size={20} />
                  </button>
                </div>
                <div className="mb-2 text-gray-700 text-sm">{drill.description}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} />
                  <span>{drill.recommendedDuration ? `${drill.recommendedDuration}s` : `${drill.duration} min`}</span>
                  {drill.reps && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{drill.reps}</span>}
                </div>
                <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium text-left">
                  View Details →
                </button>
                {isDoneStrength(drill.id) && (
                  <CheckCircle size={20} className="absolute top-2 right-2 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedExercise && selectedExercise.category === 'flexibility' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedExercise(null)}
              aria-label="Close"
            >✕</button>
            <div className="flex items-center gap-3 mb-4">
              <Stretch size={22} className="text-green-600" />
              <h3 className="text-xl font-semibold text-green-700">{selectedExercise.name}</h3>
              <button
                className={`ml-2 ${isFavoriteFlex(selectedExercise.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteFlex(selectedExercise.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteFlex(selectedExercise.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
            <div className="mb-2 text-gray-700 text-base">{selectedExercise.description}</div>
            {/* YouTube Video */}
            <div className="mb-4">
              {flexVideoLoading ? (
                <div className="flex items-center gap-2 text-gray-500"><Video size={20} className="animate-pulse" /> Loading video...</div>
              ) : flexVideo[selectedExercise.id] ? (
                <div className="w-full aspect-video mb-2">
                  <iframe
                    className="w-full h-60 rounded"
                    src={`https://www.youtube.com/embed/${flexVideo[selectedExercise.id]}`}
                    title={selectedExercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : flexVideoError ? (
                <div className="text-red-500">No video available. See instructions below.</div>
              ) : (
                <button
                  className="bg-green-100 text-green-700 px-3 py-2 rounded flex items-center gap-2"
                  onClick={() => fetchFlexVideo(selectedExercise)}
                >
                  <Video size={18} /> Load Tutorial Video
                </button>
              )}
            </div>
            {/* Timer */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 bg-green-100 rounded-full hover:bg-green-200"
                  onClick={() => { setFlexTimerRunning(!flexTimerRunning); setFlexTimerEnded(false); }}
                  aria-label={flexTimerRunning ? 'Pause' : 'Start'}
                >
                  {flexTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => { setFlexTimer(selectedExercise.recommendedDuration || 30); setFlexTimerRunning(false); setFlexTimerEnded(false); }}
                  aria-label="Reset"
                >
                  <RotateCcw size={20} />
                </button>
                <span className={`text-2xl font-mono w-16 text-center ${flexTimerEnded ? 'text-green-600 animate-pulse' : 'text-gray-900'}`}>{flexTimer}s</span>
              </div>
              {flexTimerEnded && <span className="text-green-600 font-semibold animate-bounce">Done!</span>}
            </div>
            {/* Instructions */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selectedExercise.instructions?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Reps/Duration */}
            {selectedExercise.reps && (
              <div className="mb-2 text-sm text-green-700 font-semibold">Recommended: {selectedExercise.reps}</div>
            )}
            {/* Tips */}
            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {selectedExercise.tips.map((tip, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Mark as Done */}
            <button
              className={`mt-4 w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${isDoneFlex(selectedExercise.id) ? 'bg-green-200 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={() => toggleDoneFlex(selectedExercise.id)}
            >
              <CheckCircle size={20} /> {isDoneFlex(selectedExercise.id) ? 'Marked as Done' : 'Mark as Done'}
            </button>
          </div>
        </div>
      )}

      {selectedExercise && selectedExercise.category === 'agility' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedExercise(null)}
              aria-label="Close"
            >✕</button>
            <div className="flex items-center gap-3 mb-4">
              <Zap size={22} className="text-purple-600" />
              <h3 className="text-xl font-semibold text-purple-700">{selectedExercise.name}</h3>
              <button
                className={`ml-2 ${isFavoriteAgility(selectedExercise.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteAgility(selectedExercise.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteAgility(selectedExercise.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
            <div className="mb-2 text-gray-700 text-base">{selectedExercise.description}</div>
            {/* YouTube Video */}
            <div className="mb-4">
              {agilityVideoLoading ? (
                <div className="flex items-center gap-2 text-gray-500"><Video size={20} className="animate-pulse" /> Loading video...</div>
              ) : agilityVideo[selectedExercise.id] ? (
                <div className="w-full aspect-video mb-2">
                  <iframe
                    className="w-full h-60 rounded"
                    src={`https://www.youtube.com/embed/${agilityVideo[selectedExercise.id]}`}
                    title={selectedExercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : agilityVideoError ? (
                <div className="text-red-500">No video available. See instructions below.</div>
              ) : (
                <button
                  className="bg-purple-100 text-purple-700 px-3 py-2 rounded flex items-center gap-2"
                  onClick={() => fetchAgilityVideo(selectedExercise)}
                >
                  <Video size={18} /> Load Tutorial Video
                </button>
              )}
            </div>
            {/* Timer */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 bg-purple-100 rounded-full hover:bg-purple-200"
                  onClick={() => { setAgilityTimerRunning(!agilityTimerRunning); setAgilityTimerEnded(false); }}
                  aria-label={agilityTimerRunning ? 'Pause' : 'Start'}
                >
                  {agilityTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => { setAgilityTimer(selectedExercise.recommendedDuration || 30); setAgilityTimerRunning(false); setAgilityTimerEnded(false); }}
                  aria-label="Reset"
                >
                  <RotateCcw size={20} />
                </button>
                <span className={`text-2xl font-mono w-16 text-center ${agilityTimerEnded ? 'text-purple-600 animate-pulse' : 'text-gray-900'}`}>{agilityTimer}s</span>
              </div>
              {agilityTimerEnded && <span className="text-purple-600 font-semibold animate-bounce">Done!</span>}
            </div>
            {/* Instructions */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selectedExercise.instructions?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Reps/Duration */}
            {selectedExercise.reps && (
              <div className="mb-2 text-sm text-purple-700 font-semibold">Recommended: {selectedExercise.reps}</div>
            )}
            {/* Tips */}
            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {selectedExercise.tips.map((tip, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Mark as Done */}
            <button
              className={`mt-4 w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${isDoneAgility(selectedExercise.id) ? 'bg-purple-200 text-purple-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              onClick={() => toggleDoneAgility(selectedExercise.id)}
            >
              <CheckCircle size={20} /> {isDoneAgility(selectedExercise.id) ? 'Marked as Done' : 'Mark as Done'}
            </button>
          </div>
        </div>
      )}

      {selectedExercise && selectedExercise.category === 'strength' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSelectedExercise(null)}
              aria-label="Close"
            >✕</button>
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell size={22} className="text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-700">{selectedExercise.name}</h3>
              <button
                className={`ml-2 ${isFavoriteStrength(selectedExercise.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => toggleFavoriteStrength(selectedExercise.id)}
                aria-label="Favorite"
              >
                <Star fill={isFavoriteStrength(selectedExercise.id) ? 'currentColor' : 'none'} size={22} />
              </button>
            </div>
            <div className="mb-2 text-gray-700 text-base">{selectedExercise.description}</div>
            {/* YouTube Video */}
            <div className="mb-4">
              {strengthVideoLoading ? (
                <div className="flex items-center gap-2 text-gray-500"><Video size={20} className="animate-pulse" /> Loading video...</div>
              ) : strengthVideo[selectedExercise.id] ? (
                <div className="w-full aspect-video mb-2">
                  <iframe
                    className="w-full h-60 rounded"
                    src={`https://www.youtube.com/embed/${strengthVideo[selectedExercise.id]}`}
                    title={selectedExercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : strengthVideoError ? (
                <div className="text-red-500">No video available. See instructions below.</div>
              ) : (
                <button
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center gap-2"
                  onClick={() => fetchStrengthVideo(selectedExercise)}
                >
                  <Video size={18} /> Load Tutorial Video
                </button>
              )}
            </div>
            {/* Timer */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
                  onClick={() => { setStrengthTimerRunning(!strengthTimerRunning); setStrengthTimerEnded(false); }}
                  aria-label={strengthTimerRunning ? 'Pause' : 'Start'}
                >
                  {strengthTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => { setStrengthTimer(selectedExercise.recommendedDuration || 30); setStrengthTimerRunning(false); setStrengthTimerEnded(false); }}
                  aria-label="Reset"
                >
                  <RotateCcw size={20} />
                </button>
                <span className={`text-2xl font-mono w-16 text-center ${strengthTimerEnded ? 'text-blue-600 animate-pulse' : 'text-gray-900'}`}>{strengthTimer}s</span>
              </div>
              {strengthTimerEnded && <span className="text-blue-600 font-semibold animate-bounce">Done!</span>}
            </div>
            {/* Instructions */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selectedExercise.instructions?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Reps/Duration */}
            {selectedExercise.reps && (
              <div className="mb-2 text-sm text-blue-700 font-semibold">Recommended: {selectedExercise.reps}</div>
            )}
            {/* Tips */}
            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {selectedExercise.tips.map((tip, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Mark as Done */}
            <button
              className={`mt-4 w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${isDoneStrength(selectedExercise.id) ? 'bg-blue-200 text-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={() => toggleDoneStrength(selectedExercise.id)}
            >
              <CheckCircle size={20} /> {isDoneStrength(selectedExercise.id) ? 'Marked as Done' : 'Mark as Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;