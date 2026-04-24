import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Eye, Loader2, Globe, Clock, ChevronRight, X, Save, Edit, Info } from 'lucide-react';

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pages');
      const data = await response.json();
      if (data.success) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePage = async (id, updatedData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (data.success) {
        setPages(pages.map(p => p.id === id ? data.page : p));
        setSelectedPage(null); // Close modal on success
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      {/* Page Editor Modal */}
      <AnimatePresence>
        {selectedPage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPage(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                      <Edit size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Page Editor</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedPage.slug}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPage(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Display Title</label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-bold text-slate-700"
                      value={selectedPage.title}
                      onChange={(e) => setSelectedPage({...selectedPage, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Slug Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Page Slug (URL)</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-600"
                        value={selectedPage.slug}
                        onChange={(e) => setSelectedPage({...selectedPage, slug: e.target.value})}
                      />
                    </div>
                    {/* Status Select */}
                    <div className="space-y-2 relative">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Visibility Status</label>
                      <div className="relative">
                        <select 
                          className="w-full px-6 py-4 bg-slate-100/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                          value={selectedPage.status}
                          onChange={(e) => setSelectedPage({...selectedPage, status: e.target.value})}
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="PUBLISHED">PUBLISHED</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight className="rotate-90" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                    <div className="flex items-center gap-2 mb-4 text-blue-600">
                      <Info size={16} />
                      <h4 className="text-xs font-black uppercase tracking-widest pt-0.5">Search Engine Optimization</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-blue-400/80 uppercase tracking-tighter mb-1 block">Meta Title</label>
                        <input 
                          className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-all text-slate-600 font-medium"
                          value={selectedPage.seo_title || ""}
                          onChange={(e) => setSelectedPage({...selectedPage, seo_title: e.target.value})}
                          placeholder="Short, catchy title for Google..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-blue-400/80 uppercase tracking-tighter mb-1 block">Meta Description</label>
                        <textarea 
                          className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-all text-slate-600 font-medium h-20 resize-none"
                          value={selectedPage.seo_description || ""}
                          onChange={(e) => setSelectedPage({...selectedPage, seo_description: e.target.value})}
                          placeholder="Summarize the page content for search engines..."
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => updatePage(selectedPage.id, selectedPage)}
                    disabled={isSaving}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? "Saving Changes..." : "Save Page Settings"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Pages Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Edit and manage your website structure.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 active:scale-95">
          <Plus size={18} /> Create New Page
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-soft overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm text-slate-400 focus-within:text-brand-600 transition-colors">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input 
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-600" 
              placeholder="Search by title or URL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-brand-600" size={18} />}
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <motion.div 
                key={page.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedPage(page)}
                className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <FileText size={22} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    page.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                  }`}>
                    {page.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{page.title}</h3>
                <p className="text-xs text-slate-400 font-bold mb-6 flex items-center gap-1.5">
                  <Globe size={12} className="opacity-40" /> {page.slug}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-slate-100/50 mt-auto">
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[9px] font-black tracking-tight">
                    <Clock size={10} /> {formatDate(page.updated_at)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}

            {!isLoading && filteredPages.length === 0 && (
              <div className="col-span-full py-20 text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">No pages found</h3>
                 <p className="text-slate-400 text-sm">Try searching for something else.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPages;
