import React from 'react';

interface YouTubeSearchEmbedProps {
  query: string;
}

const YouTubeSearchEmbed: React.FC<YouTubeSearchEmbedProps> = ({ query }) => {
  const listQuery = encodeURIComponent(query + ' basketball drill');
  const url = `https://www.youtube.com/embed?listType=search&list=${listQuery}`;

  return (
    <div className="w-full rounded-xl shadow-lg overflow-hidden">
      <iframe
        src={url}
        title={`YouTube search: ${query}`}
        width="100%"
        height="600"
        className="w-full"
        style={{ border: 0 }}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeSearchEmbed;
