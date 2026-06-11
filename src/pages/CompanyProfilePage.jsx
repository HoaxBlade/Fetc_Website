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
  ArrowUpRight,
  FileDown
} from "lucide-react";

const PROGRAM_DOWNLOADS = [
  {
    name: "Business Management",
    filename: "Business Management.pdf",
    category: "Management",
    icon: "💼"
  },
  {
    name: "Diploma in Health & Social Care",
    filename: "Diploma in Health & Social Care.pdf",
    category: "Health & Social Care",
    icon: "🏥"
  },
  {
    name: "Diploma in IT - Web Design",
    filename: "Diploma in Information Technology - Web Design.pdf",
    category: "IT & Computing",
    icon: "💻"
  },
  {
    name: "Diploma in IT - E Commerce",
    filename: "Diploma in IT - E Commerce F.pdf",
    category: "IT & Computing",
    icon: "🛒"
  },
  {
    name: "Hospitality & Tourism Management",
    filename: "Hospitality & Tourism Management.pdf",
    category: "Hospitality",
    icon: "🏨"
  },
  {
    name: "Gina Abroad - British Degree Route",
    filename: "Gina Abroad_Your-Smartest-Route-to-a-British-Degree.pdf",
    category: "Academic Guide",
    icon: "🇬🇧"
  }
];

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
    year: "1999",
    title: "The Inception",
    desc: "Specifically for exams and training and study abroad services this company has been formed under the umbrella of Ms. Bhumika Dilkhush proprietor of Gina Abroad."
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
    title: "Authorised City College Birmingham Study Centre UK",
    category: "Spaces",
    desc: "FETC is proud to be an Authorised Study Centre for City College Birmingham, UK, offering accredited international pathways.",
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
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

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
      <section className="relative pt-14 pb-10 px-4 md:px-8 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-50/70 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[450px] h-[300px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-3 px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100">
              About FETC
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance mb-4"
            style={{ lineHeight: "1.35" }}
          >
            Building Global Careers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 font-bold">
              Since 1999
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-8"
          >
            FETC is an authorized, state-of-the-art English examination and training center headquartered in Surat, Gujarat. We are a dream project under Gina Abroad Pvt. Ltd., empowering students with digital classrooms and authorized examination spaces.
          </motion.p>

          {/* Real-time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 pt-6 border-t border-slate-100">
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
      {/* 2a. About FETC – Partnership Intro */}
      <section className="py-12 px-4 md:px-8 bg-slate-50/40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Our Partnership</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Expanding <span className="text-brand-600">Opportunities</span> Together
            </h2>
            <div className="w-12 h-1 bg-brand-600 rounded-full" />
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              We're excited to collaborate with R.H. Patel Institute of Technology to expand opportunities for your students and enhance faculty development. Our comprehensive approach combines international university partnerships, career counseling excellence, and certified training programs.
            </p>
            <p className="text-slate-500 font-medium leading-relaxed">
              This partnership opens doors to global education while supporting your institution's growth and your students' success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-5"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              About Us
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              At FETC, We Offer Excellence in English Language Training
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We are dedicated to helping students and professionals achieve their dreams of studying, working, or settling abroad. We connect you with a world of opportunities through top-notch English language support, making your application process for international education and careers smooth and successful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2b. Campus Visits */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              Outreach
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Visits</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🗓️",
                tag: "First Visit",
                title: "Bill Boozing – 3rd April 2026",
                desc: "Curry College representative will visit your campus, sharing opportunities for American education."
              },
              {
                icon: "🇬🇧",
                tag: "Follow-Up Visits",
                title: "UK University Representatives",
                desc: "UK University Representatives will visit, showcasing British higher education options and pathways."
              },
              {
                icon: "🌍",
                tag: "Ongoing Access",
                title: "Continued University Partnerships",
                desc: "Continued university partnerships expanding your students' global education choices."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 space-y-4"
              >
                <div className="text-4xl">{item.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{item.tag}</span>
                <h3 className="text-lg font-black text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2d. Partnership Agenda */}
      <section className="py-12 px-4 md:px-8 bg-slate-50/40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              Collaboration
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Agenda of Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Partnership</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📜",
                title: "Professional Training",
                desc: "Certified TOEFL and SELT training programs for faculty members, enhancing teaching capabilities and career advancement opportunities."
              },
              {
                icon: "🎯",
                title: "Career Counselling",
                desc: "Expert guidance helping students navigate career paths, university selections, and global opportunities with confidence."
              },
              {
                icon: "🏫",
                title: "University Visits",
                desc: "Direct campus visits from international university representatives, providing students with firsthand information about study abroad options."
              },
              {
                icon: "🎓",
                title: "City College Birmingham (2+1)",
                desc: "Explore your path to Accredited qualifications. Complete your first two years in India, pathway to abroad."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 space-y-4 group"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-brand-600 transition-colors duration-300">{item.icon}</div>
                <h3 className="text-base font-black text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2e. Faculty Benefits */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              Faculty Growth
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Benefits for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Faculty Members</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏅",
                title: "Certified Training Programs",
                desc: "Official TOEFL and SELT certification training that enhances your teaching credentials and opens new career opportunities."
              },
              {
                icon: "📈",
                title: "Professional Development",
                desc: "Stay current with international education standards and improve your ability to guide students toward global opportunities."
              },
              {
                icon: "💰",
                title: "Referral Incentives",
                desc: "Earn referral incentives when your students enroll through our partnerships, creating additional income streams for dedicated faculty."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 space-y-4"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2f. Career Pathway Section (Top-Notch Global Programs) */}
      <section className="py-12 px-4 md:px-8 bg-slate-50/40 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Global Tech Education</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Top-Notch <span className="text-brand-600">Skill Based Online Programs</span><br />
              <span className="text-xl md:text-2xl text-slate-500 font-bold block mt-2">IT | Computing | Digital Technology</span>
            </h2>
            <div className="w-12 h-1 bg-brand-600 rounded-full" />
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                Career Pathway
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Software Developer/ Web Developer",
                  "IT Support Specialist",
                  "Network Engineer/ Cybersecurity Analyst",
                  "Data Scientist/ Business Intelligence Analyst",
                  "E-Commerce Manager",
                  "Tech Project Manager"
                ].map((pathway, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-center gap-2.5 text-slate-700 font-semibold text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                    {pathway}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-8 pl-0 lg:pl-12 relative"
          >
            <div className="mb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">History & Background</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mt-2">
                Our <span className="text-indigo-600">Story</span>
              </h2>
            </div>

            {/* Story Content Block */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-4">
              <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                {TIMELINE[0].title}
              </h3>
              <p className="text-slate-600 font-semibold leading-relaxed text-sm md:text-base">
                {TIMELINE[0].desc}
              </p>
            </div>

            {/* Story Video Block */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 space-y-4 overflow-hidden">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                🎥 Inside FETC & Gina Abroad
              </h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                {!isPlayingVideo ? (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    {/* Video poster overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/40 to-slate-900/60 mix-blend-multiply transition-opacity group-hover:opacity-75" />
                    <img 
                      src="/assets/story-video-thumbnail.png" 
                      alt="FETC Video Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Play Button Icon */}
                    <div className="relative z-10 w-16 h-16 bg-white/95 text-brand-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 ml-1">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span className="relative z-10 mt-3 text-xs font-black uppercase tracking-widest text-white drop-shadow-md">
                      Watch Video Demo
                    </span>
                  </div>
                ) : (
                  <video 
                    src="/assets/story-video.mp4" 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Program Curriculums & Guides (Full-Width Responsive Grid) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8 md:p-10 mt-12 space-y-6"
        >
          <h3 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            📂 Program Curriculums & Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAM_DOWNLOADS.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-brand-50/20 hover:border-brand-100 rounded-2xl border border-slate-100 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {prog.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-brand-600 transition-colors">
                      {prog.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {prog.category}
                    </span>
                  </div>
                </div>
                <a
                  href={`/assets/certificates/${prog.filename}`}
                  download={prog.filename}
                  className="p-2.5 bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white rounded-xl border border-brand-100 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
                >
                  <FileDown size={14} />
                  <span>PDF</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2g. Compacted Team Banner Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Our Pillars</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mt-2 mb-3">
              The team <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">behind your success</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Certified examiners, tech support teams, and counseling heads—our experts work in unison to provide an error-free, supportive testing and coaching environment.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[300px] md:h-[380px] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group"
          >
            <img
              src="/assets/office-images/p6.jpeg"
              alt="FETC Team and workspace"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-6 md:p-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-300 mb-1.5">Collaboration & Quality</span>
              <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight leading-none mb-2">
                Be Great. Do Good. Learn Always.
              </h3>
              <p className="text-white/70 max-w-xl font-medium text-xs md:text-sm leading-relaxed">
                Whether organizing mock tests or conducting staff alignment meetings in our conference halls, our core value remains the same: student success comes first.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Certificates Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
              Accreditations
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Certifications</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto text-base">
              Globally recognized credentials that back every examination and training program we deliver.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { src: "/assets/certificates/Screenshot 2026-06-10 111633.png", alt: "Certificate of Representation" },
              { src: "/assets/certificates/Screenshot 2026-06-10 111657.png", alt: "City College Birmingham Appointment Letter" },
              { src: "/assets/certificates/Screenshot 2026-06-10 111719.png", alt: "Certificate of Attendance" },
              { src: "/assets/certificates/Screenshot 2026-06-10 111730.png", alt: "ICEF Accredited Certificate" },
            ].map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-full h-56 overflow-hidden bg-slate-50">
                  <img
                    src={cert.src}
                    alt={cert.alt}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-600 text-center leading-snug">{cert.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-4 md:px-8 bg-slate-50/30 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              Campus Environment
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Explore Our <span className="text-brand-600">Team & Centres</span>
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
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab
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
