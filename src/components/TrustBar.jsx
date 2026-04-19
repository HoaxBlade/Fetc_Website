import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, GraduationCap, School, Building2, Building, Library } from 'lucide-react';

const TrustBar = () => {
  const partners = [
    { name: "Oxford Style", icon: Landmark },
    { name: "Global Edu", icon: GraduationCap },
    { name: "Uni West", icon: School },
    { name: "Scholar Hub", icon: Building2 },
    { name: "Elite Academy", icon: Building },
    { name: "Legacy Lib", icon: Library },
    { name: "Future Uni", icon: GraduationCap },
    { name: "Pioneer Inst", icon: Building2 },
  ];

  // Double the partners for seamless marquee
  const scrollingPartners = [...partners, ...partners];

  return (
    <div className="py-10 bg-white/50 backdrop-blur-sm border-y border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Trusted by 100+ Global Universities & Partners
        </p>
      </div>
      
      <div className="relative flex">
        <motion.div 
          className="flex gap-12 md:gap-24 items-center whitespace-nowrap px-4 md:px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {scrollingPartners.map((partner, idx) => (
            <div key={idx} className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-brand-50 transition-colors duration-300">
                <partner.icon className="w-6 h-6 text-slate-400 group-hover:text-brand-600 transition-colors" />
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fcfdfe] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fcfdfe] to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default TrustBar;
