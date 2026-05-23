import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users2, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight 
} from "lucide-react";

// Local images mapped from the public directory
const STORY_IMAGES = {
  conference: "/assets/office-images/vip-conference.jpg",
  lab: "/assets/office-images/testing-lab.jpg",
  vipCentre: "/assets/office-images/vip-exam-centre.jpg",
  cabin: "/assets/office-images/directors-cabin.jpeg",
  roongtaVesu: "/assets/office-images/exterior-roongta-vesu.jpeg",
  varachhaPrime: "/assets/office-images/exterior-varachha-prime.jpeg",
  adminPc: "/assets/office-images/admin-pc.jpeg",
  waitingArea: "/assets/office-images/waiting-area-washroom.jpeg",
  biggestCentre: "/assets/office-images/biggest-centre.jpeg"
};

const STATS = [
  { value: "27+", label: "Years of Industry Experience" },
  { value: "5,000+", label: "Candidates Trained" },
  { value: "5+", label: "State-of-the-art Centres" },
  { value: "15+", label: "Countries Served" },
  { value: "100%", label: "Tech-enabled Testing Labs" }
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Inception",
    desc: "Launched FETC under Gina Abroad Pvt. Ltd. to deliver premium, authorized English examinations and training systems in Surat."
  },
  {
    year: "2025",
    title: "Infrastructure Expansion",
    desc: "Opened our flagship tech-enabled testing lab and executive conference halls, standardizing computer-delivered assessments."
  },
  {
    year: "2026",
    title: "Becoming a Premier Hub",
    desc: "Fully digitized the learning ecosystem, establishing FETC as Surat's largest and most trusted language examination center."
  }
];

const GALLERY_ITEMS = [
  {
    src: STORY_IMAGES.lab,
    title: "High-Capacity Testing Lab",
    category: "Labs",
    desc: "State-of-the-art computer labs customized for official IELTS and PTE exam delivery.",
    location: "Surat Vesu Branch"
  },
  {
    src: STORY_IMAGES.conference,
    title: "VIP Executive Conference",
    category: "Spaces",
    desc: "Professional conference space for academic training, staff workshops, and student consultation.",
    location: "Surat Vesu Branch"
  },
  {
    src: STORY_IMAGES.vipCentre,
    title: "Authorized Exam Centre",
    category: "Labs",
    desc: "Authorized premium examination facilities built to satisfy stringent global testing standards.",
    location: "Surat Vesu Branch"
  },
  {
    src: STORY_IMAGES.cabin,
    title: "Director's Cabin",
    category: "Spaces",
    desc: "Our executive administrative space where global education partnerships are shaped.",
    location: "Surat Vesu Branch"
  },
  {
    src: "/assets/office-images/p1.jpeg",
    title: "Navratri Traditional Day",
    category: "Events & News",
    desc: "A vibrant celebration of traditional Navratri festival with traditional attire and music.",
    location: "Surat Vesu Branch"
  },
  {
    src: "/assets/office-images/p2.jpeg",
    title: "Diwali Celebration Dinner",
    category: "Events & News",
    desc: "Our annual festive dinner gathering with staff, faculty, and academic counselors.",
    location: "FETC Grand Ballroom"
  },
  {
    src: "/assets/office-images/p3.jpeg",
    title: "Annual Team Trip & Offsite",
    category: "Events & News",
    desc: "Our annual retreat promoting team building, collaborative outdoor sports, and relaxation.",
    location: "FETC Offsite"
  },
  {
    src: "/assets/office-images/p4.jpeg",
    title: "Champions of the League",
    category: "Events & News",
    desc: "Celebrating our turf cricket championship victory with full spirit, teamwork, and pride.",
    location: "Surat Turf Arena"
  },
  {
    src: "/assets/office-images/p5.jpeg",
    title: "Faculty Training Seminars",
    category: "Events & News",
    desc: "Continuous score-optimization bootcamps led by senior certified global language trainers.",
    location: "Surat Vesu Branch"
  },
  {
    src: "/assets/office-images/p6.jpeg",
    title: "Student Success Ceremony",
    category: "Events & News",
    desc: "Felicitation ceremonies recognizing students achieving outstanding IELTS and PTE scores.",
    location: "Surat Vesu Branch"
  },
  {
    src: "/assets/news/news1.png",
    title: "CBSE Mock Test Initiative for 700+ Students",
    category: "Events & News",
    desc: "FETC organized an English mock test for 700+ Class 11 CBSE students at Radiant International School, Piplod — boosting confidence and subject clarity through real exam practice.",
    location: "Radiant International School, Piplod"
  },
  {
    src: "/assets/news/news2.png",
    title: "Foreign Innovation Test at Radiant School",
    category: "Events & News",
    desc: "Covered extensively in regional media, FETC's mock test program at Radiant School showcases 13 years of excellence in preparing students for academic and career success.",
    location: "Radiant School, Surat"
  },
  {
    src: STORY_IMAGES.roongtaVesu,
    title: "Roongta Business Park Campus",
    category: "Exterior",
    desc: "Our flagship training center situated in the premier business hub of Vesu.",
    location: "Surat Vesu Branch"
  },
  {
    src: STORY_IMAGES.varachhaPrime,
    title: "Varachha Branch Campus",
    category: "Exterior",
    desc: "Our second fully equipped branch, bringing premium education closer to the community.",
    location: "Surat Varachha Branch"
  },
  {
    src: STORY_IMAGES.adminPc,
    title: "Administrative Terminal",
    category: "Workspace",
    desc: "Dedicated workspaces ensuring seamless coordination and exam administration support.",
    location: "Surat Vesu Branch"
  },
  {
    src: STORY_IMAGES.waitingArea,
    title: "Student Lounge & Waiting Area",
    category: "Workspace",
    desc: "A comfortable and spacious lobby designed to relax candidates and visitors before sessions.",
    location: "Surat Vesu Branch"
  }
];

