import { Link } from "react-router-dom";

function ServiceMarqueeRow({ 
  title, 
  description, 
  linkText, 
  linkTarget, 
  items = [], 
  bgColor = "bg-white", 
  cardBg = "bg-[#F5F5F7]",
  isStatic = false,
}) {

  let scrollingItems = items;
  if (!isStatic) {
    let baseArray = [...items];
    while (baseArray.length < 8) {
        baseArray = [...baseArray, ...items];
    }
    scrollingItems = [...baseArray, ...baseArray];
  }

  const gradientColors = [
    "from-blue-500 to-brand-700",
    "from-sky-400 to-indigo-500",
    "from-teal-400 to-blue-600",
    "from-orange-400 to-rose-500",
    "from-purple-500 to-fuchsia-600"
  ];

  const renderCard = (service, idx) => (
    <div key={idx} className={`flex w-[320px] shrink-0 flex-col justify-between rounded-[1.5rem] p-6 ring-1 ring-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] md:w-[350px] ${cardBg}`}>
      <div>
        <h3 className={`bg-gradient-to-br ${gradientColors[idx % gradientColors.length]} bg-clip-text mb-3 text-2xl font-bold tracking-tight text-transparent`}>
          {service.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-slate-600">
          {service.description.length > 120 ? service.description.substring(0, 120) + "..." : service.description}
        </p>
      </div>
      <div className="mt-8">
         <Link
           to={service.path}
           className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:text-brand-600"
         >
           Explore Details
           <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
           </svg>
         </Link>
      </div>
    </div>
  );

  return (
    <section className={`relative overflow-hidden py-16 md:py-20 ${bgColor}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* iOS Style Centered Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-500">
            {description}
          </p>
          <div className="mt-8">
             <Link
               to={linkTarget}
               className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-brand-600 active:scale-95"
             >
               {linkText}
             </Link>
          </div>
        </div>
        {isStatic ? (
          <div className="flex w-full justify-center">
             <div className="flex flex-wrap justify-center gap-8">
                {items.map((service, idx) => renderCard(service, idx))}
             </div>
          </div>
        ) : (
          <div className={`relative flex w-full overflow-hidden rounded-[2rem] shadow-inner ring-1 ring-slate-100/50 before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-24 before:bg-gradient-to-r ${beforeMaskString(bgColor)} after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-24 after:bg-gradient-to-l ${afterMaskString(bgColor)}`}>
            <div className="group flex w-max gap-8 px-4 py-8 animate-marquee-horizontal hover:[animation-play-state:paused] md:px-6">
               {scrollingItems.map((service, idx) => renderCard(service, idx))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Helpers for the Tailwind dynamic edge masks
function beforeMaskString(bg) {
    if (bg === "bg-white") return "before:from-white before:to-transparent";
    if (bg === "bg-[#F5F5F7]") return "before:from-[#F5F5F7] before:to-transparent";
    if (bg === "bg-slate-50") return "before:from-slate-50 before:to-transparent";
    return "";
}

function afterMaskString(bg) {
    if (bg === "bg-white") return "after:from-white after:to-transparent";
    if (bg === "bg-[#F5F5F7]") return "after:from-[#F5F5F7] after:to-transparent";
    if (bg === "bg-slate-50") return "after:from-slate-50 after:to-transparent";
    return "";
}

export default ServiceMarqueeRow;
