import p2 from "../assets/officeImages/p2.jpeg";
import p4 from "../assets/officeImages/p4.jpeg";
import p5 from "../assets/officeImages/p5.jpeg";

function CompanyProfilePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight md:text-5xl">
            Company Profile
          </h1>
          <div className="mt-2 h-1.5 w-20 bg-brand-600 rounded-full"></div>
        </div>

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">Director&apos;s Note</h2>
          <div className="mt-8 space-y-6">
            <p className="text-lg leading-relaxed text-slate-600 font-medium italic border-l-4 border-brand-200 pl-6">
              "With over 27 years of experience in the education and training
              industry, my journey has been of passion, growth, and transformation
              from a student, to a trainer, and ultimately to an entrepreneur and
              leader, and still an aspirant."
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              Throughout my career, I have been committed to empowering individuals
              with the skills, confidence, and global opportunities they deserve.
              From being the proprietor of London Test Centre to becoming the
              proprietor of Gina Abroad, and further transitioning into various
              ventures under the umbrella of Gina Abroad Private Limited Board of
              Directors, my journey has been dynamic and evolving.
            </p>
            <p className="text-base leading-relaxed text-slate-600">
              My expertise lies in Strategic Planning, Public Speaking, Training,
              Staff Development, and Educational Leadership, which have been evident
              in shaping various school policies in Surat to deliver impactful
              learning experiences for learners. Over the years, I have gained
              extensive experience across multiple sectors, from private to
              government, and have trained more than 5,000 teachers and countless
              students in ESL proficiency.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">The FETC Vision</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 font-medium">
            FETC is a dream project under Gina Abroad Private Limited, established
            in 2024 with a vision to provide a wide variety of English
            examinations worldwide.
          </p>
        </section>

        {/* Office Showcase Section */}
        <section className="mt-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Added Text Context */}
            <div className="lg:col-span-4 flex flex-col justify-center">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-4 px-3 py-1 bg-brand-50 rounded-full w-fit">
                 Workspace Culture
               </span>
               <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-tight">
                 Empowering Minds in a <span className="text-brand-600 underline decoration-brand-200 underline-offset-8">Global Environment</span>
               </h3>
               <p className="text-slate-500 font-medium leading-relaxed">
                 Our state-of-the-art facilities are designed to foster learning, 
                 innovation, and professional excellence. From high-tech testing centers 
                 to collaborative training spaces, every corner reflects our commitment 
                 to your global educational journey.
               </p>
            </div>

            {/* Middle: Main Circular Image (p2) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600/20 via-sky-400/20 to-teal-400/20 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative aspect-square w-72 md:w-80 overflow-hidden rounded-full border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
                  <img 
                    src={p2} 
                    alt="Training Excellence" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
              </div>
            </div>

            {/* Right: Stacked Images Grid (p4, p5) */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group/card">
                <img 
                  src={p4} 
                  alt="Modern Classrooms" 
                  className="h-44 w-full object-cover md:h-52 group-hover/card:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group/card">
                <img 
                  src={p5} 
                  alt="Student Success Sessions" 
                  className="h-44 w-full object-cover md:h-52 group-hover/card:scale-105 transition-transform duration-700 object-[50%_15%]" 
                />
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

export default CompanyProfilePage;
