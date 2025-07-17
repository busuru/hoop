import React, { useState, useEffect, useRef } from 'react';
import { StretchVertical as StretchIcon, Filter, Clock, Target, Star, Search, ArrowLeft, Play, Pause, RotateCcw, Video } from 'lucide-react';
import { stretches } from '../data/basketballData';
import { Stretch } from '../types';
import { searchYouTubeVideos } from '../services/youtubeApi';

const StretchingRoutines: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStretch, setSelectedStretch] = useState<Stretch | null>(null);
  const [showWarmupModal, setShowWarmupModal] = useState(false);

  // Add state for general stretch features
  const [favoriteStretches, setFavoriteStretches] = useState<string[]>([]);
  const [doneStretches, setDoneStretches] = useState<string[]>([]);
  const [stretchVideo, setStretchVideo] = useState<{[id: string]: string}>({});
  const [stretchVideoLoading, setStretchVideoLoading] = useState(false);
  const [stretchVideoError, setStretchVideoError] = useState(false);
  const [stretchTimer, setStretchTimer] = useState<number>(0);
  const [stretchTimerRunning, setStretchTimerRunning] = useState(false);
  const [stretchTimerEnded, setStretchTimerEnded] = useState(false);
  const stretchTimerRef = useRef<any>(null);
  const [stretchSearch, setStretchSearch] = useState('');
  const [dailyStretch, setDailyStretch] = useState<Stretch | null>(null);
  const [warmupSearch, setWarmupSearch] = useState('');
  const [selectedWarmupDrill, setSelectedWarmupDrill] = useState<Stretch | null>(null);
  const [favoriteWarmupDrills, setFavoriteWarmupDrills] = useState<string[]>([]);
  const [dailyWarmupDrill, setDailyWarmupDrill] = useState<Stretch | null>(null);

  // Timer state for drill detail
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<any>(null); // Use 'any' for browser compatibility
  const [timerEnded, setTimerEnded] = useState(false);

  // 1. Add state for doneWarmupDrills
  const [doneWarmupDrills, setDoneWarmupDrills] = useState<string[]>([]);

  // 2. Load done drills from localStorage
  useEffect(() => {
    const done = localStorage.getItem('doneWarmupDrills');
    if (done) setDoneWarmupDrills(JSON.parse(done));
  }, []);

  // 2. Load general stretch favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteStretches');
    if (fav) setFavoriteStretches(JSON.parse(fav));
    const done = localStorage.getItem('doneStretches');
    if (done) setDoneStretches(JSON.parse(done));
  }, []);
  useEffect(() => {
    localStorage.setItem('doneWarmupDrills', JSON.stringify(doneWarmupDrills));
  }, [doneWarmupDrills]);

  // 3. Mark as Done logic
  const toggleDoneWarmupDrill = (id: string) => {
    setDoneWarmupDrills(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isDoneWarmupDrill = (id: string) => doneWarmupDrills.includes(id);

  // 1. Add state for cool-down modal and features
  const [showCooldownModal, setShowCooldownModal] = useState(false);
  const [cooldownSearch, setCooldownSearch] = useState('');
  const [selectedCooldownDrill, setSelectedCooldownDrill] = useState<Stretch | null>(null);
  const [favoriteCooldownDrills, setFavoriteCooldownDrills] = useState<string[]>([]);
  const [doneCooldownDrills, setDoneCooldownDrills] = useState<string[]>([]);
  const [dailyCooldownDrill, setDailyCooldownDrill] = useState<Stretch | null>(null);
  const [cooldownTimer, setCooldownTimer] = useState<number>(0);
  const [cooldownTimerRunning, setCooldownTimerRunning] = useState(false);
  const [cooldownTimerEnded, setCooldownTimerEnded] = useState(false);
  const cooldownTimerRef = useRef<any>(null);

  // 1. Add state for YouTube video for cool-down drills
  const [cooldownVideo, setCooldownVideo] = useState<{[id: string]: string}>({});
  const [cooldownVideoLoading, setCooldownVideoLoading] = useState(false);
  const [cooldownVideoError, setCooldownVideoError] = useState(false);

  // 1. Add state for maintenance modal and features
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [selectedMaintenanceDrill, setSelectedMaintenanceDrill] = useState<Stretch | null>(null);
  const [favoriteMaintenanceDrills, setFavoriteMaintenanceDrills] = useState<string[]>([]);
  const [doneMaintenanceDrills, setDoneMaintenanceDrills] = useState<string[]>([]);
  const [dailyMaintenanceDrill, setDailyMaintenanceDrill] = useState<Stretch | null>(null);
  const [maintenanceTimer, setMaintenanceTimer] = useState<number>(0);
  const [maintenanceTimerRunning, setMaintenanceTimerRunning] = useState(false);
  const [maintenanceTimerEnded, setMaintenanceTimerEnded] = useState(false);
  const maintenanceTimerRef = useRef<any>(null);

  // 1. Add state for YouTube video for maintenance drills
  const [maintenanceVideo, setMaintenanceVideo] = useState<{[id: string]: string}>({});
  const [maintenanceVideoLoading, setMaintenanceVideoLoading] = useState(false);
  const [maintenanceVideoError, setMaintenanceVideoError] = useState(false);

  // 2. Load cached video IDs from localStorage
  useEffect(() => {
    const cachedVideos = localStorage.getItem('cooldownVideoCache');
    if (cachedVideos) setCooldownVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('cooldownVideoCache', JSON.stringify(cooldownVideo));
  }, [cooldownVideo]);

  // 2. Load cached maintenance video IDs from localStorage
  useEffect(() => {
    const cachedVideos = localStorage.getItem('maintenanceVideoCache');
    if (cachedVideos) setMaintenanceVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('maintenanceVideoCache', JSON.stringify(maintenanceVideo));
  }, [maintenanceVideo]);

  // 2. Load cached general stretch video IDs from localStorage
  useEffect(() => {
    const cachedVideos = localStorage.getItem('stretchVideoCache');
    if (cachedVideos) setStretchVideo(JSON.parse(cachedVideos));
  }, []);
  useEffect(() => {
    localStorage.setItem('stretchVideoCache', JSON.stringify(stretchVideo));
  }, [stretchVideo]);

  // 3. Fetch YouTube video for a cool-down drill (with fallback)
  const fetchCooldownVideo = async (drill: Stretch) => {
    setCooldownVideoLoading(true);
    setCooldownVideoError(false);
    let found = '';
    try {
      const cache = cooldownVideo[drill.id];
      if (cache) {
        setCooldownVideoLoading(false);
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
        setCooldownVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setCooldownVideoError(true);
      }
    } catch {
      setCooldownVideoError(true);
    }
    setCooldownVideoLoading(false);
  };

  // 3. Fetch YouTube video for a maintenance drill (with fallback)
  const fetchMaintenanceVideo = async (drill: Stretch) => {
    setMaintenanceVideoLoading(true);
    setMaintenanceVideoError(false);
    let found = '';
    try {
      const cache = maintenanceVideo[drill.id];
      if (cache) {
        setMaintenanceVideoLoading(false);
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
        setMaintenanceVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setMaintenanceVideoError(true);
      }
    } catch {
      setMaintenanceVideoError(true);
    }
    setMaintenanceVideoLoading(false);
  };

  // 3. Fetch YouTube video for a general stretch (with fallback)
  const fetchStretchVideo = async (drill: Stretch) => {
    setStretchVideoLoading(true);
    setStretchVideoError(false);
    let found = '';
    try {
      const cache = stretchVideo[drill.id];
      if (cache) {
        setStretchVideoLoading(false);
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
        setStretchVideo(v => ({ ...v, [drill.id]: found }));
      } else {
        setStretchVideoError(true);
      }
    } catch {
      setStretchVideoError(true);
    }
    setStretchVideoLoading(false);
  };

  // 2. Get all cool-down stretches
  const cooldownDrills = stretches.filter(s => s.type === 'cool-down');

  // 2. Get all maintenance stretches
  const maintenanceDrills = stretches.filter(s => s.type === 'maintenance');

  // 3. Daily cool-down drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyCooldownDrill');
    const storedDate = localStorage.getItem('dailyCooldownDrillDate');
    if (stored && storedDate === today) {
      setDailyCooldownDrill(JSON.parse(stored));
    } else {
      const randomDrill = cooldownDrills[Math.floor(Math.random() * cooldownDrills.length)];
      setDailyCooldownDrill(randomDrill);
      localStorage.setItem('dailyCooldownDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyCooldownDrillDate', today);
    }
  }, [cooldownDrills.length]);

  // 3. Daily maintenance drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyMaintenanceDrill');
    const storedDate = localStorage.getItem('dailyMaintenanceDrillDate');
    if (stored && storedDate === today) {
      setDailyMaintenanceDrill(JSON.parse(stored));
    } else {
      const randomDrill = maintenanceDrills[Math.floor(Math.random() * maintenanceDrills.length)];
      setDailyMaintenanceDrill(randomDrill);
      localStorage.setItem('dailyMaintenanceDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyMaintenanceDrillDate', today);
    }
  }, [maintenanceDrills.length]);

  // 3. Daily stretch logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyStretch');
    const storedDate = localStorage.getItem('dailyStretchDate');
    if (stored && storedDate === today) {
      setDailyStretch(JSON.parse(stored));
    } else {
      const randomStretch = stretches[Math.floor(Math.random() * stretches.length)];
      setDailyStretch(randomStretch);
      localStorage.setItem('dailyStretch', JSON.stringify(randomStretch));
      localStorage.setItem('dailyStretchDate', today);
    }
  }, [stretches.length]);

  // 4. Load favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteCooldownDrills');
    if (fav) setFavoriteCooldownDrills(JSON.parse(fav));
    const done = localStorage.getItem('doneCooldownDrills');
    if (done) setDoneCooldownDrills(JSON.parse(done));
  }, []);

  // 4. Load maintenance favorites/done from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteMaintenanceDrills');
    if (fav) setFavoriteMaintenanceDrills(JSON.parse(fav));
    const done = localStorage.getItem('doneMaintenanceDrills');
    if (done) setDoneMaintenanceDrills(JSON.parse(done));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteCooldownDrills', JSON.stringify(favoriteCooldownDrills));
  }, [favoriteCooldownDrills]);
  useEffect(() => {
    localStorage.setItem('doneCooldownDrills', JSON.stringify(doneCooldownDrills));
  }, [doneCooldownDrills]);

  // 4. Save maintenance favorites/done to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteMaintenanceDrills', JSON.stringify(favoriteMaintenanceDrills));
  }, [favoriteMaintenanceDrills]);
  useEffect(() => {
    localStorage.setItem('doneMaintenanceDrills', JSON.stringify(doneMaintenanceDrills));
  }, [doneMaintenanceDrills]);

  // 4. Save general stretch favorites/done to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteStretches', JSON.stringify(favoriteStretches));
  }, [favoriteStretches]);
  useEffect(() => {
    localStorage.setItem('doneStretches', JSON.stringify(doneStretches));
  }, [doneStretches]);

  // 5. Search filter for cool-down drills
  const filteredCooldownDrills = cooldownDrills.filter(drill =>
    drill.name.toLowerCase().includes(cooldownSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(cooldownSearch.toLowerCase())))
  );

  // 5. Search filter for maintenance drills
  const filteredMaintenanceDrills = maintenanceDrills.filter(drill =>
    drill.name.toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(maintenanceSearch.toLowerCase())))
  );

  // 6. Favorite/Done logic for cool-down
  const toggleFavoriteCooldownDrill = (id: string) => {
    setFavoriteCooldownDrills(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const isFavoriteCooldownDrill = (id: string) => favoriteCooldownDrills.includes(id);
  const toggleDoneCooldownDrill = (id: string) => {
    setDoneCooldownDrills(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isDoneCooldownDrill = (id: string) => doneCooldownDrills.includes(id);

  // 6. Favorite/Done logic for maintenance
  const toggleFavoriteMaintenanceDrill = (id: string) => {
    setFavoriteMaintenanceDrills(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const isFavoriteMaintenanceDrill = (id: string) => favoriteMaintenanceDrills.includes(id);
  const toggleDoneMaintenanceDrill = (id: string) => {
    setDoneMaintenanceDrills(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isDoneMaintenanceDrill = (id: string) => doneMaintenanceDrills.includes(id);

  // 6. Favorite/Done logic for general stretches
  const toggleFavoriteStretch = (id: string) => {
    setFavoriteStretches(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const isFavoriteStretch = (id: string) => favoriteStretches.includes(id);
  const toggleDoneStretch = (id: string) => {
    setDoneStretches(done => done.includes(id) ? done.filter(d => d !== id) : [...done, id]);
  };
  const isDoneStretch = (id: string) => doneStretches.includes(id);

  // 7. Timer logic for cool-down
  useEffect(() => {
    if (cooldownTimerRunning && cooldownTimer > 0) {
      cooldownTimerRef.current = setTimeout(() => setCooldownTimer(cooldownTimer - 1), 1000);
    } else if (cooldownTimer === 0 && cooldownTimerRunning) {
      setCooldownTimerRunning(false);
      setCooldownTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current); };
  }, [cooldownTimer, cooldownTimerRunning]);
  useEffect(() => {
    if (selectedCooldownDrill) {
      setCooldownTimer(selectedCooldownDrill.recommendedDuration || 30);
      setCooldownTimerRunning(false);
      setCooldownTimerEnded(false);
    }
  }, [selectedCooldownDrill]);

  // 7. Timer logic for maintenance
  useEffect(() => {
    if (maintenanceTimerRunning && maintenanceTimer > 0) {
      maintenanceTimerRef.current = setTimeout(() => setMaintenanceTimer(maintenanceTimer - 1), 1000);
    } else if (maintenanceTimer === 0 && maintenanceTimerRunning) {
      setMaintenanceTimerRunning(false);
      setMaintenanceTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (maintenanceTimerRef.current) clearTimeout(maintenanceTimerRef.current); };
  }, [maintenanceTimer, maintenanceTimerRunning]);
  useEffect(() => {
    if (selectedMaintenanceDrill) {
      setMaintenanceTimer(selectedMaintenanceDrill.recommendedDuration || 30);
      setMaintenanceTimerRunning(false);
      setMaintenanceTimerEnded(false);
    }
  }, [selectedMaintenanceDrill]);

  // 7. Timer logic for general stretches
  useEffect(() => {
    if (stretchTimerRunning && stretchTimer > 0) {
      stretchTimerRef.current = setTimeout(() => setStretchTimer(stretchTimer - 1), 1000);
    } else if (stretchTimer === 0 && stretchTimerRunning) {
      setStretchTimerRunning(false);
      setStretchTimerEnded(true);
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (stretchTimerRef.current) clearTimeout(stretchTimerRef.current); };
  }, [stretchTimer, stretchTimerRunning]);
  useEffect(() => {
    if (selectedStretch) {
      setStretchTimer(selectedStretch.recommendedDuration || 30);
      setStretchTimerRunning(false);
      setStretchTimerEnded(false);
    }
  }, [selectedStretch]);

  const types = [
    { id: 'all', name: 'All Stretches' },
    { id: 'warm-up', name: 'Warm-up' },
    { id: 'cool-down', name: 'Cool-down' },
    { id: 'maintenance', name: 'Maintenance' }
  ];

  // Get all warm-up stretches
  const warmupDrills = stretches.filter(s => s.type === 'warm-up');

  // Daily warm-up drill logic
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('dailyWarmupDrill');
    const storedDate = localStorage.getItem('dailyWarmupDrillDate');
    if (stored && storedDate === today) {
      setDailyWarmupDrill(JSON.parse(stored));
    } else {
      const randomDrill = warmupDrills[Math.floor(Math.random() * warmupDrills.length)];
      setDailyWarmupDrill(randomDrill);
      localStorage.setItem('dailyWarmupDrill', JSON.stringify(randomDrill));
      localStorage.setItem('dailyWarmupDrillDate', today);
    }
  }, [warmupDrills.length]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('favoriteWarmupDrills');
    if (stored) setFavoriteWarmupDrills(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem('favoriteWarmupDrills', JSON.stringify(favoriteWarmupDrills));
  }, [favoriteWarmupDrills]);

  // 2. Load done drills and cached videos from localStorage
  useEffect(() => {
    const done = localStorage.getItem('doneWarmupDrills');
    if (done) setDoneWarmupDrills(JSON.parse(done));
  }, []);
  useEffect(() => {
    localStorage.setItem('doneWarmupDrills', JSON.stringify(doneWarmupDrills));
  }, [doneWarmupDrills]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && timerRunning) {
      setTimerRunning(false);
      setTimerEnded(true);
      // Play beep
      const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      beep.play();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, timerRunning]);

  // When opening a drill, set timer to recommendedDuration
  useEffect(() => {
    if (selectedWarmupDrill) {
      setTimer(selectedWarmupDrill.recommendedDuration || 30);
      setTimerRunning(false);
      setTimerEnded(false);
    }
  }, [selectedWarmupDrill]);

  // Search filter for warm-up drills
  const filteredWarmupDrills = warmupDrills.filter(drill =>
    drill.name.toLowerCase().includes(warmupSearch.toLowerCase()) ||
    (drill.instructions && drill.instructions.some(instr => instr.toLowerCase().includes(warmupSearch.toLowerCase())))
  );

  // Favorite logic
  const toggleFavoriteWarmupDrill = (id: string) => {
    setFavoriteWarmupDrills(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };
  const isFavoriteWarmupDrill = (id: string) => favoriteWarmupDrills.includes(id);

  // 4. YouTube video fetch/fallback logic
  // This function is no longer needed as warmupVideo state and fetch logic are removed.
  // Keeping it here for now, but it will be removed in a subsequent edit.
  // const fetchWarmupVideo = async (drill: Stretch) => {
  //   setWarmupVideoLoading(true);
  //   setWarmupVideoError(false);
  //   let found = '';
  //   try {
  //     const cache = warmupVideo[drill.id];
  //     if (cache) {
  //       setWarmupVideoLoading(false);
  //       return;
  //     }
  //     const res = await searchYouTubeVideos(drill.name);
  //     for (const item of res.items) {
  //       if (item.id.videoId) {
  //         found = item.id.videoId;
  //         break;
  //       }
  //     }
  //     if (!found && res.items.length > 0) {
  //       found = res.items[0].id.videoId;
  //     }
  //     if (found) {
  //       setWarmupVideo(v => ({ ...v, [drill.id]: found }));
  //     } else {
  //       setWarmupVideoError(true);
  //     }
  //   } catch {
  //     setWarmupVideoError(true);
  //   }
  //   setWarmupVideoLoading(false);
  // };

  const filteredStretches = stretches.filter(stretch => {
    const typeMatch = selectedType === 'all' || stretch.type === selectedType;
    const searchMatch = !stretchSearch || 
      stretch.name.toLowerCase().includes(stretchSearch.toLowerCase()) ||
      stretch.targetAreas.some(area => area.toLowerCase().includes(stretchSearch.toLowerCase())) ||
      stretch.instructions.some(instruction => instruction.toLowerCase().includes(stretchSearch.toLowerCase())) ||
      (stretch.description && stretch.description.toLowerCase().includes(stretchSearch.toLowerCase()));
    return typeMatch && searchMatch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warm-up': return 'bg-orange-100 text-orange-700';
      case 'cool-down': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const groupedStretches = {
    'warm-up': filteredStretches.filter(s => s.type === 'warm-up'),
    'cool-down': filteredStretches.filter(s => s.type === 'cool-down'),
    'maintenance': filteredStretches.filter(s => s.type === 'maintenance')
  };

  const totalDuration = (stretches: Stretch[]) => {
    return stretches.reduce((sum, stretch) => sum + stretch.duration, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stretching Routines</h2>
        <p className="text-gray-600">Prevent injuries and improve flexibility with targeted stretching routines</p>
      </div>

      {/* Quick Start Routines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
              <StretchIcon size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pre-Game Warm-up</h3>
              <p className="text-sm text-gray-600">{Math.round(warmupDrills.reduce((sum, s) => sum + s.duration, 0))} minutes</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Prepare your body for intense basketball activity with dynamic stretches
          </p>
          <button
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            onClick={() => setShowWarmupModal(true)}
          >
            Start Routine
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <StretchIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Post-Game Recovery</h3>
              <p className="text-sm text-gray-600">{totalDuration(groupedStretches['cool-down'])} minutes</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Cool down and recover with gentle stretches to prevent soreness
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Start Routine
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <StretchIcon size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Daily Maintenance</h3>
              <p className="text-sm text-gray-600">{totalDuration(groupedStretches['maintenance'])} minutes</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Maintain flexibility and prevent stiffness with daily stretches
          </p>
          <button 
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setShowMaintenanceModal(true)}
          >
            Start Routine
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Filter by Type</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedType === type.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Search size={20} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Search Stretches</h3>
        </div>
        
        <div className="flex items-center">
          <input
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            type="text"
            placeholder="Search by name, target areas, or instructions..."
            value={stretchSearch}
            onChange={e => setStretchSearch(e.target.value)}
          />
          <span className="bg-orange-600 text-white px-4 py-2 rounded-r-lg">
            <Search size={18} />
          </span>
        </div>
      </div>

      {/* Daily Stretch */}
      {dailyStretch && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-200 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">Today's Featured Stretch</h3>
                <p className="text-purple-700 mb-4">Try this stretch to improve your flexibility today!</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-purple-600" />
                    <span className="text-sm text-purple-700">
                      {dailyStretch.recommendedDuration || 30}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-purple-600" />
                    <span className="text-sm text-purple-700">
                      {dailyStretch.targetAreas.length} target areas
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-semibold text-purple-900 text-lg mb-1">{dailyStretch.name}</h4>
                <p className="text-sm text-purple-700 mb-3">
                  {dailyStretch.description || dailyStretch.instructions[0]}
                </p>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  onClick={() => setSelectedStretch(dailyStretch)}
                >
                  Try This Stretch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stretches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStretches.map(stretch => (
          <div
            key={stretch.id}
            onClick={() => setSelectedStretch(stretch)}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer relative ${isDoneStretch(stretch.id) ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <StretchIcon size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {stretch.name}
                    {isDoneStretch(stretch.id) && <span className="ml-1 text-green-500" title="Completed">✓</span>}
                  </h3>
                  <p className="text-sm text-gray-600">Stretch</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(stretch.type)}`}>
                {stretch.type}
              </span>
                <button
                  className={`${isFavoriteStretch(stretch.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={e => { e.stopPropagation(); toggleFavoriteStretch(stretch.id); }}
                  aria-label="Favorite"
                >
                  <Star fill={isFavoriteStretch(stretch.id) ? 'currentColor' : 'none'} size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{stretch.recommendedDuration || stretch.duration * 60}s</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target size={16} />
                <span>{stretch.targetAreas.length} areas</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {stretch.targetAreas.slice(0, 3).map((area, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    {area}
                  </span>
                ))}
                {stretch.targetAreas.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{stretch.targetAreas.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <button className="w-full text-orange-600 hover:text-orange-700 text-sm font-medium text-left">
              View Instructions →
            </button>
            {isDoneStretch(stretch.id) && (
              <span className="absolute top-2 right-2 text-green-500" title="Completed">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Stretch Detail Modal */}
      {selectedStretch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <StretchIcon size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedStretch.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Stretch</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedStretch.type)}`}>
                      {selectedStretch.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`${isFavoriteStretch(selectedStretch.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => toggleFavoriteStretch(selectedStretch.id)}
                  aria-label="Favorite"
                >
                  <Star fill={isFavoriteStretch(selectedStretch.id) ? 'currentColor' : 'none'} size={22} />
                </button>
              <button
                onClick={() => setSelectedStretch(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Description */}
              {selectedStretch.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                  <p className="text-gray-700">{selectedStretch.description}</p>
                </div>
              )}
              
              {/* YouTube Video */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tutorial Video</h4>
                {stretchVideoLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 p-4 bg-gray-50 rounded-lg">
                    <Video size={20} className="animate-pulse" /> Loading video...
                  </div>
                ) : stretchVideo[selectedStretch.id] ? (
                  <div className="w-full aspect-video mb-2">
                    <iframe
                      className="w-full h-60 rounded"
                      src={`https://www.youtube.com/embed/${stretchVideo[selectedStretch.id]}`}
                      title={selectedStretch.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : stretchVideoError ? (
                  <div className="text-red-500 p-4 bg-red-50 rounded-lg">No video available. See instructions below.</div>
                ) : (
                  <button
                    className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-200 transition-colors"
                    onClick={() => fetchStretchVideo(selectedStretch)}
                  >
                    <Video size={18} /> Load Tutorial Video
                  </button>
                )}
              </div>
              
              {/* Duration & Timer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  <span className="text-gray-700 font-medium">Do this for {selectedStretch.recommendedDuration || 30} seconds</span>
                </div>
              </div>
              
              {/* Timer Component */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 bg-orange-100 rounded-full hover:bg-orange-200"
                    onClick={() => { setStretchTimerRunning(!stretchTimerRunning); setStretchTimerEnded(false); }}
                    aria-label={stretchTimerRunning ? 'Pause' : 'Start'}
                  >
                    {stretchTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    onClick={() => { setStretchTimer(selectedStretch.recommendedDuration || 30); setStretchTimerRunning(false); setStretchTimerEnded(false); }}
                    aria-label="Reset"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <span className={`text-2xl font-mono w-16 text-center ${stretchTimerEnded ? 'text-green-600 animate-pulse' : 'text-gray-900'}`}>{stretchTimer}s</span>
                </div>
                {stretchTimerEnded && <span className="text-green-600 font-semibold animate-bounce">Done!</span>}
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock size={18} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStretch.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target size={18} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStretch.targetAreas.length} target areas</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Target Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStretch.targetAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                <ol className="space-y-3">
                  {selectedStretch.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              {/* Tips */}
              {selectedStretch.tips && selectedStretch.tips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Coaching Tips</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {selectedStretch.tips.map((tip, index) => (
                      <li key={index} className="text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Mark as Done Button */}
              <div className="flex justify-end">
                <button
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    isDoneStretch(selectedStretch.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleDoneStretch(selectedStretch.id)}
                  aria-label="Mark as Done"
                >
                  {isDoneStretch(selectedStretch.id) ? <span>✓ Marked as Done</span> : <span>Mark as Done</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pre-Game Warm-up Modal */}
      {showWarmupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowWarmupModal(false); setSelectedWarmupDrill(null); }}
              aria-label="Close"
            >✕</button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pre-Game Warm-up Routine</h2>
              <p className="text-gray-600 mb-2">Get ready for action with these dynamic stretches.</p>
              {/* Daily Warm-up Drill */}
              {dailyWarmupDrill && (
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-orange-200 to-orange-100 text-orange-900 shadow flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base mb-1">Today's Drill</div>
                    <div className="font-semibold">{dailyWarmupDrill.name}</div>
                    <div className="text-sm opacity-80">{dailyWarmupDrill.instructions?.[0]}</div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteWarmupDrill(dailyWarmupDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => toggleFavoriteWarmupDrill(dailyWarmupDrill.id)}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteWarmupDrill(dailyWarmupDrill.id) ? 'currentColor' : 'none'} size={22} />
                  </button>
                </div>
              )}
              {/* Search Bar */}
              <div className="flex items-center mb-4">
                <input
                  className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
                  type="text"
                  placeholder="Search warm-up drills..."
                  value={warmupSearch}
                  onChange={e => setWarmupSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') {} }}
                />
                <span className="bg-orange-600 text-white px-3 py-2 rounded-r">
                  <Search size={18} />
                </span>
              </div>
            </div>
            {/* Warm-up Drills List */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {filteredWarmupDrills.map(drill => (
                <div
                  key={drill.id}
                  className={`bg-white rounded-xl shadow border border-orange-100 p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer relative ${isDoneWarmupDrill(drill.id) ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedWarmupDrill(drill)}
                >
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {drill.name}
                      {isDoneWarmupDrill(drill.id) && <span className="ml-1 text-green-500" title="Completed">✓</span>}
                    </div>
                    <div className="text-xs text-gray-600">{drill.instructions?.[0]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{drill.recommendedDuration || 30}s</span>
                    <button
                      className={`ml-2 ${isFavoriteWarmupDrill(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={e => { e.stopPropagation(); toggleFavoriteWarmupDrill(drill.id); }}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteWarmupDrill(drill.id) ? 'currentColor' : 'none'} size={20} />
                    </button>
                  </div>
                  {isDoneWarmupDrill(drill.id) && (
                    <span className="absolute top-2 right-2 text-green-500" title="Completed">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Drill Detail Modal */}
            {selectedWarmupDrill && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full m-4 max-h-[95vh] overflow-y-auto relative">
                  <button
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center"
                    onClick={() => setSelectedWarmupDrill(null)}
                  >
                    <ArrowLeft size={20} className="mr-1" /> Back
                  </button>
                  {/* Duration & Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-orange-500" />
                      <span className="text-gray-700 font-medium">Do this for {selectedWarmupDrill.recommendedDuration || 30} seconds</span>
                    </div>
                    <button
                      className={`ml-2 ${isFavoriteWarmupDrill(selectedWarmupDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => toggleFavoriteWarmupDrill(selectedWarmupDrill.id)}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteWarmupDrill(selectedWarmupDrill.id) ? 'currentColor' : 'none'} size={22} />
                    </button>
                  </div>
                  {/* Timer Component */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 bg-orange-100 rounded-full hover:bg-orange-200"
                        onClick={() => { setTimerRunning(!timerRunning); setTimerEnded(false); }}
                        aria-label={timerRunning ? 'Pause' : 'Start'}
                      >
                        {timerRunning ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => { setTimer(selectedWarmupDrill.recommendedDuration || 30); setTimerRunning(false); setTimerEnded(false); }}
                        aria-label="Reset"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <span className={`text-2xl font-mono w-16 text-center ${timerEnded ? 'text-green-600 animate-pulse' : 'text-gray-900'}`}>{timer}s</span>
                    </div>
                    {timerEnded && <span className="text-green-600 font-semibold animate-bounce">Done!</span>}
                  </div>
                  {/* Instructions */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                    <ol className="space-y-2">
                      {selectedWarmupDrill.instructions?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* Tips */}
                  {selectedWarmupDrill.tips && selectedWarmupDrill.tips.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {selectedWarmupDrill.tips.map((tip, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Mark as Done Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isDoneWarmupDrill(selectedWarmupDrill.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleDoneWarmupDrill(selectedWarmupDrill.id)}
                      aria-label="Mark as Done"
                    >
                      {isDoneWarmupDrill(selectedWarmupDrill.id) ? <span>✓ Marked as Done</span> : <span>Mark as Done</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Add Cool-down modal and UI below Warm-up modal, matching all features and structure. */}
      {showCooldownModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowCooldownModal(false); setSelectedCooldownDrill(null); }}
              aria-label="Close"
            >✕</button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Post-Game Recovery Routine</h2>
              <p className="text-gray-600 mb-2">Cool down and recover with gentle stretches.</p>
              {/* Daily Cool-down Drill */}
              {dailyCooldownDrill && (
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 shadow flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base mb-1">Today's Drill</div>
                    <div className="font-semibold">{dailyCooldownDrill.name}</div>
                    <div className="text-sm opacity-80">{dailyCooldownDrill.instructions?.[0]}</div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteCooldownDrill(dailyCooldownDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => toggleFavoriteCooldownDrill(dailyCooldownDrill.id)}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteCooldownDrill(dailyCooldownDrill.id) ? 'currentColor' : 'none'} size={22} />
                  </button>
                </div>
              )}
              {/* Search Bar */}
              <div className="flex items-center mb-4">
                <input
                  className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
                  type="text"
                  placeholder="Search cool-down drills..."
                  value={cooldownSearch}
                  onChange={e => setCooldownSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') {} }}
                />
                <span className="bg-blue-600 text-white px-3 py-2 rounded-r">
                  <Search size={18} />
                </span>
              </div>
            </div>
            {/* Cool-down Drills List */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {filteredCooldownDrills.map(drill => (
                <div
                  key={drill.id}
                  className={`bg-white rounded-xl shadow border border-blue-100 p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer relative ${isDoneCooldownDrill(drill.id) ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedCooldownDrill(drill)}
                >
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {drill.name}
                      {isDoneCooldownDrill(drill.id) && <span className="ml-1 text-green-500" title="Completed">✓</span>}
                    </div>
                    <div className="text-xs text-gray-600">{drill.instructions?.[0]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{drill.recommendedDuration || 30}s</span>
                    <button
                      className={`ml-2 ${isFavoriteCooldownDrill(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={e => { e.stopPropagation(); toggleFavoriteCooldownDrill(drill.id); }}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteCooldownDrill(drill.id) ? 'currentColor' : 'none'} size={20} />
                    </button>
                  </div>
                  {isDoneCooldownDrill(drill.id) && (
                    <span className="absolute top-2 right-2 text-green-500" title="Completed">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Drill Detail Modal */}
            {selectedCooldownDrill && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full m-4 max-h-[95vh] overflow-y-auto relative">
                  <button
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center"
                    onClick={() => setSelectedCooldownDrill(null)}
                  >
                    <ArrowLeft size={20} className="mr-1" /> Back
                  </button>
                  {/* YouTube Video */}
                  <div className="mb-4">
                    {cooldownVideoLoading ? (
                      <div className="flex items-center gap-2 text-gray-500"><Video size={20} className="animate-pulse" /> Loading video...</div>
                    ) : cooldownVideo[selectedCooldownDrill.id] ? (
                      <div className="w-full aspect-video mb-2">
                        <iframe
                          className="w-full h-60 rounded"
                          src={`https://www.youtube.com/embed/${cooldownVideo[selectedCooldownDrill.id]}`}
                          title={selectedCooldownDrill.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : cooldownVideoError ? (
                      <div className="text-red-500">No video available. See instructions below.</div>
                    ) : (
                      <button
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center gap-2"
                        onClick={() => fetchCooldownVideo(selectedCooldownDrill)}
                      >
                        <Video size={18} /> Load Tutorial Video
                      </button>
                    )}
                  </div>
                  {/* Duration & Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-blue-500" />
                      <span className="text-gray-700 font-medium">Do this for {selectedCooldownDrill.recommendedDuration || 30} seconds</span>
                    </div>
                    <button
                      className={`ml-2 ${isFavoriteCooldownDrill(selectedCooldownDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => toggleFavoriteCooldownDrill(selectedCooldownDrill.id)}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteCooldownDrill(selectedCooldownDrill.id) ? 'currentColor' : 'none'} size={22} />
                    </button>
                  </div>
                  {/* Timer Component */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
                        onClick={() => { setCooldownTimerRunning(!cooldownTimerRunning); setCooldownTimerEnded(false); }}
                        aria-label={cooldownTimerRunning ? 'Pause' : 'Start'}
                      >
                        {cooldownTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => { setCooldownTimer(selectedCooldownDrill.recommendedDuration || 30); setCooldownTimerRunning(false); setCooldownTimerEnded(false); }}
                        aria-label="Reset"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <span className={`text-2xl font-mono w-16 text-center ${cooldownTimerEnded ? 'text-blue-600 animate-pulse' : 'text-gray-900'}`}>{cooldownTimer}s</span>
                    </div>
                    {cooldownTimerEnded && <span className="text-blue-600 font-semibold animate-bounce">Done!</span>}
                  </div>
                  {/* Instructions */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                    <ol className="space-y-2">
                      {selectedCooldownDrill.instructions?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* Tips */}
                  {selectedCooldownDrill.tips && selectedCooldownDrill.tips.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {selectedCooldownDrill.tips.map((tip, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Mark as Done Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isDoneCooldownDrill(selectedCooldownDrill.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleDoneCooldownDrill(selectedCooldownDrill.id)}
                      aria-label="Mark as Done"
                    >
                      {isDoneCooldownDrill(selectedCooldownDrill.id) ? <span>✓ Marked as Done</span> : <span>Mark as Done</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[95vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowMaintenanceModal(false); setSelectedMaintenanceDrill(null); }}
              aria-label="Close"
            >✕</button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Daily Maintenance Routine</h2>
              <p className="text-gray-600 mb-2">Maintain flexibility and prevent stiffness with daily stretches.</p>
              {/* Daily Maintenance Drill */}
              {dailyMaintenanceDrill && (
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-green-200 to-green-100 text-green-900 shadow flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base mb-1">Today's Drill</div>
                    <div className="font-semibold">{dailyMaintenanceDrill.name}</div>
                    <div className="text-sm opacity-80">{dailyMaintenanceDrill.instructions?.[0]}</div>
                  </div>
                  <button
                    className={`ml-2 ${isFavoriteMaintenanceDrill(dailyMaintenanceDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => toggleFavoriteMaintenanceDrill(dailyMaintenanceDrill.id)}
                    aria-label="Favorite"
                  >
                    <Star fill={isFavoriteMaintenanceDrill(dailyMaintenanceDrill.id) ? 'currentColor' : 'none'} size={22} />
                  </button>
                </div>
              )}
              {/* Search Bar */}
              <div className="flex items-center mb-4">
                <input
                  className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
                  type="text"
                  placeholder="Search maintenance drills..."
                  value={maintenanceSearch}
                  onChange={e => setMaintenanceSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') {} }}
                />
                <span className="bg-green-600 text-white px-3 py-2 rounded-r">
                  <Search size={18} />
                </span>
              </div>
            </div>
            {/* Maintenance Drills List */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {filteredMaintenanceDrills.map(drill => (
                <div
                  key={drill.id}
                  className={`bg-white rounded-xl shadow border border-green-100 p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer relative ${isDoneMaintenanceDrill(drill.id) ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedMaintenanceDrill(drill)}
                >
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {drill.name}
                      {isDoneMaintenanceDrill(drill.id) && <span className="ml-1 text-green-500" title="Completed">✓</span>}
                    </div>
                    <div className="text-xs text-gray-600">{drill.instructions?.[0]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{drill.recommendedDuration || 30}s</span>
                    <button
                      className={`ml-2 ${isFavoriteMaintenanceDrill(drill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={e => { e.stopPropagation(); toggleFavoriteMaintenanceDrill(drill.id); }}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteMaintenanceDrill(drill.id) ? 'currentColor' : 'none'} size={20} />
                    </button>
                  </div>
                  {isDoneMaintenanceDrill(drill.id) && (
                    <span className="absolute top-2 right-2 text-green-500" title="Completed">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Drill Detail Modal */}
            {selectedMaintenanceDrill && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full m-4 max-h-[95vh] overflow-y-auto relative">
                  <button
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center"
                    onClick={() => setSelectedMaintenanceDrill(null)}
                  >
                    <ArrowLeft size={20} className="mr-1" /> Back
                  </button>
                  {/* YouTube Video */}
                  <div className="mb-4">
                    {maintenanceVideoLoading ? (
                      <div className="flex items-center gap-2 text-gray-500"><Video size={20} className="animate-pulse" /> Loading video...</div>
                    ) : maintenanceVideo[selectedMaintenanceDrill.id] ? (
                      <div className="w-full aspect-video mb-2">
                        <iframe
                          className="w-full h-60 rounded"
                          src={`https://www.youtube.com/embed/${maintenanceVideo[selectedMaintenanceDrill.id]}`}
                          title={selectedMaintenanceDrill.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : maintenanceVideoError ? (
                      <div className="text-red-500">No video available. See instructions below.</div>
                    ) : (
                      <button
                        className="bg-green-100 text-green-700 px-3 py-2 rounded flex items-center gap-2"
                        onClick={() => fetchMaintenanceVideo(selectedMaintenanceDrill)}
                      >
                        <Video size={18} /> Load Tutorial Video
                      </button>
                    )}
                  </div>
                  {/* Duration & Timer */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-green-500" />
                      <span className="text-gray-700 font-medium">Do this for {selectedMaintenanceDrill.recommendedDuration || 30} seconds</span>
                    </div>
                    <button
                      className={`ml-2 ${isFavoriteMaintenanceDrill(selectedMaintenanceDrill.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => toggleFavoriteMaintenanceDrill(selectedMaintenanceDrill.id)}
                      aria-label="Favorite"
                    >
                      <Star fill={isFavoriteMaintenanceDrill(selectedMaintenanceDrill.id) ? 'currentColor' : 'none'} size={22} />
                    </button>
                  </div>
                  {/* Timer Component */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 bg-green-100 rounded-full hover:bg-green-200"
                        onClick={() => { setMaintenanceTimerRunning(!maintenanceTimerRunning); setMaintenanceTimerEnded(false); }}
                        aria-label={maintenanceTimerRunning ? 'Pause' : 'Start'}
                      >
                        {maintenanceTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => { setMaintenanceTimer(selectedMaintenanceDrill.recommendedDuration || 30); setMaintenanceTimerRunning(false); setMaintenanceTimerEnded(false); }}
                        aria-label="Reset"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <span className={`text-2xl font-mono w-16 text-center ${maintenanceTimerEnded ? 'text-green-600 animate-pulse' : 'text-gray-900'}`}>{maintenanceTimer}s</span>
                    </div>
                    {maintenanceTimerEnded && <span className="text-green-600 font-semibold animate-bounce">Done!</span>}
                  </div>
                  {/* Instructions */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                    <ol className="space-y-2">
                      {selectedMaintenanceDrill.instructions?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* Tips */}
                  {selectedMaintenanceDrill.tips && selectedMaintenanceDrill.tips.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900 mb-2">Coaching Tips</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        {selectedMaintenanceDrill.tips.map((tip, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Mark as Done Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        isDoneMaintenanceDrill(selectedMaintenanceDrill.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleDoneMaintenanceDrill(selectedMaintenanceDrill.id)}
                      aria-label="Mark as Done"
                    >
                      {isDoneMaintenanceDrill(selectedMaintenanceDrill.id) ? <span>✓ Marked as Done</span> : <span>Mark as Done</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StretchingRoutines;