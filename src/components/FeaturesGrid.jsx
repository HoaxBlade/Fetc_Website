import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, Trophy } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      title: "Expert 1-on-1 Mentors",
      desc: "Learn from industry elites with decades of success.",
      icon: Users,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "98% Visa Success",
      desc: "Highest success rate in visa processing globally.",
      icon: ShieldCheck,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "100% Result Boost",
      desc: "Accelerated learning modules for quick band scores.",
      icon: Zap,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "10+ Global Destinations",
      desc: "Recognized as the premier gateway for global studies.",
      icon: Trophy,
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 group flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
