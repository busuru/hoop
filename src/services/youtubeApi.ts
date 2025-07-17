const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }>;
}

export const searchYouTubeVideos = async (query: string): Promise<YouTubeSearchResponse> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your environment variables.');
  }

  const searchQuery = `${query} basketball tutorial`;
  const url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&maxResults=5&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid API key');
      }
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
};