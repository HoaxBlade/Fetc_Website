import { Link } from "react-router-dom";
import { examData } from "../data/siteData";

function ExamTrainingCards() {
  const exams = Object.entries(examData);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
          Exam & Training
        </h2>
        <p className="mt-2 text-slate-600">
          Specialized coaching to prepare you for top English proficiency exams.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map(([slug, exam]) => (
          <div
            key={slug}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-slate-800">{exam.shortLabel}</h3>
            <p className="mt-2 text-sm text-slate-600">{exam.description}</p>
            <Link
              to={`/exam-training/${slug}`}
              className="mt-4 inline-block rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExamTrainingCards;
