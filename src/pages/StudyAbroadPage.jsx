import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Search, MapPin, Sparkles, Download, ChevronDown } from "lucide-react";
import { countryData as STATIC_FALLBACKS } from "../data/siteData";

function StudyAbroadPage() {
  const { country } = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSopDropdownOpen, setIsSopDropdownOpen] = useState(false);

  const fetchCountryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/pages/study-abroad/${country}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      } else {
        // Use siteData fallback if DB is missing data
        setPageData(STATIC_FALLBACKS[country] || null);
      }
    } catch (err) {
      console.error('Failed to fetch study abroad data:', err);
      setPageData(STATIC_FALLBACKS[country] || null);
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchCountryData();
  }, [fetchCountryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight italic">Exploring {country.replace('-', ' ')}...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <Search size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Oops! Country Info Missing</h1>
        <p className="text-slate-500 mb-8 font-medium">We haven't added the details for this destination to our CMS yet.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
          Go back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
        <Link to="/" className="text-brand-600 hover:text-brand-800 transition-colors">
          Home
        </Link>
        <span className="mx-2 opacity-30">/</span>
        <span>Study Abroad</span>
        <span className="mx-2 opacity-30">/</span>
        <span className="text-slate-900">{pageData.name}</span>
      </div>

      {/* Hero Card */}
      <div className="grid gap-10 rounded-[3rem] bg-white p-6 shadow-soft ring-1 ring-slate-100/50 md:grid-cols-2 md:p-12 transition-all duration-500 hover:shadow-xl">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-lg group aspect-[4/3] md:aspect-auto">
          <img
            src={pageData.image || "https://images.unsplash.com/photo-1526137630142-fca52b75e6e1?q=80&w=1287&auto=format&fit=crop"}
            alt={pageData.name}
            className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
             <span className="w-10 h-1 bg-brand-600 rounded-full" />
             <span className="text-xs font-black text-brand-600 uppercase tracking-widest">Top Destination</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-6xl text-balance flex flex-wrap items-center gap-4">
            <span>Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">{pageData.name}</span></span>
            {(STATIC_FALLBACKS[country]?.flag || pageData.flag) && (
              <img 
                src={STATIC_FALLBACKS[country]?.flag || pageData.flag} 
                alt={`${pageData.name} flag`} 
                className="h-10 md:h-12 w-auto object-contain rounded-lg filter drop-shadow-md select-none" 
              />
            )}
          </h1>
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-slate-500 font-medium">
            {pageData.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to={`/start-journey?country=${pageData.name}`}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 hover:shadow-brand-100 active:scale-95"
            >
              Start Your Journey
            </Link>
            {pageData.sopLinks && pageData.sopLinks.length > 1 ? (
              <div className="relative">
                <button
                  onClick={() => setIsSopDropdownOpen(!isSopDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsSopDropdownOpen(false), 200)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl shadow-slate-200 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:text-brand-600 hover:shadow-brand-100/50 active:scale-95"
                >
                  <Download size={20} />
                  Download SOP
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isSopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSopDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] rounded-2xl bg-white p-2 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 z-50">
                    {pageData.sopLinks.map((sop, idx) => (
                      <a
                        key={idx}
                        href={sop.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Download size={16} />
                        {sop.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (pageData.sopLinks || pageData.sopLink) && (
              <a
                href={pageData.sopLinks ? pageData.sopLinks[0].url : pageData.sopLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl shadow-slate-200 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:text-brand-600 hover:shadow-brand-100/50 active:scale-95"
              >
                <Download size={20} />
                Download SOP
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      {pageData.universities && pageData.universities.length > 0 && (
        <div className="mt-24">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
            <div>
               <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                 Elite Universities
               </h2>
               <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest italic flex items-center gap-2">
                 <Sparkles size={14} className="text-amber-400" /> Discover your perfect match in {pageData.name}
               </p>
            </div>
            
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder={`Search universities...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-white py-4.5 pl-14 pr-6 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-brand-300 focus:ring-8 focus:ring-brand-600/5 shadow-soft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pageData.universities
              .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((uni, idx) => (
              <a
                key={idx}
                href={uni.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col justify-between rounded-[2.5rem] bg-white p-8 border border-slate-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-brand-100"
              >
                {uni.exclusive && (
                  <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-xl ring-4 ring-white">
                    Exclusive Partner
                  </span>
                )}
                
                <div className="mb-10 flex h-32 w-full items-center justify-center relative p-4">
                   <div className="absolute inset-0 bg-slate-50/50 rounded-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {uni.image ? (
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="h-full w-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-2xl font-black text-brand-600 relative z-10">
                      {uni.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <h3 className="text-center text-base font-black text-slate-800 transition-colors duration-300 group-hover:text-brand-600 leading-tight mb-4">
                    {uni.name}
                  </h3>
                  
                  <div className="flex flex-col gap-3 pt-6 border-t border-slate-50 relative group-hover:border-brand-50 transition-colors">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                       <span className="flex items-center gap-1.5 group-hover:text-amber-500 transition-colors">
                         <MapPin size={12} /> {uni.location || pageData.name}
                       </span>
                       <span className="px-2 py-1 bg-slate-50 rounded-lg group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                         {uni.ranking || "Top Ranked"}
                       </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover Indicator */}
                <div className="mt-6 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                   <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1.5">
                      Visit Website <Sparkles size={10} />
                   </span>
                </div>
              </a>
            ))}
          </div>
          
          {pageData.universities.filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="py-20 text-center">
               <p className="text-slate-400 font-bold italic">No universities match your search...</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default StudyAbroadPage;
