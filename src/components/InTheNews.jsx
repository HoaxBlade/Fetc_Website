import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Newspaper, ExternalLink } from 'lucide-react';

// Import news images
import News1 from '../assets/News/news1.png';
import News2 from '../assets/News/news2.png';

const newsItems = [
  {
    image: News1,
    headline: "CBSE Mock Test Initiative for 700+ Students",
    description: "FETC organized an English mock test for 700+ Class 11 CBSE students at Radiant International School, Piplod — boosting confidence and subject clarity through real exam practice.",
  },
  {
    image: News2,
    headline: "Foreign Innovation Test at Radiant School",
    description: "Covered extensively in regional media, FETC's mock test program at Radiant School showcases 13 years of excellence in preparing students for academic and career success.",
  },
];

const InTheNews = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-10 md:py-14 bg-transparent relative z-10 overflow-hidden" id="in-the-news">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-200/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-5 px-4 py-2 bg-amber-50 rounded-full ring-1 ring-amber-100">
            <Newspaper className="w-3.5 h-3.5" />
            In The News
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Making{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Headlines
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            When dedication meets impact, the media takes notice. Here's FETC in the spotlight.
          </p>
        </motion.div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {newsItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.15 }}
              className="group"
            >
              <div className="relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                {/* Newspaper Image */}
                <div className="relative overflow-hidden">
                  <div className="h-[280px] overflow-hidden bg-slate-50">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Newspaper badge */}
                  <motion.div
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-amber-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5"
                  >
                    <Newspaper className="w-3 h-3" />
                    Press Coverage
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2 group-hover:text-amber-700 transition-colors duration-300">
                    {item.headline}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {item.description}
                  </p>

                  {/* Bottom accent bar */}
                  <div className="mt-5 pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Featured in Regional Media
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InTheNews;
