import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { User, Mail, FileText, MessageSquare, Send, MapPin, Phone, Plane } from "lucide-react";

const StartJourneyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country") || "Global Education";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: `Study Abroad Enquiry - ${country}`,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Backend /api/leads already creates both leads and tickets now
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ 
            name: "", 
            email: "", 
            phone: "", 
            subject: `Study Abroad Enquiry - ${country}`, 
            message: "" 
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column - Journey Info */}
        <div className="col-span-1 bg-brand-800 text-white rounded-2xl p-8 shadow-soft flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
          <div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Plane size={32} className="text-brand-50" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Start Your Journey</h2>
            <p className="text-brand-100 mb-10 leading-relaxed opacity-90">
              You are one step away from your dream of studying in <span className="font-bold text-white underline decoration-brand-400">{country}</span>. Fill the form to begin.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-full shrink-0 transition-colors group-hover:bg-white/20">
                  <MapPin size={24} className="text-brand-50" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Visit Our Office</h4>
                  <p className="text-sm text-brand-100 mt-1 leading-relaxed">
                    2nd floor, 239, Roongta Signature<br/>
                    Vesu, Surat - 395007
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-full shrink-0 transition-colors group-hover:bg-white/20">
                  <Phone size={24} className="text-brand-50" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Quick Support</h4>
                  <p className="text-sm text-brand-100 mt-1">+91-8854347201</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-brand-50">
              Expert Guidance Awaits
            </h4>
            <p className="text-sm text-brand-100 leading-relaxed">
              Our experts will help you with course selection, university application, and visa processing.
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-soft p-8 lg:p-12 border border-slate-100">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Fill Admission Enquiry</h3>
            <p className="text-slate-500 mt-1">Please provide your valid details so our experts can reach you.</p>
          </div>
          
          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 animate-fade-in-up">
              <div className="bg-green-100 p-1.5 rounded-full shrink-0 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">Application Received!</h4>
                <p className="text-sm text-green-600 mt-0.5">We have created your support ticket. An expert will call you shortly.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700">Service Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <FileText size={18} />
                  </div>
                  <input
                    readOnly
                    type="text"
                    value="Study Abroad Journey"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-semibold text-slate-700">Enquiry Details <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-4 ${
                isSubmitting ? "bg-brand-600/70 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-[0.99] hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={18} className="transform -rotate-12 group-hover:rotate-0 transition-transform" />
                  Begin My Journey
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartJourneyPage;
