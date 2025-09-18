import React, { useState } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle, Activity, Search, Filter, Youtube, X } from 'lucide-react';
import { stretches } from '../data/basketballData';
import { Stretch } from '../types';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { YouTubeVideo } from '../types';

const StretchingRoutines: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStretch, setSelectedStretch] = useState<Stretch | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const types = [
    { id: 'all', name: 'All Stretches' },
    { id: 'warm-up', name: 'Warm-up' },
    { id: 'cool-down', name: 'Cool-down' },
    { id: 'maintenance', name: 'Maintenance' }
  ];

  const filteredStretches = stretches.filter(stretch => {
    const matchesType = selectedType === 'all' || stretch.type === selectedType;
    const matchesSearch = stretch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (stretch.description && stretch.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warm-up': return 'bg-orange-100 text-orange-700';
      case 'cool-down': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const startTimer = (duration: number) => {
    setTimeRemaining(duration);
    setTimerActive(true);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimerActive(false);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimerActive(false);
    setTimeRemaining(selectedStretch?.duration || 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadStretchVideos = async (stretch: Stretch) => {
    setLoadingVideos(true);
    setVideoError(null);
    
    try {
      const searchQuery = `how to do ${stretch.name} stretch tutorial proper form`;
      const response = await searchYouTubeVideos(searchQuery);
      const videoData: YouTubeVideo[] = response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      
      setVideos(videoData);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleStretchSelect = (stretch: Stretch) => {
    setSelectedStretch(stretch);
    setVideos([]);
    setVideoError(null);
    setTimeRemaining(stretch.duration);
    loadStretchVideos(stretch);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  React.useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stretching Routines</h2>
        <p className="text-gray-600">Improve flexibility and prevent injuries with guided stretching</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stretches..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stretches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStretches.map((stretch) => (
          <div
            key={stretch.id}
            onClick={() => handleStretchSelect(stretch)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{stretch.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(stretch.type)}`}>
                    {stretch.type}
                  </span>
                </div>
              </div>
            </div>
            
            {stretch.description && (
              <p className="text-sm text-gray-600 mb-4">{stretch.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{stretch.duration}s</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stretch.targetAreas.slice(0, 2).map((area, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-orange-600 text-sm font-medium">
                Watch & Start →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stretch Detail Modal */}
      {selectedStretch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedStretch.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedStretch.type)}`}>
                        {selectedStretch.type}
                      </span>
                      <span className="text-sm text-gray-500">{selectedStretch.duration}s</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedStretch(null);
                    setVideos([]);
                    setSelectedVideo(null);
                    setVideoError(null);
                    pauseTimer();
                    setTimeRemaining(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedStretch.description && (
                <div className="mb-6">
                  <p className="text-gray-700">{selectedStretch.description}</p>
                </div>
              )}

              {(selectedStretch.instructions && selectedStretch.instructions.length > 0) || (selectedStretch.tips && selectedStretch.tips.length > 0) ? (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStretch.instructions && selectedStretch.instructions.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Step-by-step Instructions</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        {selectedStretch.instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {selectedStretch.tips && selectedStretch.tips.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Tips</h4>
                      <ul className="space-y-2 text-gray-700">
                        {selectedStretch.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
              
              {/* Timer will be in persistent footer */}
              
              
              {/* Loading State */}
              {loadingVideos && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading stretch videos...</p>
                </div>
              )}

              {/* Error State */}
              {videoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={12} className="text-white" />
                    </div>
                    <p className="text-red-700">{videoError}</p>
                  </div>
                  {videoError.includes('API key') && (
                    <p className="text-sm text-red-600 mt-2">
                      Please add your YouTube API key to the environment variables as VITE_YOUTUBE_API_KEY
                    </p>
                  )}
                </div>
              )}

              {/* Videos Grid */}
              {!loadingVideos && videos.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Youtube className="text-red-600" size={20} />
                    Stretch Videos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                              <Play size={16} className="text-white ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {truncateTitle(video.title, 50)}
                          </h5>
                          <p className="text-xs text-gray-600 mb-1">{video.channelTitle}</p>
                          <p className="text-xs text-gray-500">{formatDate(video.publishedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Target Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStretch.targetAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Duration: {selectedStretch.duration} seconds</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedStretch(null);
                    setVideos([]);
                    setSelectedVideo(null);
                    setVideoError(null);
                    pauseTimer();
                    setTimeRemaining(0);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Close
                </button>
            </div>

            {/* Timer persistent footer */}
            <div className="border-t border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {formatTime(timeRemaining || selectedStretch.duration)}
              </div>
              <div className="flex items-center justify-center space-x-3">
                {!timerActive ? (
                  <button
                    onClick={() => startTimer(timeRemaining || selectedStretch.duration)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                  >
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>
              {timeRemaining === 0 && selectedStretch && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-medium">Stretch completed!</span>
                </div>
              )}
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
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
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

      {/* Empty State */}
      {filteredStretches.length === 0 && (
        <div className="text-center py-12">
          <Activity size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No stretches found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default StretchingRoutines;