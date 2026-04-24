import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Target, Lightbulb, Compass, Building2, Users2, Award, Loader2 } from "lucide-react";

const STATIC_FALLBACK = {
  hero: {
    title: "Our",
    titleHighlight: "Story",
    description: "A legacy of excellence in global education, built on the foundation of empowering students to achieve their international dreams."
  },
  directorsNote: {
    quote: "With over 27 years of experience in the education and training industry, my journey has been of passion, growth, and transformation.",
    content: "Throughout my career, I have been committed to empowering individuals with the skills, confidence, and global opportunities they deserve.\nMy expertise lies in Strategic Planning, Public Speaking, Training, Staff Development, and Educational Leadership."
  },
  visionSection: {
    badge: "Our Purpose",
    titlePrefix: "The FETC",
    titleHighlight: "Vision",
    values: [
      {
        icon: "Target",
        title: "Global Reach",
        desc: "Established in 2024 to provide a wide variety of English examinations worldwide.",
        color: "from-blue-500 to-indigo-500"
      },
      {
        icon: "Lightbulb",
        title: "Innovation",
        desc: "Implementing state-of-the-art testing and training methodologies for modern learners.",
        color: "from-amber-400 to-orange-500"
      },
      {
        icon: "Compass",
        title: "Guidance",
        desc: "A dream project under Gina Abroad dedicated to steering students toward success.",
        color: "from-teal-400 to-emerald-500"
      }
    ]
  },
  officeShowcase: {
    badge: "Workspace Culture",
    title: "Empowering Minds in a Global Environment",
    description: "Our state-of-the-art facilities are designed to foster learning, innovation, and professional excellence.",
    images: [
      "/assets/office-images/exterior-roongta-vesu.jpeg",
      "/assets/office-images/directors-cabin.jpeg",
      "/assets/office-images/testing-lab.jpg",
      "/assets/office-images/vip-conference.jpg"
    ]
  }
};

function CompanyProfilePage() {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchPageContent = async () => {
    try {
      const response = await fetch('/api/pages/about/company-profile');
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      } else {
        setPageData(STATIC_FALLBACK);
      }
    } catch (err) {
      console.error('Failed to fetch company profile content:', err);
      setPageData(STATIC_FALLBACK);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, []);

  const showcaseImages = pageData?.officeShowcase?.images || [];

  useEffect(() => {
    if (showcaseImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [showcaseImages.length]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight italic">Loading Our Story...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 md:px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-100/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-0 w-[400px] h-[300px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 mb-6 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <Building2 className="w-8 h-8 text-brand-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            {pageData?.hero?.title || "Our"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">
              {pageData?.hero?.titleHighlight || "Story"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {pageData?.hero?.description || "A legacy of excellence in global education, built on the foundation of empowering students to achieve their international dreams."}
          </motion.p>
        </div>
      </section>

      {/* Director's Note */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
            className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden"
          >
            <Quote className="absolute top-10 right-10 w-32 h-32 text-brand-50/50 rotate-12 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-4">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 h-full flex flex-col justify-center text-center lg:text-left">
                  <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                    <Users2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Director's Note</h2>
                  <div className="h-1 w-12 bg-gradient-to-r from-brand-600 to-teal-400 rounded-full mx-auto lg:mx-0 mt-4" />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-medium italic border-l-4 border-teal-400 pl-6 md:pl-8">
                  "{pageData?.directorsNote?.quote || "With over 27 years of experience in the education and training industry, my journey has been of passion, growth, and transformation."}"
                </p>
                <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed pl-6 md:pl-8">
                  {pageData?.directorsNote?.content ? (
                    pageData.directorsNote.content.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)
                  ) : (
                    <>
                      <p>Throughout my career, I have been committed to empowering individuals with the skills, confidence, and global opportunities they deserve.</p>
                      <p>My expertise lies in Strategic Planning, Public Speaking, Training, Staff Development, and Educational Leadership.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Values Bento */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-4 px-4 py-2 bg-brand-50 rounded-full">
              {pageData?.visionSection?.badge || "Our Purpose"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {pageData?.visionSection?.titlePrefix || "The FETC"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">
                {pageData?.visionSection?.titleHighlight || "Vision"}
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(pageData?.visionSection?.values || [
              {
                icon: "Target",
                title: "Global Reach",
                desc: "Established in 2024 to provide a wide variety of English examinations worldwide.",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: "Lightbulb",
                title: "Innovation",
                desc: "Implementing state-of-the-art testing and training methodologies for modern learners.",
                color: "from-amber-400 to-orange-500"
              },
              {
                icon: "Compass",
                title: "Guidance",
                desc: "A dream project under Gina Abroad dedicated to steering students toward success.",
                color: "from-teal-400 to-emerald-500"
              }
            ]).map((item, idx) => {
              const Icon = { Target, Lightbulb, Compass }[item.icon] || Target;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.color} shadow-lg shadow-brand-200/50 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Office Showcase Section */}
      <section className="py-24 relative overflow-hidden bg-white mt-10 border-t border-slate-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-6 px-4 py-2 bg-teal-50 rounded-full border border-teal-100 w-fit">
                {pageData?.officeShowcase?.badge || "Workspace Culture"}
              </span>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                {pageData?.officeShowcase?.title || "Empowering Minds in a Global Environment"}
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
                {pageData?.officeShowcase?.description || "Our state-of-the-art facilities are designed to foster learning, innovation, and professional excellence."}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <Award className="w-8 h-8 text-brand-600 mb-3" />
                  <h4 className="font-bold text-slate-900">Modern Facilities</h4>
                  <p className="text-sm text-slate-500 mt-1">Equipped with the latest learning technology.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <Users2 className="w-8 h-8 text-teal-500 mb-3" />
                  <h4 className="font-bold text-slate-900">Collaborative Spaces</h4>
                  <p className="text-sm text-slate-500 mt-1">Designed for interaction and growth.</p>
                </div>
              </div>
            </motion.div>

            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-square w-full min-w-[300px] max-w-[580px] overflow-hidden rounded-full border-[8px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] group mx-auto">
                  {showcaseImages.length > 0 ? showcaseImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Workspace ${idx}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out transform ${idx === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                        }`}
                    />
                  )) : (
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300 italic text-sm">
                      No Showcase Images Added
                    </div>
                  )}
                </div>

                <div className="absolute -inset-4 bg-brand-200/20 rounded-full blur-3xl -z-10 animate-pulse" />

                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                  {showcaseImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIndex ? "w-8 bg-brand-600" : "w-2 bg-slate-200"
                        }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompanyProfilePage;
