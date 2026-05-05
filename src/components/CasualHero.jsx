import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Users, GraduationCap, Briefcase, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import casualHeroImg from "../assets/casual-hero.png"; 
import casualLawImg from "../assets/casual-law.png";
import casualMedImg from "../assets/casual-med.png";

const CasualHero = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: casualHeroImg,
      field: "General Education",
      icon: GraduationCap,
      label: "Top 100 Universities",
      color: "text-brand-600",
      bgColor: "bg-brand-50"
    },
    {
      image: casualLawImg,
      field: "Law & Justice",
      icon: Briefcase,
      label: "Elite Law Schools",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      image: casualMedImg,
      field: "Medical & Health",
      icon: Stethoscope,
      label: "Global Medical Hubs",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const defaultContent = {
    badge: "Your Future, Simplified ✨",
    titleMain: "Dream Big. We'll",
    titleHighlight: "Handle the Rest.",
    subtitle: "Forget the stress of paperwork. We make your journey to international education smooth, fun, and totally achievable.",
    buttonText: "Let's Get Started"
  };

  const finalContent = { ...defaultContent, ...content };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-transparent">
      {/* Textured Background Elements */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(#1e293b 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
      />
      
      {/* Abstract Geometric Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-80 h-80 text-brand-100/40" 
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        </motion.svg>
        
        <motion.div 
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-10 opacity-20"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-orange-400">
            <path d="M10 10L30 30M30 10L10 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        <motion.div 
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-20 opacity-20"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-brand-300">
            <path d="M10 30Q30 10 50 30T90 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>

      {/* Dynamic Background Accents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className={`absolute top-20 right-10 w-64 h-64 ${slides[currentIndex].bgColor}/30 rounded-full blur-3xl`} />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-slate-100/30 rounded-full blur-[100px]" />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-orange-600 text-sm font-bold mb-6"
              >
                <Sparkles className="w-4 h-4" />
                {finalContent.badge}
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {finalContent.titleMain} <br />
                <span className="relative inline-block bg-gradient-to-r from-brand-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  {finalContent.titleHighlight}
                  <motion.svg 
                    viewBox="0 0 300 20" 
                    className="absolute -bottom-2 left-0 w-full h-4 text-orange-400/60"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <path 
                      d="M5 15Q150 5 295 15" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                    />
                  </motion.svg>
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              {finalContent.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/contact"
                className="group flex items-center gap-3 bg-brand-600 text-white font-bold px-10 py-5 rounded-full text-lg transition-all hover:bg-brand-700 hover:shadow-xl hover:-translate-y-1"
              >
                <span>{finalContent.buttonText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              <Link
                to="/about/company-profile"
                className="flex items-center gap-2 px-8 py-5 rounded-full font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Our Story
              </Link>
            </div>

            {/* Quick Trust Indicators */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-bold text-sm">5k+ Happy Students</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span className="font-bold text-sm">100+ Universities</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Content - Rotating Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white aspect-[4/5] md:aspect-square isolate transform-gpu bg-slate-50">
              <AnimatePresence mode="popLayout">
                <motion.img 
                  key={currentIndex}
                  src={slides[currentIndex].image} 
                  alt={slides[currentIndex].field} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Floating Field Badge - Changes with Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -top-6 -right-6 md:right-0 bg-white p-4 rounded-2xl shadow-xl z-20 border border-slate-50 flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${slides[currentIndex].bgColor} rounded-xl flex items-center justify-center`}>
                  {React.createElement(slides[currentIndex].icon, { className: `w-6 h-6 ${slides[currentIndex].color}` })}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Focus</p>
                  <p className="font-bold text-slate-900">{slides[currentIndex].field}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-6 md:left-0 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none">98%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visa Success</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CasualHero;
