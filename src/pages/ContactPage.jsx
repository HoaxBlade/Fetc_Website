import React, { useState, useEffect } from "react";
import { User, Mail, FileText, MessageSquare, Send, MapPin, Phone, Mail as MailIcon } from "lucide-react";

const ContactPage = () => {
  const [pageData, setPageData] = useState(null);

  const fetchPageContent = async () => {
    try {
      const response = await fetch('/api/pages/contact');
      const data = await response.json();
      if (data.success && data.page) {
        setPageData(data.page.content);
      }
    } catch (err) {
      console.error('Failed to fetch contact page content:', err);
    }
  };

  useEffect(() => {
    fetchPageContent();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Course Related",
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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "Course Related", message: "" });
        // Remove success message after 5 seconds
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

        {/* Left Column - Contact Info */}
        <div className="col-span-1 bg-brand-800 text-white rounded-2xl p-8 shadow-soft flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1">
          <div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight">
              {pageData?.infoSection?.title || "Get In Touch With Us"}
            </h2>
            <p className="text-brand-100 mb-10 leading-relaxed opacity-90">
              {pageData?.infoSection?.description || "Have questions about our courses, study abroad programs, or anything else? We'd love to hear from you."}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-full shrink-0 transition-colors group-hover:bg-white/20">
                  <MapPin size={24} className="text-brand-50" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Visit Us</h4>
                  <div className="text-sm text-brand-100 mt-1 leading-relaxed">
                    {pageData?.contactDetails?.address?.lines?.map((line, i) => (
                      <React.Fragment key={i}>
                        {line}<br />
                      </React.Fragment>
                    )) || (
                        <>
                          2nd floor, 239, Roongta Signature<br />
                          Nr. Shyam Mandir Vesu<br />
                          Surat - 395007
                        </>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-full shrink-0 transition-colors group-hover:bg-white/20">
                  <Phone size={24} className="text-brand-50" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Call Us</h4>
                  <p className="text-sm text-brand-100 mt-1">
                    {pageData?.contactDetails?.phone?.number || "+91-8854347201"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/10 rounded-full shrink-0 transition-colors group-hover:bg-white/20">
                  <MailIcon size={24} className="text-brand-50" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email Us</h4>
                  <p className="text-sm text-brand-100 mt-1">
                    {pageData?.contactDetails?.email?.address || "consult@fetc.in"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Working Hours
            </h4>
            <p className="text-sm text-brand-100 mb-1">
              {pageData?.workingHours?.weekdays || "Mon - Sat: 9:00 AM - 7:00 PM"}
            </p>
            <p className="text-sm text-brand-100">
              {pageData?.workingHours?.sunday || "Sunday: Closed"}
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-soft p-8 lg:p-12 border border-slate-100">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Send us a Message</h3>
            <p className="text-slate-500 mt-1">Fill out the form below and we will get back to you promptly.</p>
          </div>

          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3 animate-fade-in-up">
              <div className="bg-green-100 p-1.5 rounded-full shrink-0 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <h4 className="font-bold">Message sent successfully!</h4>
                <p className="text-sm text-green-600 mt-0.5">We'll get back to you as soon as possible.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label htmlFor="subject" className="text-sm font-semibold text-slate-700">Subject <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <FileText size={18} />
                </div>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300 appearance-none font-medium text-slate-700 cursor-pointer"
                >
                  <option value="Course Related">Course Related</option>
                  <option value="Study Abroad">Study Abroad</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label htmlFor="message" className="text-sm font-semibold text-slate-700">Your Message <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all hover:border-slate-300 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mt-4 ${isSubmitting ? "bg-brand-600/70 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-[0.99] hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Message...
                </>
              ) : (
                <>
                  <Send size={18} className="transform -rotate-12 group-hover:rotate-0 transition-transform" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-12 bg-white p-4 rounded-[2rem] shadow-soft border border-slate-100 relative group">
        <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Our Location</h3>
        <div className="w-full h-[500px] sm:h-[600px] rounded-[1.5rem] overflow-hidden relative shadow-inner bg-slate-100">
          <iframe
            title="FETC Location Map"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2173516541525!2d72.77322501493404!3d21.132808085942443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fca00000001%3A0x3938b81313333333!2sForeign%20English%20Tests%20Capital%20-%20FETC!5e0!3m2!1sen!2sin!4v1714310000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute -top-16 left-0 w-full h-[calc(100%+4rem)] transition-all duration-700 pointer-events-none"
          ></iframe>

          {/* Custom Pin Marker Overlay */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-[100%] pointer-events-none flex flex-col items-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white animate-bounce">
              <MapPin size={24} fill="currentColor" className="text-white" />
            </div>
            <div className="w-2 h-2 bg-red-500/50 rounded-full blur-[2px] mt-1"></div>
          </div>

          {/* Floating Map Card */}
          <div className="absolute top-8 left-8 w-[90%] max-w-sm glass-card backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-2xl animate-fade-in-up">
            <h4 className="text-2xl font-black text-slate-900 leading-tight mb-2">
              Foreign English Tests Capital - FETC
            </h4>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-brand-600 font-black text-lg">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-400 text-sm font-medium">(83 Reviews)</span>
            </div>

            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Second Floor, Roongta Signature, 238 – 239, VIP Rd, opp. Shyam Mandir, Anand Park, Vesu, Surat, Gujarat 395007
            </p>

            <div className="flex gap-3">
              <a
                href="https://www.google.com/maps/dir//Foreign+English+Tests+Capital+-+FETC/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be04fca00000001:0x3938b81313333333?sa=X"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
              >
                Get Directions
              </a>
              <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-600 transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
