import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, BookOpen, Clock, Tag, ShieldCheck, Sparkles } from "lucide-react";
import { examData as EXAM_FALLBACKS } from "../data/siteData";

function ExamDetailPage() {
  const { exam } = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExamData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pages/exam-training/${exam}`);
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      } else {
        setPageData(EXAM_FALLBACKS[exam] || null);
      }
    } catch (err) {
      console.error('Failed to fetch exam data:', err);
      setPageData(EXAM_FALLBACKS[exam] || null);
    } finally {
      setIsLoading(false);
    }
  }, [exam]);

  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight italic">Preparing {exam.toUpperCase()} Prep...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-800">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <BookOpen size={32} />
        </div>
        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Exam Info Missing</h1>
        <p className="text-slate-500 mb-8 font-medium">We haven't added the details for this exam to our dynamic system yet.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
          Go back home
        </Link>
      </main>
    );
  }

  const displayDesc = pageData.fullDescription || pageData.description || "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link to="/" className="text-brand-600 hover:text-brand-800">Home</Link>
        <span className="mx-2 opacity-30">/</span>
        <span>Exam & Training</span>
        <span className="mx-2 opacity-30">/</span>
        <span className="text-slate-900">{pageData.name}</span>
      </div>

      <div className="rounded-[3rem] bg-white p-8 shadow-soft ring-1 ring-slate-100/50 transition-all duration-500 hover:shadow-xl md:p-16">
        
        <div className="mb-14 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 px-4 py-2 bg-brand-50 rounded-full">
              Official Preparation
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-6xl lg:text-7xl">
              {pageData.name}
            </h1>
          </div>
          {/* <button className="inline-flex shrink-0 items-center gap-3 justify-center rounded-2xl bg-slate-900 px-10 py-5 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600">
             Apply Now <ChevronRight size={18} />
          </button> */}
        </div>

        {pageData.metadata && pageData.metadata.length > 0 && (
          <div className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
             {pageData.metadata.map((item, idx) => {
                const Icon = [Tag, Clock, ShieldCheck, BookOpen][idx % 4] || Tag;
                return (
                  <div key={idx} className="flex flex-col rounded-3xl bg-slate-50/50 p-6 ring-1 ring-slate-100 transition-all duration-300 hover:bg-white hover:shadow-lg group">
                     <Icon size={18} className="text-slate-300 group-hover:text-brand-600 transition-colors mb-3" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                     <span className="mt-2 text-sm font-black text-slate-800">{item.value}</span>
                  </div>
                );
             })}
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <div className="text-xl leading-relaxed text-slate-600 font-medium space-y-8">
            {displayDesc.split('\n\n').map((para, idx) => (
               <p key={idx} className="relative pl-0 md:pl-10">
                  {idx === 0 && <span className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-brand-500 to-transparent rounded-full hidden md:block" />}
                  {para}
               </p>
            ))}
          </div>
        </div>

        {pageData.features && pageData.features.length > 0 && (
          <div className="mt-24 border-t border-slate-100 pt-20">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                 Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Training Features</span>
               </h2>
               <p className="text-slate-400 font-bold text-sm mt-3 uppercase tracking-widest italic">Why Choose FETC for your {pageData.name} Journey?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {pageData.features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-10 text-center ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group">
                   <div className="mb-4 w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                      <Sparkles size={28} />
                   </div>
                   <div className="bg-gradient-to-br from-slate-900 to-brand-600 bg-clip-text text-4xl font-black text-transparent mb-2 group-hover:from-brand-600 group-hover:to-indigo-600 transition-all">{feature.highlight}</div>
                   <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{feature.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ExamDetailPage;
