import { Link } from "react-router-dom";

const services = [
  {
    title: "Study Abroad",
    description: "Explore world-class academic institutions from the UK to Australia, with comprehensive guidance on admissions and visas.",
    path: "/study-abroad/united-kingdom",
    color: "from-blue-500 to-brand-700"
  },
  {
    title: "Career Assessment",
    description: "Discover your perfect professional path with our highly tailored behavioral and occupational analysis tailored to your specific strengths.",
    path: "/career-assessment/behaviour-and-career-analysis",
    color: "from-sky-400 to-indigo-500"
  },
  {
    title: "Exam & Training",
    description: "Prepare rigorously for IELTS, TOEFL, PTE, and PSI with expert mentors, realistic simulations, and AI-driven mock testing.",
    path: "/exam-training/idp-for-ielts",
    color: "from-teal-400 to-blue-600"
  }
];

// Duplicate the array so there are enough items to loop seamlessly.
const scrollingItems = [...services, ...services];

function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:gap-24 md:px-6">
        
        {/* Left Side: Static Sticky Text */}
        <div className="flex flex-col justify-center">
          <div className="sticky top-32">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Services We <br/> Provide
            </h2>
            <p className="mt-8 max-w-md text-lg font-medium leading-relaxed text-slate-600">
              We deliver comprehensive end-to-end support for your international education journey. Whether you are looking for career clarity, exam mastery, or elite university placements, our expert team ensures your absolute success.
            </p>
            <div className="mt-12">
               <Link
                 to="/about/company-profile"
                 className="inline-flex items-center justify-center rounded-full bg-slate-900 px-10 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:shadow-[0_15px_40px_rgb(2,132,199,0.3)] active:scale-95"
               >
                 Discover More
               </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Auto Scrolling Cards */}
        <div className="relative h-[650px] overflow-hidden rounded-[2.5rem] bg-[#F5F5F7] ring-1 ring-slate-100/50 shadow-inner before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-24 before:bg-gradient-to-b before:from-[#F5F5F7] before:to-transparent after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-24 after:bg-gradient-to-t after:from-[#F5F5F7] after:to-transparent md:h-[700px]">
          
          <div className="group flex flex-col gap-6 p-6 animate-marquee-vertical hover:[animation-play-state:paused]">
             {scrollingItems.map((service, idx) => (
                <div key={idx} className="flex flex-col justify-between rounded-[2rem] bg-white p-8 ring-1 ring-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)]">
                  <div>
                    <h3 className={`bg-gradient-to-br ${service.color} bg-clip-text text-3xl font-extrabold tracking-tight text-transparent`}>
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base font-medium leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-10">
                     <Link
                       to={service.path}
                       className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900 transition-colors hover:text-brand-600"
                     >
                       Explore Service
                       <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                       </svg>
                     </Link>
                  </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
