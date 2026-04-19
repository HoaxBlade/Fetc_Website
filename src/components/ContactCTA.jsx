import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCTA = () => {
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden"
        >
          {/* Decorative mesh background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-[120px] -ml-32 -mb-32"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                Ready to Start Your <span className="text-brand-400">Global Chapter?</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium mb-10 max-w-md">
                Schedule your one-on-one session with our senior experts today. Success doesn't wait.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/my-account"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-full transition-all group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about/company-profile"
                  className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-white font-bold px-8 py-4 rounded-full transition-all"
                >
                  Our Values
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 space-y-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <PhoneCall className="w-5 h-5 text-brand-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Call Us Directly</p>
                  <p className="text-xl font-bold text-white">+91-8854347201</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <Mail className="w-5 h-5 text-brand-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Support</p>
                  <p className="text-xl font-bold text-white">consult@fetc.in</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
