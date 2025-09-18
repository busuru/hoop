import React, { useState, useEffect } from 'react';
import { Search, Play, Heart, X, Youtube, Star, Clock, User, Target, Shield, Dumbbell, Zap } from 'lucide-react';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { YouTubeVideo, FavoriteVideo } from '../types';

const VideoLearning: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('basketball-video-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('basketball-video-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const categoryButtons = [
    { 
      id: 'dribbling', 
      name: 'Dribbling', 
      icon: Target, 
      color: 'bg-blue-500',
      searchTerm: 'basketball dribbling drills fundamentals'
    },
    { 
      id: 'shooting', 
      name: 'Shooting', 
      icon: Target, 
      color: 'bg-orange-500',
      searchTerm: 'basketball shooting form technique drills'
    },
    { 
      id: 'defense', 
      name: 'Defense', 
      icon: Shield, 
      color: 'bg-red-500',
      searchTerm: 'basketball defense fundamentals stance drills'
    },
    { 
      id: 'conditioning', 
      name: 'Conditioning', 
      icon: Zap, 
      color: 'bg-green-500',
      searchTerm: 'basketball conditioning training fitness drills'
    }
  ];

  const handleSearch = async (query: string, categoryId?: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setActiveCategory(categoryId || null);
    setNextPageToken(undefined);
    
    try {
      const response = await searchYouTubeVideos(query);
      const videoData: YouTubeVideo[] = response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      
      setVideos(videoData);
      setNextPageToken(response.nextPageToken);
      setShowFavorites(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageToken) return;
    setLoading(true);
    try {
      const response = await searchYouTubeVideos(activeCategory ? categoryButtons.find(c => c.id === activeCategory)?.searchTerm || searchQuery : searchQuery, nextPageToken);
      const more: YouTubeVideo[] = response.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description
      }));
      setVideos(prev => [...prev, ...more]);
      setNextPageToken(response.nextPageToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more videos');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCategory(null);
    setNextPageToken(undefined);
    await handleSearch(searchQuery);
  };

  const handleCategoryClick = async (category: typeof categoryButtons[0]) => {
    setNextPageToken(undefined);
    await handleSearch(category.searchTerm, category.id);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const quickSearchTerms = [
    'crossover move',
    'free throw shooting',
    'layup technique',
    'ball handling',
    'jump shot',
    'defensive slides'
  ];

  const displayVideos = showFavorites 
    ? favorites.map(fav => ({
        id: fav.videoId,
        title: fav.title,
        thumbnail: fav.thumbnail,
        channelTitle: fav.channelTitle,
        publishedAt: fav.savedAt,
        description: ''
      }))
    : videos;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Learning</h2>
        <p className="text-gray-600">Learn basketball skills from YouTube tutorials and save your favorites</p>
      </div>

      {/* Category Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Basketball Skills Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryButtons.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                disabled={loading}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Tutorials & Drills</p>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleFormSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for specific basketball skills (e.g., behind the back dribble)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search size={20} />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Quick Search Terms */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick searches:</p>
          <div className="flex flex-wrap gap-2">
            {quickSearchTerms.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle between search results and favorites */}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFavorites(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showFavorites
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Search Results ({videos.length})
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              showFavorites
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Heart size={16} />
            <span>Favorites ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for videos...</p>
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
      {!loading && displayVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
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

      {/* Load More */}
      {!loading && !showFavorites && nextPageToken && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      {/* Empty States */}
      {!loading && displayVideos.length === 0 && !showFavorites && (
        <div className="text-center py-12">
          <Youtube size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No videos found</p>
          <p className="text-sm text-gray-400">Try clicking a category button or searching for basketball skills</p>
        </div>
      )}

      {!loading && showFavorites && favorites.length === 0 && (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No favorite videos yet</p>
          <p className="text-sm text-gray-400">Search for videos and save your favorites</p>
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

export default VideoLearning;