import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, Download } from 'lucide-react';

const AdminCourses = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Courses Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your curriculum and student enrollments.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
          <Plus size={18} /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Courses</p>
          <h3 className="text-2xl font-bold text-slate-800">12</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">Active Students</p>
          <h3 className="text-2xl font-bold text-slate-800">0</h3>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search courses..." 
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Filter size={18} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="p-16 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-brand-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
          <p className="text-slate-400 text-sm italic">Start by adding your first course to the curriculum.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCourses;
