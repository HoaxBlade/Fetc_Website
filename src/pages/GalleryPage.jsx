import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Plus } from 'lucide-react';

import img1 from "../assets/officeImages/biggest-centre.jpeg";
import img2 from "../assets/officeImages/exterior-roongta-vesu.jpeg";
import img3 from "../assets/officeImages/IMG_2426.JPG";
import img4 from "../assets/officeImages/testing-lab.jpg";
import img5 from "../assets/officeImages/vip-conference.jpg";
import img6 from "../assets/officeImages/vip-exam-centre.jpg";
import img7 from "../assets/officeImages/_DSC1619.JPG";
import img8 from "../assets/officeImages/_DSC1638.JPG";
import img9 from "../assets/officeImages/admin-pc.jpeg";
import img10 from "../assets/officeImages/directors-cabin.jpeg";
import img11 from "../assets/officeImages/ext.2.jpeg";
import img12 from "../assets/officeImages/exterior-varachha-prime.jpeg";
import img13 from "../assets/officeImages/signage.jpeg";
import img14 from "../assets/officeImages/waiting-area-washroom.jpeg";
import img15 from "../assets/officeImages/p1.jpeg";
import img16 from "../assets/officeImages/p2.jpeg";
import img17 from "../assets/officeImages/p3.jpeg";
import img18 from "../assets/officeImages/p4.jpeg";
import img19 from "../assets/officeImages/p5.jpeg";
import img20 from "../assets/officeImages/p6.jpeg";
import img21 from "../assets/officeImages/p7.jpeg";
import img22 from "../assets/officeImages/p8.jpeg";
import img23 from "../assets/officeImages/p9.jpeg";
import img24 from "../assets/officeImages/p10.jpeg";
import img25 from "../assets/officeImages/p11.jpeg";
import img26 from "../assets/officeImages/p12.jpeg";
import img27 from "../assets/officeImages/p13.jpeg";
import img28 from "../assets/officeImages/p14.jpeg";
import img29 from "../assets/officeImages/p15.jpeg";

const images = [
  { src: img1, category: "Office", title: "Main Corporate Centre" },
  { src: img4, category: "Academic", title: "State-of-the-Art Testing Lab", featured: true },
  { src: img2, category: "Exterior", title: "Roongta Vesu Exterior" },
  { src: img3, category: "Office", title: "Modern Office Space" },
  { src: img5, category: "Office", title: "VIP Conference Room", featured: true },
  { src: img6, category: "Academic", title: "Elite Exam Centre" },
  { src: img7, category: "Office", title: "Interior View - Desk" },
  { src: img8, category: "Office", title: "Interior View - Hall" },
  { src: img9, category: "Office", title: "Administration Area" },
  { src: img11, category: "Exterior", title: "Vesu Office Facade", featured: true },
  { src: img10, category: "Office", title: "Executive Director's Cabin" },
  { src: img12, category: "Exterior", title: "Varachha Prime Exterior" },
  { src: img13, category: "Exterior", title: "Corporate Signage" },
  { src: img14, category: "Office", title: "Waiting Lounge & Ambiance" },
  { src: img15, category: "Office", title: "Office Detail - 1" },
  { src: img16, category: "Office", title: "Office Detail - 2" },
  { src: img17, category: "Office", title: "Office Detail - 3" },
  { src: img18, category: "Office", title: "Office Detail - 4" },
  { src: img19, category: "Office", title: "Office Detail - 5" },
  { src: img20, category: "Office", title: "Office Detail - 6" },
  { src: img21, category: "Office", title: "Office Detail - 7" },
  { src: img22, category: "Office", title: "Office Detail - 8" },
  { src: img23, category: "Office", title: "Office Detail - 9" },
  { src: img24, category: "Office", title: "Office Detail - 10" },
  { src: img25, category: "Office", title: "Office Detail - 11" },
  { src: img26, category: "Office", title: "Office Detail - 12" },
  { src: img27, category: "Office", title: "Office Detail - 13" },
  { src: img28, category: "Office", title: "Office Detail - 14" },
];

const ImageWrapper = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Stagger the initial "render" of the img tags to avoid a single massive burst
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
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const displayedImages = useMemo(() => {
    return images.slice(0, visibleCount);
  }, [visibleCount]);

  const hasMore = visibleCount < images.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  }, []);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

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

  return (
    <main className="min-h-screen py-20 px-4 md:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Minimal Header */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight text-balance">
              Take a Visual <span className="bg-gradient-to-r from-brand-600 to-blue-500 bg-clip-text text-transparent">Journey</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the state-of-the-art facilities and professional environment designed to empower your global future.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayedImages.map((img, idx) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: (idx % 8) * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImageIndex(images.indexOf(img))}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-200 ring-1 ring-slate-200/50 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Performance-optimized Image Component */}
                  <ImageWrapper src={img.src} alt={img.title} />
                  
                  {/* Minimal Tint on Hover */}
                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex justify-center pb-20"
          >
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-4 bg-slate-900 hover:bg-brand-600 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-brand-200"
            >
              <span className="text-sm uppercase tracking-widest">Show More</span>
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
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
              <div className="relative group">
                <img
                  src={images[selectedImageIndex].src}
                  alt="Full Preview"
                  className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default GalleryPage;
