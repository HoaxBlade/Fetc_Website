import React from 'react';
import { motion } from 'framer-motion';

const GenericSection = ({ title, content, index }) => {
  if (!title && !content) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-[400px] h-[400px] bg-slate-50 rounded-full blur-[100px] pointer-events-none opacity-50`} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end md:text-right'} max-w-3xl ${index % 2 === 0 ? '' : 'ml-auto'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              {title}
            </h2>
            <div 
              className="text-lg text-slate-500 font-medium leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, '<br />') }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GenericSection;
