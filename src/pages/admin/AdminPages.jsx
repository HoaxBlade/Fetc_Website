import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Loader2, Globe, Clock, ChevronRight, X, Save, Edit, Info, Building, GraduationCap, BookOpen, Users, ImageIcon, MapPin, Target, Tag, Sparkles } from 'lucide-react';

const AdminPages = () => {
  const handleFileUpload = async (section, field, file, customSectionId = null, arrayIndex = null) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/upload', {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        if (customSectionId) {
          updateCustomSection(customSectionId, field, data.url);
        } else if (arrayIndex !== null) {
          // Special case for items IN an array (like universities)
          const currentArray = [...(selectedPage.content?.[field] || [])];
          if (currentArray[arrayIndex]) {
            currentArray[arrayIndex] = { ...currentArray[arrayIndex], image: data.url };
            handleContentChange(null, field, currentArray);
          }
        } else {
          // Check if the field should be an array (like office showcase images or gallery)
          const currentVal = selectedPage.content?.[section]?.[field] || selectedPage.content?.[field];

          if (selectedPage.slug === '/gallery' && field === 'images') {
            // Special case for Gallery: Add as object
            const current = selectedPage.content.images || [];
            handleContentChange(null, 'images', [...current, { src: data.url, title: "New Moment", category: "Gallery" }]);
          } else if (Array.isArray(currentVal)) {
            handleContentChange(section, field, [...currentVal, data.url]);
          } else {
            handleContentChange(section, field, data.url);
          }
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: "", slug: "" });
  const [activeTab, setActiveTab] = useState("settings"); // "settings" or "content"
  const [isSaving, setIsSaving] = useState(false);

  const categories = ["Main Pages", "Study Abroad", "Exams & Training", "Assessment", "Other"];
  const [groupSelectedPageIds, setGroupSelectedPageIds] = useState({});

  const getCategory = (slug) => {
    if (slug === '/' || slug === '/contact' || slug === '/gallery' || slug.startsWith('/about/') || slug === '/forgot-password' || slug === '/my-account' || slug === '/terms' || slug === '/privacy' || slug === '/refund' || slug === '/faq') return 'Main Pages';
    if (slug.startsWith('/study-abroad/')) return 'Study Abroad';
    if (slug.startsWith('/exam-training/')) return 'Exams & Training';
    if (slug.includes('career-assessment')) return 'Assessment';
    return 'Other';
  };

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/pages', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success) {
        const processedPages = data.pages.map(p => {
          let content = p.content;
          while (typeof content === 'string') {
            try {
              const next = JSON.parse(content);
              if (typeof next === 'string' && next === content) break;
              content = next;
            } catch (e) {
              break;
            }
          }
          return { ...p, content: content || { sections: [] } };
        });
        setPages(processedPages);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePage = async (id, updatedData) => {
    setIsSaving(true);

    // Auto-sort arrays if they exist in content (e.g. universities)
    const processedData = { ...updatedData };
    if (processedData.content?.universities) {
      processedData.content.universities.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (processedData.content?.metadata) {
      // Maybe not sort metadata to keep custom order
    }

    try {
      const response = await fetch((window.API_BASE || "") + `/api/admin/pages/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(processedData),
      });
      const data = await response.json();
      if (data.success) {
        let content = data.page.content;
        while (typeof content === 'string') {
          try {
            const next = JSON.parse(content);
            if (typeof next === 'string' && next === content) break;
            content = next;
          } catch (e) {
            break;
          }
        }
        const cleanPage = { ...data.page, content: content || { sections: [] } };
        setPages(pages.map(p => p.id === id ? cleanPage : p));
        setSelectedPage(null); // Close modal on success
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalCreate = async () => {
    if (!newPageData.title || !newPageData.slug) return;
    setIsSaving(true);
    try {
      const response = await fetch((window.API_BASE || "") + '/api/admin/pages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(newPageData),
      });
      const data = await response.json();
      if (data.success) {
        setPages([...pages, data.page]);
        setShowCreateModal(false);
        setNewPageData({ title: "", slug: "" });
        setSelectedPage(data.page);
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (section, field, value) => {
    setSelectedPage(prev => {
      const newContent = { ...(prev.content || {}) };
      if (section) {
        newContent[section] = { ...(newContent[section] || {}), [field]: value };
      } else if (field === null) {
        // Direct update of a complex section
        newContent[section] = value;
      } else {
        newContent[field] = value;
      }
      return { ...prev, content: newContent };
    });
  };

  const addSection = (type) => {
    setSelectedPage(prev => {
      const currentSections = prev.content?.sections || [];
      const newSection = {
        type,
        title: "New Section Title",
        body: "Write your content here...",
        image: type === 'image_text' ? "" : undefined,
        reversed: type === 'image_text' ? false : undefined
      };
      return {
        ...prev,
        content: { ...prev.content, sections: [...currentSections, newSection] }
      };
    });
  };

  const updateSection = (index, field, value) => {
    setSelectedPage(prev => {
      const currentSections = [...(prev.content?.sections || [])];
      currentSections[index] = { ...currentSections[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, sections: currentSections }
      };
    });
  };

  const removeSection = (index) => {
    setSelectedPage(prev => {
      const currentSections = [...(prev.content?.sections || [])];
      currentSections.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, sections: currentSections }
      };
    });
  };

  const addCustomSection = () => {
    const currentSections = selectedPage.content?.customSections || [];
    const newSection = {
      id: Date.now().toString(),
      title: "New Custom Section",
      content: "Enter your content here..."
    };
    handleContentChange('customSections', null, [...currentSections, newSection]);
  };

  const updateCustomSection = (id, field, value) => {
    const currentSections = selectedPage.content?.customSections || [];
    const updatedSections = currentSections.map(sec =>
      sec.id === id ? { ...sec, [field]: value } : sec
    );
    handleContentChange('customSections', null, updatedSections);
  };

  const removeCustomSection = (id) => {
    const currentSections = selectedPage.content?.customSections || [];
    const updatedSections = currentSections.filter(sec => sec.id !== id);
    handleContentChange('customSections', null, updatedSections);
  };

  useEffect(() => {
    console.log("AdminPages: Fetching pages...");
    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => {
    return page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const CustomGroupSelector = ({ activePage, pages, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-full flex items-center justify-between bg-slate-100/50 hover:bg-slate-200/50 border border-slate-200/40 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-700 transition-all shadow-sm group"
        >
          <span className="truncate">{activePage.title}</span>
          <ChevronRight className={`transition-transform duration-300 w-3.5 h-3.5 ${isOpen ? 'rotate-90 text-brand-600' : 'text-slate-400'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                className="absolute left-0 right-0 top-full z-50 mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
              >
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[10px] font-bold transition-all border-b border-slate-100/50 last:border-0
                      ${p.id === activePage.id
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'}
                    `}
                  >
                    {p.title}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const PageCard = ({ page }) => (
    <motion.div
      key={page.id}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => setSelectedPage(page)}
      className="glass-card rounded-[2rem] p-8 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
    >
      {/* Glow Effect */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-brand-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="p-3.5 bg-slate-50 text-brand-600 rounded-xl border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
          <FileText size={20} />
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-xs ${page.status === 'PUBLISHED'
            ? 'bg-emerald-400/5 text-emerald-600 border-emerald-400/20'
            : 'bg-amber-400/5 text-amber-600 border-amber-400/20'
            }`}>
            {page.status}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
            {getCategory(page.slug)}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors tracking-tight leading-tight">{page.title}</h3>
        <p className="text-[11px] text-slate-400 font-medium mb-8 flex items-center gap-2 group-hover:text-slate-500 transition-colors">
          <Globe size={13} className="opacity-40" /> {page.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/40 mt-auto relative z-10">
        <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          <Clock size={12} /> {formatDate(page.updated_at)}
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 shadow-lg shadow-slate-900/20">
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  );


  const ImageUploader = ({ section, field, value, label, customSectionId = null }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">{label}</label>
      <div className="relative group aspect-video bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
        {value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
              <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer hover:bg-brand-50 transition-colors">
                <Edit size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(section, field, e.target.files[0], customSectionId)} />
              </label>
              <button
                onClick={() => handleContentChange(section, field, "")}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all gap-2">
            <ImageIcon className="text-slate-200" size={32} />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Upload Image</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(section, field, e.target.files[0], customSectionId)} />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      {/* Page Editor Modal Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedPage && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
              {/* Background Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setSelectedPage(null); setActiveTab("settings"); }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
              />

              {/* Centered Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[85vh] z-[10000] pointer-events-auto m-4"
              >
                <div className="p-8 md:p-10 pb-0 shrink-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                        <Edit size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Page Editor</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          < Globe size={10} /> {selectedPage.slug}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedPage(null); setActiveTab("settings"); }} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl mb-8">
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Info size={14} /> Page Settings
                    </button>
                    <button
                      onClick={() => setActiveTab("content")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[0.9rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Edit size={14} /> Page Content
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-10 custom-scrollbar">
                  {activeTab === 'settings' ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Display Title</label>
                        <input
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-bold text-slate-700"
                          value={selectedPage.title}
                          onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Page Slug (URL)</label>
                          <input
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-600"
                            value={selectedPage.slug}
                            onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Visibility Status</label>
                            <div className="relative">
                              <select
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all appearance-none cursor-pointer"
                                value={selectedPage.status}
                                onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value })}
                              >
                                <option value="DRAFT">DRAFT (Hidden from website)</option>
                                <option value="PUBLISHED">PUBLISHED (Live on website)</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight className="rotate-90" size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Menu & Footer Placement</label>
                        <div className="relative">
                          <select
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:border-brand-200 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all appearance-none cursor-pointer"
                            value={selectedPage.nav_visibility || 'none'}
                            onChange={(e) => setSelectedPage({ ...selectedPage, nav_visibility: e.target.value })}
                          >
                            <option value="none">Don't show in any menus (Private Link)</option>
                            <option value="navbar">Show in Navbar only</option>
                            <option value="footer">Show in Footer only</option>
                            <option value="both">Show in both Navbar & Footer</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-500">
                            <Globe size={18} />
                          </div>
                        </div>
                      </div>

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
                              onChange={(e) => setSelectedPage({ ...selectedPage, seo_title: e.target.value })}
                              placeholder="Short, catchy title for Google..."
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-blue-400/80 uppercase tracking-tighter mb-1 block">Meta Description</label>
                            <textarea
                              className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-all text-slate-600 font-medium h-20 resize-none"
                              value={selectedPage.seo_description || ""}
                              onChange={(e) => setSelectedPage({ ...selectedPage, seo_description: e.target.value })}
                              placeholder="Summarize the page content for search engines..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* 1. HOME PAGE EDITOR */}
                      {selectedPage.slug === '/' && (
                        <div className="space-y-6 pb-20">
                          {/* 1. Hero Section */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 1. Hero Section
                            </h3>
                            <div className="space-y-4">
                              <ImageUploader
                                section="hero"
                                field="bgImage"
                                value={selectedPage.content?.hero?.bgImage}
                                label="Hero Background Image"
                              />
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Floating Badge</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.badge || ""}
                                  onChange={(e) => handleContentChange('hero', 'badge', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Headline (Main)</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.hero?.titleMain || ""}
                                    onChange={(e) => handleContentChange('hero', 'titleMain', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Headline (Highlight)</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.hero?.titleHighlight || ""}
                                    onChange={(e) => handleContentChange('hero', 'titleHighlight', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Subtitle Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.subtitle || ""}
                                  onChange={(e) => handleContentChange('hero', 'subtitle', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Primary Button Text</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.buttonText || ""}
                                  onChange={(e) => handleContentChange('hero', 'buttonText', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. Trust Bar */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Building size={18} className="text-brand-600" /> 2. Trust Bar
                            </h3>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Trust Message</label>
                              <input
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                value={selectedPage.content?.trustBar?.message || ""}
                                onChange={(e) => handleContentChange('trustBar', 'message', e.target.value)}
                                placeholder="Trusted by 100+ Global Universities..."
                              />
                            </div>
                          </div>

                          {/* 3. Study Abroad Section */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <GraduationCap size={18} className="text-brand-600" /> 3. Study Abroad Section
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.studyAbroad?.title || ""}
                                    onChange={(e) => handleContentChange('studyAbroad', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.studyAbroad?.badgeText || ""}
                                    onChange={(e) => handleContentChange('studyAbroad', 'badgeText', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.studyAbroad?.description || ""}
                                  onChange={(e) => handleContentChange('studyAbroad', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 4. Exam Training Section */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <BookOpen size={18} className="text-brand-600" /> 4. Exam Training Section
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Section Title</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.examTraining?.title || ""}
                                    onChange={(e) => handleContentChange('examTraining', 'title', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.examTraining?.badgeText || ""}
                                    onChange={(e) => handleContentChange('examTraining', 'badgeText', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.examTraining?.description || ""}
                                  onChange={(e) => handleContentChange('examTraining', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 7. Custom Sections Builder */}
                          <div className="pt-10 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Custom Sections</h3>
                                <p className="text-xs text-slate-400 font-medium">Add modular content blocks to this page.</p>
                              </div>
                              <button
                                onClick={addCustomSection}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95"
                              >
                                <Plus size={14} /> Add New Section
                              </button>
                            </div>

                            <div className="space-y-6">
                              {selectedPage.content?.customSections?.map((section, idx) => (
                                <motion.div
                                  key={section.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm relative group"
                                >
                                  <button
                                    onClick={() => removeCustomSection(section.id)}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>

                                  <div className="space-y-4">
                                    <ImageUploader
                                      section="customSections"
                                      field="image"
                                      value={section.image}
                                      customSectionId={section.id}
                                      label="Section Image"
                                    />
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Section {idx + 1} Title</label>
                                      <input
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:border-brand-300 outline-none transition-all"
                                        value={section.title}
                                        onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                        placeholder="e.g. Our Global History"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Section Content</label>
                                      <textarea
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 h-32 resize-none focus:border-brand-300 outline-none transition-all"
                                        value={section.content}
                                        onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                                        placeholder="Write your story here..."
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}

                              {(!selectedPage.content?.customSections || selectedPage.content?.customSections.length === 0) && (
                                <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                                  <Plus size={32} className="mx-auto mb-3 text-slate-100" />
                                  <p className="text-xs font-bold text-slate-300 tracking-tight">No custom sections added yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. COMPANY PROFILE EDITOR */}
                      {selectedPage.slug === '/about/company-profile' && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 1. Hero / Our Story
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Main Title (e.g. Our)</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.title || ""}
                                  onChange={(e) => handleContentChange('hero', 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Title Highlight (e.g. Story)</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.titleHighlight || ""}
                                  onChange={(e) => handleContentChange('hero', 'titleHighlight', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.hero?.description || ""}
                                  onChange={(e) => handleContentChange('hero', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Users size={18} className="text-brand-600" /> 2. Director's Note
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Main Quote</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 h-24 resize-none focus:border-brand-300 outline-none transition-all italic"
                                  value={selectedPage.content?.directorsNote?.quote || ""}
                                  onChange={(e) => handleContentChange('directorsNote', 'quote', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Detailed Message</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-40 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.directorsNote?.content || ""}
                                  onChange={(e) => handleContentChange('directorsNote', 'content', e.target.value)}
                                  placeholder="Add paragraphs here. Use new lines for separate paragraphs."
                                />
                              </div>
                            </div>
                          </div>

                          {/* Vision & Values Section Editor */}
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Target size={18} className="text-brand-600" /> 3. Vision & Values
                            </h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Badge Text</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.visionSection?.badge || ""}
                                    onChange={(e) => handleContentChange('visionSection', 'badge', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Title Prefix</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.visionSection?.titlePrefix || ""}
                                    onChange={(e) => handleContentChange('visionSection', 'titlePrefix', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Title Highlight</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.visionSection?.titleHighlight || ""}
                                  onChange={(e) => handleContentChange('visionSection', 'titleHighlight', e.target.value)}
                                />
                              </div>

                              <div className="space-y-3 pt-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Vision Pillars (3 Recommended)</label>
                                {(selectedPage.content?.visionSection?.values || []).map((val, idx) => (
                                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3 relative group">
                                    <div className="grid grid-cols-2 gap-3">
                                      <input
                                        className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold"
                                        value={val.icon}
                                        onChange={(e) => {
                                          const newVals = [...selectedPage.content.visionSection.values];
                                          newVals[idx].icon = e.target.value;
                                          handleContentChange('visionSection', 'values', newVals);
                                        }}
                                        placeholder="Icon (Target, Lightbulb, Compass)"
                                      />
                                      <input
                                        className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold"
                                        value={val.title}
                                        onChange={(e) => {
                                          const newVals = [...selectedPage.content.visionSection.values];
                                          newVals[idx].title = e.target.value;
                                          handleContentChange('visionSection', 'values', newVals);
                                        }}
                                        placeholder="Pillar Title"
                                      />
                                    </div>
                                    <textarea
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-medium h-16 resize-none"
                                      value={val.desc}
                                      onChange={(e) => {
                                        const newVals = [...selectedPage.content.visionSection.values];
                                        newVals[idx].desc = e.target.value;
                                        handleContentChange('visionSection', 'values', newVals);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-white border-2 border-brand-100 border-dashed rounded-3xl">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <ImageIcon size={18} className="text-brand-600" /> 4. Office Showcase
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Main Headline</label>
                                <input
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.officeShowcase?.title || ""}
                                  onChange={(e) => handleContentChange('officeShowcase', 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.officeShowcase?.description || ""}
                                  onChange={(e) => handleContentChange('officeShowcase', 'description', e.target.value)}
                                />
                              </div>

                              <div className="pt-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-3 block">Showcase Gallery Images</label>
                                <div className="grid grid-cols-2 gap-4">
                                  {(selectedPage.content?.officeShowcase?.images || []).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                                      <img src={img} className="w-full h-full object-cover" alt="Showcase" />
                                      <button
                                        onClick={() => {
                                          const newImgs = selectedPage.content.officeShowcase.images.filter((_, i) => i !== idx);
                                          handleContentChange('officeShowcase', 'images', newImgs);
                                        }}
                                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-xs"
                                      >
                                        <X size={16} /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-300 hover:text-brand-600 transition-all group">
                                    <Plus size={24} className="text-slate-300 group-hover:text-brand-600" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-brand-600">Add Photo</span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleFileUpload('officeShowcase', 'images', e.target.files[0], null);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CONTACT US EDITOR */}
                      {selectedPage.slug.toLowerCase() === '/contact' && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Info size={18} className="text-brand-600" /> 1. Intro Section
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Title</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.infoSection?.title || ""}
                                  onChange={(e) => handleContentChange('infoSection', 'title', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.infoSection?.description || ""}
                                  onChange={(e) => handleContentChange('infoSection', 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <MapPin size={18} className="text-brand-600" /> 2. Contact Details
                            </h3>
                            <div className="space-y-6">
                              <div className="p-4 bg-white rounded-2xl border border-slate-100 italic space-y-3">
                                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-tight block">Address Lines (One per line)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.contactDetails?.address?.lines?.join('\n') || ""}
                                  onChange={(e) => handleContentChange('contactDetails', 'address', { ...selectedPage.content.contactDetails.address, lines: e.target.value.split('\n') })}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Phone Number</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.contactDetails?.phone?.number || ""}
                                    onChange={(e) => handleContentChange('contactDetails', 'phone', { ...selectedPage.content.contactDetails.phone, number: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Email Address</label>
                                  <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                    value={selectedPage.content?.contactDetails?.email?.address || ""}
                                    onChange={(e) => handleContentChange('contactDetails', 'email', { ...selectedPage.content.contactDetails.email, address: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Clock size={18} className="text-brand-600" /> 3. Working Hours
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Weekday Hours</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.workingHours?.weekdays || ""}
                                  onChange={(e) => handleContentChange('workingHours', 'weekdays', e.target.value)}
                                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Sunday Status</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.workingHours?.sunday || ""}
                                  onChange={(e) => handleContentChange('workingHours', 'sunday', e.target.value)}
                                  placeholder="Sunday: Closed"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 4. Location Map
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Google Maps Embed URL</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-medium text-slate-500 h-32 resize-none focus:border-brand-300 outline-none transition-all font-mono"
                                  value={selectedPage.content?.mapSection?.mapUrl || ""}
                                  onChange={(e) => handleContentChange('mapSection', 'mapUrl', e.target.value)}
                                  placeholder="Paste the src URL from the Google Maps iframe..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. STUDY ABROAD / COUNTRY EDITOR */}
                      {selectedPage.slug.startsWith('/study-abroad/') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <Globe size={18} className="text-brand-600" /> 1. Country Identity
                            </h3>
                            <div className="space-y-4">
                              <ImageUploader
                                section="content"
                                field="image"
                                value={selectedPage.content?.image}
                                label="Hero Banner Image"
                              />
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Country Name</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.name || ""}
                                  onChange={(e) => handleContentChange(null, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Short Description</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.description || ""}
                                  onChange={(e) => handleContentChange(null, 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-8 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">University Partnerships</h3>
                                <p className="text-xs text-slate-400 font-medium italic">Manage the institutions students can apply to in this country.</p>
                              </div>
                              <button
                                onClick={() => {
                                  const current = selectedPage.content.universities || [];
                                  // Prepend new university to show it first in the editor
                                  handleContentChange(null, 'universities', [{ name: "New University", link: "", ranking: "Top Ranked", exclusive: false, location: selectedPage.content.name }, ...current]);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all shadow-lg active:scale-95"
                              >
                                <Plus size={14} /> Add University
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(selectedPage.content?.universities || []).map((uni, idx) => (
                                <div key={idx} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm relative group">
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content.universities.filter((_, i) => i !== idx);
                                      handleContentChange(null, 'universities', current);
                                    }}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                  >
                                    <X size={14} />
                                  </button>

                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative group w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {uni.image ? (
                                          <>
                                            <img src={uni.image} className="w-full h-full object-contain" alt="Logo" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                              <label className="p-1.5 bg-white text-slate-900 rounded-lg cursor-pointer shadow-xl">
                                                <Plus size={12} />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(null, 'universities', e.target.files[0], null, idx)} />
                                              </label>
                                            </div>
                                          </>
                                        ) : (
                                          <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                            <Building size={20} className="text-slate-200" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(null, 'universities', e.target.files[0], null, idx)} />
                                          </label>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <input
                                          className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0"
                                          value={uni.name}
                                          onChange={(e) => {
                                            const current = [...selectedPage.content.universities];
                                            current[idx].name = e.target.value;
                                            handleContentChange(null, 'universities', current);
                                          }}
                                          placeholder="University Name"
                                        />
                                        <div className="flex items-center gap-2 mt-1">
                                          <input
                                            className="text-[10px] font-bold text-slate-300 bg-transparent border-none p-0 focus:ring-0 italic"
                                            value={uni.ranking}
                                            onChange={(e) => {
                                              const current = [...selectedPage.content.universities];
                                              current[idx].ranking = e.target.value;
                                              handleContentChange(null, 'universities', current);
                                            }}
                                            placeholder="Ranking (e.g. Top 100)"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                      <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest pl-1">Website URL</label>
                                        <input
                                          className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-medium"
                                          value={uni.link}
                                          onChange={(e) => {
                                            const current = [...selectedPage.content.universities];
                                            current[idx].link = e.target.value;
                                            handleContentChange(null, 'universities', current);
                                          }}
                                          placeholder="https://..."
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          const current = [...selectedPage.content.universities];
                                          current[idx].exclusive = !current[idx].exclusive;
                                          handleContentChange(null, 'universities', current);
                                        }}
                                        className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all mt-4 border ${uni.exclusive ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                      >
                                        {uni.exclusive ? 'Exclusive Partner' : 'Standard Partner'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. EXAM & TRAINING EDITOR */}
                      {selectedPage.slug.startsWith('/exam-training/') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <BookOpen size={18} className="text-brand-600" /> 1. Exam Identity
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Exam Name (e.g. IDP for IELTS)</label>
                                <input
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.name || ""}
                                  onChange={(e) => handleContentChange(null, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Short Description (Summary)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-20 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.description || ""}
                                  onChange={(e) => handleContentChange(null, 'description', e.target.value)}
                                  placeholder="A short summary for lists..."
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-brand-600 uppercase tracking-tight mb-1 block">Full Rich Content (Detailed Story)</label>
                                <textarea
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-64 resize-none focus:border-brand-300 outline-none transition-all"
                                  value={selectedPage.content?.fullDescription || ""}
                                  onChange={(e) => handleContentChange(null, 'fullDescription', e.target.value)}
                                  placeholder="Add the full detailed story here..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Tag size={18} className="text-brand-600" /> 2. Exam Metadata (Cost, Validity, etc.)
                              </h3>
                              <button
                                onClick={() => {
                                  const current = selectedPage.content.metadata || [];
                                  handleContentChange(null, 'metadata', [...current, { label: "New Tech", value: "TBA" }]);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-brand-50 transition-all flex items-center gap-2 shadow-sm"
                              >
                                <Plus size={12} /> Add Field
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {(selectedPage.content?.metadata || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 group">
                                  <div className="flex-1 bg-white border border-slate-100 p-3 rounded-2xl flex flex-col gap-1">
                                    <input
                                      className="bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-300 focus:ring-0"
                                      value={item.label}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.metadata];
                                        current[idx].label = e.target.value;
                                        handleContentChange(null, 'metadata', current);
                                      }}
                                    />
                                    <input
                                      className="bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0"
                                      value={item.value}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.metadata];
                                        current[idx].value = e.target.value;
                                        handleContentChange(null, 'metadata', current);
                                      }}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content.metadata.filter((_, i) => i !== idx);
                                      handleContentChange(null, 'metadata', current);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-6 bg-white border-2 border-brand-100 border-dashed rounded-3xl">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                <Sparkles size={18} className="text-brand-600" /> 3. Key Training Features
                              </h3>
                              <button
                                onClick={() => {
                                  const current = selectedPage.content.features || [];
                                  handleContentChange(null, 'features', [...current, { highlight: "100%", label: "New Feature" }]);
                                }}
                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-brand-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                              >
                                <Plus size={12} /> Add Feature
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {(selectedPage.content?.features || []).map((feature, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative group">
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content.features.filter((_, i) => i !== idx);
                                      handleContentChange(null, 'features', current);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                  <input
                                    className="w-full bg-transparent border-none p-0 text-2xl font-black text-brand-600 focus:ring-0 mb-1"
                                    value={feature.highlight}
                                    onChange={(e) => {
                                      const current = [...selectedPage.content.features];
                                      current[idx].highlight = e.target.value;
                                      handleContentChange(null, 'features', current);
                                    }}
                                  />
                                  <input
                                    className="w-full bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-400 focus:ring-0"
                                    value={feature.label}
                                    onChange={(e) => {
                                      const current = [...selectedPage.content.features];
                                      current[idx].label = e.target.value;
                                      handleContentChange(null, 'features', current);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. GALLERY EDITOR */}
                      {selectedPage.slug === '/gallery' && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                              <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                  <ImageIcon size={24} className="text-brand-600" /> Visual Portfolio
                                </h3>
                                <p className="text-xs text-slate-400 font-medium italic mt-1">Manage the snapshots of your facilities and success stories.</p>
                              </div>
                              <label className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 hover:-translate-y-1 transition-all shadow-xl cursor-pointer active:scale-95">
                                <Plus size={16} /> Add Photo
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => e.target.files?.[0] && handleFileUpload(null, 'images', e.target.files[0])}
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {(selectedPage.content?.images || []).map((img, idx) => (
                                <div key={idx} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                    <img src={img.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery" />
                                    <button
                                      onClick={() => {
                                        const current = selectedPage.content.images.filter((_, i) => i !== idx);
                                        handleContentChange(null, 'images', current);
                                      }}
                                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    <div>
                                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Photo Title</label>
                                      <input
                                        className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-700 focus:border-brand-200 outline-none transition-colors"
                                        value={img.title || ""}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.images];
                                          current[idx].title = e.target.value;
                                          handleContentChange(null, 'images', current);
                                        }}
                                        placeholder="e.g. VIP Conference Room"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Category</label>
                                      <input
                                        className="w-full bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-700 focus:border-brand-200 outline-none transition-colors"
                                        value={img.category || ""}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.images];
                                          current[idx].category = e.target.value;
                                          handleContentChange(null, 'images', current);
                                        }}
                                        placeholder="e.g. Office / Labs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {(!selectedPage.content?.images || selectedPage.content.images.length === 0) && (
                              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                <ImageIcon size={40} className="mx-auto mb-4 text-slate-100" />
                                <p className="text-slate-300 font-bold italic tracking-tight">Your gallery is waiting for its first photo...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 7. CAREER EDITOR */}
                      {selectedPage.slug.includes('career-assessment') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                              <Target size={22} className="text-brand-600" /> Career Analysis Editor
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2 block">Main Heading</label>
                                <input
                                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:border-brand-300 outline-none transition-all shadow-sm"
                                  value={selectedPage.content?.title || ""}
                                  onChange={(e) => handleContentChange(null, 'title', e.target.value)}
                                  placeholder="Behaviour and Career Analysis"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2 block">Detailed Description</label>
                                <textarea
                                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 h-64 resize-none focus:border-brand-300 outline-none transition-all shadow-sm"
                                  value={selectedPage.content?.description || ""}
                                  onChange={(e) => handleContentChange(null, 'description', e.target.value)}
                                  placeholder="Describe your career analysis services here..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="p-8 bg-brand-50/50 rounded-[2.5rem] border border-brand-100 border-dashed text-center">
                            <p className="text-xs font-bold text-brand-600 opacity-60 flex items-center justify-center gap-2">
                              <Sparkles size={14} /> Career Assessment Module Active
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 8. POLICY EDITOR (Terms, Privacy, Refund) */}
                      {(selectedPage.slug === '/terms' || selectedPage.slug === '/privacy' || selectedPage.slug === '/refund') && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                              <FileText size={22} className="text-brand-600" /> Policy Content Editor
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2 block">Last Updated Date</label>
                                <input
                                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:border-brand-300 outline-none transition-all shadow-sm"
                                  value={selectedPage.content?.lastUpdated || ""}
                                  onChange={(e) => handleContentChange(null, 'lastUpdated', e.target.value)}
                                  placeholder="e.g. October 24, 2026"
                                />
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Policy Sections</label>
                                  <button
                                    onClick={() => {
                                      const current = selectedPage.content?.sections || [];
                                      handleContentChange(null, 'sections', [...current, { title: "New Section", body: "" }]);
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-brand-600 transition-all flex items-center gap-2"
                                  >
                                    <Plus size={12} /> Add Section
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {(selectedPage.content?.sections || []).map((section, idx) => (
                                    <div key={idx} className="p-6 bg-white border border-slate-200 rounded-[2rem] relative group shadow-sm">
                                      <button
                                        onClick={() => {
                                          const current = selectedPage.content.sections.filter((_, i) => i !== idx);
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                      >
                                        <X size={16} />
                                      </button>
                                      <input
                                        className="w-full bg-transparent border-none p-0 text-lg font-black text-slate-900 focus:ring-0 mb-3"
                                        value={section.title}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.sections];
                                          current[idx].title = e.target.value;
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        placeholder="Section Title"
                                      />
                                      <textarea
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-600 h-32 resize-none focus:border-brand-200 outline-none transition-colors"
                                        value={section.body}
                                        onChange={(e) => {
                                          const current = [...selectedPage.content.sections];
                                          current[idx].body = e.target.value;
                                          handleContentChange(null, 'sections', current);
                                        }}
                                        placeholder="Enter policy details here..."
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 9. FAQ EDITOR */}
                      {selectedPage.slug === '/faq' && (
                        <div className="space-y-6 pb-20">
                          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                              <Info size={22} className="text-brand-600" /> FAQ Knowledge Base
                            </h3>
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Questions & Answers</label>
                                <button
                                  onClick={() => {
                                    const current = selectedPage.content?.faqs || [];
                                    handleContentChange(null, 'faqs', [...current, { question: "New Question?", answer: "" }]);
                                  }}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg"
                                >
                                  <Plus size={14} /> Add FAQ Item
                                </button>
                              </div>

                              <div className="space-y-4">
                                {(selectedPage.content?.faqs || []).map((faq, idx) => (
                                  <div key={idx} className="p-6 bg-white border border-slate-200 rounded-[2rem] relative group shadow-sm overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-600" />
                                    <button
                                      onClick={() => {
                                        const current = selectedPage.content.faqs.filter((_, i) => i !== idx);
                                        handleContentChange(null, 'faqs', current);
                                      }}
                                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                                    >
                                      <X size={16} />
                                    </button>
                                    <input
                                      className="w-full bg-transparent border-none p-0 text-base font-black text-slate-900 focus:ring-0 mb-3"
                                      value={faq.question}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.faqs];
                                        current[idx].question = e.target.value;
                                        handleContentChange(null, 'faqs', current);
                                      }}
                                      placeholder="Question?"
                                    />
                                    <textarea
                                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-600 h-24 resize-none focus:border-brand-200 outline-none transition-colors"
                                      value={faq.answer}
                                      onChange={(e) => {
                                        const current = [...selectedPage.content.faqs];
                                        current[idx].answer = e.target.value;
                                        handleContentChange(null, 'faqs', current);
                                      }}
                                      placeholder="Answer the question..."
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC SECTION EDITOR FOR GENERIC PAGES */}
                      {selectedPage.slug !== '/' && selectedPage.slug !== '/about/company-profile' && selectedPage.slug.toLowerCase() !== '/contact' && !selectedPage.slug.startsWith('/study-abroad/') && !selectedPage.slug.startsWith('/exam-training/') && selectedPage.slug !== '/gallery' && !selectedPage.slug.includes('career-assessment') && selectedPage.slug !== '/terms' && selectedPage.slug !== '/privacy' && selectedPage.slug !== '/refund' && selectedPage.slug !== '/faq' && (
                        <div className="space-y-8 pb-20">
                          <div className="bg-brand-50/50 p-8 rounded-[2rem] border border-brand-100 flex items-center justify-between gap-6">
                            <div>
                              <h3 className="text-lg font-bold text-brand-900 mb-1">Custom Page Builder</h3>
                              <p className="text-xs text-brand-600 font-medium">Add sections to build your custom page layout.</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addSection('text')}
                                className="px-5 py-3 bg-white text-brand-700 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-brand-200 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                              >
                                + Text Block
                              </button>
                              <button
                                onClick={() => addSection('image_text')}
                                className="px-5 py-3 bg-white text-brand-700 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-brand-200 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                              >
                                + Image & Text
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {selectedPage.content?.sections?.map((section, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm group relative"
                              >
                                <button
                                  onClick={() => removeSection(idx)}
                                  className="absolute top-6 right-6 p-2 text-rose-300 hover:text-rose-500 transition-colors"
                                >
                                  <X size={18} />
                                </button>

                                <div className="flex items-center gap-2 mb-6">
                                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                    Section #{idx + 1} — {section.type}
                                  </span>
                                </div>

                                <div className="space-y-4">
                                  <input
                                    className="w-full px-0 text-xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 outline-none"
                                    placeholder="Enter section title..."
                                    value={section.title}
                                    onChange={(e) => updateSection(idx, 'title', e.target.value)}
                                  />

                                  {section.type === 'image_text' && (
                                    <div className="grid grid-cols-2 gap-6 items-start">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Section Image</label>
                                        <div className="relative group aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-slate-400">
                                          {section.image ? (
                                            <img src={section.image} className="w-full h-full object-cover" alt="Section" />
                                          ) : (
                                            <>
                                              <ImageIcon size={24} className="mb-2" />
                                              <span className="text-[10px] font-bold">No image selected</span>
                                            </>
                                          )}
                                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <label className="p-3 bg-white text-slate-900 rounded-full cursor-pointer shadow-xl">
                                              <Edit size={18} />
                                              <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    fetch((window.API_BASE||'') + '/api/admin/upload', { method: 'POST', body: formData })
                                                      .then(res => res.json())
                                                      .then(data => data.success && updateSection(idx, 'image', data.url));
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <textarea
                                        className="w-full h-full min-h-[150px] p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:border-brand-200 outline-none transition-colors resize-none"
                                        placeholder="Write section body content..."
                                        value={section.body}
                                        onChange={(e) => updateSection(idx, 'body', e.target.value)}
                                      />
                                    </div>
                                  )}

                                  {section.type === 'text' && (
                                    <textarea
                                      className="w-full min-h-[200px] p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:border-brand-200 outline-none transition-colors resize-none"
                                      placeholder="Write section body content..."
                                      value={section.body}
                                      onChange={(e) => updateSection(idx, 'body', e.target.value)}
                                    />
                                  )}
                                </div>
                              </motion.div>
                            ))}

                            {(!selectedPage.content?.sections || selectedPage.content.sections.length === 0) && (
                              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                                <Plus size={32} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-sm font-bold italic text-slate-400 tracking-tight">Your page is empty. Start adding sections!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => updatePage(selectedPage.id, selectedPage)}
                    disabled={isSaving}
                    className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8 sticky bottom-0 z-10"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? "Saving Changes..." : "Save Page Content"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand-200/20 rounded-full blur-[60px] pointer-events-none" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 relative z-10">Page Management</h1>
          <p className="text-slate-500 font-medium text-sm italic relative z-10">Structure and manage your website's core pages.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group flex items-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 active:scale-95 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">Create New Page</span>
        </button>
      </div>

      {/* Custom Creation Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden p-10 border border-slate-200/60"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Page</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Structure your website</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Page Title</label>
                    <input
                      autoFocus
                      placeholder="e.g. Careers"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-bold text-slate-700"
                      value={newPageData.title}
                      onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">URL Slug</label>
                    <input
                      placeholder="/careers"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium text-slate-500"
                      value={newPageData.slug}
                      onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFinalCreate}
                      disabled={isSaving || !newPageData.title || !newPageData.slug}
                      className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-brand-600 transition-all shadow-xl shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      {isSaving ? "Creating..." : "Create Page"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="bg-slate-100/50 backdrop-blur-md rounded-[2rem] border border-slate-200/40 p-4 mb-16 flex flex-wrap items-center justify-between gap-6 shadow-sm">
        <div className="flex gap-4 items-center flex-1 max-w-lg">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-all duration-300" />
            <input
              className="w-full pl-12 pr-6 py-3 bg-white/80 border border-slate-200/60 rounded-xl text-[13px] focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-400/50 transition-all font-medium text-slate-700 placeholder:text-slate-400"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-200/60 rounded-xl shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{pages.length} Pages</span>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-2">
              <Loader2 className="animate-spin text-brand-600" size={14} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-40">
        {searchTerm ? (
          filteredPages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))
        ) : (
          // Grouped Implementation
          categories.map(cat => {
            const pagesInCategory = pages.filter(p => getCategory(p.slug) === cat);
            if (pagesInCategory.length === 0) return null;

            // For "Main Pages", always show individual cards
            if (cat === "Main Pages") {
              return pagesInCategory.map(page => <PageCard key={page.id} page={page} />);
            }

            // For groupable categories, show ONE card
            const selectedId = groupSelectedPageIds[cat] || pagesInCategory[0].id;
            const activePage = pagesInCategory.find(p => p.id === selectedId) || pagesInCategory[0];

            return (
              <motion.div
                key={cat}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card rounded-[2rem] p-8 transition-all cursor-pointer group relative active:scale-[0.99] z-10 border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex justify-between items-start mb-8 relative z-10 mt-2">
                  <div className="p-4 bg-slate-50 text-brand-600 rounded-xl border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <FileText size={22} />
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-xs ${activePage.status === 'PUBLISHED' ? 'bg-emerald-400/5 text-emerald-600 border-emerald-400/20' : 'bg-amber-400/5 text-amber-600 border-amber-400/20'}`}>
                      {activePage.status}
                    </span>
                  </div>
                </div>

                <div className="mb-10 relative z-20">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 truncate tracking-tight">{cat}</h3>
                  <CustomGroupSelector
                    activePage={activePage}
                    pages={pagesInCategory}
                    onSelect={(id) => setGroupSelectedPageIds(prev => ({ ...prev, [cat]: id }))}
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPage(activePage);
                    }}
                    className="group/btn flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Edit {activePage.title}
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {pagesInCategory.length} Pages
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

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
    </motion.div>
  );
};

export default AdminPages;
