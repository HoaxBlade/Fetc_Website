import { motion, AnimatePresence } from "framer-motion";
import { Target, Compass, Loader2, ClipboardList, FileBarChart, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import InteractiveGuide from "../components/InteractiveGuide";

function CareerAssessmentPage() {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

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
    <main className="mx-auto max-w-7xl px-4 py-20 md:px-6">
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
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
            {pageData?.title || "Behaviour and Career Analysis"}
          </h1>
          
          <div className="prose prose-slate max-w-none">
          {/* Interactive Process Steps */}
          <div className="mt-16 border-t border-slate-50 pt-16">
            <div className="flex flex-col gap-6 max-w-2xl">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-brand-50/50 rounded-3xl p-8 border border-brand-100 ring-4 ring-brand-600/5"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg">
                        <ClipboardList size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Step 1: Take the Assessment</h3>
                    </div>
                    <p className="text-slate-600 font-normal leading-relaxed mb-8">
                      Complete a comprehensive psychometric and behavioral test designed to map your unique cognitive traits and work style.
                    </p>
                    <button 
                      onClick={() => setActiveStep(2)}
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all hover:translate-x-1"
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-teal-50/50 rounded-3xl p-8 border border-teal-100 ring-4 ring-teal-600/5"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg">
                        <FileBarChart size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Step 2: Get Your Detailed Report</h3>
                    </div>
                    <p className="text-slate-600 font-normal leading-relaxed mb-8">
                      Receive an in-depth, data-driven breakdown of your strengths, personality profile, and ideal global industry matches.
                    </p>
                    <button 
                      onClick={() => setActiveStep(3)}
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all hover:translate-x-1"
                    >
                      Final Step <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 ring-4 ring-blue-600/5"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                        <Users size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Step 3: Expert Counseling</h3>
                    </div>
                    <p className="text-slate-600 font-normal leading-relaxed mb-8">
                      Sit down with our mentors to translate your report into a concrete study abroad and career pathway.
                    </p>
                    <div className="flex items-center gap-3 text-blue-600 font-bold">
                       <CheckCircle2 size={24} />
                       <span>Your journey starts here!</span>
                    </div>
                    <button 
                      onClick={() => setActiveStep(1)}
                      className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-bold underline"
                    >
                      Restart Process
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Indicator Dots */}
              <div className="flex gap-2 mt-4 px-2">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeStep === step ? "w-8 bg-slate-900" : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Interactive Booklet Section */}
      <div className="mt-20">
         <InteractiveGuide slug="career-assessment-guide" />
      </div>
    </main>
  );
}

export default CareerAssessmentPage;
