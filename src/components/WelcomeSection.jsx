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
  const imageLabels = ["Your New Life", "Learning is Fun", "Amazing Team", "Student Hangouts"];

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
    "Learning That Fits You",
    "Smart AI Mock Tests",
    "Stress-Free Visa Help",
    "Support Even After You Land"
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="py-28 bg-[#FEFDFB] relative overflow-hidden"
    >
      {/* Decorative Blobs */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-orange-100/30 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-100/20 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Badge */}
        <motion.div variants={itemVariants} className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 px-6 py-3 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Together with Gina Abroad
          </span>
        </motion.div>

        {/* Main Grid — Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Image Showcase */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.06)] border-8 border-white bg-slate-100 aspect-[4/3] isolate transform-gpu">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={imageLabels[idx]}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-[1500ms] ease-in-out ${
                    idx === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 bg-white p-4 rounded-[1.5rem] shadow-xl z-20"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-brand-600 tracking-tight">5k+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Happy Students</span>
                </div>
              </motion.div>

              {/* Current image label */}
              <div className="absolute bottom-8 left-8 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                  <span className="text-slate-900 text-sm font-bold">{imageLabels[currentIndex]}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div variants={itemVariants} className="flex flex-col text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
              Why Choose{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-600">FETC?</span>
                <span className="absolute bottom-2 left-0 w-full h-4 bg-brand-100/60 -z-10 rounded-full" />
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10">
              We're more than just consultants. We're your friends on this big journey, making sure every step—from exams to your new dorm—is as easy as it should be.
            </p>

            {/* Highlight checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {highlights.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-4 group justify-center lg:justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  </div>
                  <span className="text-base font-bold text-slate-700">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link
                to="/about/company-profile"
                className="group flex items-center gap-3 bg-brand-600 text-white font-bold px-10 py-5 rounded-full text-lg transition-all hover:bg-brand-700 hover:shadow-xl hover:-translate-y-1"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-700 font-bold px-10 py-5 rounded-full text-lg transition-all hover:border-brand-200 hover:bg-slate-50"
              >
                Say Hello!
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bento Cards Row */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: "Learn Your Way",
              desc: "Casual, fun, and super effective language training with mentors who actually care.",
              gradient: "from-brand-500 to-brand-600",
              iconColor: "text-white",
              tag: "Learning"
            },
            {
              icon: Award,
              title: "Testing Made Easy",
              desc: "We're an official center for all the big exams. We'll help you ace them without the stress.",
              gradient: "from-orange-500 to-orange-600",
              iconColor: "text-white",
              tag: "Testing"
            },
            {
              icon: Globe,
              title: "Go Anywhere",
              desc: "10+ countries, hundreds of universities. We'll help you find the one that feels like home.",
              gradient: "from-teal-500 to-emerald-600",
              iconColor: "text-white",
              tag: "Global"
            },
            {
              icon: Sparkles,
              title: "Smart Futures",
              desc: "Our AI helps you figure out what you're naturally good at, so you pick the right career.",
              gradient: "from-purple-500 to-fuchsia-600",
              iconColor: "text-white",
              tag: "AI Powered"
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bg-white rounded-[3rem] p-10 border border-slate-50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
            >
              {/* Permanent soft background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
              
              {/* Subtle background glow on hover */}
              <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

              <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                    {card.tag}
                  </span>
                </div>
                <h3 className={`text-xl font-black mb-4 tracking-tight group-hover:bg-gradient-to-r ${card.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-slate-900`}>{card.title}</h3>
                <p className="text-base font-medium leading-relaxed text-slate-600 flex-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WelcomeSection;

