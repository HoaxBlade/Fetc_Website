import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Globe, AlertCircle } from 'lucide-react';

const GenericPage = () => {
  const params = useParams();
  const slug = params['*'] || params.slug;
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fullSlug = slug ? `/${slug}` : '/';
        const response = await fetch(`/api/pages${fullSlug}`);
        const data = await response.json();
        
        if (data.success) {
          let parsedContent = data.page.content;
          // Robust multi-pass parsing for double-stringified JSON
          while (typeof parsedContent === 'string') {
            try {
              const next = JSON.parse(parsedContent);
              if (typeof next === 'string' && next === parsedContent) break; // Avoid infinite loop on simple strings
              parsedContent = next;
            } catch (e) {
              break;
            }
          }
          setPage({ ...data.page, content: parsedContent });
        } else {
          setError(data.message || 'Page not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">Loading amazing content...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Oops! Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">The page you're looking for doesn't exist or hasn't been published yet.</p>
        <Link to="/" className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32"
    >
      {/* Dynamic Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-200/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Globe size={14} /> FETC Official Page
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {page.title}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              {page.seo_description || "Expert guidance for your global education dreams."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Page Content Rendering */}
      <section className="max-w-5xl mx-auto px-4">
        {(() => {
          // Robustly extract sections regardless of nesting
          let sections = page.content?.sections || [];
          if (page.content?.content?.sections) sections = page.content.content.sections;
          
          const hasSections = Array.isArray(sections) && sections.length > 0;

          if (hasSections) {
            return (
              <div className="space-y-20">
                {sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {section.type === 'text' && (
                      <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{section.title}</h2>
                      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                        {section.body}
                      </div>
                    </div>
                  )}
                  {section.type === 'image_text' && (
                    <div className={`flex flex-col ${section.reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 items-center`}>
                      <div className="flex-1 w-full">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-brand-600/10 rounded-[3rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform" />
                          <img src={section.image || 'https://via.placeholder.com/800x600'} alt={section.title} className="rounded-[3rem] shadow-2xl w-full object-cover aspect-video border-4 border-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{section.title}</h2>
                        <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                          {section.body}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            );
          } else {
            return (
              // 2. Legacy / Unknown Content structure
              <div className="bg-white p-16 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 text-center">
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Globe size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Content Under Review</h2>
                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                  We are currently updating this page's layout to bring you a better experience. 
                  Please check back shortly or explore our other resources!
                </p>
                <div className="mt-10 pt-10 border-t border-slate-50 flex justify-center gap-6">
                   <Link to="/" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Home Page</Link>
                   <Link to="/contact" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Contact Support</Link>
                </div>
              </div>
            );
          }
        })()}
      </section>
    </motion.div>
  );
};

export default GenericPage;
