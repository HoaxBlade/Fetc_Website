import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Bell } from 'lucide-react';

const AdminNewsFlash = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">News Flash</h1>
          <p className="text-slate-500 font-medium text-sm italic">Broadcast important announcements across the website.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-amber-600" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">No active news flash announcements.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminNewsFlash;
