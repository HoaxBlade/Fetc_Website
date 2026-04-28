import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Plus, Search } from 'lucide-react';

const AdminPosts = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Blog Posts</h1>
          <p className="text-slate-500 font-medium text-sm italic">Share news, updates, and student success stories.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/100 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none" placeholder="Search posts..." />
          </div>
        </div>

        <div className="p-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="text-slate-400" size={24} />
          </div>
          <p className="text-slate-400 text-sm italic">No blog posts published yet.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPosts;
