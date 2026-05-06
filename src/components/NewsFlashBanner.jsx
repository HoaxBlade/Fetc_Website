import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

const NewsFlashBanner = () => {
  const [news, setNews] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch((window.API_BASE||'') + '/api/news-flash');
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
    <div className="bg-brand-600 border-b border-brand-700/20 relative overflow-hidden z-[1500] h-8 flex items-center">
      <div className="w-full flex items-center h-full px-4 sm:px-6">

        {/* Persistent Icon */}
        <div className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white z-20 shadow-sm mr-4">
          <Megaphone size={11} className="animate-pulse stroke-[2.2px]" />
        </div>

        {/* High-Speed Marquee Container */}
        <div className="flex-grow relative h-full overflow-hidden flex items-center">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 25, 
              repeat: Infinity,
              ease: "linear",
            }}
            className="whitespace-nowrap inline-block"
          >
            <span className="text-xs font-semibold tracking-tight text-white py-1">
              {tickerText}
            </span>
            <span className="inline-block w-[100vw]" />
            <span className="text-xs font-semibold tracking-tight text-white py-1">
              {tickerText}
            </span>
            <span className="inline-block w-[100vw]" />
          </motion.div>
        </div>

        {/* Persistent Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white z-20 ml-4"
        >
          <X size={14} className="stroke-[2.2px]" />
        </button>
      </div>

      {/* Visual Polishing Fades */}
      <div className="absolute left-12 top-0 h-full w-16 bg-gradient-to-r from-brand-600 to-transparent pointer-events-none z-10" />
      <div className="absolute right-12 top-0 h-full w-16 bg-gradient-to-l from-brand-600 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default NewsFlashBanner;
