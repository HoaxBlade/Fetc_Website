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
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (layout !== "split-overlapping" || !items || items.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000); // Shuffling every 5 seconds per user request
    return () => clearInterval(interval);
  }, [layout, items, isPaused]);

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
    <div key={idx} className={`flex w-[320px] shrink-0 flex-col justify-between rounded-[1.5rem] p-6 ring-1 ring-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] md:w-[350px] ${cardBg}`}>
      <div>
        <h3 className={`bg-gradient-to-br ${gradientColors[idx % gradientColors.length]} bg-clip-text mb-3 text-2xl font-bold tracking-tight text-transparent`}>
          {service.title}
        </h3>
        {service.links ? (
          <div className="space-y-3 mt-4">
             {service.links.map((link, lIdx) => (
               <a 
                 key={lIdx} 
                 href={link.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors group/link"
               >
                 <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover/link:bg-brand-50 transition-colors">
                   <Download size={14} className="text-slate-400 group-hover/link:text-brand-600" />
                 </div>
                 {link.label}
               </a>
             ))}
          </div>
        ) : (
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            {service.description && (service.description.length > 120 ? service.description.substring(0, 120) + "..." : service.description)}
          </p>
        )}
      </div>
      <div className="mt-8">
        {service.path ? (
          <Link
            to={service.path}
            className="group-hover:text-brand-600 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:text-brand-600"
          >
            Explore Details
            <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        ) : (
          <div className="h-4" /> // Spacing if no path
        )}
      </div>
    </div>
  );

  if (layout === "split-overlapping") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative overflow-hidden py-12 md:py-20 ${bgColor}`}
      >
        {/* Fresh Gradient Block (Single soft glow) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <div className={`grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 items-center ${reverse ? 'flex-row-reverse lg:flex-row-reverse' : ''}`}>

            {/* Text column (Order 2 on mobile if reversed, Order 1 on desktop if not) */}
            <div className={`flex flex-col items-start lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 mb-6 ring-1 ring-brand-100">
                {badgeText}
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl text-balance">
                {title}
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-slate-500">
                {description}
              </p>

              {/* Trust Stats Indicator */}
              {stats && stats.length > 0 && (
                <div className="mt-10 grid w-full grid-cols-3 gap-4 border-y border-slate-100 py-8">
                  {stats.map((stat, idx) => (
                    <div key={idx} className={`${idx !== 0 ? 'border-l border-slate-100 pl-4' : ''}`}>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <Link
                  to={items[activeIndex]?.path || linkTarget}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-10 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 active:scale-95"
                >
                  {linkText}
                </Link>
              </div>
            </div>

            {/* Cards column (Order 1 on mobile if reversed, Order 2 on desktop if not) */}
            <div
              className={`relative flex w-full items-center justify-center lg:col-span-7 min-h-[550px] ${reverse ? 'lg:justify-start lg:order-1' : 'lg:justify-end lg:order-2'}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* World Map Background (Faint SVG) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                <svg viewBox="0 0 1000 500" className={`w-full max-w-2xl text-slate-900 ${reverse ? 'scale-x-[-1]' : ''}`} fill="currentColor">
                  <path d="M150,200 Q200,100 300,150 T450,200 T600,150 T750,200 T900,150 V350 Q800,450 650,400 T450,450 T250,400 T100,450 Z" opacity="0.5" />
                  <circle cx="200" cy="150" r="5" />
                  <circle cx="450" cy="250" r="3" />
                  <circle cx="700" cy="180" r="4" />
                  <circle cx="850" cy="300" r="3" />
                </svg>
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
              <div className="relative h-[400px] w-[320px] md:h-[450px] md:w-[380px]">
                {items.map((service, i) => {
                  const offsetIndex = (i - activeIndex + items.length) % items.length;

                  // Display top 4 visually for more depth
                  const isVisible = offsetIndex < 4;
                  const isTop = offsetIndex === 0;

                  // Styling based on depth
                  const scale = isVisible ? 1 - (offsetIndex * 0.05) : 0.8;
                  const translateY = isVisible ? offsetIndex * 20 : 60;
                  const translateX = isVisible ? offsetIndex * 8 : 20;

                  const zIndex = items.length - offsetIndex;
                  const opacity = isVisible ? 1 - (offsetIndex * 0.2) : 0;

                  // Consistent stack rotation per depth level
                  const rotate = isVisible ? (offsetIndex === 1 ? -3 : offsetIndex === 2 ? 3 : offsetIndex === 3 ? -1.5 : 0) : 0;

                  return (
                    <div
                      key={i}
                      className={`absolute top-0 left-0 flex h-full w-full flex-col justify-between rounded-[2.5rem] p-8 ring-1 ring-slate-200/60 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] origin-center ${cardBg}`}
                      style={{
                        zIndex,
                        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                        opacity,
                        boxShadow: isTop ? '0 40px 80px -15px rgba(0,0,0,0.12)' : '0 10px 30px -5px rgba(0,0,0,0.03)',
                        cursor: isTop ? 'default' : 'pointer'
                      }}
                      onClick={() => {
                        if (!isTop) setActiveIndex(i);
                      }}
                    >
                      <div>
                        {/* Status chip for top card */}
                        {isTop && (
                          <div className="mb-4 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 ring-1 ring-brand-100">
                            Featured Destination
                          </div>
                        )}
                        <h3 className={`bg-gradient-to-br ${gradientColors[i % gradientColors.length]} bg-clip-text mb-4 text-3xl font-extrabold tracking-tight text-transparent transition-opacity duration-500`}>
                          {service.title}
                        </h3>
                        <p className={`text-sm font-medium leading-relaxed transition-opacity duration-500 ${isTop ? 'text-slate-600 opacity-100' : 'text-slate-400 opacity-0'}`}>
                          {service.description}
                        </p>
                      </div>

                      <div className={`mt-6 transition-all duration-500 ${isTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <Link
                          to={service.path}
                          className="group/link inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:text-brand-600"
                        >
                          Explore Details
                          <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
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

        {/* iOS Style Centered Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-500">
            {description}
          </p>
          <div className="mt-8">
            <Link
              to={linkTarget}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 active:scale-95"
            >
              {linkText}
            </Link>
          </div>
        </div>
        {isStatic ? (
          <div className="flex w-full justify-center">
            <div className="flex flex-wrap justify-center gap-8">
              {items.map((service, idx) => renderCard(service, idx))}
            </div>
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
