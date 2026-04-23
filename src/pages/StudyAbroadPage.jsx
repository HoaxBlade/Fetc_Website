import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { countryData } from "../data/siteData";

function StudyAbroadPage() {
  const { country } = useParams();
  const details = countryData[country];
  const [searchQuery, setSearchQuery] = useState("");

  if (!details) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Country Not Found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-center text-sm text-slate-500">
        <Link to="/" className="text-brand-700 hover:text-brand-800 font-medium">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Study Abroad</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-800">{details.name}</span>
      </div>

      <div className="grid gap-10 rounded-[2.5rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 md:grid-cols-2 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)]">
        <div className="relative overflow-hidden rounded-[2rem] shadow-sm">
          <img
            src={details.image}
            alt={details.name}
            className="h-full max-h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{details.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{details.description}</p>
          <div>
            <Link
              to={`/start-journey?country=${details.name}`}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:shadow-lg active:scale-95"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>

      {details.universities && details.universities.length > 0 && (
        <div className="mt-20">
          <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Top Universities in {details.name}
            </h2>
            <div className="relative w-full max-w-sm">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={`Search in ${details.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-400/10 shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {details.universities
              .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((uni, idx) => (
              <a
                key={idx}
                href={uni.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col justify-between rounded-3xl bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
              >
                {uni.exclusive && (
                  <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md ring-4 ring-slate-50">
                    Exclusive
                  </span>
                )}
                <div className="mb-6 flex h-24 w-full items-center justify-center shrink-0">
                  {uni.image ? (
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="h-full w-full object-contain mix-blend-multiply opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-xl font-bold text-slate-300 transition duration-300 group-hover:bg-brand-50 group-hover:text-brand-400">
                      {uni.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="mt-auto flex flex-col items-center">
                  <h3 className="text-center text-[13px] font-bold text-slate-800 transition-colors duration-300 group-hover:text-brand-600">
                    {uni.name}
                  </h3>
                  <div className="mt-3 flex w-full flex-col items-center gap-1.5 border-t border-slate-50 pt-3 text-[11px] font-medium text-slate-400 transition-colors duration-300 group-hover:border-slate-100/60">
                    <div className="flex items-center justify-center gap-1.5">
                      <svg className="h-3.5 w-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{uni.location || details.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>{uni.ranking || `Top ${(uni.name.length % 5 + 1) * 50}`}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default StudyAbroadPage;
