import { Link } from "react-router-dom";
import ukImg from "../assets/countries/uk.png";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 text-white">
      <div className="absolute inset-0 opacity-20">
        <img src={ukImg} alt="Study Abroad" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-20 md:px-6">
        <p className="mb-3 inline-block w-fit rounded-full bg-white/15 px-4 py-1 text-sm">
          IELTS | Study Abroad | Career Guidance
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Your Gateway to Global Education
        </h1>
        <p className="mt-4 max-w-2xl text-slate-100">
          Build your international future with trusted experts for exam
          preparation, admissions, and career direction.
        </p>
        <div className="mt-8">
          <Link
            to="/about/company-profile"
            className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-soft transition hover:bg-slate-100"
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
