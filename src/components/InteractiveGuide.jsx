import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, Loader2, Sparkles } from 'lucide-react';

const InteractiveGuide = ({ slug }) => {
    const [guide, setGuide] = useState(null);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/guides/${slug}`);
                const data = await response.json();
                if (data.success) {
                    setGuide(data.guide);
                    setPages(data.pages);
                } else {
                    setError(data.message || 'Guide not found');
                }
            } catch (err) {
                setError('Failed to load guide');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuide();
    }, [slug]);

    const nextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-[3rem] bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
                <p className="mt-4 text-sm font-bold tracking-widest text-slate-400 uppercase italic">Preparing Cinematic Guide...</p>
            </div>
        );
    }

    if (error || pages.length === 0) {
        return (
            <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-[3rem] bg-slate-100 p-10 text-center">
                <p className="text-slate-400 font-bold italic">Guide content unavailable or missing pages.</p>
            </div>
        );
    }

    return (
        <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-[100] bg-slate-950 p-4 md:p-10' : 'my-12'}`}>
            {/* Background Glow */}
            {!isFullscreen && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-400/5 blur-[120px] pointer-events-none" />
            )}

            <div className="relative mx-auto flex max-w-5xl flex-col items-center">
                {/* Header Info */}
                {!isFullscreen && (
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-600 ring-1 ring-brand-100">
                           <Sparkles size={12} /> Interactive Blueprint
                        </span>
                        <h2 className="mt-4 text-3xl font-black tracking-tighter text-slate-900 md:text-4xl">{guide.title}</h2>
                        <p className="mt-2 text-slate-500 font-medium">{guide.description}</p>
                    </div>
                )}

                {/* The Viewer Stage */}
                <div className={`relative w-full shadow-[0_50px_100px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden bg-slate-900 ${isFullscreen ? 'h-full' : 'aspect-[3/4] md:aspect-[16/9]'}`}>
                    
                    {/* Centered Page */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
                                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`relative w-full h-full flex items-center justify-center ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                                onClick={() => setIsZoomed(!isZoomed)}
                                style={{ perspective: '2000px' }}
                            >
                                <img
                                    src={pages[currentPage].image_url}
                                    alt={`Page ${currentPage + 1}`}
                                    className="h-full w-full object-contain shadow-2xl rounded-sm ring-1 ring-white/10"
                                />
                                
                                {/* Page Shadow Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Overlays */}
                    <button 
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none group active:scale-95"
                    >
                        <ChevronLeft size={28} className="transition-transform group-hover:-translate-x-1" />
                    </button>
                    
                    <button 
                        onClick={nextPage}
                        disabled={currentPage === pages.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-0 disabled:pointer-events-none group active:scale-95"
                    >
                        <ChevronRight size={28} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20">
                        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Page</span>
                            <span className="text-sm font-black text-white leading-none">{currentPage + 1} / {pages.length}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsZoomed(!isZoomed)}
                                className="text-white hover:text-brand-400 transition-colors"
                                title="Zoom"
                            >
                                {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                            </button>
                            <button 
                                onClick={toggleFullscreen}
                                className="text-white hover:text-brand-400 transition-colors"
                                title="Fullscreen"
                            >
                                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Thumbnails (Optional/Mobile) */}
                {!isZoomed && !isFullscreen && (
                    <div className="mt-10 flex gap-2 overflow-x-auto pb-4 w-full justify-center no-scrollbar">
                        {pages.map((page, idx) => (
                            <button
                                key={page.id}
                                onClick={() => setCurrentPage(idx)}
                                className={`h-16 w-12 shrink-0 rounded-md border-2 transition-all overflow-hidden ${
                                    currentPage === idx ? 'border-brand-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'
                                }`}
                            >
                                <img src={page.image_url} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveGuide;
