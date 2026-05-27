import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Loader2, ArrowLeft, ArrowRight, Save, RefreshCw, 
  Download, CheckCircle, XCircle, AlertCircle, Calendar, Eye, ShieldAlert 
} from 'lucide-react';

const CustomDatePicker = ({ name, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) return parsed;
    }
    return new Date();
  });

  const selectedDate = value ? new Date(value) : null;

  const handleDayClick = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;
    onChange({ target: { name, value: dateString } });
    setIsOpen(false);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  const nextMonthDaysNeeded = 42 - days.length;
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateLabel = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(`.datepicker-${name}`)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, name]);

  return (
    <div className={`relative datepicker-${name} w-full`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl p-3 text-sm font-medium text-slate-700 bg-white cursor-pointer flex justify-between items-center transition-all ${
          isOpen ? 'border-brand-600 ring-4 ring-brand-600/5' : 'border-slate-200'
        } ${error ? 'border-rose-400 ring-rose-400/5' : ''}`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value ? formatDateLabel(selectedDate) : (placeholder || "Select Date")}
        </span>
        <Calendar size={16} className="text-slate-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-[99999]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button 
                type="button" 
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="font-bold text-slate-800 text-sm">
                {months[month]} {year}
              </span>
              <button 
                type="button" 
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <span key={d} className="text-[11px] font-bold text-slate-400 uppercase">{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((d, idx) => {
                const isSelected = selectedDate && 
                  selectedDate.getDate() === d.day && 
                  selectedDate.getMonth() === month && 
                  selectedDate.getFullYear() === year && 
                  d.isCurrentMonth;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!d.isCurrentMonth}
                    onClick={() => handleDayClick(d.day)}
                    className={`text-xs font-semibold py-2 rounded-xl transition-all ${
                      isSelected 
                        ? "bg-brand-600 text-white font-bold shadow-md shadow-brand-100" 
                        : d.isCurrentMonth 
                        ? "text-slate-700 hover:bg-slate-50 hover:text-brand-600" 
                        : "text-slate-300 pointer-events-none"
                    }`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  const tabs = [
    { key: "leadGeneration", label: "Lead Generation" },
    { key: "enrollmentInfo", label: "Enrollment Info" },
    { key: "documentation", label: "Documentation" },
  ];

  const initialForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    service: "",
    country: "",
    program: "",
    visaRejection: "",
    travelHistory: "",
    examType: "",
    ebd: "",
    anyspecificlocation: "",
    status: "NEW",
    payment: "",
    documents: []
  };

  const [form, setForm] = useState(initialForm);

  // Document slots mapping per service
  const docFieldsByService = {
    studyAbroad: [
      { name: "passport", label: "Passport" },
      { name: "passportPhotograph", label: "Passport sized Photograph" },
      { name: "aadhaarCard", label: "Aadhaar Card" },
      { name: "birthCertificate", label: "Copy of Birth Certificate" },
      { name: "cv", label: "CV" },
      { name: "parentsPassport", label: "Parent's Passport" },
      { name: "itinerary", label: "Itinerary" },
      { name: "visaCopy", label: "Visa Copy" },
      { name: "tenthResult", label: "10th Result" },
      { name: "tenthPassingCertificate", label: "10th Passing Certificate" },
      { name: "eleventhResult", label: "11th Result (Semester wise, NIOS)" },
      { name: "predictableMarksheet", label: "Predictable Marksheet" },
      { name: "twelfthResult", label: "12th Result/Diploma" },
      { name: "twelfthPassingCertificate", label: "12th Passing Certificate/Diploma" },
      { name: "sop", label: "SOP" },
      { name: "coverLetter", label: "Cover Letter" },
      { name: "languageExamCertificate", label: "Language Exam Certificate" },
      { name: "lorPrincipal", label: "LOR - Principal/HOD" },
      { name: "lorProfessor1", label: "LOR - Professor 1" },
      { name: "lorProfessor2", label: "LOR - Professor 2" },
      { name: "bachelorsMarksheets", label: "Bachelor’s Marksheets (Min. 6)" },
      { name: "predictableTranscript", label: "Predictable Transcript" },
      { name: "transcript", label: "Transcript" },
      { name: "bachelorsProvisionalCertificate", label: "Bachelor's Provisional Degree/Certificate" },
      { name: "bachelorsDegree", label: "Bachelor's Degree" },
      { name: "wes", label: "WES (if required)" },
      { name: "internshipWorkExperience", label: "Internship/Work Experience" },
      { name: "gap", label: "Gap Declaration" },
      { name: "bankStatement", label: "Bank Statement (Min 6 Months)" },
      { name: "bankManagerCertificate", label: "Bank Manager’s Certificate" },
      { name: "itrs", label: "ITR 3 Years" },
      { name: "caNetworth", label: "CA Networth" },
      { name: "companyProof", label: "Company/Job/Farmer's Proof" },
      { name: "sponsorDocs", label: "Sponsor Documents" },
      { name: "loanSanctionLetter", label: "Loan Sanction Letter" },
      { name: "otherDocumentsStudyAbroad", label: "Other Documents" }
    ],
    workpermit: [
      { name: "passportWorkpermit", label: "Passport" },
      { name: "passportPhotographWorkpermit", label: "Passport sized Photograph" },
      { name: "aadhaarCardWorkpermit", label: "Aadhaar Card" },
      { name: "panCardWorkpermit", label: "PAN Card" },
      { name: "birthCertificateWorkpermit", label: "Copy of Birth Certificate" },
      { name: "cvWorkpermit", label: "CV" },
      { name: "travelHistoryWorkpermit", label: "Travel History" },
      { name: "itineraryWorkpermit", label: "Itinerary" },
      { name: "visaCopyWorkpermit", label: "Visa Copy" },
      { name: "pccWorkpermit", label: "PCC" },
      { name: "marriageCertificateWorkpermit", label: "Marriage Certificate" },
      { name: "academicsWorkpermit", label: "Academic Documents" },
      { name: "sopWorkpermit", label: "SOP" },
      { name: "coverLetterWorkpermit", label: "Cover Letter" },
      { name: "languageExamCertificateWorkpermit", label: "Language Exam Certificate" },
      { name: "workExperienceWorkpermit", label: "Work Experience" },
      { name: "gapWorkpermit", label: "Gap Declaration" },
      { name: "nocWorkpermit", label: "NOC" },
      { name: "bankStatementWorkpermit", label: "Bank Statement (Min 6 Months)" },
      { name: "bankManagerCertificateWorkpermit", label: "Bank Manager’s Certificate" },
      { name: "salarySlipWorkpermit", label: "Salary Slip" },
      { name: "itrsWorkpermit", label: "ITR 3 Years/Form 16" },
      { name: "caNetworthWorkpermit", label: "CA Networth" },
      { name: "companyProofWorkpermit", label: "Company/Job/Farmer's Proof" },
      { name: "otherDocumentsWorkpermit", label: "Other Documents" }
    ],
    touristVisa: [
      { name: "passportTourist", label: "Passport" },
      { name: "passportPhotographTourist", label: "Passport sized Photograph" },
      { name: "aadhaarCardTourist", label: "Aadhaar Card" },
      { name: "birthCertificateTourist", label: "Copy of Birth Certificate" },
      { name: "cvTourist", label: "CV" },
      { name: "travelHistoryTourist", label: "Travel History" },
      { name: "itineraryTourist", label: "Itinerary" },
      { name: "visaCopyTourist", label: "Visa Copy" },
      { name: "marriageCertificateTourist", label: "Marriage Certificate" },
      { name: "academicsTourist", label: "Academic Documents" },
      { name: "coverLetterTourist", label: "Cover Letter" },
      { name: "workExperienceTourist", label: "Work Experience" },
      { name: "rejectionLetterTourist", label: "Rejection Letter (If Any)" },
      { name: "nocTourist", label: "NOC" },
      { name: "bankStatementsTourist", label: "Bank Statement (Min 6 Months)" },
      { name: "bankManagerCertificateTourist", label: "Bank Manager’s Certificate" },
      { name: "salarySlipTourist", label: "Salary Slip" },
      { name: "itrsTourist", label: "ITR 3 Years/Form 16" },
      { name: "caNetworthTourist", label: "CA Networth" },
      { name: "companyProofTourist", label: "Company/Job/Farmer's Proof" },
      { name: "sponsorDocsTourist", label: "Sponsor Documents" },
      { name: "otherDocumentsTourist", label: "Other Documents" }
    ],
    examBooking: [
      { name: "Govrmentid", label: "Government ID" },
      { name: "passportExamBooking", label: "Passport" },
      { name: "otherDocumentsExamBooking", label: "Other Documents" }
    ]
  };

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/v1/lead/${id}`);
        if (!res.ok) throw new Error('Lead not found');
        const data = await res.json();
        
        // Normalize DOB to YYYY-MM-DD
        const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : "";
        const formattedEbd = data.ebd ? new Date(data.ebd).toISOString().split('T')[0] : "";

        setForm({
          ...initialForm,
          ...data,
          dob: formattedDob,
          ebd: formattedEbd
        });
      } catch (err) {
        console.error(err);
        alert('Failed to fetch lead details.');
        navigate('/admin/leads');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchLead();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  // Upload file slot
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 50MB
    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds 50MB size limit.");
      return;
    }

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Dynamic upload slot endpoint
      const res = await fetch(`/api/v1/lead/${id}/documents/${fieldName}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        // Sync local form documents
        const updatedDoc = data.document;
        const newDocs = Array.isArray(form.documents)
          ? [...form.documents.filter(d => d.documentType !== fieldName), updatedDoc]
          : [updatedDoc];

        setForm(prev => ({
          ...prev,
          [fieldName]: updatedDoc.filePath,
          documents: newDocs
        }));
        alert(`${updatedDoc.fileName} uploaded successfully!`);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Admin document status changer
  const handleStatusChange = async (fieldName, newStatus) => {
    try {
      const res = await fetch(`/api/v1/lead/${id}/documents/${fieldName}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();

      if (data.success) {
        const newDocs = Array.isArray(form.documents)
          ? form.documents.map(d => d.documentType === fieldName ? { ...d, status: newStatus } : d)
          : [];
        setForm(prev => ({ ...prev, documents: newDocs }));
        alert(`Document verification status changed to: ${newStatus}`);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  // Form validator
  const validateFields = (stageKey) => {
    const errors = {};
    if (stageKey === "leadGeneration") {
      if (!form.firstName) errors.firstName = "First name is required";
      if (!form.lastName) errors.lastName = "Last name is required";
      if (!form.gender) errors.gender = "Gender selection is required";
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errors.email = "Valid email is required";
      if (!form.phone) errors.phone = "Phone number is required";
      if (!form.location) errors.location = "Office location is required";
    }

    if (stageKey === "enrollmentInfo") {
      if (!form.service) errors.service = "Service type is required";
      if (["studyAbroad", "workpermit", "touristVisa"].includes(form.service) && !form.country) {
        errors.country = "Country is required";
      }
      if (!form.status) errors.status = "Lead conversion status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    const currentTab = tabs[activeTab].key;
    if (!validateFields(currentTab)) {
      alert("Please fix all highlighted errors before continuing.");
      return;
    }
    if (activeTab < tabs.length - 1) {
      setActiveTab(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const currentTab = tabs[activeTab].key;
    if (!validateFields(currentTab)) {
      alert("Please check your validation fields.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/v1/lead/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        setCompleted(true);
        alert("Lead wizard updated successfully! 🎉");
        setTimeout(() => {
          navigate('/admin/leads');
        }, 1200);
      } else {
        throw new Error(data.message || "Failed to save lead updates");
      }
    } catch (err) {
      console.error(err);
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-brand-600 w-12 h-12" />
        <p className="text-slate-500 font-medium italic">Retrieving lead stages and documents...</p>
      </div>
    );
  }

  const activeService = form.service || "";
  const documentSlots = docFieldsByService[activeService] || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Wizard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
            📝 Edit Lead: <span className="text-brand-600 font-bold">{form.firstName} {form.lastName}</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm italic">Update enrollment stages, funnel details, and documents.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/leads')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-all"
        >
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>

      {/* Modern Stage Progress Indicator */}
      <div className="relative mb-12 max-w-3xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 rounded-full z-0" />
        <div 
          className="absolute top-1/2 left-0 h-[3px] bg-brand-600 -translate-y-1/2 rounded-full transition-all duration-500 z-0"
          style={{ width: `${(activeTab / (tabs.length - 1)) * 100}%` }}
        />
        
        <div className="flex justify-between relative z-10">
          {tabs.map((tab, idx) => {
            const isCompleted = idx < activeTab;
            const isActive = idx === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  if (idx <= activeTab || validateFields(tabs[activeTab].key)) {
                    setActiveTab(idx);
                  }
                }}
                className="flex flex-col items-center gap-2 focus:outline-none"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : isActive 
                      ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100 scale-110" 
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? "text-brand-600 font-bold" : isCompleted ? "text-emerald-500" : "text-slate-400"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Glass-morphic Form Card */}
      <div className="bg-white border border-slate-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-10 mb-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {completed ? (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner">
                  <CheckCircle size={44} className="stroke-[2.2]" />
                </div>
                <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">Changes Saved Successfully!</h2>
                <p className="text-slate-400 text-sm font-medium italic">Redirecting you back to the leads dashboard...</p>
              </div>
            ) : (
              <>
                {/* 1️⃣ STAGE 1: LEAD GENERATION */}
                {activeTab === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">👤 Lead Generation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">First Name *</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          value={form.firstName} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${formErrors.firstName ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`} 
                          placeholder="e.g. John"
                        />
                        {formErrors.firstName && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.firstName}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Middle Name</label>
                        <input 
                          type="text" 
                          name="middleName" 
                          value={form.middleName || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                          placeholder="e.g. Kumar"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Name *</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          value={form.lastName} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${formErrors.lastName ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`} 
                          placeholder="e.g. Sharma"
                        />
                        {formErrors.lastName && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.lastName}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                        <CustomDatePicker 
                          name="dob" 
                          value={form.dob} 
                          onChange={handleChange} 
                          error={formErrors.dob} 
                          placeholder="Select Date of Birth" 
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gender *</label>
                        <select 
                          name="gender" 
                          value={form.gender || ""} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer ${formErrors.gender ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.gender && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.gender}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${formErrors.email ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`} 
                          placeholder="e.g. name@email.com"
                        />
                        {formErrors.email && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.email}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone *</label>
                        <input 
                          type="text" 
                          name="phone" 
                          value={form.phone} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${formErrors.phone ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`} 
                          placeholder="e.g. 9876543210"
                        />
                        {formErrors.phone && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.phone}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Office Location *</label>
                        <select 
                          name="location" 
                          value={form.location || ""} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer ${formErrors.location ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Location</option>
                          <option value="Vesu">Vesu</option>
                          <option value="Varachha">Varachha</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.location && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.location}</span>}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Permanent Address</label>
                      <textarea 
                        name="address" 
                        value={form.address || ""} 
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                        placeholder="e.g. 123, Main Street, City, State"
                        rows={3}
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-6 mt-8">
                      <h4 className="font-semibold text-slate-800 text-sm mb-4">🚨 Emergency Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact Person Name</label>
                          <input 
                            type="text" 
                            name="emergencyContactName" 
                            value={form.emergencyContactName || ""} 
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                            placeholder="e.g. Contact Person Name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Relationship</label>
                          <input 
                            type="text" 
                            name="emergencyContactRelation" 
                            value={form.emergencyContactRelation || ""} 
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                            placeholder="e.g. Parent, Sibling, Guardian"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Emergency Phone</label>
                          <input 
                            type="text" 
                            name="emergencyContactPhone" 
                            value={form.emergencyContactPhone || ""} 
                            onChange={handleChange}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                            placeholder="e.g. 9876543210"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2️⃣ STAGE 2: ENROLLMENT INFO */}
                {activeTab === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6">🎓 Course & Enrollment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Selection *</label>
                        <select 
                          name="service" 
                          value={form.service || ""} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer ${formErrors.service ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Service</option>
                          <option value="studyAbroad">Study Abroad</option>
                          <option value="workpermit">Work Permit</option>
                          <option value="touristVisa">Tourist Visa</option>
                          <option value="examBooking">Exam Booking</option>
                          <option value="training">Training Courses</option>
                        </select>
                        {formErrors.service && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.service}</span>}
                      </div>

                      {["studyAbroad", "workpermit", "touristVisa"].includes(form.service) && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Country *</label>
                          <select 
                            name="country" 
                            value={form.country || ""} 
                            onChange={handleChange}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer ${formErrors.country ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                          >
                            <option value="">Select Country</option>
                            <option value="Canada">Canada</option>
                            <option value="Germany">Germany</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Australia">Australia</option>
                            <option value="Europe">Europe</option>
                            <option value="Other">Other</option>
                          </select>
                          {formErrors.country && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.country}</span>}
                        </div>
                      )}

                      {["examBooking", "training"].includes(form.service) && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exam / Training Course *</label>
                          <input 
                            type="text" 
                            name="examType" 
                            value={form.examType || ""} 
                            onChange={handleChange}
                            className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium ${formErrors.examType ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`} 
                            placeholder="IELTS, PTE, GRE, etc."
                          />
                          {formErrors.examType && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.examType}</span>}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Specific Target Location</label>
                        <input 
                          type="text" 
                          name="anyspecificlocation" 
                          value={form.anyspecificlocation || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                          placeholder="e.g., Munich, Toronto, London"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Visa Rejections?</label>
                        <select 
                          name="visaRejection" 
                          value={form.visaRejection || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Travel History?</label>
                        <select 
                          name="travelHistory" 
                          value={form.travelHistory || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Academic Program / Course</label>
                        <input 
                          type="text" 
                          name="program" 
                          value={form.program || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium" 
                          placeholder="e.g. Science, Commerce, IT"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Funnel Lead Status *</label>
                        <select 
                          name="status" 
                          value={form.status || "NEW"} 
                          onChange={handleChange}
                          className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer ${formErrors.status ? 'border-rose-400 ring-rose-400/5' : 'border-slate-200'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="NEW">Cold (NEW)</option>
                          <option value="CONTACTED">Warm (CONTACTED)</option>
                          <option value="CLOSED">Hot / Won (CLOSED)</option>
                        </select>
                        {formErrors.status && <span className="text-xs text-rose-500 font-semibold mt-1.5 block">{formErrors.status}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Method</label>
                        <select 
                          name="payment" 
                          value={form.payment || ""} 
                          onChange={handleChange}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 font-medium text-slate-700 bg-white appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center] cursor-pointer"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                        >
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Card">Credit/Debit Card</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expected Booking Date (EBD)</label>
                        <CustomDatePicker 
                          name="ebd" 
                          value={form.ebd} 
                          onChange={handleChange} 
                          placeholder="Select Booking Date" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3️⃣ STAGE 3: DOCUMENTATION */}
                {activeTab === 2 && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-3 mb-6 gap-2">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">📁 Verification Documents Uploader</h3>
                      <span className="text-xs font-semibold bg-brand-50 text-brand-600 px-3 py-1 rounded-full uppercase tracking-wider">
                        Service: {form.service || 'N/A'}
                      </span>
                    </div>

                    {!form.service ? (
                      <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="font-bold text-sm italic mb-1">Service Type Not Selected</p>
                        <p className="text-xs text-slate-400">Please go back to the previous step and select a course or study abroad service.</p>
                      </div>
                    ) : documentSlots.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                        <p className="font-bold text-sm text-slate-500 mb-1">No Documents Required</p>
                        <p className="text-xs text-slate-400">Selected service ("{form.service}") does not require any document verification.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {documentSlots.map((field) => {
                          const existingDoc = Array.isArray(form.documents)
                            ? form.documents.find(d => d.documentType === field.name)
                            : null;
                          const fileUrl = existingDoc ? existingDoc.filePath : form[field.name];
                          const status = existingDoc ? existingDoc.status : (fileUrl ? "Uploaded" : "Empty");

                          return (
                            <div 
                              key={field.name}
                              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                                status === 'Verified' 
                                  ? 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/50' 
                                  : status === 'Rejected' 
                                  ? 'bg-rose-50/30 border-rose-100 hover:bg-rose-50/50' 
                                  : status === 'Pending' 
                                  ? 'bg-amber-50/30 border-amber-100 hover:bg-amber-50/50'
                                  : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 leading-none">
                                    {status === "Verified" && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                                    {status === "Rejected" && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                                    {status === "Pending" && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                                    {field.label}
                                  </h4>
                                  
                                  {fileUrl ? (
                                    <p className="text-[10px] text-slate-400 font-medium mt-2 truncate flex items-center gap-1.5">
                                      <FileText size={10} className="text-slate-400 shrink-0" />
                                      {existingDoc?.fileName || "uploaded-document"}
                                    </p>
                                  ) : (
                                    <p className="text-[10px] text-slate-400 font-medium italic mt-2">No file uploaded.</p>
                                  )}
                                </div>

                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shrink-0 ${
                                  status === 'Verified' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : status === 'Rejected' 
                                    ? 'bg-rose-100 text-rose-700' 
                                    : status === 'Pending' 
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {status}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100/60 pt-3">
                                <div className="flex gap-2">
                                  {fileUrl ? (
                                    <>
                                      <a 
                                        href={fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-100 flex items-center gap-1 text-[11px] font-semibold transition-colors"
                                      >
                                        <Download size={12} /> Get File
                                      </a>

                                      <label className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-100 flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors">
                                        <RefreshCw size={12} className={uploadingField === field.name ? 'animate-spin' : ''} />
                                        Replace
                                        <input 
                                          type="file" 
                                          accept="application/pdf,image/jpeg,image/png,image/webp,video/mp4,audio/mp3"
                                          onChange={(e) => handleFileUpload(e, field.name)}
                                          disabled={uploadingField !== null}
                                          className="hidden" 
                                        />
                                      </label>
                                    </>
                                  ) : (
                                    <label className="p-2.5 bg-brand-600 text-white rounded-xl flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition-colors hover:bg-brand-700 shadow-sm shadow-brand-100">
                                      <Loader2 size={12} className={uploadingField === field.name ? 'animate-spin' : 'hidden'} />
                                      {uploadingField === field.name ? 'Uploading...' : 'Upload File'}
                                      <input 
                                        type="file" 
                                        accept="application/pdf,image/jpeg,image/png,image/webp,video/mp4,audio/mp3"
                                        onChange={(e) => handleFileUpload(e, field.name)}
                                        disabled={uploadingField !== null}
                                        className="hidden" 
                                      />
                                    </label>
                                  )}
                                </div>

                                {fileUrl && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-semibold text-slate-400 mr-1">Verify:</span>
                                    <select 
                                      value={status} 
                                      onChange={(e) => handleStatusChange(field.name, e.target.value)}
                                      className={`text-[10px] font-bold rounded-xl p-1.5 pr-6 border transition-all appearance-none bg-no-repeat bg-[length:12px_12px] bg-[right_6px_center] cursor-pointer ${
                                        status === 'Verified' 
                                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25' 
                                          : status === 'Rejected' 
                                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/25'
                                          : 'bg-amber-500/10 text-amber-600 border-amber-500/25'
                                      }`}
                                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Verified">Verified</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Form Action Controls */}
      {!completed && (
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {activeTab === 0 ? (
            <button 
              type="button" 
              onClick={() => navigate('/admin/leads')}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-all"
            >
              Cancel
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handlePrevious}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Previous
            </button>
          )}

          {activeTab === tabs.length - 1 ? (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-7 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-semibold text-sm shadow-lg shadow-brand-100 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-7 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold text-sm shadow-md flex items-center gap-2 transition-all"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditLead;
