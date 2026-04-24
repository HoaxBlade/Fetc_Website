import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, GraduationCap, Play } from "lucide-react";
import { Link } from "react-router-dom";
import banner from "../assets/logo/fetc banner.png";

const Hero = ({ content: propsContent }) => {
  // Dynamic Content State
  const [content, setContent] = useState({
    badge: "Trusted Global Guidance",
    titleMain: "Empower Your",
    titleHighlight: "Global Journey",
    subtitle: "From elite exam training to seamless visa processing, we provide the strategic guidance you need to conquer international education.",
    buttonText: "Start Your Journey"
  });

  // Animated counters
  const [counts, setCounts] = useState({ universities: 0, success: 0, destinations: 0, students: 0 });
  const targets = useMemo(() => ({ universities: 100, success: 98, destinations: 10, students: 5000 }), []);

  useEffect(() => {
    // 1. Handle dynamic content (Prop first, then fetch)
    if (propsContent) {
      setContent(prev => ({ ...prev, ...propsContent }));
    } else {
      const fetchContent = async () => {
        try {
          const response = await fetch('/api/pages/home');
          const data = await response.json();
          if (data.success && data.page.content?.hero) {
            setContent(prev => ({ ...prev, ...data.page.content.hero }));
          }
        } catch (err) {
          console.warn("Using fallback hero content:", err);
        }
      };
      fetchContent();
    }

    // 2. Handle animated counters
    setCounts({ universities: 0, success: 0, destinations: 0, students: 0 });
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounts({
        universities: Math.floor(targets.universities * progress),
        success: Math.floor(targets.success * progress),
        destinations: Math.floor(targets.destinations * progress),
        students: Math.floor(targets.students * progress)
      });
      if (currentStep >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [propsContent, targets]); // Re-run if props or targets change

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-100/40 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-[150px] translate-y-1/2 pointer-events-none z-0" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Banner & Content Container */}
      <div className="relative w-full min-h-[650px] lg:h-[800px] flex items-center justify-center overflow-hidden">
        {/* Banner Image Background */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1.2 }}
            src={content.bgImage || banner}
            alt="UK Education Banner"
            className="w-full h-full object-cover object-center lg:object-[center_25%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        </div>

        {/* Floating Glass Cards - Integrated with banner */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] bg-white/80 backdrop-blur-xl border border-white/60 p-3 rounded-2xl shadow-xl hidden lg:block z-20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Success Rate</p>
              <p className="text-base font-bold text-slate-900 leading-none">98% <span className="text-brand-600 text-[10px] font-bold">Visa</span></p>
            </div>
          </div>
        </motion.div>

        {/* Content Box - Positioned DIRECTLY on Top */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full">
          <div className="max-w-2xl space-y-6 text-center lg:text-left bg-white/70 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-white/60 mx-auto lg:mx-0 relative overflow-hidden group">
            {/* Subtle light leak effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-200/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand-300/30 transition-colors duration-700" />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-50/50 border border-brand-100/50 text-brand-600 text-[10px] font-bold uppercase tracking-[0.25em] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                {content.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                {content.titleMain} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500">{content.titleHighlight}</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                {content.subtitle}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 bg-slate-900 text-white font-bold px-10 py-4.5 rounded-2xl transition-all duration-500 hover:bg-brand-600 hover:shadow-[0_20px_50px_rgba(13,94,183,0.3)] hover:-translate-y-1.5"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <button className="group inline-flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 font-bold hover:text-slate-900 transition-all">
                <div className="w-14 h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Play className="w-5 h-5 text-brand-600 fill-brand-600" />
                </div>
                <span className="text-base tracking-tight">Watch Success Stories</span>
              </button>
            </motion.div>

            {/* Counter Stats Section - More Compact */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/40 backdrop-blur-md rounded-[2rem] p-5 border border-white/40 shadow-inner"
            >
              <div className="text-center md:border-r border-slate-200/60 last:border-0 px-2 group/stat">
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover/stat:text-brand-600 transition-colors">{counts.universities}+</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Universities</p>
              </div>
              <div className="text-center md:border-r border-slate-200/60 last:border-0 px-2 group/stat">
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover/stat:text-brand-600 transition-colors">{counts.success}%</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Visa Success</p>
              </div>
              <div className="text-center md:border-r border-slate-200/60 last:border-0 px-2 group/stat">
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover/stat:text-brand-600 transition-colors">{counts.destinations}+</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Countries</p>
              </div>
              <div className="text-center px-2 group/stat">
                <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover/stat:text-brand-600 transition-colors">{counts.students.toLocaleString()}+</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Students</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
