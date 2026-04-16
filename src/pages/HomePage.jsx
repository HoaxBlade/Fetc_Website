import Hero from "../components/Hero";
import ServiceMarqueeRow from "../components/ServiceMarqueeRow";
import WelcomeSection from "../components/WelcomeSection";
import { countryData, examData } from "../data/siteData";

function HomePage() {

  // Map Data directly from your database
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
    }
  ];

  return (
    <>
      <Hero />
      
      <ServiceMarqueeRow 
        title="Study Abroad"
        description="Explore world-class academic institutions from the UK to Australia, with comprehensive guidance on admissions and visas. Our teams handle everything end-to-end securely."
        linkText="Start Your Journey"
        linkTarget="/study-abroad/united-kingdom"
        items={studyAbroadCards}
        bgColor="bg-white"
        cardBg="bg-[#F5F5F7]"
      />
      
      <ServiceMarqueeRow 
        title="Exam Training"
        description="Prepare rigorously for IELTS, TOEFL, PTE, and PSI with expert mentors, realistic simulations, and AI-driven mock testing."
        linkText="View All Exams"
        linkTarget="/exam-training/idp-for-ielts"
        items={examCards}
        bgColor="bg-[#F5F5F7]"
        cardBg="bg-white"
      />

      <ServiceMarqueeRow 
        title="Career Assessment"
        description="Align your natural strengths with the perfect professional or academic trajectory. We help you discover what you are meant to do."
        linkText="Get Assessed"
        linkTarget="/career-assessment/behaviour-and-career-analysis"
        items={careerCards}
        bgColor="bg-white"
        cardBg="bg-[#F5F5F7]"
        isStatic={true}
      />

      <WelcomeSection />
    </>
  );
}

export default HomePage;
