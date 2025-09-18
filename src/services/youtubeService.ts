// youtubeService.ts
import axios from "axios";

export interface YouTubeVideo {
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

/**
 * 📌 Fetch the most relevant YouTube video for a given drill
 */
export const getRelevantVideo = async (query: string): Promise<YouTubeVideo> => {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
      query + " basketball drill"
    )}&order=relevance&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;

    const { data: searchData } = await axios.get(searchUrl);

    if (!searchData.items || searchData.items.length === 0) {
      throw new Error("No relevant videos found");
    }

    // ✅ Always take the first result (most relevant)
    const bestMatch = searchData.items[0];
    const videoId = bestMatch.id.videoId;

    // Fetch details for that video
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const { data: videoData } = await axios.get(videoUrl);

    if (!videoData.items || videoData.items.length === 0) {
      throw new Error("Video details not found");
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
      channelThumbnail: "",
    };
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return getDefaultVideo();
  }
};

/**
 * 📌 Fetch a random basketball training video (most relevant only)
 */
export const getRandomBasketballVideo = async (): Promise<YouTubeVideo> => {
  try {
    const queries = [
      "basketball shooting drill",
      "ball handling drills",
      "basketball footwork training",
      "basketball defense drills",
      "finishing at the rim drills",
      "basketball passing drills",
      "basketball agility training",
      "basketball conditioning drills",
    ];
    const query = queries[Math.floor(Math.random() * queries.length)];

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
      query
    )}&order=relevance&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;
    const { data: searchData } = await axios.get(searchUrl);

    if (!searchData.items || searchData.items.length === 0) {
      return getDefaultVideo();
    }

    // ✅ Always take the first result
    const bestMatch = searchData.items[0];
    const videoId = bestMatch.id.videoId;

    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const { data: videoData } = await axios.get(videoUrl);

    if (!videoData.items || videoData.items.length === 0) {
      return getDefaultVideo();
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
      channelThumbnail: "",
    };
  } catch (error) {
    console.error("Error fetching random YouTube video:", error);
    return getDefaultVideo();
  }
};

/**
 * ⏱ Convert ISO 8601 duration → human-readable
 */
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * ✅ Default fallback video
 */
const getDefaultVideo = (): YouTubeVideo => ({
  id: "dv13gl0a-FA",
  title: "5 Essential Basketball Drills for Beginners",
  description:
    "Learn the 5 most important basketball drills for beginners to improve your game.",
  thumbnailUrl: "https://img.youtube.com/vi/dv13gl0a-FA/maxresdefault.jpg",
  viewCount: "1,234,567",
  duration: "15:30",
  channelTitle: "Basketball Training",
  channelThumbnail: "",
});

/**
 * 💾 Local caching (24 hours)
 */
export const getCachedVideo = (): YouTubeVideo | null => {
  const cached = localStorage.getItem("youtubeVideo");
  const lastUpdated = localStorage.getItem("youtubeVideoLastUpdated");
  const now = new Date().getTime();

  if (
    cached &&
    lastUpdated &&
    now - parseInt(lastUpdated) < 24 * 60 * 60 * 1000
  ) {
    return JSON.parse(cached);
  }
  return null;
};

export const cacheVideo = (video: YouTubeVideo) => {
  localStorage.setItem("youtubeVideo", JSON.stringify(video));
  localStorage.setItem(
    "youtubeVideoLastUpdated",
    new Date().getTime().toString()
  );
};
