import React, { useState, lazy, Suspense } from 'react';
import { Play, Clock, Star, Target, Shield, Users, Footprints, Search, Filter, Youtube, X, ArrowLeft } from 'lucide-react';
import { skills } from '../data/basketballData';
import { Skill } from '../types';
import { searchYouTubeVideos } from '../services/youtubeApi';
import { YouTubeVideo } from '../types';

// Lazy load the DribbleMoves component
const DribbleMoves = lazy(() => import('./DribbleMoves'));

const SkillsLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showDribbleMoves, setShowDribbleMoves] = useState(false);

  const categories = [
    { id: 'all', name: 'All Skills', icon: Target },
    { id: 'shooting', name: 'Shooting', icon: Target },
    { id: 'dribbling', name: 'Dribbling', icon: Play },
    { id: 'defense', name: 'Defense', icon: Shield },
    { id: 'passing', name: 'Passing', icon: Users },
    { id: 'footwork', name: 'Footwork', icon: Footprints }
  ];

  // Filter out the crossover dribble and only keep dribbling skills
  const dribblingSkills = skills.filter(skill => 
    skill.category === 'dribbling' && 
    !skill.name.toLowerCase().includes('crossover')
  );

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const getSkillsForCategory = (category: string) => {
    return category === 'dribbling' ? dribblingSkills : 
           category === 'all' ? skills : 
           skills.filter(skill => skill.category === category);
  };

  const filteredSkills = getSkillsForCategory(selectedCategory).filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || skill.difficulty === selectedDifficulty;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
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
    const categoryData = categories.find(cat => cat.id === category);
    const Icon = categoryData?.icon || Target;
    return <Icon size={20} />;
  };

  const loadSkillVideos = async (skill: Skill) => {
    setLoadingVideos(true);
    setVideoError(null);
    
    try {
      const searchQuery = `how to ${skill.name} basketball tutorial`;
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

  const handleSkillSelect = (skill: Skill) => {
    if (skill.id === 'dribbling-moves') {
      setShowDribbleMoves(true);
      return;
    }
    setSelectedSkill(skill);
    setVideos([]);
    setVideoError(null);
    loadSkillVideos(skill);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const renderSkillsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSkills.map((skill) => (
        <div
          key={skill.id}
          onClick={() => handleSkillSelect(skill)}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                {getCategoryIcon(skill.category)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                  {skill.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>{Math.floor((skill.recommendedDuration || 300) / 60)} min</span>
            </div>
            <span className="text-orange-600 text-sm font-medium">
              {skill.id === 'dribbling-moves' ? 'View Moves →' : 'Watch Videos →'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // Show DribbleMoves component when dribbling category is selected
  if (selectedCategory === 'dribbling') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => setSelectedCategory('all')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to All Skills
        </button>
        <Suspense fallback={<div className="text-center py-8">Loading Dribble Moves...</div>}>
          <DribbleMoves />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills Library</h2>
        <p className="text-gray-600">Master basketball fundamentals with detailed instructions and tips</p>
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
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {renderSkillsGrid()}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {getCategoryIcon(selectedSkill.category)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedSkill.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedSkill.difficulty)}`}>
                        {selectedSkill.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{selectedSkill.category}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setVideos([]);
                    setSelectedVideo(null);
                    setVideoError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedSkill.description && (
                <div className="mb-6">
                  <p className="text-gray-700">{selectedSkill.description}</p>
                </div>
              )}
              
              {/* Loading State */}
              {loadingVideos && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tutorial videos...</p>
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
                    Tutorial Videos
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
              
              {/* Tips Section */}
              {selectedSkill.tips && selectedSkill.tips.length > 0 && (
                <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tips</h4>
                <ul className="space-y-2">
                  {selectedSkill.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Recommended: {Math.floor((selectedSkill.recommendedDuration || 300) / 60)} minutes</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setVideos([]);
                    setSelectedVideo(null);
                    setVideoError(null);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Close
                </button>
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
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No skills found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default SkillsLibrary;