import React, { useState, useEffect } from "react";

const TermsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        console.log("Fetching Terms from DB...");
        const response = await fetch((window.API_BASE||'') + '/api/pages/terms');
        const result = await response.json();
        console.log("DB Response:", result);
        if (result.success) setData(result.page);
      } catch (err) {
        console.error("Failed to fetch terms:", err);
      }
    };
    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Terms and Conditions
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
                  <section key={idx} id={section.title.toLowerCase().replace(/[^a-z]/g, '')} className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">{section.title}</h2>
                    <div className="whitespace-pre-line">
                      {section.body.includes(':') && idx === 0 ? (
                        <ul className="space-y-4 list-none pl-0">
                          {section.body.split('\n').filter(line => line.trim()).map((line, lidx) => {
                            const colonIndex = line.indexOf(':');
                            if (colonIndex === -1) return <li key={lidx}>{line}</li>;
                            const key = line.substring(0, colonIndex).trim();
                            const val = line.substring(colonIndex + 1).trim();
                            return (
                              <li key={lidx} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                                <span className="font-semibold text-slate-800 sm:min-w-[150px]">{key}:</span> 
                                <span>{val || "-"}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : section.body.includes('- ') ? (
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                          {section.body.split('\n').filter(line => line.trim()).map((line, lidx) => (
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
                  <section id="introduction" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">1. Introduction</h2>
                    <ul className="space-y-4 list-none pl-0">
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Country:</span> <span>Gujarat, India</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Company:</span> <span>GINA ABROAD PRIVATE LIMITED, 238–239, Second Floor, Roongta Signature, Opp. Shyam Mandir, VIP Road, Vesu, Surat, India</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Device:</span> <span>Any device that can access the Service such as a computer, mobile phone, or tablet</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Service:</span> <span>Refers to the Website</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Terms:</span> <span>These Terms form the agreement between You and the Company</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Social Media:</span> <span>Any third-party services or content available through the Service</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">Website:</span> <span>GINA ABROAD PRIVATE LIMITED – http://www.fetc.in</span></li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4"><span className="font-semibold text-slate-800 sm:min-w-[150px]">You:</span> <span>The individual or legal entity using the Service</span></li>
                    </ul>
                  </section>

                  <section id="acknowledgment" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">2. Acknowledgment</h2>
                    <p className="mb-4">These Terms and Conditions govern your use of the Service and form a binding agreement between You and the Company.</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>Your use of the Service is conditional upon acceptance of these Terms</li>
                      <li>By accessing or using the Service, you agree to be bound by these Terms</li>
                      <li>If you do not agree, you must not use the Service</li>
                      <li>You must be at least 18 years old to use this Service</li>
                      <li>Please review our Privacy Policy before using the Service</li>
                    </ul>
                  </section>

                  <section id="links" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">3. Links to Other Websites</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>Our Service may contain links to third-party websites</li>
                      <li>These websites are not operated or controlled by us</li>
                      <li>We are not responsible for their content, policies, or practices</li>
                      <li>We recommend reviewing their terms and privacy policies before use</li>
                    </ul>
                  </section>

                  <section id="termination" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">4. Termination</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>We reserve the right to suspend or terminate your access immediately if you violate these Terms</li>
                      <li>Upon termination, your right to use the Service will cease</li>
                    </ul>
                  </section>

                  <section id="liability" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">5. Limitation of Liability</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>Our total liability is limited to the amount you paid through the Service</li>
                      <li>We are not responsible for any indirect, incidental, or consequential damages, even if advised of the possibility</li>
                    </ul>
                  </section>

                  <section id="severability" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">6. Severability and Waiver</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li><strong className="text-slate-800">Severability:</strong> If any provision is found invalid, it will be adjusted to achieve its intent while the remaining provisions remain in effect</li>
                      <li><strong className="text-slate-800">Waiver:</strong> Failure to enforce any right does not waive the ability to enforce it later</li>
                    </ul>
                  </section>

                  <section id="translation" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">7. Translation Interpretation</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>If these Terms are translated into other languages, the English version will prevail in case of any dispute</li>
                    </ul>
                  </section>

                  <section id="changes" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">8. Changes to These Terms and Conditions</h2>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>We reserve the right to update or modify these Terms at any time</li>
                      <li>Significant changes will be notified at least 30 days in advance</li>
                      <li>Continued use of the Service indicates acceptance of the updated Terms</li>
                    </ul>
                  </section>

                  <section id="contact" className="mb-2 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100 text-slate-800">9. Contact Us</h2>
                    <p className="mb-4">If you have any questions regarding these Terms and Conditions, you can contact us via:</p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-600">
                      <li>
                        <strong className="text-slate-800">Website:</strong>{" "}
                        <a href="/contact" className="text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                          https://fetc.in/contact-us
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

export default TermsPage;
