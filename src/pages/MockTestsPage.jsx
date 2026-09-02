import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Award, Users, Loader2, X, User, Mail, Phone, Calendar, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl, getApiUrl } from '../apiConfig';
import SafeImage from '../components/SafeImage';
import { useScrollLock } from '../hooks/useScrollLock';

const DEFAULT_MOCK_TESTS = [
  {
    id: 'd1',
    name: "SELT (Secure English Language Test)",
    description: "Official mock exam for UKVI, study, work, and immigration requirements.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd2',
    name: "IELTS Academic & General Training",
    description: "Complete practice tests for Listening, Reading, Writing, and Speaking modules.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd3',
    name: "TOEFL iBT Practice",
    description: "Full-length internet-based tests modeled directly on the ETS syllabus.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd4',
    name: "PTE Academic Exam Prep",
    description: "AI-scored simulated exams aligned with official Pearson guidelines.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd5',
    name: "SAT Prep Simulators",
    description: "Adaptive testing pattern mirroring the digital Scholastic Assessment Test.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd6',
    name: "GMAT Focus Edition Mock",
    description: "Quantitative Reasoning, Verbal Reasoning, and Data Insights simulators.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd7',
    name: "GRE General Test Simulator",
    description: "Analytical Writing, Verbal Reasoning, and Quantitative Reasoning sections.",
    price: "₹49",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 'd8',
    name: "Pearson Versant Test Simulator",
    description: "Simulated speaking and writing assessment with auto-scoring metrics.",
    price: "₹499",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=60"
  }
];

export default function MockTestsPage() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [heroData, setHeroData] = useState({
    badge: "Practice & Succeed",
    titleMain: "Practice Mock Exams & Tests",
    subtitle: "Gain the confidence needed to clear your foreign educational and language requirements. Fully timed, high-accuracy simulator environments."
  });

  useScrollLock(Boolean(selectedTest));

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Page Management content for /mock-tests
        try {
          const pageRes = await fetch(getApiUrl('/api/pages/mock-tests'), {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
          const pageData = await pageRes.json();
          if (pageData.success && pageData.page?.content) {
            if (pageData.page.content.hero) {
              setHeroData(prev => ({ ...prev, ...pageData.page.content.hero }));
            }
            if (pageData.page.content.mockTestsList && pageData.page.content.mockTestsList.length > 0) {
              setTests(pageData.page.content.mockTestsList);
              setIsLoading(false);
              return;
            }
          }
        } catch (pe) {
          console.warn("Could not fetch /api/pages/mock-tests, falling back:", pe);
        }

        // 2. Fallback to /api/mock-tests endpoint
        const response = await fetch(getApiUrl('/api/mock-tests'), {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
        if (data.success && data.mockTests && data.mockTests.length > 0) {
          setTests(data.mockTests);
        } else {
          setTests(DEFAULT_MOCK_TESTS);
        }
      } catch (err) {
        console.error('Failed to fetch mock tests for public page:', err);
        setTests(DEFAULT_MOCK_TESTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockTests();
  }, []);

  const handleEnroll = (test) => {
    setSelectedTest(test);
    setIsSuccessModal(false);
    setFormData({
      name: '',
      email: '',
      phone: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest) return;

    try {
      setIsSubmitting(true);
      const testTitle = selectedTest.title || selectedTest.name || 'Mock Test';

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        testTitle: testTitle
      };

      const response = await fetch(getApiUrl('/api/v1/mock-test/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await response.json();
      if (res.success) {
        setIsSuccessModal(true);
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
      } else {
        alert(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Mock test lead submission error:', err);
      alert(`Submission Error: ${err.message || 'Failed to submit inquiry.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-6">
            {heroData.badge || "Practice & Succeed"}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {heroData.titleMain || "Practice Mock Exams & Tests"}
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {heroData.subtitle || "Gain the confidence needed to clear your foreign educational and language requirements. Fully timed, high-accuracy simulator environments."}
          </p>
        </div>

        {/* Grid of Mock Tests */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
            <p className="text-slate-500 font-bold text-sm">Loading Available Mock Tests...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tests.map((test, index) => {
              const testTitle = test.title || test.name || "Mock Test";
              const testDesc = test.content || test.description || "Official practice module.";
              const rawImage = test.image_url || test.image;
              const testImage = rawImage ? getAssetUrl(rawImage) : "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60";

              return (
                <div 
                  key={test.id || index} 
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
                >
                  <div className="h-48 overflow-hidden relative bg-slate-100">
                    <SafeImage
                      src={testImage} 
                      alt={testTitle} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
                        {testTitle}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 whitespace-pre-line">
                        {testDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEnroll(test)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs tracking-wider uppercase transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                    >
                      Request Access <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

        {/* Request Access Modal */}
        <AnimatePresence>
          {selectedTest && (
            <div className="fixed inset-0 w-screen h-screen z-[5000] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTest(null)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 z-[5001] border border-slate-100"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 inline-block mb-2">
                      Mock Test Registration
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {selectedTest.title || selectedTest.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Fill out the form below to register for your test.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTest(null)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>

                {isSuccessModal ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Request Submitted!</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-xs mb-6 leading-relaxed">
                      Thank you for registering for <strong>{selectedTest.title || selectedTest.name}</strong>. Our counselors will contact you shortly to guide you.
                    </p>
                    <button
                      onClick={() => { setSelectedTest(null); setIsSuccessModal(false); }}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  /* Form Fields */
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                      {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
