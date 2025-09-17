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

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const CHANNEL_IDS = [
  'UCWpbxI4NmdvhnNtL8JSM0WA', // ILoveBasketballTV
  'UCVntvknM0sYf3gJ1C5pkoGQ', // ShotMechanics
  'UCiC5yAJdFtF-y5ua4_yBcPw'  // Devin Williams
];

const getRandomChannelId = () => {
  return CHANNEL_IDS[Math.floor(Math.random() * CHANNEL_IDS.length)];
};

export const getRandomBasketballVideo = async (): Promise<YouTubeVideo> => {
  try {
    // First, get a random video from a basketball channel
    const channelId = getRandomChannelId();
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&type=video&q=basketball%20training&key=${YOUTUBE_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error('No videos found');
    }
    
    // Get a random video from the search results
    const randomVideo = searchData.items[Math.floor(Math.random() * searchData.items.length)];
    const videoId = randomVideo.id.videoId;
    
    // Get video details
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const videoResponse = await fetch(videoUrl);
    const videoData = await videoResponse.json();
    
    if (!videoData.items || videoData.items.length === 0) {
      throw new Error('Video details not found');
    }
    
    const video = videoData.items[0];
    
    return {
      id: videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      viewCount: parseInt(video.statistics.viewCount).toLocaleString(),
      duration: formatDuration(video.contentDetails.duration),
      channelTitle: video.snippet.channelTitle,
      channelThumbnail: '' // We'll keep this empty for now
    };
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    // Return a default video in case of error
    return getDefaultVideo();
  }
};

const formatDuration = (duration: string): string => {
  // Convert ISO 8601 duration to human-readable format
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getDefaultVideo = (): YouTubeVideo => ({
  id: 'dv13gl0a-FA',
  title: '5 Essential Basketball Drills for Beginners',
  description: 'Learn the 5 most important basketball drills for beginners to improve your game.',
  thumbnailUrl: 'https://img.youtube.com/vi/dv13gl0a-FA/maxresdefault.jpg',
  viewCount: '1,234,567',
  duration: '15:30',
  channelTitle: 'Basketball Training',
  channelThumbnail: ''
});

export const getCachedVideo = (): YouTubeVideo | null => {
  const cached = localStorage.getItem('youtubeVideo');
  const lastUpdated = localStorage.getItem('youtubeVideoLastUpdated');
  const now = new Date().getTime();
  
  if (cached && lastUpdated && (now - parseInt(lastUpdated)) < 24 * 60 * 60 * 1000) {
    return JSON.parse(cached);
  }
  return null;
};

export const cacheVideo = (video: YouTubeVideo) => {
  localStorage.setItem('youtubeVideo', JSON.stringify(video));
  localStorage.setItem('youtubeVideoLastUpdated', new Date().getTime().toString());
};
