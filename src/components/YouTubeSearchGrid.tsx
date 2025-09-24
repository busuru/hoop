import React from 'react';

interface YouTubeSearchGridProps {
  query: string;
  variants?: string[]; // optional custom variants
}

// Generates multiple search embeds using slight query variations so multiple results appear side-by-side
const YouTubeSearchGrid: React.FC<YouTubeSearchGridProps> = ({ query, variants }) => {
  const base = query.trim();
  const defaultVariants = [
    `${base} basketball drill`,
    `${base} basketball tutorial`,
    `${base} basketball training`,
    `${base} fundamentals`,
    `${base} beginner`,
    `${base} advanced tips`,
  ];

  const terms = (variants && variants.length > 0) ? variants : defaultVariants;

  const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {terms.map((term, idx) => {
        const listQuery = encodeURIComponent(term);
        const url = `https://www.youtube.com/embed/videoseries?listType=search&list=${listQuery}&index=${idx}&modestbranding=1&rel=0&playsinline=1${origin ? `&origin=${origin}` : ''}`;
        const searchUrl = `https://www.youtube.com/results?search_query=${listQuery}`;
        return (
          <div key={idx} className="w-full rounded-xl shadow-lg overflow-hidden bg-black/5">
            <iframe
              src={url}
              title={`YouTube search: ${term}`}
              width="100%"
              height="315"
              className="w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="px-2 py-2 bg-white border-t text-xs text-gray-600 flex items-center justify-between">
              <span className="truncate">{term}</span>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Open on YouTube
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YouTubeSearchGrid;
