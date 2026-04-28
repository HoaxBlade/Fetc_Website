import React, { useState, useEffect } from "react";

const PrivacyPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await fetch('/api/pages/privacy');
        const result = await response.json();
        if (result.success) setData(result.page);
      } catch (err) {
        console.error("Failed to fetch privacy:", err);
      }
    };
    fetchPrivacy();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-medium">
            Last Updated: {data?.content?.lastUpdated || "February 03, 2025"}
          </p>
        </div>

        <div className="w-full relative">
          {/* Main Content */}
          <div className="w-full">
            <div className="bg-white rounded-3xl p-6 md:p-10 lg:p-12 shadow-soft border border-slate-100 text-slate-700 leading-relaxed">

              {data?.content?.sections ? (
                data.content.sections.map((section, idx) => (
                  <section key={idx} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">{section.title}</h2>
                    <div className="whitespace-pre-line">
                      {section.body.includes('- ') ? (
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-2">
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
                /* YOUR ORIGINAL HARDCODED CONTENT */
                <>
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">1. Introduction</h2>
                    <p className="mb-4">This Privacy Policy explains how we collect, use, and protect your personal information when you access our website and services.</p>
                    <p>By using our Service, you agree to the terms described in this Privacy Policy.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">2. Information Collection</h2>
                    <p className="mb-4">We collect personal information that you provide to us, such as:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6 mt-2">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Payment details</li>
                    </ul>
                    <p className="mb-4">We also collect usage data such as:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6 mt-2">
                      <li>IP address</li>
                      <li>Browser type</li>
                    </ul>
                    <p>This helps us improve our services and understand user behavior.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">3. How We Use Your Information</h2>
                    <p className="mb-4">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-2">
                      <li>Provide and improve our services</li>
                      <li>Communicate with you regarding your account or service-related matters</li>
                      <li>Personalize your experience</li>
                      <li>Respond to your inquiries</li>
                    </ul>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">4. Data Security</h2>
                    <p className="mb-4">We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction.</p>
                    <p>However, please note that no method of electronic storage or transmission over the internet is completely secure.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">5. Sharing of Data</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>We do not sell or rent your personal information to third parties</li>
                      <li>We may share your information with trusted service providers to help us deliver our services</li>
                    </ul>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">6. Your Rights</h2>
                    <p className="mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6 mt-2">
                      <li>Access your personal data</li>
                      <li>Update your information</li>
                      <li>Request deletion of your data</li>
                    </ul>
                    <p>To exercise these rights, please contact us using the details below.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">7. Changes to This Privacy Policy</h2>
                    <p className="mb-4">We may update this Privacy Policy from time to time.</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6 mt-2">
                      <li>Any changes will be posted on this page</li>
                      <li>The "Last Updated" date will be revised accordingly</li>
                    </ul>
                    <p>We recommend reviewing this page periodically.</p>
                  </section>

                  <section className="mb-2">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">8. Contact Us</h2>
                    <p className="mb-4">If you have any questions or concerns about this Privacy Policy, you can contact us at:</p>
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

export default PrivacyPage;
