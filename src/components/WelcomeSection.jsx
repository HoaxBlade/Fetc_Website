import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Award, Globe, ArrowRight } from "lucide-react";

// Import the 4 new carousel images
import welcome1 from "../assets/fetc-about-us/welcome-1.jpeg";
import welcome2 from "../assets/fetc-about-us/welcome-2.jpeg";
import welcome3 from "../assets/fetc-about-us/welcome-3.jpeg";
import welcome4 from "../assets/fetc-about-us/welcome-4.jpeg";

const WelcomeSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [welcome1, welcome2, welcome3, welcome4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative Blob for Section Linker */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-slate-200/20 blur-[120px]"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header (Minimal) */}
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600 mb-4 px-3 py-1 bg-brand-50 rounded-full">
            Powered by Gina Abroad
          </span>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          
          {/* 1. Large Main Welcome Card (2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col justify-between overflow-hidden relative">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                Welcome to <br/> <span className="text-brand-600 font-black">FETC</span>
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mb-10">
                Building your international future with trusted experts for exam preparation, admissions, and career direction.
              </p>
              <Link
                to="/about/company-profile"
                className="group inline-flex items-center gap-3 bg-slate-900 border border-slate-900 hover:bg-white hover:text-slate-900 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300"
              >
                <span>Explore FETC's Mission</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Panoramic Image Carousel at Bottom of Card */}
            <div className="mt-12 -mx-8 -mb-8 lg:-mx-12 lg:-mb-12 relative h-64 lg:h-80 overflow-hidden bg-slate-100">
               {images.map((img, idx) => (
                 <img 
                   key={idx}
                   src={img} 
                   alt={`Classroom ${idx + 1}`} 
                   className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-[1500ms] ease-in-out transform ${
                     idx === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                   }`}
                 />
               ))}
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
               
               {/* Progress Indicators (Apple Style Pills) */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className="h-1 rounded-full bg-white/30 overflow-hidden transition-all duration-500"
                      style={{ width: idx === currentIndex ? "24px" : "8px" }}
                    >
                      <div 
                        className={`h-full bg-white transition-all ${idx === currentIndex ? "w-full duration-[5000ms] ease-linear" : "w-0 duration-0"}`}
                      />
                    </div>
                  ))}
               </div>

               {/* Floating Stat integrated inside image area */}
               <div className="absolute top-6 right-6 bg-white/40 backdrop-blur-2xl border border-white/30 p-5 rounded-2xl shadow-xl animate-float z-20">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">2.98K</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mt-1">Finished Sessions</span>
                  </div>
               </div>
            </div>
          </div>

          {/* 2. English Language Training (Wide 2x1) */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col justify-center">
            <div className="flex items-start gap-6">
              <div className="shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 tracking-tight">English Language Training</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                  Blended & Hybrid training structure to assist maximum proficiency in teaching worldwide with our elite certified mentors.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Authorized Exam Centre (1x1) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">Authorized Exam Centre</h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500 mb-4">
                We provide official testing services for various international language examinations.
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Partner</p>
            </div>
          </div>

          {/* 4. Study Abroad (1x1) */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">Global Study Abroad</h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500 mb-4">
                Expert support in program selection, application processes, and visa requirements.
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expert Guidance</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
