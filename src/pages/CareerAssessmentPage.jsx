import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Brain, Target, AlertTriangle, Compass,
  CheckCircle2, ArrowRight, LayoutGrid, Loader2,
  Award, Activity, TrendingUp, Building2,
  MessageSquare, HeartPulse, Cog, Shield, Map, Focus,
  Layers, Check, ClipboardList, FileBarChart, Users
} from 'lucide-react';
import InteractiveGuide from "../components/InteractiveGuide";
import ContactPage from "./ContactPage";

// --- Extracted Data ---
const VAK_DATA = [
  { name: 'Visual', score: 80, color: '#0ea5e9' },      // sky-500
  { name: 'Kinesthetic', score: 60, color: '#3b82f6' }, // blue-500
  { name: 'Auditory', score: 40, color: '#64748b' },    // slate-500
];

const COMPETENCY_DATA = [
  { subject: 'Democratic values', score: 90 },
  { subject: 'Helping attitude', score: 85 },
  { subject: 'Democratic decision', score: 75 },
  { subject: 'Consultative Process', score: 80 },
  { subject: 'Repeated Action', score: 65 },
  { subject: 'Organizing', score: 70 },
  { subject: 'Market research', score: 75 },
  { subject: 'Attention to detail', score: 85 },
  { subject: 'Conflict Management', score: 80 },
  { subject: 'Interpersonal Skill', score: 85 },
];

const CAREER_DATA = [
  { subject: 'Hospitality', score: 95, icon: Building2 },
  { subject: 'Counseling', score: 88, icon: MessageSquare },
  { subject: 'Healthcare', score: 85, icon: HeartPulse },
  { subject: 'Production Eng', score: 82, icon: Cog },
  { subject: 'Criminology', score: 84, icon: Shield },
  { subject: 'Navigation', score: 80, icon: Map },
];

const STRENGTHS = [
  "Effectively processes and utilizes feedback",
  "Engages positively in recognition exchanges",
  "Consistently identifies potential in peers",
  "Demonstrates high emotional intelligence",
  "Accurately assesses human motivations",
  "Maintains high proactive engagement",
  "Structures personal time efficiently",
  "Processes information in linear, logical steps",
  "Prefers contextual stability over disruption",
  "Exhibits strong visual-spatial imagination"
];

const TABS = [
  { id: 'overview', label: 'Executive Summary', icon: LayoutGrid },
  { id: 'competencies', label: 'Core Competencies', icon: Target },
  { id: 'careers', label: 'Career Alignment', icon: BriefcaseIcon },
  { id: 'learning', label: 'Cognitive Profile', icon: Brain },
];

// Helper icon component for tabs
function BriefcaseIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}

