import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getApiUrl } from "../apiConfig";
import CasualHero from "../components/CasualHero";
import ServiceMarqueeRow from "../components/ServiceMarqueeRow";
import WelcomeSection from "../components/WelcomeSection";
import TrustBar from "../components/TrustBar";
import FeaturesGrid from "../components/FeaturesGrid";
import HowItWorks from "../components/HowItWorks";
import ContactCTA from "../components/ContactCTA";
import GenericSection from "../components/GenericSection";
import { countryData, examData } from "../data/siteData";

function HomePage() {
  const [pageData, setPageData] = useState(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // 1. Fetch DB Data
    console.log("Fetching home page data...");
    fetch((window.API_BASE||'') + '/api/pages/home', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Home Page Data:", data);
        if (data.success && data.page.content) {
          setPageData(data.page.content);
        }
      })
      .catch(err => {
        console.warn("Using local fallback data:", err);
      });

    // 2. Preload Heavy Memoji Assets
    const imagesToPreload = Object.values(countryData)
      .map(data => data.image)
      .filter(Boolean); // Filter out nulls

    // Also preload some static banner if needed, but memojis are the heaviest
    
    if (imagesToPreload.length === 0) {
      setAssetsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) setAssetsLoaded(true);
      };
      img.onerror = () => {
        loadedCount++; // Count even on error so we don't hang
        if (loadedCount === totalImages) setAssetsLoaded(true);
      };
    });

    // Fallback: If Vercel is extremely slow, force load after 3.5 seconds
    const timeout = setTimeout(() => setAssetsLoaded(true), 3500);
    return () => clearTimeout(timeout);
  }, []);

  if (!assetsLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-brand-600">FETC</span>
          </div>
        </div>
        <p className="text-slate-500 font-bold mt-6 uppercase text-sm tracking-widest animate-pulse">Loading Experience...</p>
      </div>
    );
  }

  const studyAbroadCards = Object.entries(countryData).map(([key, data]) => ({
    title: data.name,
    description: data.description,
    path: `/study-abroad/${key}`,
    flag: data.flag,
    image: data.image
  }));

  const examCards = Object.entries(examData).map(([key, data]) => ({
    title: data.name,
    description: data.description,
    path: `/exam-training/${key}`
  }));

  const careerCards = [
    {
      title: "Behaviour and Career Analysis",
      description: "Discover your perfect professional path with our highly tailored behavioral and occupational analysis.",
      path: "/career-assessment/behaviour-and-career-analysis"
    },
    {
      title: "Helpful Resources",
      links: [
        { label: "Financial Planning Checklist", url: "https://drive.google.com/file/d/1wX99-y42WJNS8U8uAiS3xQzUrpiivcUM/view?usp=drive_link" },
        { label: "Part time job and internships", url: "https://drive.google.com/file/d/1iXz--uNuiuBBHnNv8yX3khWjzBhUspyG/view?usp=drive_link" },
        { label: "Road Map Study Abroad", url: "https://drive.google.com/file/d/139BsYSsVSIPziOebKWNL8StFU7LGs6P3/view?usp=drive_link" },
        { label: "Service Provider Agreement", url: "https://drive.google.com/file/d/16RCN90tqMDusAexTX6L2fKCLu92XSZYh/view?usp=drive_link" }
      ]
    }
  ];

  return (
    <div className="relative w-full bg-transparent overflow-hidden">
      {/* Premium Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-teal-200/25 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[35%] left-[-10%] w-[45%] h-[45%] bg-cyan-200/25 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute top-[55%] right-[-10%] w-[50%] h-[50%] bg-orange-100/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[-10%] left-[15%] w-[55%] h-[55%] bg-brand-200/25 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-teal-100/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      {/* Global Background Texture (Glassy Noise) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Hero Section */}
      <div className="relative z-10">
        <CasualHero content={pageData?.hero} />
        <TrustBar message={pageData?.trustBar?.message} />
      </div>

      {/* SECTION 1: STUDY ABROAD */}
      <div className="relative w-full">
        {/* Playful Background Blobs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-400/5 rounded-full blur-[150px] -translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-orange-400/5 rounded-full blur-[150px] translate-y-1/4 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 py-14 md:py-16">
          <ServiceMarqueeRow
            title={pageData?.studyAbroad?.title || "Explore the World"}
            description={pageData?.studyAbroad?.description || "Pick your dream destination and let us handle the boring stuff. We've helped thousands of students settle in over 10+ countries."}
            linkText={pageData?.studyAbroad?.linkText || "Start My Adventure"}
            linkTarget="/study-abroad/united-kingdom"
            items={studyAbroadCards}
            bgColor="bg-transparent"
            cardBg="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 rounded-[2.5rem]"
            layout="split-overlapping"
            badgeText={pageData?.studyAbroad?.badgeText || "Global Vibes"}
            stats={pageData?.studyAbroad?.stats || [
              { value: "100+", label: "Universities" },
              { value: "10+", label: "Destinations" },
              { value: "98%", label: "Visa Success" }
            ]}
          />
        </div>
      </div>

      <div className="relative z-20">
        <FeaturesGrid
          title={pageData?.features?.sectionTitle || "Why Students Love Us"}
          subtitle={pageData?.features?.sectionSubtitle || "We're not your typical consultants. We care about your journey as much as you do."}
          items={pageData?.features?.items}
        />
      </div>

      {/* SECTION 2: EXAM TRAINING */}
      <div className="relative w-full bg-transparent">
        {/* Background Gradients */}
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-teal-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 py-14 md:py-16">
          <ServiceMarqueeRow
            title={pageData?.examTraining?.title || "Ace Your Exams"}
            description={pageData?.examTraining?.description || "From IELTS to PTE, we make exam prep feel like a breeze with expert coaching and real mock tests."}
            linkText={pageData?.examTraining?.linkText || "Check Courses"}
            linkTarget="/exam-training/idp-for-ielts"
            items={examCards}
            bgColor="bg-transparent"
            cardBg="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 rounded-[2.5rem]"
            layout="split-overlapping"
            reverse={true}
            badgeText={pageData?.examTraining?.badgeText || "Top Coaching"}
            stats={pageData?.examTraining?.stats || [
              { value: "100%", label: "Result Boost" },
              { value: "200+", label: "Mock Tests" },
              { value: "Expert", label: "1-on-1 Mentors" }
            ]}
          />
        </div>
      </div>

      <div className="relative z-20">
        <HowItWorks />
      </div>

      {/* SECTION 3: CAREER ASSESSMENT */}
      <div className="relative w-full">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 py-14 md:py-16">
          <ServiceMarqueeRow
            title={pageData?.careerAssessment?.title || "Find Your Path"}
            description={pageData?.careerAssessment?.description || "Not sure what to study? Our AI-powered analysis helps you discover your strengths and the perfect career to match."}
            linkText={pageData?.careerAssessment?.linkText || "Get Your Result"}
            linkTarget="/career-assessment/behaviour-and-career-analysis"
            items={pageData?.careerAssessment?.items || careerCards}
            bgColor="bg-transparent"
            cardBg="bg-white border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[2.5rem]"
            isStatic={true}
            badgeText={pageData?.careerAssessment?.badgeText || "Smart Career"}
            stats={pageData?.careerAssessment?.stats}
            secondTitle={pageData?.careerAssessment?.secondTitle || "Helpful Stuff"}
            secondDescription={pageData?.careerAssessment?.secondDescription || "Guides, checklists, and all the tools you need to stay organized."}
          />
        </div>
      </div>

      <div className="relative z-20">
        <WelcomeSection />

        {/* Dynamic Custom Sections added via Admin Panel */}
        {pageData?.customSections?.map((section, idx) => (
          <GenericSection
            key={section.id}
            title={section.title}
            content={section.content}
            image={section.image}
            index={idx}
          />
        ))}

        <ContactCTA />
      </div>
    </div>
  );
}

export default HomePage;
