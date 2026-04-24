import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Loader2, Globe, Clock, ChevronRight, X, Save, Edit, Info, Building, GraduationCap, BookOpen, Users, ImageIcon, MapPin } from 'lucide-react';

const AdminPages = () => {
  const handleFileUpload = async (section, field, file, customSectionId = null) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        if (customSectionId) {
          updateCustomSection(customSectionId, field, data.url);
        } else {
          handleContentChange(section, field, data.url);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
  };

  const ImageUploader = ({ section, field, value, customSectionId = null, label = "Section Image" }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 relative group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => customSectionId ? updateCustomSection(customSectionId, field, "") : handleContentChange(section, field, "")}
              className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <label className={`flex-1 ${!value ? 'w-full' : ''}`}>
          <div className="w-full px-4 py-3 bg-white border border-slate-200 border-dashed rounded-xl text-xs font-bold text-slate-400 hover:border-brand-300 hover:text-brand-600 cursor-pointer transition-all flex items-center justify-center gap-2">
            <Plus size={14} /> {value ? "Change Photo" : "Upload Photo"}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(section, field, e.target.files[0], customSectionId);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [activeTab, setActiveTab] = useState("settings"); // "settings" or "content"
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

  const handleContentChange = (section, field, value) => {
    let updatedContent;

    if (field === null) {
      // Direct update of the section (e.g. for arrays)
      updatedContent = {
        ...selectedPage.content,
        [section]: value
      };
    } else {
      updatedContent = {
        ...selectedPage.content,
        [section]: {
          ...(selectedPage.content[section] || {}),
          [field]: value
        }
      };
    }
    setSelectedPage({ ...selectedPage, content: updatedContent });
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
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedPage.slug}</p>
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
                        <div className="space-y-2 relative">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Visibility Status</label>
                          <div className="relative">
                            <select
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                              value={selectedPage.status}
                              onChange={(e) => setSelectedPage({ ...selectedPage, status: e.target.value })}
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
                                 />
                               </div>
                            </div>
                          </div>

                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                              <ImageIcon size={18} className="text-brand-600" /> 3. Office Showcase
                            </h3>
                            <div className="space-y-4">
                               <div>
                                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Main Headline</label>
                                 <input 
                                   className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:border-brand-300 outline-none transition-all"
                                   value={selectedPage.content?.officeShowcase?.title || ""}
                                   onChange={(e) => handleContentChange('officeShowcase', 'title', e.target.value)}
                                 />
                               </div>
                               <div>
                                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 block">Description</label>
                                 <textarea 
                                   className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-500 h-24 resize-none focus:border-brand-300 outline-none transition-all"
                                   value={selectedPage.content?.officeShowcase?.description || ""}
                                   onChange={(e) => handleContentChange('officeShowcase', 'description', e.target.value)}
                                 />
                               </div>
                            </div>
                          </div>

                          <div className="p-8 bg-brand-50/50 rounded-3xl border border-brand-100 border-dashed text-center">
                             <p className="text-xs font-bold text-brand-600 opacity-60">Company Profile Editor Active ✨</p>
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

                      {/* FALLBACK MESSAGE */}
                      {selectedPage.slug !== '/' && selectedPage.slug !== '/about/company-profile' && selectedPage.slug.toLowerCase() !== '/contact' && (
                        <div className="py-20 text-center opacity-40">
                          <Edit size={32} className="mx-auto mb-4 text-slate-300" />
                          <p className="text-sm font-bold italic text-slate-400 tracking-tight">Content editor for this page is under development.</p>
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
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${page.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
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
