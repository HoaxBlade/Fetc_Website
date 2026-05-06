import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, ClipboardCheck, PlaneTakeoff, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Discovery Call",
      desc: "Connect with our senior experts to map out your ambitions, evaluate your profile, and build a personalized roadmap.",
      icon: MousePointer2,
      gradient: "from-brand-600 to-blue-600",
      shadowColor: "shadow-brand-200/40",
      number: "01"
    },
    {
      title: "Strategic Training",
      desc: "Enroll in our high-precision prep programs — IELTS, PTE, TOEFL — with AI-driven mock tests and 1-on-1 mentoring.",
      icon: ClipboardCheck,
      gradient: "from-orange-500 to-amber-600",
      shadowColor: "shadow-orange-200/40",
      number: "02"
    },
    {
      title: "Arrival & Success",
      desc: "Secure your visa, finalize admissions, and begin your international journey with end-to-end post-landing support.",
      icon: PlaneTakeoff,
      gradient: "from-teal-500 to-emerald-600",
      shadowColor: "shadow-teal-200/40",
      number: "03"
    }
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-transparent">
      {/* Ambient background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-5 px-4 py-2 bg-brand-50 rounded-full ring-1 ring-brand-100">
            Your Success Blueprint
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
            How We Get You{" "}
            <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">There</span>
          </h2>
          <p className="mt-5 text-lg text-slate-500 font-medium max-w-xl mx-auto">
            A proven 3-step process that has helped 5,000+ students achieve their global education dreams.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-[60px] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-px bg-gradient-to-r from-brand-200 via-slate-200 to-teal-200 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2">
                  {/* Step number + Icon row */}
                  <div className="flex items-center gap-5 mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-xl ${step.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors tracking-tighter">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base font-medium leading-relaxed text-slate-500 mb-8">
                    {step.desc}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-brand-600 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