// --- Custom macOS-style Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl px-5 py-4 border border-slate-200/60 rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label || payload[0].payload.subject}</p>
        <p className="text-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: payload[0].color || payload[0].payload.color || '#0ea5e9' }} />
          <span className="font-medium text-slate-600">Score:</span>
          <span className="font-bold text-slate-900 text-base">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function CareerAssessmentPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch((window.API_BASE||'') + '/api/pages/career-assessment/behaviour-and-career-analysis')
      .then(res => res.json())
      .then(data => setPageData(data))
      .catch(err => console.error('Failed to fetch career data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generating Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="mx-auto max-w-[1200px] space-y-16">

        {/* --- PROFESSIONAL HERO HEADER WITH ROUNDED BORDERS & COLORS --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/80 p-10 lg:p-14 shadow-sm"
        >
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/50 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Verified Assessment
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15]">
                {/* MATCHED GRADIENT COLOR (Blue to Teal) */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
                  Behavioral & Career
                </span> <br />
                <span className="text-slate-900">Analysis Report</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                A comprehensive data-driven evaluation mapping your intrinsic behavioral patterns, cognitive learning styles, and verified competencies to optimal industry pathways.
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-4 w-full max-w-sm">
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Focus size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Profile</h3>
                  <p className="text-base font-bold text-slate-800">Consultative Leader</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Peak Industry Match</h3>
                  <p className="text-base font-bold text-slate-800">Hospitality & Healthcare</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- MAIN DASHBOARD CONTAINER --- */}
        <div className="bg-white rounded-[3rem] border border-slate-200/80 shadow-sm min-h-[700px] flex flex-col overflow-hidden">

          {/* Rounded Segmented Navigation */}
          <div className="w-full border-b border-slate-100 px-8 py-4 overflow-x-auto no-scrollbar flex md:justify-center">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2.5 px-4 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="p-8 lg:p-12 flex-1">
            <AnimatePresence mode="wait">

              {/* 1. EXECUTIVE SUMMARY */}
              {activeTab === 'overview' && (
                <motion.div key="overview" variants={pageVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  <motion.div variants={cardVariants} className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 lg:p-12 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                        <LayoutGrid size={24} className="text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4 tracking-tight">Assessment Overview</h2>
                      <p className="text-slate-300 text-base leading-relaxed max-w-xl mb-10 font-medium">
                        The ComPAS Now™ analysis indicates a strong alignment with roles requiring methodical organization, interpersonal diplomacy, and contextual consistency. High scores in democratic values suggest proficiency in collaborative environments.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button onClick={() => setActiveTab('competencies')} className="px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:scale-105 transition-transform inline-flex items-center gap-2 w-fit">
                          View Matrix Data <ArrowRight size={18} />
                        </button>
                        <a href="http://compasnow.com/newOnlineTest.jsp" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600/30 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-blue-600/50 transition-all inline-flex items-center gap-2 w-fit">
                          Start Online Test <ArrowRight size={18} />
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="bg-slate-50 rounded-[2rem] p-10 border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Activity size={20} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Primary Modality</h3>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800 mb-4">Visual-Dominant</p>
                    <p className="text-base text-slate-500 font-medium leading-relaxed">
                      Primary cognitive processing occurs through spatial and observational engagement.
                    </p>
                  </motion.div>

                  <motion.div variants={cardVariants} className="lg:col-span-3 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                      <CheckCircle2 className="text-blue-500" size={28} />
                      <h3 className="text-2xl font-bold text-slate-800">Verified Behavioral Strengths</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      {STRENGTHS.map((strength, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                          <Check size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-base font-medium text-slate-600">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 2. CORE COMPETENCIES */}
              {activeTab === 'competencies' && (
                <motion.div key="competencies" variants={pageVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                  <motion.div variants={cardVariants} className="lg:col-span-7 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="w-full text-left mb-8">
                      <h2 className="text-2xl font-bold text-slate-900">Competency Matrix</h2>
                      <p className="text-slate-500 text-base font-medium">Multivariate analysis of interactive response patterns.</p>
                    </div>
                    <div className="w-full h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={COMPETENCY_DATA}>
                          <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Radar name="Score" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.15} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8 flex items-center gap-2">
                        <Layers size={18} className="text-blue-500" /> Upper Quartile Traits
                      </h3>
                      <div className="space-y-6">
                        {[...COMPETENCY_DATA].sort((a, b) => b.score - a.score).slice(0, 4).map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-base font-bold text-slate-800">{item.subject}</span>
                              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }} animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-blue-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Analysis Note</h4>
                      <p className="text-base font-medium text-slate-600 leading-relaxed">
                        The combination of high Democratic Values (90%) and Interpersonal Skills (85%) strongly indicates a capability for consensus-building and effective team mediation in structured environments.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 3. CAREER ALIGNMENTS */}
              {activeTab === 'careers' && (
                <motion.div key="careers" variants={pageVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="space-y-6">

                  <motion.div variants={cardVariants} className="bg-white rounded-[2rem] p-10 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400" />
                    <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Award size={40} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-3">
                        Primary Recommendation
                      </div>
                      <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{CAREER_DATA[0].subject} Sector</h2>
                      <p className="text-base font-medium text-slate-600 max-w-2xl">Optimal alignment ({CAREER_DATA[0].score}%) based on interpersonal metrics and structured environmental preferences.</p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CAREER_DATA.slice(1).map((career, idx) => {
                      const Icon = career.icon;
                      return (
                        <motion.div variants={cardVariants} key={career.subject} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
                              <Icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                              {career.score}% Match
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-4">{career.subject}</h3>
                          <div className="mt-auto h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${career.score}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div variants={cardVariants} className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle size={24} className="text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Divergent Pathways</h3>
                      <p className="text-base font-medium text-slate-600">Statistical variance suggests minimizing pursuit of highly unstructured or volatile sectors such as Consultancy, Live Media, or active military deployments.</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 4. COGNITIVE PROFILE */}
              {activeTab === 'learning' && (
                <motion.div key="learning" variants={pageVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  <motion.div variants={cardVariants} className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">VAK Modality Analysis</h2>
                    <p className="text-slate-500 text-base font-medium mb-10">Distribution of neuro-linguistic learning preferences.</p>

                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={VAK_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} dy={15} />
                          <YAxis hide />
                          <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                          <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={50}>
                            {VAK_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="flex flex-col gap-6">
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm h-full">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Optimization Strategies</h3>
                      <div className="space-y-8">
                        {[
                          { title: "Data Visualization", desc: "Convert text-heavy materials into architectural diagrams, flowcharts, or mind maps prior to deep reading." },
                          { title: "Kinesthetic Engagement", desc: "Integrate physical interaction during study sessions via active highlighting, note-taking, or practical experimentation." },
                          { title: "Information Sequencing", desc: "Adopt a top-down approach: establish structural outlines or bullet points before engaging with granular details." },
                          { title: "Environmental Control", desc: "Ensure isolated, distraction-free environments to maintain focus integrity, minimizing auditory interference." },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={18} className="text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-base mb-1.5">{item.title}</h4>
                              <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- TAKE ASSESSMENT CTA --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white shadow-2xl shadow-blue-200/50"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Ready to Start?
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Take Your Professional <br />
                ComPAS Now™ Assessment
              </h2>
              <p className="text-blue-50 text-base font-medium opacity-90 leading-relaxed">
                Unlock your full potential with our advanced behavioral evaluation. 
                Complete the online test now to receive your personalized roadmap to career excellence.
              </p>
            </div>
            
            <a 
              href="http://compasnow.com/newOnlineTest.jsp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-10 py-5 bg-white text-blue-700 rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Start Assessment</span>
              <Compass size={20} className="relative z-10 group-hover:rotate-45 transition-transform duration-500" />
            </a>
          </div>
        </motion.div>

        {/* --- CONTACT SEGMENT (Now parallel and perfectly spaced) --- */}
        <div className="w-full">
          <ContactPage bgTransparent={true} showMap={false} compact={true} />
        </div>

      </div>
    </main>
  );
}