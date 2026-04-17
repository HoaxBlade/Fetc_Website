import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl mb-4 bg-white overflow-hidden transition-all hover:border-brand-300 shadow-sm">
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-800 pr-4">{question}</span>
        <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <div
        className={`px-6 grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = ({ title, faqs }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
        {title}
      </h2>
      <div>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const FAQPage = () => {
  const generalFaqs = [
    {
      question: "What services do you offer?",
      answer: "We provide a comprehensive suite of study abroad services, including personalized counselling to help you choose the right program, expert assistance with university applications and visa processing, pre-departure orientation, and post-arrival support."
    },
    {
      question: "Why should I choose your consultancy over others?",
      answer: "We have a high success rate, experienced advisors, and strong partnerships with prestigious universities. We provide personalized guidance and continuous support throughout your journey."
    },
    {
      question: "Do you charge for your services?",
      answer: "Yes, we charge a fee for our services, which includes personalized support and expert guidance. Detailed fee information is provided during the initial consultation."
    },
    {
      question: "Do you assist in visa dates?",
      answer: "Yes, we do."
    },
    {
      question: "How far in advance should I start the application process?",
      answer: "We recommend starting 6 to 12 months before your intended start date to allow time for preparation and processing."
    }
  ];

  const studyFaqs = [
    {
      question: "How do I start the application process?",
      answer: "Schedule a consultation with our advisors. We assess your background, goals, and preferences to guide you toward suitable programs and universities."
    },
    {
      question: "What documents are required?",
      answer: "Academic transcripts, financial statements, SOP, recommendation letters, resume, test scores, and proof of language proficiency."
    },
    {
      question: "Do you assist with SOP and essays?",
      answer: "Yes, we help you create strong, personalized SOPs and essays."
    },
    {
      question: "How much does studying abroad cost?",
      answer: "Costs vary depending on the country and program. We provide detailed estimates during consultation."
    },
    {
      question: "Are scholarships available?",
      answer: "Yes, we assist in finding and applying for scholarships and financial aid."
    },
    {
      question: "Can you help choose the right program and university?",
      answer: "Yes, we guide you based on your academic background and career goals."
    },
    {
      question: "How can I improve my chances of acceptance?",
      answer: "Focus on a strong SOP, good recommendations, and academic performance. We provide guidance to strengthen your application."
    },
    {
      question: "Do you assist with undergraduate and postgraduate applications?",
      answer: "Yes, we support undergraduate, postgraduate, and doctoral programs."
    },
    {
      question: "Do you offer test preparation (IELTS, TOEFL, etc.)?",
      answer: "Yes, we provide coaching for IELTS, TOEFL, SAT, SELT, and PTE."
    },
    {
      question: "What are the eligibility criteria?",
      answer: "It depends on the country and program, but generally includes academic qualifications and language proficiency."
    },
    {
      question: "What is the application cost?",
      answer: "It includes application fees, test fees, and document preparation costs."
    },
    {
      question: "Are financial requirements needed for a visa?",
      answer: "Yes, proof of funds is required. We assist in meeting these requirements."
    }
  ];

  const examinationFaqs = [...studyFaqs]; // Use the same structure and content as Study FAQs

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our services, study abroad programs, and examination preparation below.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-soft border border-slate-100">
          <FAQSection title="1. General Questions" faqs={generalFaqs} />
          <FAQSection title="2. Study FAQs" faqs={studyFaqs} />
          <FAQSection title="3. Examination FAQs" faqs={examinationFaqs} />
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
