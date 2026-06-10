import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { countryData } from "../data/siteData";
import { ArrowRight, Globe } from "lucide-react";

export default function StudyAbroadListingPage() {
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 px-4 py-2 bg-brand-50 rounded-full border border-brand-100 shadow-sm">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            Explore the World
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
        >
          Choose Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-500 to-teal-500">
            Study Destination
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
        >
          We've helped thousands of students settle in over 10+ countries. Pick your dream destination and let us handle the admissions, visa preparation, and landing guidelines.
        </motion.p>
      </section>

      {/* Country Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Object.entries(countryData).map(([key, country]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              onClick={() => navigate(`/study-abroad/${key}`)}
              className="group relative bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 hover:ring-brand-200/50 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Soft background glows on hover */}
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-50/35 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                {/* Flag and Heading */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    {country.name}
                    {country.flag && (
                      <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="h-5 w-auto object-contain rounded-md filter drop-shadow-sm select-none"
                      />
                    )}
                  </h2>
                </div>

                {/* Memoji Logo Container */}
                <div className="h-40 flex items-center justify-center mb-6 bg-slate-50/50 rounded-3xl p-4 border border-slate-100/50 group-hover:bg-brand-50/30 transition-colors duration-500">
                  {country.image ? (
                    <img
                      src={country.image}
                      alt={`${country.name} memoji`}
                      className="h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                      style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.06))" }}
                    />
                  ) : (
                    <span className="text-4xl">🎓</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-base font-semibold leading-relaxed text-slate-500 mb-8">
                  {country.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-4 mt-auto border-t border-slate-50">
                <div
                  className="group/btn inline-flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-slate-900 transition-colors hover:text-brand-600"
                >
                  Explore Universities
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
