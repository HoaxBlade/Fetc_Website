import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAssetUrl } from '../apiConfig';

// Import fallback review images
import UditImg from '../assets/reviews/Udit Gangnami.png';
import MansiImg from '../assets/reviews/Mansi Savani USA F1 Visa.png';
import NaitikImg from '../assets/reviews/Naitik Patel Ireland Student Visa.png';
import PrajalImg from '../assets/reviews/Prajal Sonariya USA F1 Visa.png';
import PrathanaImg from '../assets/reviews/Prathana Dankhara USA F1 visa.png';
import RutvikImg from '../assets/reviews/Rutvik Tejani USA F1 Visa.png';
import SamarthImg from '../assets/reviews/Samarth Pachchigar Spain Student Visa.png';

const defaultSuccessStudents = [
  {
    name: "Mansi Savani",
    achievement: "USA F1 Visa",
    country: "🇺🇸",
    image: MansiImg,
  },
  {
    name: "Naitik Patel",
    achievement: "Ireland Student Visa",
    country: "🇮🇪",
    image: NaitikImg,
  },
  {
    name: "Prajal Sonariya",
    achievement: "USA F1 Visa",
    country: "🇺🇸",
    image: PrajalImg,
  },
  {
    name: "Prathana Dankhara",
    achievement: "USA F1 Visa",
    country: "🇺🇸",
    image: PrathanaImg,
  },
  {
    name: "Rutvik Tejani",
    achievement: "USA F1 Visa",
    country: "🇺🇸",
    image: RutvikImg,
  },
  {
    name: "Samarth Pachchigar",
    achievement: "Spain Student Visa",
    country: "🇪🇸",
    image: SamarthImg,
  },
];

const SuccessStories = ({ data }) => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Dynamic Star Student Data
  const starData = data?.starStudent || {};
  const starName = starData.name || "Udit Gangnani";
  const starBadge = starData.badge || "Full Scholarship";
  const starUniversity = starData.university || "University of Pisa, Italy";
  const starDescription = starData.description || "Driven by a passion for higher education, Udit placed his trust in FETC to guide his journey abroad. With our dedicated mentorship and strategic support, he earned a fully funded scholarship to pursue Data Science at the University of Pisa, Italy.";
  const starImage = starData.image ? getAssetUrl(starData.image) : UditImg;

  // Dynamic Top Students Array (limit to max 9)
  const dynamicStudentsList = (data?.topStudents && Array.isArray(data.topStudents) && data.topStudents.length > 0)
    ? data.topStudents.slice(0, 9)
    : defaultSuccessStudents;

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [dynamicStudentsList]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = 320;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-10 md:py-14 bg-transparent relative z-10 overflow-hidden" id="success-stories">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-emerald-200/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-200/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-5 px-4 py-2 bg-emerald-50 rounded-full ring-1 ring-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            Student Spotlights
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Dreams Turned{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Reality
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Real students. Real visas. Real success stories that inspire the next generation of global achievers.
          </p>
        </motion.div>

        {/* Spotlight Card — Star Student */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mb-14"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.15)]">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-brand-500/10 rounded-full blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative flex-shrink-0"
              >
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-[2rem] overflow-hidden ring-4 ring-emerald-500/20 shadow-2xl bg-slate-800">
                  <img
                    src={starImage}
                    alt={starName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Floating badge */}
                {starBadge && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {starBadge}
                  </motion.div>
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex-1 text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4 px-3 py-1.5 bg-emerald-500/10 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Featured Success Story
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                  {starName}
                </h3>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-5 max-w-lg whitespace-pre-line">
                  {starDescription}
                </p>
                {starUniversity && (
                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                      🎓 {starUniversity}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Student Cards Carousel */}
        <div className="relative">
          {/* Scroll Buttons */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Top FETC Achievers ({dynamicStudentsList.length})
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${canScrollLeft ? 'bg-white shadow-md border-slate-200 hover:bg-slate-50 hover:scale-105 cursor-pointer text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${canScrollRight ? 'bg-white shadow-md border-slate-200 hover:bg-slate-50 hover:scale-105 cursor-pointer text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pt-2 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dynamicStudentsList.map((student, idx) => {
              const studentImg = student.image ? getAssetUrl(student.image) : MansiImg;
              return (
                <motion.div
                  key={student.name + idx}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                  className="group flex-shrink-0 snap-start w-[260px] md:w-[280px]"
                >
                  <div className="relative bg-white rounded-[1.8rem] overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2" style={{ transform: 'translate3d(0, 0, 0)' }}>
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden bg-slate-100">
                      <img
                        src={studentImg}
                        alt={`${student.name} — ${student.achievement}`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translate3d(0, 0, 0)' }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Country flag floating */}
                      {student.country && (
                        <div className="absolute top-4 right-4 text-xl bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center justify-center shadow-md font-bold text-slate-800">
                          {student.country}
                        </div>
                      )}

                      {/* Bottom info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h4 className="text-lg font-bold text-white tracking-tight">{student.name}</h4>
                        <p className="text-xs text-white/80 font-semibold">{student.achievement}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
