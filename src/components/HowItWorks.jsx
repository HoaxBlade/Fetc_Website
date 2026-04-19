import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, ClipboardCheck, PlaneTakeoff } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Discovery Call",
      desc: "Connect with our experts to map out your global ambitions.",
      icon: MousePointer2,
      color: "bg-brand-600 text-white"
    },
    {
      title: "Strategic Training",
      desc: "Enroll in our high-precision prep programs (IELTS, PTE, etc.).",
      icon: ClipboardCheck,
      color: "bg-slate-900 text-white"
    },
    {
      title: "Arrival & Success",
      desc: "Secure your visa and begin your international journey.",
      icon: PlaneTakeoff,
      color: "bg-teal-500 text-white"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#F8F9FA]/50">
      {/* Connector Line (Desktop) */}
      <div className="absolute top-[45%] left-1/4 right-1/4 h-0.5 border-t border-dashed border-slate-200 hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-4 px-3 py-1 bg-brand-50 rounded-full">
            Your Success Blueprint
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            How We Get You There
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mb-8 shadow-xl relative transition-transform duration-500 group-hover:scale-110`}>
                <step.icon className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-black text-slate-900 shadow-md">
                  0{idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-base font-medium leading-relaxed text-slate-500 max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
