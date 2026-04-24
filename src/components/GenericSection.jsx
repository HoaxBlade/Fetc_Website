import React from 'react';
import { motion } from 'framer-motion';

const GenericSection = ({ title, content, image, index }) => {
  if (!title && !content) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-[400px] h-[400px] bg-slate-50 rounded-full blur-[100px] pointer-events-none opacity-50`} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className={`grid grid-cols-1 ${image ? 'lg:grid-cols-2 gap-12 lg:gap-20 items-center' : ''}`}>
          
          {/* Image Column (if exists) */}
          {image && (
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative ${index % 2 === 0 ? '' : 'lg:order-2'}`}
            >
               <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                  <img src={image} alt={title} className="w-full h-full object-cover min-h-[400px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
               </div>
               {/* Decorative dots */}
               <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} w-24 h-24 opacity-20`} style={{ backgroundImage: 'radial-gradient(#1e293b 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }} />
            </motion.div>
          )}

          <div className={`flex flex-col ${image ? '' : (index % 2 === 0 ? 'md:items-start max-w-3xl' : 'md:items-end md:text-right max-w-3xl ml-auto')}`}>
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
      </div>
    </section>
  );
};

export default GenericSection;
