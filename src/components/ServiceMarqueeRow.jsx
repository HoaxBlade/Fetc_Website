import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

function ServiceMarqueeRow({
  title,
  description,
  linkText,
  linkTarget,
  items = [],
  bgColor = "bg-white",
  cardBg = "bg-[#F5F5F7]",
  isStatic = false,
  layout = "centered",
  // New dynamic props
  badgeText = "Global Opportunities",
  stats = [],
  floatingTags = [],
  reverse = false,
  secondTitle,
  secondDescription,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (layout !== "split-overlapping" || !items || items.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3000); // Reduced to 3 seconds per user request, resets timer on activeIndex change
    return () => clearInterval(interval);
  }, [layout, items, isPaused, activeIndex]);

  let scrollingItems = items;
  if (!isStatic) {
    let baseArray = [...items];
    while (baseArray.length < 8) {
      baseArray = [...baseArray, ...items];
    }
    scrollingItems = [...baseArray, ...baseArray];
  }

  const gradientColors = [
    "from-blue-500 to-brand-700",
    "from-sky-400 to-indigo-500",
    "from-teal-400 to-blue-600",
    "from-orange-400 to-rose-500",
    "from-purple-500 to-fuchsia-600"
  ];

  const renderCard = (service, idx) => (
    <div 
      key={idx} 
      className={`flex w-full flex-col justify-between rounded-[2.5rem] p-10 ring-1 ring-slate-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:max-w-[480px] ${cardBg}`}
    >
      <div>
        <h3 className="mb-6 text-2xl font-bold tracking-tight text-blue-600 flex items-center gap-3">
          <span>{service.title}</span>
          {service.flag && (
            <img 
              src={service.flag} 
              alt={`${service.title} flag`} 
              className="h-5 w-auto object-contain rounded-md filter drop-shadow-sm select-none" 
            />
          )}
        </h3>
        {service.links ? (
          <div className="space-y-4 mt-6">
             {service.links.map((link, lIdx) => (
               <a 
                 key={lIdx} 
                 href={link.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-4 text-base font-bold text-slate-700 hover:text-blue-600 transition-colors group/link"
               >
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover/link:bg-blue-50 group-hover/link:border-blue-100 transition-all">
                   <Download size={16} className="text-slate-400 group-hover/link:text-blue-600" />
                 </div>
                 {link.label}
               </a>
             ))}
          </div>
        ) : (
          <p className="text-base font-medium leading-relaxed text-slate-500">
            {service.description && (service.description.length > 200 ? service.description.substring(0, 200) + "..." : service.description)}
          </p>
        )}
      </div>
      <div className="mt-12">
        {service.path ? (
          <Link
            to={service.path}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900 transition-colors hover:text-blue-600 group/btn"
          >
            Explore Details
            <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        ) : null}
      </div>
    </div>
  );

  const renderStaticCard = (service, idx) => {
    const isLinkCard = !!service.links;
    
    return (
      <div 
        key={idx} 
        className="group relative flex w-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white/70 backdrop-blur-2xl p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] ring-1 ring-white/80 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:bg-white/90 hover:ring-blue-50/50"
      >
        {/* Soft, ethereal background glows */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-50/40 blur-[80px] transition-opacity duration-1000 group-hover:opacity-100 opacity-50 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-50/40 blur-[80px] transition-opacity duration-1000 group-hover:opacity-100 opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50/50 ring-1 ring-blue-100/50 backdrop-blur-sm transition-transform duration-700 group-hover:scale-110 group-hover:bg-blue-50">
            {isLinkCard ? (
              <svg className="h-7 w-7 text-blue-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            ) : (
              <svg className="h-7 w-7 text-blue-600 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
          </div>
          
          {service.title && service.title !== title && service.title !== secondTitle && (
            <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 transition-colors duration-500 flex items-center gap-3">
              <span>{service.title}</span>
              {service.flag && (
                <img 
                  src={service.flag} 
                  alt={`${service.title} flag`} 
                  className="h-6 w-auto object-contain rounded-md filter drop-shadow-sm select-none" 
                />
              )}
            </h3>
          )}
          
          {service.links ? (
            <div className="mt-8 flex flex-col gap-4">
               {service.links.map((link, lIdx) => (
                 <a 
                   key={lIdx} 
                   href={link.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group/link relative flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.03)] ring-1 ring-slate-100/50 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_8px_25px_-8px_rgba(0,0,0,0.08)] hover:ring-blue-100"
                 >
                   <div className="relative flex items-center gap-4">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50/80 transition-colors duration-500 group-hover/link:bg-blue-50">
                       <Download size={16} className="text-slate-400 transition-colors duration-500 group-hover/link:text-blue-500" />
                     </div>
                     <span className="font-semibold text-sm text-slate-700 transition-colors duration-500 group-hover/link:text-slate-900">
                       {link.label}
                     </span>
                   </div>
                 </a>
               ))}
            </div>
          ) : (
            <p className="mt-4 text-lg font-medium leading-relaxed text-slate-500">
              {service.description}
            </p>
          )}
        </div>
        
        <div className="relative z-10 mt-12">
          {service.path ? (
            <Link
              to={service.path}
              className="group/btn inline-flex items-center gap-3 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_25px_-8px_rgba(13,94,183,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(13,94,183,0.6)]"
            >
              Explore Details
              <svg className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    );
  };

  if (layout === "split-overlapping") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative overflow-hidden py-12 md:py-20 ${bgColor}`}
      >
        {/* Richer multi-layered background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]"></div>
          {!reverse && <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-300/8 rounded-full blur-[120px]" />}
          {reverse && <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-300/8 rounded-full blur-[120px]" />}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className={`grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 items-center ${reverse ? 'flex-row-reverse lg:flex-row-reverse' : ''}`}>

            {/* Text column (Order 2 on mobile if reversed, Order 1 on desktop if not) */}
            <div className={`flex flex-col items-start lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}>
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-6 ring-1 ${!reverse ? 'bg-brand-50 text-brand-600 ring-brand-100' : 'bg-teal-50 text-teal-600 ring-teal-100'}`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${!reverse ? 'bg-brand-400' : 'bg-teal-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${!reverse ? 'bg-brand-500' : 'bg-teal-500'}`}></span>
                </span>
                {badgeText}
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl text-balance">
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${!reverse ? 'from-brand-600 to-blue-500' : 'from-teal-600 to-cyan-500'}`}>
                  {title.split(' ').slice(-1)}
                </span>
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-slate-500">
                {description}
              </p>

              {/* Trust Stats Indicator */}
              {stats && stats.length > 0 && (
                <div className="mt-10 grid w-full grid-cols-3 gap-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  {stats.map((stat, idx) => (
                    <div key={idx} className={`text-center ${idx !== 0 ? 'border-l border-slate-100' : ''}`}>
                      <div className={`text-2xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent ${!reverse ? 'from-brand-600 to-blue-500' : 'from-teal-600 to-cyan-500'}`}>{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <Link
                  to={items[activeIndex]?.path || linkTarget}
                  className={`group/cta relative inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden ${!reverse ? 'bg-gradient-to-r from-brand-600 to-blue-600 shadow-[0_8px_30px_rgba(13,94,183,0.3)] hover:shadow-[0_12px_40px_rgba(13,94,183,0.45)]' : 'bg-gradient-to-r from-teal-600 to-cyan-600 shadow-[0_8px_30px_rgba(13,148,136,0.3)] hover:shadow-[0_12px_40px_rgba(13,148,136,0.45)]'}`}
                >
                  <span className="relative z-10">{linkText}</span>
                  <svg className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Cards column (Order 1 on mobile if reversed, Order 2 on desktop if not) */}
            <div
              className={`relative flex w-full items-center justify-center lg:col-span-7 min-h-[550px] ${reverse ? 'lg:justify-start lg:order-1' : 'lg:justify-end lg:order-2'}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Background Visual — Different per section */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!reverse ? (
                  /* GLOBE for "Explore the World" (countries) */
                  <>
                    <motion.div
                      key={activeIndex}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <svg
                        viewBox="0 0 200 200"
                        className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] opacity-[0.08]"
                        style={{ animation: 'spin 25s linear infinite' }}
                      >
                        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-700" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-600" />
                        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-brand-500" />
                        <ellipse cx="100" cy="100" rx="80" ry="55" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-400" />
                        <ellipse cx="100" cy="100" rx="80" ry="75" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-brand-300" />
                        <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-brand-500" />
                        <ellipse cx="100" cy="100" rx="55" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-400" />
                        <ellipse cx="100" cy="100" rx="75" ry="80" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-brand-300" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-slate-400" />
                        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.3" className="text-slate-400" />
                        <circle cx="65" cy="60" r="3" className="text-brand-600" fill="currentColor" opacity="0.6" />
                        <circle cx="130" cy="75" r="2.5" className="text-brand-500" fill="currentColor" opacity="0.5" />
                        <circle cx="85" cy="120" r="2" className="text-teal-500" fill="currentColor" opacity="0.5" />
                        <circle cx="145" cy="110" r="2.5" className="text-brand-400" fill="currentColor" opacity="0.4" />
                        <circle cx="55" cy="95" r="2" className="text-orange-500" fill="currentColor" opacity="0.4" />
                      </svg>
                    </motion.div>
                    <div 
                      className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] border border-dashed border-slate-200/30 rounded-full"
                      style={{ animation: 'spin 40s linear infinite reverse' }}
                    >
                      <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-brand-400/30 rounded-full" />
                      <div className="absolute -bottom-1.5 left-1/2 w-2 h-2 bg-teal-400/20 rounded-full" />
                      <div className="absolute top-1/2 -left-1 w-2.5 h-2.5 bg-orange-400/25 rounded-full" />
                    </div>
                  </>
                ) : (
                  /* BOOK / EXAM visual for "Ace Your Exams" */
                  <>
                    <svg
                      viewBox="0 0 200 200"
                      className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] opacity-[0.06]"
                    >
                      {/* Open book shape */}
                      <path d="M100 40 L100 170" stroke="currentColor" strokeWidth="1.5" className="text-teal-600" />
                      {/* Left page */}
                      <path d="M100 40 Q60 35 30 50 L30 160 Q60 148 100 155 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-teal-500" />
                      {/* Right page */}
                      <path d="M100 40 Q140 35 170 50 L170 160 Q140 148 100 155 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-teal-500" />
                      {/* Text lines - left page */}
                      <line x1="45" y1="70" x2="90" y2="68" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="45" y1="82" x2="85" y2="80" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="45" y1="94" x2="88" y2="92" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="45" y1="106" x2="80" y2="104" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="45" y1="118" x2="86" y2="117" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      {/* Text lines - right page */}
                      <line x1="110" y1="68" x2="155" y2="70" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="110" y1="80" x2="155" y2="82" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="110" y1="92" x2="150" y2="94" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      <line x1="110" y1="104" x2="148" y2="106" stroke="currentColor" strokeWidth="0.6" className="text-slate-400" />
                      {/* Checkmark on right page */}
                      <path d="M120 120 L128 130 L145 110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500" />
                      {/* Graduation cap above */}
                      <path d="M100 20 L130 30 L100 40 L70 30 Z" fill="currentColor" className="text-brand-500" opacity="0.3" />
                      <line x1="130" y1="30" x2="130" y2="45" stroke="currentColor" strokeWidth="0.8" className="text-brand-400" />
                      {/* Pencil accent */}
                      <line x1="160" y1="170" x2="175" y2="155" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-orange-400" />
                      <polygon points="175,155 178,152 176,158" fill="currentColor" className="text-orange-400" />
                    </svg>
                    {/* Floating formula/score accents */}
                    <motion.div
                      animate={{ y: [-8, 8, -8] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-8 right-16 text-sm font-bold text-teal-400/15 select-none"
                    >
                      Band 8.0
                    </motion.div>
                    <motion.div
                      animate={{ y: [6, -6, 6] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-16 left-8 text-sm font-bold text-brand-400/15 select-none"
                    >
                      Score 90+
                    </motion.div>
                    <motion.div
                      animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/3 left-4 text-xs font-bold text-orange-400/12 select-none"
                    >
                      A+
                    </motion.div>
                  </>
                )}
              </div>

              {/* Floating Service Tags */}
              {floatingTags && floatingTags.map((tag, idx) => {
                const positions = [
                  "top-6 left-6 md:top-12 md:left-12",
                  "bottom-12 left-4 md:bottom-24 md:left-8",
                  "top-1/3 right-4 lg:right-8 hidden lg:block",
                  "bottom-6 right-6"
                ];

                return (
                  <motion.div
                    key={idx}
                    animate={{
                      y: [-10, 10, -10],
                      rotate: idx % 2 === 0 ? [-1, 1, -1] : [1, -1, 1]
                    }}
                    transition={{
                      duration: 4 + (idx * 0.5),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute ${positions[idx % positions.length]} group`}
                  >
                    <div className="rounded-full bg-white/80 px-4 py-2 text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-100 transition-all hover:scale-110">
                      {tag}
                    </div>
                  </motion.div>
                );
              })}
              <div 
                className="relative h-[430px] w-[320px] md:h-[460px] md:w-[380px]"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {items.map((service, i) => {
                  const offsetIndex = (i - activeIndex + items.length) % items.length;

                  // Display top 4 visually for more depth
                  const isVisible = offsetIndex < 4;
                  const isTop = offsetIndex === 0;

                  // Styling based on depth and viewport responsiveness
                  const scale = isVisible ? 1 - (offsetIndex * 0.05) : 0.8;
                  const translateY = isVisible 
                    ? (isMobile ? offsetIndex * 12 : offsetIndex * 20) 
                    : (isMobile ? 40 : 60);
                  const translateX = isVisible 
                    ? (isMobile ? 0 : offsetIndex * 8) 
                    : (isMobile ? 0 : 20);

                  const zIndex = items.length - offsetIndex;
                  const opacity = isVisible ? 1 - (offsetIndex * 0.2) : 0;

                  // Consistent stack rotation per depth level (subtle rotation on mobile to stay within screen boundaries)
                  const rotate = isVisible 
                    ? (offsetIndex === 1 
                        ? (isMobile ? -1.5 : -3) 
                        : offsetIndex === 2 
                        ? (isMobile ? 1.5 : 3) 
                        : offsetIndex === 3 
                        ? (isMobile ? -0.8 : -1.5) 
                        : 0) 
                    : 0;
                   return (
                    <div
                      key={i}
                      className={`absolute top-0 left-0 flex h-full w-full flex-col rounded-[2.5rem] p-6 overflow-hidden transition-[transform,opacity,box-shadow,background-color] duration-500 md:duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,opacity] origin-center ${isTop ? 'ring-1 ring-slate-200/80' : 'ring-1 ring-slate-100/40'}`}
                      style={{
                        zIndex,
                        transform: `translate3d(${translateX}px, ${translateY}px, ${zIndex * 4}px) scale(${scale}) rotate(${rotate}deg)`,
                        opacity,
                        visibility: isVisible ? 'visible' : 'hidden',
                        pointerEvents: isTop ? 'auto' : (isVisible ? 'auto' : 'none'),
                        boxShadow: isTop 
                          ? (!reverse 
                            ? '0 40px 80px -15px rgba(13,94,183,0.12), 0 20px 40px -10px rgba(0,0,0,0.06)' 
                            : '0 40px 80px -15px rgba(13,148,136,0.12), 0 20px 40px -10px rgba(0,0,0,0.06)')
                          : '0 10px 30px -5px rgba(0,0,0,0.03)',
                        cursor: isTop ? 'default' : 'pointer',
                        backgroundColor: isTop ? '#ffffff' : '#fafbfc'
                      }}
                      onClick={() => {
                        if (!isTop) setActiveIndex(i);
                      }}
                    >
                      <div className={`flex flex-col h-full w-full ${isTop ? '' : 'pointer-events-none'}`}>
                        {/* Top section: badge + title + desc */}
                        <div>
                          {isTop && (
                            <div className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ring-1 ${!reverse ? 'bg-brand-50 text-brand-600 ring-brand-100' : 'bg-teal-50 text-teal-600 ring-teal-100'}`}>
                              {reverse ? 'Top Exam Prep' : 'Featured Destination'}
                            </div>
                          )}
                          <h3 className={`mb-2 text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-500 flex items-center gap-3 ${isTop ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <span className={`bg-gradient-to-br ${gradientColors[i % gradientColors.length]} bg-clip-text text-transparent`}>
                              {service.title}
                            </span>
                            {service.flag && (
                              <img 
                                src={service.flag} 
                                alt={`${service.title} flag`} 
                                className="h-6 w-auto object-contain rounded-md filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] select-none" 
                              />
                            )}
                          </h3>
                          <p className={`text-sm font-medium leading-relaxed line-clamp-3 transition-opacity duration-500 ${isTop ? 'text-slate-500 opacity-100' : 'text-slate-400 opacity-0'}`}>
                            {service.description}
                          </p>
                        </div>

                        {/* Memoji image for study abroad cards */}
                        {service.image && (
                          <div className="relative flex-1 flex items-center justify-center min-h-0">
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              className={`h-28 md:h-32 w-auto object-contain transition-all duration-700 select-none ${isTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-6 pointer-events-none'}`}
                              style={{ 
                                animation: isTop ? 'float 5s ease-in-out infinite' : 'none',
                                mixBlendMode: 'multiply'
                              }}
                            />
                          </div>
                        )}

                        {/* Rich visual interior for exam cards (no image) */}
                        {!service.image && service.features && (
                          <div className={`flex-1 flex flex-col justify-start gap-3 mt-4 min-h-0 transition-all duration-700 ${isTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                            <div className="grid grid-cols-2 gap-2">
                              {service.features.slice(0, 4).map((feat, fi) => {
                                const pillColors = !reverse
                                  ? ['bg-brand-50 text-brand-700 ring-brand-100', 'bg-sky-50 text-sky-700 ring-sky-100', 'bg-indigo-50 text-indigo-700 ring-indigo-100', 'bg-violet-50 text-violet-700 ring-violet-100']
                                  : ['bg-teal-50 text-teal-700 ring-teal-100', 'bg-emerald-50 text-emerald-700 ring-emerald-100', 'bg-cyan-50 text-cyan-700 ring-cyan-100', 'bg-green-50 text-green-700 ring-green-100'];
                                return (
                                  <div key={fi} className={`rounded-xl px-3 py-2.5 ring-1 ${pillColors[fi % pillColors.length]}`}>
                                    <div className="text-sm font-extrabold tracking-tight leading-none">{feat.highlight}</div>
                                    <div className="text-[9px] font-bold uppercase tracking-wider opacity-60 mt-1">{feat.label}</div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Compact metadata inline */}
                            {service.metadata && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {service.metadata.slice(0, 2).map((meta, mi) => (
                                  <span key={mi} className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-slate-100">
                                    <span className="text-slate-600">{meta.value}</span>
                                    <span>·</span>
                                    <span>{meta.label}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Explore Details link - always at bottom */}
                        <div className={`mt-auto pt-3 transition-all duration-500 ${isTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                          <Link
                            to={service.path}
                            className={`group/link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${!reverse ? 'text-slate-900 hover:text-brand-600' : 'text-slate-900 hover:text-teal-600'}`}
                          >
                            Explore Details
                            <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Dots Indicator */}
                <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 transition-all duration-300 rounded-full ${activeIndex === i ? 'w-8 bg-brand-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative overflow-hidden py-12 md:py-16 ${bgColor}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* Premium Split Header for Static Section */}
        <div className={`mb-16 grid grid-cols-1 gap-10 lg:gap-16 ${secondTitle ? 'lg:grid-cols-2 text-left' : 'items-center text-center'}`}>
          <div className="relative flex flex-col">
            {secondTitle && (
              <div className="absolute -right-8 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
            )}
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
              {description}
            </p>
            {linkText && (
              <div className="mt-8">
                <Link
                  to={linkTarget}
                  className="inline-flex w-max items-center justify-center rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_25px_-8px_rgba(13,94,183,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(13,94,183,0.6)] active:scale-95"
                >
                  {linkText}
                </Link>
              </div>
            )}
          </div>
          
          {secondTitle && (
            <div className="flex flex-col">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {secondTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
                {secondDescription}
              </p>
            </div>
          )}
        </div>
        {isStatic ? (
          <div className="grid w-full grid-cols-1 gap-8 lg:gap-12 md:grid-cols-2">
            {items.map((service, idx) => renderStaticCard(service, idx))}
          </div>
        ) : (
          <div className={`relative flex w-full overflow-hidden rounded-[2rem] shadow-inner ring-1 ring-slate-100/50`}>
            <div className="group flex w-max gap-8 px-4 py-8 animate-marquee-horizontal hover:[animation-play-state:paused] md:px-6">
              {scrollingItems.map((service, idx) => renderCard(service, idx))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default ServiceMarqueeRow;
