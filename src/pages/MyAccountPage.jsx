import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import loginBg from "../assets/officeImages/_DSC1638.JPG";
import logo from "../assets/logo/FETC_FINAL LOGO-01_11 Version_Edit TM_PNG.png";

const MyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    // Redirect if already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
      return;
    }

    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state, navigate]);

  // Prevent "glitch" render if already logged in
  if (localStorage.getItem("user")) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <img src={logo} alt="FETC Logo" className="h-12 mx-auto mb-6" />
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase italic">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Dummy Credentials
    const DUMMY_EMAIL = "fetc2026@gmail.com";
    const DUMMY_PASS = "admin@12345";

    setTimeout(() => {
      setIsSubmitting(false);

      if (activeTab === "login") {
        if (formData.email === DUMMY_EMAIL && formData.password === DUMMY_PASS) {
          setMessage({ type: "success", text: "Successfully logged in! Redirecting..." });

          // Save session
          localStorage.setItem("user", JSON.stringify({
            name: "Admin",
            email: DUMMY_EMAIL,
            role: "ADMIN",
            phone: "9033347209"
          }));

          setTimeout(() => {
            // Notify other components (Navbar)
            window.dispatchEvent(new Event("user-login"));
            navigate("/");
          }, 1500);
        } else {
          setMessage({ type: "error", text: "Invalid email or password. Please try again." });
        }
      } else {
        // Signup Simulation
        if (formData.password.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters." });
        } else {
          setMessage({ type: "success", text: "Account created successfully! Please sign in." });
          setActiveTab("login");
        }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">

      {/* Left Side: Premium Animated Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden">
        {/* Animated Mesh Gradients */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full bg-brand-900/30 rounded-full blur-[150px] opacity-40" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-full h-full bg-blue-900/20 rounded-full blur-[130px] opacity-30" 
        />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg"
        >
          <img src={logo} alt="FETC Logo" className="h-16 mb-12 brightness-0 invert" />
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Elevate Your <br />
            <span className="text-brand-400">Global Potential.</span>
          </h2>
          <p className="text-brand-100/70 text-xl leading-relaxed mb-10 font-medium">
            Join the elite community of students achieving excellence in global education.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white tracking-tighter">100+</p>
              <p className="text-brand-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Global Universities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tighter">100%</p>
              <p className="text-brand-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Quality Guarantee</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Modern Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 relative overflow-y-auto">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full blur-[120px] -mr-32 -mt-32 opacity-60" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-[120px] -ml-32 -mb-32 opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-10 flex justify-center">
            <img src={logo} alt="FETC Logo" className="h-12" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              {activeTab === "login" ? "Welcome back" : "Get started"}
            </h3>
            <p className="text-slate-500 font-medium italic">
              {activeTab === "login"
                ? "Sign in to access your portal and tracking."
                : "Create your account to start your global journey."}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 ring-1 ring-slate-200/50 backdrop-blur-xl">

            {/* Custom Tab Switcher */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 relative">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 ease-out ${activeTab === "login" ? "left-1.5" : "left-[calc(50%+1.5px)]"
                  }`}
              />
              <button
                onClick={() => { setActiveTab("login"); setMessage({ type: "", text: "" }); }}
                className={`relative flex-1 py-3 text-sm font-black transition-colors z-10 ${activeTab === "login" ? "text-brand-700" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => { setActiveTab("signup"); setMessage({ type: "", text: "" }); }}
                className={`relative flex-1 py-3 text-sm font-black transition-colors z-10 ${activeTab === "signup" ? "text-brand-700" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Join Now
              </button>
            </div>

            {/* Error/Success Feedbacks */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border overflow-hidden ${message.type === "error"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-green-50 text-green-600 border-green-100"
                    }`}
                >
                  {message.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                        <input
                          name="name"
                          type="text"
                          required={activeTab === "signup"}
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-600/30 transition-all font-medium"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                        <input
                          name="phone"
                          type="tel"
                          required={activeTab === "signup"}
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-600/30 transition-all font-medium"
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-600/30 transition-all font-medium"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                    {activeTab === "login" && (
                      <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700">
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-600/30 transition-all font-medium"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full group relative flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-sm font-black uppercase tracking-widest overflow-hidden transition-all ${isSubmitting
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-brand-600 hover:shadow-2xl hover:shadow-brand-200 active:scale-[0.98]"
                  }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{activeTab === "login" ? "Let's Go" : "Create My Account"}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-xs font-bold">
                Need assistance? <Link to="/contact" className="text-brand-600 hover:underline">Support Center</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyAccountPage;
