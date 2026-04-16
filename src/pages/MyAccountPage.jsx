import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const MyAccountPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "login"); // 'login' or 'signup'

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Basic Validation simulation
    if (activeTab === "signup" && formData.password.length < 6) {
      setIsSubmitting(false);
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      if (activeTab === "login") {
        setMessage({ type: "success", text: "Successfully logged in!" });
      } else {
        setMessage({ type: "success", text: "Account created successfully! Please login." });
        setActiveTab("login");
      }
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] bg-[#F5F5F7] flex flex-col justify-center py-12">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="w-full max-w-md mr-auto">
          
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              My Account
            </h2>
            <p className="mt-3 text-base text-slate-600 font-medium">
              {activeTab === "login" ? "Welcome back! Please login to your account." : "Create a new account to get started."}
            </p>
          </div>

          <div className="bg-white py-10 px-6 shadow-xl sm:rounded-[2rem] sm:px-10 border border-slate-100">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8 relative">
            <button
              onClick={() => { setActiveTab("login"); setMessage({ type: "", text: "" }); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${
                activeTab === "login" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab("signup"); setMessage({ type: "", text: "" }); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${
                activeTab === "signup" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all animate-fade-in-up ${
              message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {message.type === "error" ? (
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              )}
              {message.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Signup Only Fields */}
            <div className={`space-y-5 transition-all duration-500 overflow-hidden ${activeTab === "signup" ? "max-h-64 opacity-100" : "max-h-0 opacity-0 hidden"}`}>
              {/* Name Field */}
              <div className="space-y-1.5 group">
                <label flex="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={activeTab === "signup"}
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5 group">
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    name="phone"
                    type="number"
                    required={activeTab === "signup"}
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Email Field (Shared) */}
            <div className="space-y-1.5 group">
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field (Shared) */}
            <div className="space-y-1.5 group">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                {activeTab === "login" && (
                  <Link to="/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {activeTab === "signup" && (
                <p className="text-xs text-slate-500 mt-1.5">Must be at least 6 characters long.</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all bg-brand-600 hover:bg-brand-700 active:scale-[0.98] ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {activeTab === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {activeTab === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