const CATEGORIES = ["All", "Labs", "Spaces", "Events & News", "Exterior", "Workspace"];

function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [isChanging, setIsChanging] = useState(false);

  const filteredGallery = useMemo(() => {
    if (activeTab === "All") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsChanging(true);
    setActiveTab(tab);
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 font-sans">
      
      {/* 1. Hero Header Section */}
      <section className="relative pt-24 pb-16 px-4 md:px-8 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-50/70 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[450px] h-[300px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-brand-600 mb-6 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              About FETC
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight text-balance mb-8"
            style={{ lineHeight: "1.45" }}
          >
            Building Global Careers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">
              Since 2024
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16"
          >
            FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces.
          </motion.p>

          {/* Real-time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 pt-8 border-t border-slate-100">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
                className="flex flex-col items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100/40"
              >
                <span className="text-3xl md:text-4xl font-black text-brand-600 tracking-tight mb-2">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center leading-snug">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Our Story Section (Asymmetrical Timeline Layout) */}
      <section className="py-24 px-4 md:px-8 bg-slate-50/40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">History & Background</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Our <span className="text-brand-600">Story</span>
            </h2>
            <div className="w-12 h-1 bg-brand-600 rounded-full my-4" />
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              Founded in 2024 as a landmark project under Gina Abroad Pvt. Ltd., FETC emerged with a single goal: to simplify the journey of international education. By creating authorized, state-of-the-art digital assessment halls, we brought world-class standards right to Surat's student community.
            </p>
            <p className="text-slate-500 font-medium leading-relaxed">
              We started by integrating advanced computer systems tailored for major international tests like IELTS, PTE, and TOEFL, bridging the gap between local aspirations and global standards.
            </p>
          </div>

          {/* Right Timeline */}
          <div className="lg:col-span-7 space-y-8 pl-0 lg:pl-12 relative">
            {/* Animated Travelling Arrow Path (Desktop Only) */}
            <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-[2px] bg-slate-200/60">
              {/* Travelling Arrow Indicator */}
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
                style={{ originY: 0 }}
                animate={{
                  top: ["0%", "100%"]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Visual Arrow and Pulsing Ring */}
                <div className="relative flex flex-col items-center">
                  <span className="absolute inline-flex h-5 w-5 rounded-full bg-brand-400/50 opacity-75 animate-ping" />
                  <div className="relative w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.8)] border border-white">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {TIMELINE.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative flex gap-6 md:gap-8 group"
              >
                {/* Timeline Year Ball */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white text-brand-600 rounded-2xl border border-slate-200 flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300">
                    {item.year}
                  </div>
                </div>

                <div className="flex-1 pb-8 border-b border-slate-100 last:border-b-0">
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Team Banner Section */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Our Pillars</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mt-3 mb-4">
              The team <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">behind your success</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              Certified examiners, tech support teams, and counseling heads—our experts work in unison to provide an error-free, supportive testing and coaching environment.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 group"
          >
            <img
              src={STORY_IMAGES.conference}
              alt="FETC Team and workspace"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent flex flex-col justify-end p-8 md:p-16">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-300 mb-2">Collaboration & Quality</span>
              <h3 className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none mb-3">
                Be Great. Do Good. Learn Always.
              </h3>
              <p className="text-white/70 max-w-xl font-medium text-sm leading-relaxed">
                Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Bento/Story Grid Section (Merged Gallery) */}
      <section className="py-24 px-4 md:px-8 bg-slate-50/30 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              Campus Environment
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Explore Our <span className="text-brand-600">Team & Test Centres</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
              A visual walkthrough of our high-tech examination halls, executive lounges, and academic spaces designed for your global journey.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-8">
              {CATEGORIES.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-200"
                      : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {isChanging ? (
                // Shimmering Preloader Grid
                <motion.div
                  key="shimmer-preloaders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="contents"
                >
                  {Array.from({ length: Math.min(filteredGallery.length || 4, 8) }).map((_, i) => (
                    <div
                      key={`preloader-${i}`}
                      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100/80 shadow-soft p-6 space-y-6"
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 rounded-[1.8rem] overflow-hidden">
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/40 to-slate-100 animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse" />
                        <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                // Real Cards Grid (with lightweight layout-free animation)
                <motion.div
                  key="gallery-real-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="contents"
                >
                  {filteredGallery.map((item, idx) => (
                    <motion.div
                      key={item.src}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.02, ease: "easeOut" }}
                      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-soft group hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="eager"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-600">
                          <MapPin size={11} className="stroke-[2.5]" />
                          {item.location}
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

    </main>
  );
}

export default CompanyProfilePage;
