import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Award, Globe, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Import the 4 carousel images
import welcome1 from "../assets/fetc-about-us/welcome-1.jpeg";
import welcome2 from "../assets/fetc-about-us/welcome-2.jpeg";
import welcome3 from "../assets/fetc-about-us/welcome-3.jpeg";
import welcome4 from "../assets/fetc-about-us/welcome-4.jpeg";

const WelcomeSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [welcome1, welcome2, welcome3, welcome4];
  const imageLabels = ["Campus Life", "Classroom Sessions", "Team Activities", "Student Events"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const highlights = [
    "Personalized Learning Paths",
    "AI-Driven Mock Testing",
    "End-to-End Visa Support",
    "Post-Landing Assistance"
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="py-28 bg-transparent relative overflow-hidden"
    >
      {/* Decorative Blobs */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-brand-100/20 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-teal-100/15 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Badge */}
        <motion.div variants={itemVariants} className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 px-4 py-2 bg-brand-50 rounded-full ring-1 ring-brand-100">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gina Abroad
          </span>
        </motion.div>

        {/* Main Grid — Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Image Showcase */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 bg-slate-100 aspect-[4/3]">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={imageLabels[idx]}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-[1500ms] ease-in-out transform ${
                    idx === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  }`}
                />
              ))}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-2xl border border-white/30 p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white tracking-tight">5000+</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 mt-1">Students Placed</span>
                </div>
              </motion.div>

              {/* Current image label */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-white/20 backdrop-blur-2xl border border-white/20 rounded-full px-4 py-2">
                  <span className="text-white text-xs font-bold">{imageLabels[currentIndex]}</span>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="h-1.5 rounded-full bg-white/30 overflow-hidden transition-all duration-500 cursor-pointer"
                    style={{ width: idx === currentIndex ? "28px" : "8px" }}
                  >
                    <div
                      className={`h-full bg-white transition-all ${
                        idx === currentIndex ? "w-full duration-[5000ms] ease-linear" : "w-0 duration-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative floating element behind image */}
            <div className="absolute -bottom-6 -right-6 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-brand-100/50 to-teal-100/50 -z-10" />
          </motion.div>

          {/* Right — Content */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent font-black">
                FETC
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
              Building your international future with trusted experts for exam preparation, admissions, and career direction. 
              We're not just consultants — we're your partners in success.
            </p>

            {/* Highlight checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about/company-profile"
                className="group inline-flex items-center gap-3 bg-slate-900 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-brand-600 hover:shadow-[0_20px_60px_rgba(13,94,183,0.25)] hover:-translate-y-0.5"
              >
                <span>Explore Our Mission</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 border-2 border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:border-slate-900 hover:bg-slate-50"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bento Cards Row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BookOpen,
              title: "English Language Training",
              desc: "Blended & Hybrid training to achieve maximum proficiency with elite certified mentors.",
              gradient: "from-blue-500 to-indigo-600",
              tag: "Core Program"
            },
            {
              icon: Award,
              title: "Authorized Exam Centre",
              desc: "Official testing services for IELTS, PTE, TOEFL, and Pearson Versant examinations.",
              gradient: "from-sky-500 to-cyan-600",
              tag: "Official Partner"
            },
            {
              icon: Globe,
              title: "Global Study Abroad",
              desc: "Expert support in program selection, application processes, and visa requirements.",
              gradient: "from-teal-500 to-emerald-600",
              tag: "10+ Countries"
            },
            {
              icon: Sparkles,
              title: "Career Assessment",
              desc: "Discover your ideal professional path with our behavioral and occupational analysis.",
              gradient: "from-purple-500 to-fuchsia-600",
              tag: "AI Powered"
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
            >
              {/* Subtle background glow on hover */}
              <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{card.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500 flex-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WelcomeSection;
