import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, Trophy, ArrowUpRight } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      title: "Expert 1-on-1 Mentors",
      desc: "Learn from industry elites with decades of experience guiding students to global success.",
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/10",
      metric: "50+",
      metricLabel: "Elite Mentors"
    },
    {
      title: "98% Visa Success",
      desc: "Highest success rate in visa processing across UK, USA, Canada, and Australia.",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/10",
      metric: "98%",
      metricLabel: "Approval Rate"
    },
    {
      title: "100% Result Boost",
      desc: "Accelerated learning modules and AI-driven mock tests for guaranteed band improvements.",
      icon: Zap,
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/10",
      metric: "2+",
      metricLabel: "Band Increase"
    },
    {
      title: "10+ Destinations",
      desc: "Recognized as the premier gateway for international education across four continents.",
      icon: Trophy,
      gradient: "from-purple-500 to-fuchsia-600",
      bgGlow: "bg-purple-500/10",
      metric: "10+",
      metricLabel: "Countries"
    }
  ];

  return (
    <section className="py-24 bg-transparent relative z-10 overflow-hidden">
      {/* Section background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-100/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 px-4 py-2 bg-brand-50 rounded-full ring-1 ring-brand-100">
            Why Choose FETC
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Built for <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Every metric is a promise we deliver on. Here's what sets us apart from every other consultancy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white rounded-[2rem] border border-slate-100 p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2 cursor-default"
            >
              {/* Hover glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${f.bgGlow} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              {/* Icon */}
              <div className={`relative w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-brand-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500 mb-6">
                  {f.desc}
                </p>

                {/* Metric pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-black bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent`}>
                      {f.metric}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {f.metricLabel}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-300" />
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

export default FeaturesGrid;
