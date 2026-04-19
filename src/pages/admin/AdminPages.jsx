import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Eye } from 'lucide-react';

const AdminPages = () => {
  const pages = [
    { name: "Home Page", slug: "/", status: "Published", lastEdited: "2 hours ago" },
    { name: "About Us", slug: "/about", status: "Published", lastEdited: "1 day ago" },
    { name: "Contact Us", slug: "/contact", status: "Draft", lastEdited: "3 days ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Pages Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Edit and manage your website structure.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
          <Plus size={18} /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pages.map((page, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                <FileText size={20} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {page.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{page.name}</h3>
            <p className="text-xs text-slate-400 font-medium mb-6 italic">{page.slug}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Edited {page.lastEdited}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminPages;
