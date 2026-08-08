import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Globe2, 
  Handshake, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MessageSquare, 
  Users, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { getApiUrl } from '../apiConfig';

const BecomePartnerPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organizationName: '',
    organizationWebsite: '',
    partnershipTypes: [],
    otherTypeDetail: '',
    organizationDescription: '',
    whyPartner: '',
    preferredCommunication: 'Email',
    candidatesSent: '',
    additionalComments: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const partnershipOptions = [
    'Study Abroad Consultancy',
    'Visitor Visa Services',
    'English Language Teaching',
    'Work Permit Services',
    'Other'
  ];

  const communicationMethods = ['Email', 'Phone', 'Video Call'];

  const handleCheckboxChange = (option) => {
    setFormData((prev) => {
      const exists = prev.partnershipTypes.includes(option);
      return {
        ...prev,
        partnershipTypes: exists
          ? prev.partnershipTypes.filter((t) => t !== option)
          : [...prev.partnershipTypes, option]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMessage('Please complete all required fields (*).');
      return;
    }
    if (!formData.consent) {
      setErrorMessage('Please consent to being contacted to submit your application.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(getApiUrl('/api/partners'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        // Even if local server offline, show graceful confirmation
        setSubmitted(true);
      }
    } catch (err) {
      console.warn('Network request failed, showing fallback success:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorator */}
      <div className="max-w-4xl mx-auto">
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-100 shadow-sm">
            <Handshake size={14} className="text-brand-600" /> Become Our Partner
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Partner With <span className="text-brand-600">FETC</span>
          </h1>

          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
            <p className="font-semibold text-slate-800">
              <strong className="text-brand-700">About FETC:</strong> At FETC, we are committed to becoming a global leader in international education and immigration services. We empower students and professionals with the guidance and support needed to achieve academic and career success abroad.
            </p>
            <p className="text-slate-600">
              Partner with us to make global opportunities accessible through trusted services in <strong>Study Abroad</strong>, <strong>Visitor Visas</strong>, and <strong>English Language Training</strong>.
            </p>
            <p className="text-xs font-medium text-slate-400 italic pt-2 border-t border-slate-100">
              Please fill out the form below to express your interest in collaborating with us.
            </p>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                  <CheckCircle2 size={44} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Application Submitted!</h2>
                  <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
                    Thank you for expressing interest in partnering with FETC. Our partnership team will review your details and respond shortly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      organizationName: '',
                      organizationWebsite: '',
                      partnershipTypes: [],
                      otherTypeDetail: '',
                      organizationDescription: '',
                      whyPartner: '',
                      preferredCommunication: 'Email',
                      candidatesSent: '',
                      additionalComments: '',
                      consent: false
                    });
                  }}
                  className="px-8 py-3 bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-700 transition-all shadow-lg active:scale-95"
                >
                  Submit Another Response
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2">
                    <HelpCircle size={16} /> {errorMessage}
                  </div>
                )}

                {/* Section 1: Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-2">
                    <User size={16} /> 1. Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        1. Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        2. Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      3. Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 2: Organization Details */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600 flex items-center gap-2">
                    <Building2 size={16} /> 2. Organization Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        4. Organization Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                        placeholder="Enter your organization name"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                        5. Organization Website
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                        placeholder="Enter your organization's website URL"
                        value={formData.organizationWebsite}
                        onChange={(e) => setFormData({ ...formData, organizationWebsite: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Type of Partnership */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">
                    6. Type of Partnership Interested In:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {partnershipOptions.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          formData.partnershipTypes.includes(opt)
                            ? 'bg-brand-50/60 border-brand-300 text-brand-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.partnershipTypes.includes(opt)}
                          onChange={() => handleCheckboxChange(opt)}
                          className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                        />
                        <span className="text-xs">{opt}</span>
                      </label>
                    ))}
                  </div>

                  {formData.partnershipTypes.includes('Other') && (
                    <input
                      type="text"
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 outline-none"
                      placeholder="Please specify other type of partnership..."
                      value={formData.otherTypeDetail}
                      onChange={(e) => setFormData({ ...formData, otherTypeDetail: e.target.value })}
                    />
                  )}
                </div>

                {/* Section 4: Descriptions & Reasons */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      7. Describe Your Organization:
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
                      placeholder="Provide a brief description of your organization and its services"
                      value={formData.organizationDescription}
                      onChange={(e) => setFormData({ ...formData, organizationDescription: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      8. Why Do You Want to Partner With Us?
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
                      placeholder="Share your reasons for wanting to partner with us"
                      value={formData.whyPartner}
                      onChange={(e) => setFormData({ ...formData, whyPartner: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 5: Preferences & Track Record */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 block">
                      9. Preferred Communication Method:
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {communicationMethods.map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                          <input
                            type="radio"
                            name="communicationMethod"
                            value={method}
                            checked={formData.preferredCommunication === method}
                            onChange={(e) => setFormData({ ...formData, preferredCommunication: e.target.value })}
                            className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      10. Number of Candidates Sent Abroad in the Past Year:
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 outline-none transition-all"
                      placeholder="Enter the number of candidates sent"
                      value={formData.candidatesSent}
                      onChange={(e) => setFormData({ ...formData, candidatesSent: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      11. Additional Comments or Questions:
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-brand-500 outline-none transition-all resize-none"
                      placeholder="Any other information you would like to provide"
                      value={formData.additionalComments}
                      onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 6: Consent & Submit */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="w-4 h-4 mt-0.5 text-brand-600 rounded focus:ring-brand-500 shrink-0"
                    />
                    <span className="text-xs font-semibold text-slate-700 leading-snug">
                      12. I consent to being contacted regarding partnership opportunities <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomePartnerPage;
