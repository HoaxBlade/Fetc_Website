import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Compass, Loader2 } from "lucide-react";

function CareerAssessmentPage() {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCareerData = async () => {
    try {
      const response = await fetch('/api/pages/career-assessment/behaviour-and-career-analysis');
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      }
    } catch (err) {
      console.error('Failed to fetch career data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-20 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[3rem] border border-slate-100 bg-white p-10 md:p-20 shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-brand-100">
             <Target size={32} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
            {pageData?.title || "Behaviour and Career Analysis"}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-xl leading-relaxed text-slate-600 font-medium">
              {pageData?.description || "Our behavioural and career analysis service helps students identify the right pathway based on personality, strengths, interests, and global career opportunities."}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-16">
             <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                   <Compass size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Identify Your Path</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">Discover the global opportunities that align perfectly with your unique personality and strengths.</p>
                </div>
             </div>
             <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                   <Target size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Guidance</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">Our mentors provide data-driven insights to help you make informed decisions about your future.</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default CareerAssessmentPage;
