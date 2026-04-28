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
        },
        {
          title: "4. Termination",
          body: "We reserve the right to suspend or terminate your access immediately if you violate these Terms\n- Upon termination, your right to use the Service will cease"
        },
        {
          title: "5. Limitation of Liability",
          body: "Our total liability is limited to the amount you paid through the Service\n- We are not responsible for any indirect, incidental, or consequential damages, even if advised of the possibility"
        },
        {
          title: "6. Severability and Waiver",
          body: "Severability: If any provision is found invalid, it will be adjusted to achieve its intent while the remaining provisions remain in effect\nWaiver: Failure to enforce any right does not waive the ability to enforce it later"
        },
        {
          title: "7. Translation Interpretation",
          body: "If these Terms are translated into other languages, the English version will prevail in case of any dispute"
        },
        {
          title: "8. Changes to These Terms and Conditions",
          body: "We reserve the right to update or modify these Terms at any time\n- Significant changes will be notified at least 30 days in advance\n- Continued use of the Service indicates acceptance of the updated Terms"
        },
        {
          title: "9. Contact Us",
          body: "If you have any questions regarding these Terms and Conditions, you can contact us via:\nWebsite: https://fetc.in/contact-us"
        }
      ]
    }
  },
  {
    title: "Privacy Policy",
    slug: "/privacy",
    content: {
      lastUpdated: "February 03, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "This Privacy Policy explains how we collect, use, and protect your personal information when you access our website and services.\nBy using our Service, you agree to the terms described in this Privacy Policy."
        },
        {
          title: "2. Information Collection",
          body: "We collect personal information that you provide to us, such as:\n- Name\n- Email address\n- Payment details\n\nWe also collect usage data such as:\n- IP address\n- Browser type\n\nThis helps us improve our services and understand user behavior."
        },
        {
          title: "3. How We Use Your Information",
          body: "We use the information we collect to:\n- Provide and improve our services\n- Communicate with you regarding your account or service-related matters\n- Personalize your experience\n- Respond to your inquiries"
        },
        {
          title: "4. Data Security",
          body: "We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction.\nHowever, please note that no method of electronic storage or transmission over the internet is completely secure."
        },
        {
          title: "5. Sharing of Data",
          body: "We do not sell or rent your personal information to third parties\n- We may share your information with trusted service providers to help us deliver our services"
        },
        {
          title: "6. Your Rights",
          body: "You have the right to:\n- Access your personal data\n- Update your information\n- Request deletion of your data\nTo exercise these rights, please contact us using the details below."
        },
        {
          title: "7. Changes to This Privacy Policy",
          body: "We may update this Privacy Policy from time to time.\n- Any changes will be posted on this page\n- The \"Last Updated\" date will be revised accordingly\nWe recommend reviewing this page periodically."
        },
        {
          title: "8. Contact Us",
          body: "If you have any questions or concerns about this Privacy Policy, you can contact us at:\nEmail: info@fetc.in"
        }
      ]
    }
  },
  {
    title: "Refund Policy",
    slug: "/refund",
    content: {
      lastUpdated: "February 3, 2025",
      sections: [
        {
          title: "1. Introduction",
          body: "We strive to provide high-quality online English learning services.\nIf you are not satisfied with your purchase, this Refund Policy explains the conditions and process for requesting a refund."
        },
        {
          title: "2. Refund Process",
          body: "If your refund request meets our eligibility criteria, it will be processed accordingly\n- The refund will be credited to your original payment method\n- Refunds are typically processed within 5 business days"
        },
        {
          title: "3. Contact Us",
          body: "If you have any questions about our Refund Policy, please contact us:\nEmail: info@fetc.in"
        }
      ]
    }
  },
  {
    title: "Frequently Asked Questions",
    slug: "/faq",
    content: {
      lastUpdated: "April 28, 2026",
      faqs: [
        {
          question: "How do I start my study abroad journey?",
          answer: "Simply book a free consultation through our website or visit one of our branches."
        },
        {
          question: "What exams do you provide training for?",
          answer: "We provide training for IELTS, TOEFL, PTE, and Pearson Versant."
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
