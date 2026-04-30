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

const exams = {
  'selt': { 
    name: 'SELT', 
    description: 'Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.', 
    fullDescription: 'The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam varies depending on the test provider and location but generally falls within INR 10,000. This investment is essential for those pursuing opportunities in the UK.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 10,000'}, 
      {label:'Frequency', value:'Weekly / On-demand'}, 
      {label:'Duration', value:'15m - 3h'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'UKVI', label:'Approved'}, 
      {highlight:'Fast', label:'Booking'},
      {highlight:'Global', label:'Recognition'},
      {highlight:'Expert', label:'Guidance'}
    ] 
  },
  'gre-gmat': { 
    name: 'GRE & GMAT', 
    description: 'Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.', 
    fullDescription: 'The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the GRE is approximately INR 19,000, while the GMAT costs around INR 25,000. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide.', 
    metadata: [
      {label:'Cost', value:'INR 19k - 25k'}, 
      {label:'Frequency', value:'Flexible'}, 
      {label:'Duration', value:'2h - 2.5h'}, 
      {label:'Validity', value:'5 Years'}
    ], 
    features: [
      {highlight:'Global', label:'Admissions'}, 
      {highlight:'High', label:'Target Scores'},
      {highlight:'Advanced', label:'Analytics'},
      {highlight:'Full', label:'Support'}
    ] 
  },
  'sat': { 
    name: 'SAT', 
    description: 'A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.', 
    fullDescription: 'The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student\'s readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student\'s academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is approximately INR 7,000 to INR 8,000, depending on the location and whether the Essay section is included. This investment is essential for students aiming to pursue higher education abroad.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 8,000'}, 
      {label:'Frequency', value:'7 Times / Year'}, 
      {label:'Duration', value:'3 Hours'}, 
      {label:'Validity', value:'5 Years'}
    ], 
    features: [
      {highlight:'USA', label:'Undergraduate'}, 
      {highlight:'1500+', label:'Target Score'},
      {highlight:'Math/Eng', label:'Focus'},
      {highlight:'Expert', label:'Training'}
    ] 
  },
  'idp-for-ielts': { 
    name: 'IDP for IELTS', 
    description: 'Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.', 
    fullDescription: 'The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 17,000, making it a crucial investment for your future abroad.', 
    metadata: [
      {label:'Cost', value:'INR 17,000'}, 
      {label:'Frequency', value:'Weekly'}, 
      {label:'Duration', value:'2 Hrs 45 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Comprehensive Assessment'}, 
      {highlight:'100%', label:'Success Rate'},
      {highlight:'8.0+', label:'Average Band Score'},
      {highlight:'Weekly', label:'Mock Tests'}
    ] 
  },
  'toefl': { 
    name: 'TOEFL', 
    description: 'Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.', 
    fullDescription: 'The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is approximately INR 16,000, reflecting its importance in achieving your educational and career goals.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 16,000'}, 
      {label:'Frequency', value:'60+ times/year'}, 
      {label:'Duration', value:'1 Hr 56 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'100%', label:'Rapid Results'}, 
      {highlight:'500+', label:'Elite Mentors'},
      {highlight:'550+', label:'Efficiency and Quality'}, 
      {highlight:'300+', label:'Objective Scoring'}
    ] 
  },
  'pte': { 
    name: 'PTE', 
    description: 'Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.', 
    fullDescription: 'The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is approximately INR 15,900. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 15,900'}, 
      {label:'Frequency', value:'Almost Daily'}, 
      {label:'Duration', value:'2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'AI-Driven', label:'Pattern Mastery'}, 
      {highlight:'Instant', label:'Scoring'},
      {highlight:'550+', label:'Efficiency and Quality'}, 
      {highlight:'300+', label:'Objective Scoring'}
    ] 
  },
  'pearson-versant': { 
    name: 'Pearson Versant Test', 
    description: 'Fast and accurate assessment of English proficiency across all key areas.', 
    fullDescription: 'At FETC, we offer the Pearson Versant Test, a leading exam that provides a swift and accurate assessment of your English proficiency.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 4,000'}, 
      {label:'Frequency', value:'On-demand'}, 
      {label:'Duration', value:'15-50 Mins'}, 
      {label:'Validity', value:'Inst. Dependant'}
    ], 
    features: [
      {highlight:'Real-time', label:'Feedback'}, 
      {highlight:'Global', label:'Recognition'},
      {highlight:'AI-Driven', label:'Scoring'},
      {highlight:'Fast', label:'Results'}
    ] 
  },
  'psi': { 
    name: 'PSI', 
    description: 'Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.', 
    fullDescription: 'At FETC, we offer expert coaching for the PSI exam, providing a comprehensive and structured path to mastering your English proficiency. Our preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and detailed performance feedback.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 17,000'}, 
      {label:'Frequency', value:'Flexible'}, 
      {label:'Duration', value:'Up to 2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Assessments'}, 
      {highlight:'100%', label:'Rapid Results'},
      {highlight:'Expert', label:'Coaching'},
      {highlight:'Targeted', label:'Strategy'}
    ] 
  }
};

async function seed() {
  await client.connect();
  console.log('Connected to database');

  for (const [slug, content] of Object.entries(exams)) {
    const fullSlug = `/exam-training/${slug}`;
    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    await client.query(query, [content.name, fullSlug, JSON.stringify(content)]);
    console.log(`Seeded: ${fullSlug}`);
  }

  await client.end();
  console.log('Seeding completed!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
