import { Link, useParams } from "react-router-dom";
import { countryData } from "../data/siteData";

function StudyAbroadPage() {
  const { country } = useParams();
  const details = countryData[country];

  if (!details) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Country Not Found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2 md:p-8">
        <img
          src={details.image}
          alt={details.name}
          className="h-64 w-full rounded-xl object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{details.name}</h1>
          <p className="mt-4 leading-7 text-slate-700">{details.description}</p>
          <Link
            to="/about/company-profile"
            className="mt-8 inline-block rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </main>
  );
}

export default StudyAbroadPage;
