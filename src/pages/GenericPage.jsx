import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Globe, AlertCircle } from 'lucide-react';

const GenericPage = () => {
  const { '*': slug } = useParams();
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
          setPage(data.page);
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
      <section className="max-w-4xl mx-auto px-4">
        {page.content && typeof page.content === 'object' ? (
          <div className="space-y-16">
            {/* Generic Section Rendering */}
            {page.content.sections && Array.isArray(page.content.sections) ? (
              page.content.sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="prose prose-slate prose-lg max-w-none"
                >
                  {section.type === 'text' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h2>
                      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {section.body}
                      </div>
                    </div>
                  )}
                  {section.type === 'image_text' && (
                    <div className={`flex flex-col ${section.reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
                      <div className="flex-1">
                        <img src={section.image || 'https://via.placeholder.com/800x600'} alt={section.title} className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-video" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{section.title}</h2>
                        <p className="text-slate-600 leading-relaxed">{section.body}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              // Fallback for simple content
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 prose prose-slate max-w-none">
                 <div dangerouslySetInnerHTML={{ __html: typeof page.content === 'string' ? page.content : JSON.stringify(page.content) }} />
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 italic">
            This page is still being drafted. Check back soon for amazing content!
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default GenericPage;
