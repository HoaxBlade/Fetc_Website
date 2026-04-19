import Hero from "../components/Hero";
import ServiceMarqueeRow from "../components/ServiceMarqueeRow";
import WelcomeSection from "../components/WelcomeSection";
import TrustBar from "../components/TrustBar";
import FeaturesGrid from "../components/FeaturesGrid";
import HowItWorks from "../components/HowItWorks";
import ContactCTA from "../components/ContactCTA";
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
      <TrustBar />

      <div className="relative">
        {/* Connector Blob 1 */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] -translate-y-1/2 -ml-64 pointer-events-none z-0"></div>

        <ServiceMarqueeRow
          title="Study Abroad"
          description="Explore world-class academic institutions from the UK to Australia, with comprehensive guidance on admissions and visas. Our teams handle everything end-to-end securely."
          linkText="Start Your Journey"
          linkTarget="/study-abroad/united-kingdom"
          items={studyAbroadCards}
          bgColor="bg-transparent"
          cardBg="bg-white"
          layout="split-overlapping"
          badgeText="Global Opportunities"
          stats={[
            { value: "100+", label: "Universities" },
            { value: "10+", label: "Destinations" },
            { value: "98%", label: "Visa Success" }
          ]}
          floatingTags={["🎓 Elite Admissions", "📑 Seamless Visa", "💰 Scholarships"]}
        />
      </div>

      <FeaturesGrid />

      <div className="relative">
        <ServiceMarqueeRow
          title="Exam Training"
          description="Prepare rigorously for IELTS, TOEFL, PTE, and PSI with expert mentors, realistic simulations, and AI-driven mock testing."
          linkText="View All Exams"
          linkTarget="/exam-training/idp-for-ielts"
          items={examCards}
          bgColor="bg-[#F8F9FA]/50"
          cardBg="bg-white"
          layout="split-overlapping"
          reverse={true}
          badgeText="Elite Coaching"
          stats={[
            { value: "100%", label: "Result Boost" },
            { value: "200+", label: "Mock Tests" },
            { value: "Expert", label: "1-on-1 Mentors" }
          ]}
          floatingTags={["✍️ IELTS Mastery", "💻 PTE Masterclass", "📚 TOEFL Success"]}
        />
        {/* Connector Blob 2 */}
        <div className="absolute top-full left-1/3 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none z-0"></div>
      </div>

      <HowItWorks />

      <div className="relative">
        <ServiceMarqueeRow
          title="Career Assessment"
          description="Align your natural strengths with the perfect professional or academic trajectory. We help you discover what you are meant to do."
          linkText="Get Assessed"
          linkTarget="/career-assessment/behaviour-and-career-analysis"
          items={careerCards}
          bgColor="bg-transparent"
          cardBg="bg-white"
          isStatic={true}
        />
      </div>

      <WelcomeSection />

      <ContactCTA />
    </>
  );
}

export default HomePage;
