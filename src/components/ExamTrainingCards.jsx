import { Link } from "react-router-dom";
import { examData } from "../data/siteData";

function ExamTrainingCards() {
  const exams = Object.entries(examData);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Exam & Training
        </h2>
        <p className="mt-4 text-lg font-medium text-slate-500">
          Specialized coaching to prepare you for top English proficiency exams.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map(([slug, exam]) => (
          <div
            key={slug}
            className="flex flex-col justify-between rounded-3xl bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
          >
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{exam.shortLabel}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{exam.description}</p>
            </div>
            <div className="mt-8 flex">
              <Link
                to={`/exam-training/${slug}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-brand-600 hover:shadow-lg active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExamTrainingCards;
