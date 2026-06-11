import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { examData } from "../data/siteData";
import { ArrowRight, Award, Clock, Calendar, CheckCircle2, BadgePercent } from "lucide-react";

export default function ExamTrainingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Emojis for each exam type
  const examIcons = {
    selt: "📜",
    "gre-gmat": "📈",
    sat: "🎓",
    "idp-for-ielts": "💬",
    toefl: "🎧",
    pte: "💻"
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-50/70 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[450px] h-[300px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Hero Section */}
      <section className="relative pt-20 pb-12 px-4 md:px-8 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 shadow-sm">
            <Award className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Accredited Prep Programs
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
        >
          Master Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500">
            Standardized Exams
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
        >
          Access top-tier language training, computer-based mock modules, and expert mentors. Achieve the target score you need to study, work, or live abroad.
        </motion.p>
      </section>

      {/* Exam Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Object.entries(examData).map(([key, exam]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              onClick={() => navigate(`/exam-training/${key}`)}
              className="group relative bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 hover:ring-brand-200/50 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Hover background glow */}
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-50/35 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* ShortLabel & Custom Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
                    {exam.shortLabel}
                  </span>
                  <span className="text-3xl filter drop-shadow-sm select-none">
                    {examIcons[key] || "📝"}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                  {exam.name}
                </h2>

                {/* Description */}
                <p className="text-slate-500 text-sm font-semibold leading-relaxed mb-6 line-clamp-3">
                  {exam.description}
                </p>

                {/* Key metadata badges */}
                <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-50/50 group-hover:bg-brand-50/20 p-4 rounded-2xl border border-slate-100/50 transition-colors duration-500">
                  {exam.metadata && exam.metadata.slice(0, 4).map((meta, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {meta.label}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700 truncate">
                        {meta.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-4 mt-auto border-t border-slate-50">
                <div className="group/btn inline-flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-slate-900 transition-colors hover:text-brand-600">
                  Explore Test Prep
                  <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
