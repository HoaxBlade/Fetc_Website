import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

const NewsFlashBanner = () => {
  const [news, setNews] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news-flash');
        const data = await res.json();
        if (data.success && data.news.length > 0) {
          setNews(data.news);
        }
      } catch (err) {
        console.error('Failed to fetch news flash:', err);
      }
    };
    fetchNews();
  }, []);

  if (!isVisible || news.length === 0) return null;

  const tickerText = news.map(item => item.content).join('      •      ');

  return (
    <div className="bg-amber-400 border-b border-amber-500/20 relative overflow-hidden z-[1500] h-10 flex items-center">
      <div className="w-full flex items-center h-full px-4 sm:px-6">

        {/* Persistent Icon */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-amber-900 z-20 shadow-sm mr-4">
          <Megaphone size={14} className="animate-pulse" />
        </div>

        {/* High-Speed Marquee Container */}
        <div className="flex-grow relative h-full overflow-hidden flex items-center">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 20, 
              repeat: Infinity,
              ease: "linear",
            }}
            className="whitespace-nowrap inline-block"
          >
            <span className="text-[13px] font-semibold tracking-tight text-amber-950 py-1">
              {tickerText}
            </span>
            <span className="inline-block w-[100vw]" />
            <span className="text-[13px] font-semibold tracking-tight text-amber-950 py-1">
              {tickerText}
            </span>
            <span className="inline-block w-[100vw]" />
          </motion.div>
        </div>

        {/* Persistent Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 p-1.5 hover:bg-black/10 rounded-full transition-colors text-amber-900/40 hover:text-amber-900 z-20 ml-4"
        >
          <X size={16} />
        </button>
      </div>

      {/* Visual Polishing Fades */}
      <div className="absolute left-14 top-0 h-full w-20 bg-gradient-to-r from-amber-400 to-transparent pointer-events-none z-10" />
      <div className="absolute right-14 top-0 h-full w-20 bg-gradient-to-l from-amber-400 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default NewsFlashBanner;
