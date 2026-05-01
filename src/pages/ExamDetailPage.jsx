import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, BookOpen } from "lucide-react";
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
      <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] md:p-14">
        
        <div className="mb-12 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {pageData.name}
          </h1>
          {/* <Link
            to="/about/company-profile"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-900 px-10 py-4 text-base font-semibold text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:shadow-[0_15px_40px_rgb(2,132,199,0.3)] active:scale-95"
          >
            Apply Now
          </Link> */}
        </div>

        {pageData.metadata && pageData.metadata.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
             {pageData.metadata.map((item, idx) => (
                <div key={idx} className="flex flex-col rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-100 transition duration-300 hover:bg-white hover:shadow-md">
                   <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                   <span className="mt-1.5 text-sm font-bold text-slate-800">{item.value}</span>
                </div>
             ))}
          </div>
        )}

        <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-600">
          {displayDesc.split('\n\n').map((para, idx) => {
             const lines = para.split('\n');
             if (lines.length > 1) {
               return (
                 <div key={idx} className="mb-10 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                   <h3 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight">{lines[0]}</h3>
                   <div className="space-y-4">
                     {lines.slice(1).map((line, i) => (
                       <p key={i} className="text-slate-600 leading-relaxed m-0">{line}</p>
                     ))}
                   </div>
                 </div>
               );
             }
             return <p key={idx} className="mb-8 font-medium text-slate-700">{para}</p>;
          })}
        </div>

        {pageData.features && pageData.features.length > 0 && (
          <div className="mt-16 border-t border-slate-100 pt-16">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-slate-900">
              Key Features
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {pageData.features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-[2rem] bg-slate-50 p-6 text-center ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)]">
                   <div className="mb-3 bg-gradient-to-br from-brand-600 to-sky-500 bg-clip-text text-4xl font-bold text-transparent">{feature.highlight}</div>
                   <div className="text-sm font-medium text-slate-600">{feature.label}</div>
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
