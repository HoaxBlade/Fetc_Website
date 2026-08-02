const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const policies = [
  {
    title: "Frequently Asked Questions",
    slug: "/faq",
    content: {
      lastUpdated: "February 03, 2025",
      faqs: [
        { question: "What services do you offer?", answer: "We provide comprehensive study abroad services including, counselling, university selection, application assistance, visa processing, pre-departure orientation, and post-arrival support." },
        { question: "Why should I choose your consultancy over others?", answer: "Our consultancy boasts a high success rate, personalized guidance from experienced advisors, and partnerships with top universities worldwide. We also offer ongoing support throughout your study abroad journey." },
        { question: "How do I start the application process?", answer: "Begin by scheduling a consultation with one of our advisors. We will assess your academic background, financial background, career goals, and preferences to help you select suitable programs and universities." },
        { question: "What documents are required for the application?", answer: "Typically, you will need your academic transcripts, financials, a statement of purpose, letters of recommendation, a resume, standardized test scores (if applicable), and proof of language proficiency." },
        { question: "Do you assist with writing the Statement of Purpose (SOP) and essays?", answer: "Yes, we only write the SOPs. Students just need to provide craft compelling SOPs and essays that reflect your strengths and aspirations." },
        { question: "How much does studying abroad cost?", answer: "Costs vary depending on the country, university, and program. They include tuition fees, accommodation, living expenses, insurance, and travel costs. We can provide detailed estimates during your consultation." },
        { question: "Are there scholarships or financial aid available?", answer: "Yes, many universities offer scholarships and financial aid. We can assist you in identifying and applying for these opportunities to help reduce your expenses." },
        { question: "Do you charge for your services?", answer: "Yes, we charge a fee for our services, which covers the personalized support and expertise we provide throughout the application and visa process. Detailed fee information can be provided during your initial consultation." },
        { question: "How do you assist with the visa application process?", answer: "We provide step-by-step guidance on visa requirements, help you prepare the necessary documentation, and conduct mock visa interviews to ensure you are well-prepared." },
        { question: "What if my visa application is denied?", answer: "Firstly, we have 99% of visa ratio. In case, if your visa application is denied, we will analyze the reasons for denial, assist in addressing any issues, and guide you through the reapplication process." },
        { question: "Can you help me choose the right program and university?", answer: "Absolutely! Our advisors have extensive knowledge of programs and universities worldwide and will help match your interests, curriculam, and career goals with the right options." },
        { question: "How far in advance should I start the application process?", answer: "It’s best to start the application process at least 06-12 months before your intended start date to ensure ample time for research, test preparation, application submission, financials check and visa processing." },
        { question: "Can you help with applications for both undergraduate and postgraduate programs?", answer: "Yes, we assist with applications for undergraduate, postgraduate, and doctoral programs across various fields of study." }
      ]
    }
  },
  {
    title: "Terms & Conditions",
    slug: "/terms",
    content: {
      lastUpdated: "February 03, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "Country: Gujarat, India\nCompany: GINA ABROAD PRIVATE LIMITED, 238–239, Second Floor, Roongta Signature, Opp. Shyam Mandir, VIP Road, Vesu, Surat, India\nDevice: Any device that can access the Service such as a computer, mobile phone, or tablet\nService: Refers to the Website\nTerms: These Terms form the agreement between You and the Company\nSocial Media: Any third-party services or content available through the Service\nWebsite: GINA ABROAD PRIVATE LIMITED – http://www.fetc.in\nYou: The individual or legal entity using the Service"
        },
        {
          title: "2. Acknowledgment",
          body: "These Terms and Conditions govern your use of the Service and form a binding agreement between You and the Company.\n- Your use of the Service is conditional upon acceptance of these Terms\n- By accessing or using the Service, you agree to be bound by these Terms\n- If you do not agree, you must not use the Service\n- You must be at least 18 years old to use this Service\n- Please review our Privacy Policy before using the Service"
        },
        {
          title: "3. Links to Other Websites",
          body: "Our Service may contain links to third-party websites\n- These websites are not operated or controlled by us\n- We are not responsible for their content, policies, or practices\n- We recommend reviewing their terms and privacy policies before use"
        }
      ]
    }
  }
];

async function seedPolicies() {
  try {
    await client.connect();
    console.log('Connected to database');

    for (const policy of policies) {
      const query = `
        INSERT INTO pages (title, slug, content, status) 
        VALUES ($1, $2, $3, 'PUBLISHED') 
        ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
      `;
      await client.query(query, [policy.title, policy.slug, JSON.stringify(policy.content)]);
      console.log(`Seeded Policy: ${policy.slug}`);
    }

    console.log('Policy seeding completed!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seedPolicies();
