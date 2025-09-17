import React, { useState, useEffect } from 'react';
import { Play, Clock, User } from 'lucide-react';
import { getRandomBasketballVideo, getCachedVideo, cacheVideo } from '../services/youtubeService';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: string;
  duration: string;
  channelTitle: string;
  channelThumbnail: string;
}

const VideoOfTheDay: React.FC = () => {
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        
        // Check for cached video first
        const cachedVideo = getCachedVideo();
        if (cachedVideo) {
          setVideo(cachedVideo);
          setLoading(false);
          return;
        }
        
        // If no cached video, fetch a new one
        const randomVideo = await getRandomBasketballVideo();
        setVideo(randomVideo);
        cacheVideo(randomVideo);
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-xl h-48 w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || 'No video available. Please try again later.'}
      </div>
    );
  }

  const handleVideoClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div className="group">
      <div className="relative rounded-xl overflow-hidden mb-4 cursor-pointer" onClick={handleVideoClick}>
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 group-hover:opacity-90 transition-opacity">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold line-clamp-2 text-sm sm:text-base">{video.title}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-gray-300 flex items-center gap-1">
              <Clock size={12} /> {video.duration}
            </span>
            <span className="text-xs text-gray-300 flex items-center gap-1">
              <User size={12} /> {video.channelTitle}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>{video.viewCount} views</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Refresh video
            setLoading(true);
            getRandomBasketballVideo()
              .then(newVideo => {
                setVideo(newVideo);
                cacheVideo(newVideo);
              })
              .catch(err => {
                console.error('Error refreshing video:', err);
                setError('Failed to load new video');
              })
              .finally(() => setLoading(false));
          }}
          className="text-blue-500 hover:text-blue-600 text-xs font-medium"
        >
          Show Another
        </button>
      </div>
    </div>
  );
};

export default VideoOfTheDay;
