import { useState, useEffect } from "react";
import Hero from "../components/Hero";
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

  useEffect(() => {
    console.log("Fetching home page data...");
    fetch('/api/pages/home')
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
  }, []);

  const studyAbroadCards = Object.entries(countryData).map(([key, data]) => ({
    title: data.name,
    description: data.description,
    path: `/study-abroad/${key}`
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
    <div className="relative w-full bg-[#FAFAFA] overflow-hidden">

      {/* Ensure Hero stays below header */}
      <div className="relative z-10">
        <Hero content={pageData?.hero} />
        <TrustBar message={pageData?.trustBar?.message} />
      </div>

      {/* SECTION 1: STUDY ABROAD */}
      <div className="relative w-full">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/15 rounded-full blur-[120px] -translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px] translate-y-1/4 translate-x-1/4 pointer-events-none" />

        {/* Component Wrapper */}
        <div className="relative z-10 py-16">
          <ServiceMarqueeRow
            title={pageData?.studyAbroad?.title || "Study Abroad"}
            description={pageData?.studyAbroad?.description || "Explore world-class academic institutions from the UK to Australia, with comprehensive guidance on admissions and visas."}
            linkText={pageData?.studyAbroad?.linkText || "Start Your Journey"}
            linkTarget="/study-abroad/united-kingdom"
            items={studyAbroadCards}
            bgColor="bg-transparent"
            cardBg="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            layout="split-overlapping"
            badgeText={pageData?.studyAbroad?.badgeText || "Global Opportunities"}
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
          title={pageData?.features?.sectionTitle}
          subtitle={pageData?.features?.sectionSubtitle}
          items={pageData?.features?.items}
        />
      </div>

      {/* SECTION 2: EXAM TRAINING */}
      <div className="relative w-full">
        {/* Background Gradients */}
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-teal-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        <div className="relative z-10 py-16">
          <ServiceMarqueeRow
            title={pageData?.examTraining?.title || "Exam Training"}
            description={pageData?.examTraining?.description || "Prepare rigorously for IELTS, TOEFL, PTE, and PSI with expert mentors, realistic simulations, and AI-driven mock testing."}
            linkText={pageData?.examTraining?.linkText || "View All Exams"}
            linkTarget="/exam-training/idp-for-ielts"
            items={examCards}
            bgColor="bg-transparent"
            cardBg="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
            layout="split-overlapping"
            reverse={true}
            badgeText={pageData?.examTraining?.badgeText || "Elite Coaching"}
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
        {/* Smooth central glow without hard borders */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] bg-amber-400/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 py-16">
          <ServiceMarqueeRow
            title={pageData?.careerAssessment?.title || "Career Assessment"}
            description={pageData?.careerAssessment?.description || "Align your natural strengths with the perfect professional or academic trajectory. We help you discover what you are meant to do."}
            linkText={pageData?.careerAssessment?.linkText || "Get Assessed"}
            linkTarget="/career-assessment/behaviour-and-career-analysis"
            items={pageData?.careerAssessment?.items || careerCards}
            bgColor="bg-transparent"
            cardBg="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            isStatic={true}
            badgeText={pageData?.careerAssessment?.badgeText || "Strategic Growth"}
            stats={pageData?.careerAssessment?.stats}
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