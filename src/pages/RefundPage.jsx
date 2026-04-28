import React, { useState, useEffect } from "react";

const RefundPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRefund = async () => {
      try {
        const response = await fetch('/api/pages/refund');
        const result = await response.json();
        if (result.success) setData(result.page);
      } catch (err) {
        console.error("Failed to fetch refund:", err);
      }
    };
    fetchRefund();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Refund Policy
          </h1>
          <p className="text-slate-500 font-medium">
            Last Updated: {data?.content?.lastUpdated || "February 3, 2025"}
          </p>
        </div>

        <div className="w-full relative">
          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-soft border border-slate-100 text-slate-700 leading-relaxed">
              
              {/* DYNAMIC CONTENT FROM CMS */}
              {data?.content?.sections ? (
                data.content.sections.map((section, idx) => (
                  <section key={idx} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">{section.title}</h2>
                    <div className="whitespace-pre-line">
                      {section.body.includes('- ') ? (
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                          {section.body.split('\n').map((line, lidx) => (
                            <li key={lidx}>{line.replace('- ', '').trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mb-4">{section.body}</p>
                      )}
                    </div>
                  </section>
                ))
              ) : (
                /* YOUR ORIGINAL HARDCODED CONTENT (KEEPING IT IN THE FILE) */
                <>
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">1. Introduction</h2>
                    <p className="mb-4">We strive to provide high-quality online English learning services.</p>
                    <p>If you are not satisfied with your purchase, this Refund Policy explains the conditions and process for requesting a refund.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">2. Refund Process</h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                      <li>If your refund request meets our eligibility criteria, it will be processed accordingly</li>
                      <li>The refund will be credited to your original payment method</li>
                      <li>Refunds are typically processed within <strong className="text-slate-800">5 business days</strong></li>
                    </ul>
                  </section>

                  <section className="mb-2">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">3. Contact Us</h2>
                    <p className="mb-4">If you have any questions about our Refund Policy, please contact us:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>
                        <strong className="text-slate-800">Email:</strong>{" "}
                        <a href="mailto:info@fetc.in" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                          info@fetc.in
                        </a>
                      </li>
                    </ul>
                  </section>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;
