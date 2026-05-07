import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, GraduationCap, School, Building2, Building, Library, Award, BookOpen } from 'lucide-react';

const TrustBar = ({ message }) => {
  const partners = [
    { name: "Oxford Brookes", icon: Landmark },
    { name: "QA Universities", icon: GraduationCap },
    { name: "Global Education", icon: School },
    { name: "Scholar Hub", icon: Building2 },
    { name: "Elite Academy", icon: Building },
    { name: "IDP Education", icon: Award },
    { name: "Future Studies", icon: GraduationCap },
    { name: "Pioneer Inst", icon: Building2 },
    { name: "Learning Hub", icon: BookOpen },
    { name: "Legacy Institute", icon: Library },
  ];

  // Triple for seamless loop
  const scrollingPartners = [...partners, ...partners, ...partners];

  return (
    <div className="py-10 lg:py-8 bg-white/20 backdrop-blur-md border-y border-white/20 overflow-hidden relative">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-50/10 via-transparent to-teal-50/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400"
        >
          {message || (
            <>Working with <span className="text-brand-600">100+</span> amazing universities to get you there</>
          )}
        </motion.p>
      </div>

      <div className="relative flex">
        <motion.div
          className="flex gap-8 md:gap-12 items-center whitespace-nowrap px-4 md:px-6"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {scrollingPartners.map((partner, idx) => (
            <div key={idx} className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-slate-50/80 group-hover:bg-brand-50 transition-all duration-300 group-hover:shadow-sm">
                <partner.icon className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-colors duration-300" />
              </div>
              <span className="text-sm font-bold text-slate-300 group-hover:text-slate-600 transition-colors duration-300 tracking-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gradient Masks — wider for premium feel */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white/30 via-white/10 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white/30 via-white/10 to-transparent z-10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TrustBar;
