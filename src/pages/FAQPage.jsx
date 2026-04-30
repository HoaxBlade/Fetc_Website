import React, { useState, useEffect } from "react";
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
      answer: "We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support."
    },
    {
      question: "Why should I choose your consultancy over others?",
      answer: "Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey."
    }
  ];

  const applicationFaqs = [
    {
      question: "How do I start the application process?",
      answer: "Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities."
    },
    {
      question: "What documents are required for the application?",
      answer: "Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency."
    },
    {
      question: "Do you assist with writing the Statement of Purpose (SOP) and essays?",
      answer: "Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations."
    }
  ];

  const financialFaqs = [
    {
      question: "How much does studying abroad cost?",
      answer: "Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation."
    },
    {
      question: "Are there scholarships or financial aid available?",
      answer: "Yes, many universities offer scholarships and financial aid. We can assist you in identifying and applying for these opportunities to help reduce your expenses."
    },
    {
      question: "Do you charge for your services?",
      answer: "Yes, we charge a fee for our services, which covers the personalized support and expertise we provide throughout the application and visa process. Detailed fee information can be provided during your initial consultation."
    }
  ];

  const visaFaqs = [
    {
      question: "How do you assist with the visa application process?",
      answer: "We provide step-by-step guidance on visa requirements, help you prepare the necessary documentation, and conduct mock visa interviews to ensure you are well-prepared."
    },
    {
      question: "What if my visa application is denied?",
      answer: "Firstly, we have 99% of visa ratio. In case, if your visa application is denied, we will analyze the reasons for denial, assist in addressing any issues, and guide you through the reapplication process."
    }
  ];

  const miscellaneousFaqs = [
    {
      question: "Can you help me choose the right program and university?",
      answer: "Absolutely! Our advisors have extensive knowledge of programs and universities worldwide and will help match your interests, curriculam, and career goals with the right options."
    },
    {
      question: "How far in advance should I start the application process?",
      answer: "It’s best to start the application process at least 06-12 months before your intended start date to ensure ample time for research, test preparation, application submission, financials check and visa processing."
    },
    {
      question: "Can you help with applications for both undergraduate and postgraduate programs?",
      answer: "Yes, we assist with applications for undergraduate, postgraduate, and doctoral programs across various fields of study."
    }
  ];

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

          <FAQSection title="1. General Information" faqs={generalFaqs} />
          <FAQSection title="2. Application Process" faqs={applicationFaqs} />
          <FAQSection title="3. Financial Information" faqs={financialFaqs} />
          <FAQSection title="4. Visa and Travel" faqs={visaFaqs} />
          <FAQSection title="5. Miscellaneous" faqs={miscellaneousFaqs} />
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
