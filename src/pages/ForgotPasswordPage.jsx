import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4 shadow-sm border border-brand-200">
            <KeyRound size={32} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Forgot Password?
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 px-4">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {isSubmitted ? (
            <div className="text-center animate-fade-in-up">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Check your email</h3>
              <p className="text-sm text-slate-500 mb-6">
                We sent a password reset link to <br/>
                <span className="font-medium text-slate-800">{email}</span>
              </p>
              <Link
                to="/my-account"
                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              >
                Back to log in
              </Link>
            </div>
          ) : (
            <form className="space-y-6 animate-fade-in-up" onSubmit={handleSubmit}>
              <div className="space-y-2 group">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all bg-brand-600 hover:bg-brand-700 active:scale-[0.98] ${
                    (isSubmitting || !email) ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Instructions...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          )}

          {!isSubmitted && (
            <div className="mt-8 text-center">
              <Link to="/my-account" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
                <ArrowLeft size={16} />
                Back to log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
