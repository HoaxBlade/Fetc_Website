import { ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';

const mockTests = [
  {
    name: "SELT (Secure English Language Test)",
    description: "Official mock exam for UKVI, study, work, and immigration requirements.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "IELTS Academic & General Training",
    description: "Complete practice tests for Listening, Reading, Writing, and Speaking modules.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "TOEFL iBT Practice",
    description: "Full-length internet-based tests modeled directly on the ETS syllabus.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "PTE Academic Exam Prep",
    description: "AI-scored simulated exams aligned with official Pearson guidelines.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "SAT Prep Simulators",
    description: "Adaptive testing pattern mirroring the digital Scholastic Assessment Test.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "GMAT Focus Edition Mock",
    description: "Quantitative Reasoning, Verbal Reasoning, and Data Insights simulators.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "GRE General Test Simulator",
    description: "Analytical Writing, Verbal Reasoning, and Quantitative Reasoning sections.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "Pearson Versant Test Simulator",
    description: "Simulated speaking and writing assessment with auto-scoring metrics.",
    price: "₹499",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=60"
  }
];

export default function MockTestsPage() {
  const handleEnroll = (testName) => {
    // Disabled redirect to contact us page for now
    console.log(`Enroll requested for: ${testName}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-6">
            Practice & Succeed
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Practice Mock Exams & Tests
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Gain the confidence needed to clear your foreign educational and language requirements. Fully timed, high-accuracy simulator environments.
          </p>
        </div>

        {/* Grid of Mock Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockTests.map((test, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60";
                  }}
                />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/50 text-blue-700 font-extrabold text-sm shadow-sm">
                  {test.price}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
                    {test.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                    {test.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEnroll(test.name)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs tracking-wider uppercase transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                >
                  Request Access <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 mb-16 shadow-sm">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Authenticated Syllabi</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-relaxed">
              Mapped exactly to ETS, Pearson, SFE, and IDP formats.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 border-y md:border-y-0 md:border-x border-slate-100">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Award size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Simulated Scoring</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-relaxed">
              Provides detailed breakdown analysis of error rates.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Expert Evaluation</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-relaxed">
              Option to submit mock essays and interviews to verified trainers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
