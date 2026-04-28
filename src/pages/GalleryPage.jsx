import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Plus, Loader2, ImageIcon } from 'lucide-react';

const ImageWrapper = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="w-full h-full relative">
      {shouldRender && (
        <img 
          src={src} 
          alt={alt} 
          decoding="async" 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-400 animate-spin opacity-20" />
        </div>
      )}
    </div>
  );
};

function GalleryPage() {
  const [pageData, setPageData] = useState({ images: [] });
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGalleryData = useCallback(async () => {
    try {
      const response = await fetch('/api/pages/gallery');
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      }
    } catch (err) {
      console.error('Failed to fetch gallery content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  const allImages = useMemo(() => pageData?.images || [], [pageData?.images]);

  const displayedImages = useMemo(() => {
    return allImages.slice(0, visibleCount);
  }, [visibleCount, allImages]);

  const hasMore = visibleCount < allImages.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight italic">Loading Your Visual Journey...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-20 px-4 md:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Minimal Header */}
        <div className="text-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-6 px-4 py-2 bg-brand-50 rounded-full">
              Snapshots of Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter text-balance leading-none">
              Take a Visual <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">Journey</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the state-of-the-art facilities and professional environment designed to empower your global future.
            </p>
          </motion.div>
        </div>

        {allImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {displayedImages.map((img, idx) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImageIndex(allImages.indexOf(img))}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-slate-200 ring-1 ring-slate-100 shadow-soft transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl">
                    <ImageWrapper src={img.src} alt={img.title} />
                    
                    {/* Minimal Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">{img.category || "Event"}</span>
                       <h4 className="text-white font-bold text-sm tracking-tight">{img.title || "FETC Moment"}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <ImageIcon size={32} />
             </div>
             <p className="text-slate-400 font-bold italic">The gallery is currently empty. Add photos in the Admin Panel!</p>
          </div>
        )}

        {/* Banner Style Load More / Show More Image Card */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 flex justify-center pb-20 px-4"
          >
            <button
              onClick={handleLoadMore}
              className="group relative w-full max-w-4xl h-48 overflow-hidden rounded-[3rem] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-brand-100"
            >
              {/* Using the FETC Banner as background */}
              <div className="absolute inset-0 bg-slate-900">
                <img 
                  src="/assets/logo/fetc banner.png" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  alt="Show More Banner"
                />
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-600 transition-all">
                  <Plus className="w-6 h-6 text-white transition-transform group-hover:rotate-90" />
                </div>
                <span className="text-white text-xs font-black uppercase tracking-[0.4em]">Discover More</span>
                <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest italic">Experience the FETC Difference</span>
              </div>
            </button>
          </motion.div>
        )}
      </div>

      {/* Premium Glass Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-3xl"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-[101]"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-[101]"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>
            <button
              className="absolute top-8 right-8 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-[102]"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full flex flex-col items-center px-4" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group max-h-[85vh] overflow-hidden rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5">
                <img
                  src={allImages[selectedImageIndex].src}
                  alt="Full Preview"
                  className="max-w-full max-h-[85vh] object-contain"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950/80 to-transparent">
                   <p className="text-white font-bold text-lg">{allImages[selectedImageIndex].title || "FETC Moment"}</p>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{allImages[selectedImageIndex].category || "Gallery"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default GalleryPage;
