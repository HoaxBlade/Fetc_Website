import { Link } from "react-router-dom";
import ukImg from "../assets/countries/uk.png";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FA] text-slate-900">
      <div className="absolute inset-0">
        <img src={ukImg} alt="Study Abroad" className="h-full w-full object-cover opacity-30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA] via-[#F8F9FA]/70 to-transparent"></div>
        {/* Lava Lamp Blob Start */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]"></div>
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-16 md:py-24 md:px-8">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm backdrop-blur-md">
          IELTS • Study Abroad • Career Guidance
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
          Your Gateway to <br/> <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">Global Education</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
          Build your international future with trusted experts for exam
          preparation, admissions, and career direction.
        </p>
        <div className="mt-8 flex">
          <Link
            to="/about/company-profile"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
