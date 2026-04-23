import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, PhoneCall, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCTA = () => {
  return (
    <section className="py-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-slate-950" />

          {/* Animated Mesh Gradients */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/15 rounded-full blur-[120px]"
          />

          {/* Dot grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 md:p-16 lg:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              
              {/* Left — Text & CTA */}
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-100 mb-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full ring-1 ring-white/10"
                >
                  Let's Connect
                </motion.span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                  Ready to Start Your{" "}
                  <span className="bg-gradient-to-r from-brand-100 via-teal-300 to-brand-100 bg-clip-text text-transparent">
                    Global Chapter?
                  </span>
                </h2>
                <p className="text-slate-400 text-lg font-medium mb-10 max-w-md leading-relaxed">
                  Schedule your one-on-one session with our senior experts today. Your success story begins with a single conversation.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span className="relative z-10">Book Free Consultation</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  <Link
                    to="/about/company-profile"
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/5 backdrop-blur-sm"
                  >
                    Our Values
                  </Link>
                </div>
              </div>

              {/* Right — Contact Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: PhoneCall,
                    label: "Call Us Directly",
                    value: "+91-8854347201",
                    gradient: "from-brand-600 to-blue-600"
                  },
                  {
                    icon: Mail,
                    label: "Email Support",
                    value: "consult@fetc.in",
                    gradient: "from-teal-500 to-emerald-600"
                  },
                  {
                    icon: MapPin,
                    label: "Visit Our Centre",
                    value: "Surat, Gujarat, India",
                    gradient: "from-purple-500 to-fuchsia-600"
                  },
                  {
                    icon: Clock,
                    label: "Working Hours",
                    value: "Mon – Sat, 9AM – 7PM",
                    gradient: "from-amber-500 to-orange-600"
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="group flex items-center gap-5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/15 cursor-default"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-white">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
