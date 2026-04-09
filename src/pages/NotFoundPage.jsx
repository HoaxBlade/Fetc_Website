import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-600">The page you requested was not found.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-brand-700 px-6 py-3 text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFoundPage;
