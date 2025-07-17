import React, { useState, useEffect } from 'react';
import { Play, Heart, X, Youtube, Star, Clock, User, ArrowLeft, Search } from 'lucide-react';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { YouTubeVideo, FavoriteVideo } from '../types';

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

const DribbleMoves: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DribbleCategory | null>(null);
  const [selectedMove, setSelectedMove] = useState<DribbleMove | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('basketball-dribble-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('basketball-dribble-favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const handleMoveSelect = async (move: DribbleMove) => {
    setSelectedMove(move);
    setLoading(true);
    setError(null);
    
    try {
      const searchQuery = `how to do ${move.name} basketball dribble move tutorial`;
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
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (video: YouTubeVideo) => {
    const isAlreadyFavorite = favorites.some(fav => fav.videoId === video.id);
    
    if (isAlreadyFavorite) {
      setFavorites(favorites.filter(fav => fav.videoId !== video.id));
    } else {
      const newFavorite: FavoriteVideo = {
        id: Date.now().toString(),
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        savedAt: new Date().toISOString()
      };
      setFavorites([...favorites, newFavorite]);
    }
  };

  const isFavorite = (videoId: string) => {
    return favorites.some(fav => fav.videoId === videoId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const goBack = () => {
    if (selectedMove) {
      setSelectedMove(null);
      setVideos([]);
      setError(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Category Selection View
  if (!selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dribble Moves</h2>
          <p className="text-gray-600">Master basketball dribbling with categorized moves and video tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dribbleCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
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

  // Move Selection View
  if (selectedCategory && !selectedMove) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={goBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} flex items-center justify-center text-white`}>
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.moves.map((move) => (
            <div
              key={move.id}
              onClick={() => handleMoveSelect(move)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Play size={20} className="text-orange-600" />
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

  // Video Tutorials View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={goBack}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Play size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedMove?.name}</h2>
            <p className="text-gray-600">Video tutorials and instructions</p>
          </div>
        </div>
      </div>

      {/* Move Info Card */}
      {selectedMove && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedMove.difficulty)}`}>
                {selectedMove.difficulty}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-600">{selectedCategory?.name}</span>
            </div>
          </div>
          <p className="text-gray-700">{selectedMove.description}</p>
        </div>
      )}

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
          {error.includes('API key') && (
            <p className="text-sm text-red-600 mt-2">
              Please add your YouTube API key to the environment variables as VITE_YOUTUBE_API_KEY
            </p>
          )}
        </div>
      )}

      {/* Videos Grid */}
      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
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
                    toggleFavorite(video);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isFavorite(video.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                  }`}
                >
                  <Heart size={16} fill={isFavorite(video.id) ? 'currentColor' : 'none'} />
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

      {/* Empty State */}
      {!loading && videos.length === 0 && !error && selectedMove && (
        <div className="text-center py-12">
          <Youtube size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No tutorial videos found</p>
          <p className="text-sm text-gray-400">Try selecting a different move or check your internet connection</p>
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
                  onClick={() => toggleFavorite(selectedVideo)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite(selectedVideo.id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={16} fill={isFavorite(selectedVideo.id) ? 'currentColor' : 'none'} />
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

export default DribbleMoves;