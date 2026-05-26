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
    fullDescription: 'The Secure English Language Test (SELT) is a highly specialized English proficiency examination officially mandated by UK Visas and Immigration (UKVI). It serves as a foundational requirement for individuals intending to study, work, or establish permanent residency in the United Kingdom. Meticulously designed to evaluate practical language capabilities, the SELT ensures candidates possess the essential communication skills required to thrive in an English-speaking environment.\n\nExam Format & Structural Overview\nThe SELT is strategically tiered across multiple proficiency levels—A1, A2, B1, and B2—tailored to specific visa classifications. These tiers range from foundational linguistic competence (A1, A2) to advanced operational proficiency (B1, B2). The comprehensive assessment encompasses four core modules: Listening, Reading, Writing, and Speaking. Delivered exclusively through a secure computer-based platform, test results are expedited and transmitted directly to the relevant immigration authorities.\n\nWho Should Take the SELT?\nThe SELT is an obligatory prerequisite for applicants seeking specific UK visas, encompassing skilled worker routes, academic study programs, and family settlement pathways. Candidates are required to attain a strictly defined qualifying score corresponding to their visa category. Securing the appropriate SELT certification is a non-negotiable and critical milestone in your UK immigration journey.\n\nGlobal Recognition & Investment\nExclusively tailored for UK immigration protocols, the SELT acts as your primary gateway to the United Kingdom. The examination requires an investment of INR 15,900/-. This is a foundational investment toward unlocking transformative academic and professional opportunities in the UK.', 
    metadata: [
      {label:'Cost', value:'INR 15,900/-'}, 
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
    fullDescription: 'The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) stand as the premier global benchmarks for admission into elite graduate and business schools. While the GRE offers broad utility across a vast spectrum of master\'s and doctoral disciplines, the GMAT is highly specialized and rigorously tailored for top-tier business school admissions. Both assessments rigorously evaluate your cognitive readiness and analytical prowess for advanced academic and professional endeavors.\n\nExam Format & Structural Overview\nThe GRE is systematically divided into three core domains: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing, engineered to test complex problem-solving and critical thinking under pressure.\nConversely, the GMAT features four rigorous sections: the Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning, heavily emphasizing executive-level management competencies.\nBoth examinations employ sophisticated, computer-adaptive algorithms where the difficulty of subsequent questions dynamically scales based on your real-time performance.\n\nWho Should Take the GRE/GMAT?\nThe GRE is an indispensable credential for candidates pursuing advanced degrees—from the humanities to STEM fields—across global institutions. The GMAT is the gold standard for prospective MBA candidates and those targeting elite finance and management programs. Achieving a competitive score on either test is often the defining factor in securing admission to competitive, world-renowned academic institutions.\n\nGlobal Recognition & Investment\nRecognized universally, the GRE and GMAT are pivotal for admission to premier universities across the USA, Canada, the UK, Europe, and Australia. The examination fee ranges between INR 22,000/- to 25,000/-. These examinations represent a strategic and high-yield investment in your long-term career trajectory, unlocking access to prestigious alumni networks and global opportunities.', 
    metadata: [
      {label:'Cost', value:'INR 22,000/- to 25,000/-'}, 
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
    fullDescription: 'The Scholastic Assessment Test (SAT) is the universally recognized cornerstone of the undergraduate college admissions process, primarily utilized by institutions across the United States. Designed to accurately gauge a student\'s academic readiness for rigorous university coursework, the SAT provides admissions committees with a standardized metric to evaluate a highly diverse global applicant pool. Exceptional performance on this exam is often a deciding factor for scholarships and acceptances into top-tier universities.\n\nExam Format & Structural Overview\nThe SAT is meticulously divided into two primary disciplines: Evidence-Based Reading & Writing, and Mathematics. The assessment focuses heavily on real-world problem-solving, data analysis, and reading comprehension. Now fully transitioned to a digital, computer-adaptive format in many regions, the exam offers a streamlined and secure testing experience that measures the precise skills required for collegiate academic success.\n\nWho Should Take the SAT?\nThe SAT is highly recommended—and often mandatory—for high school students aspiring to enroll in prestigious undergraduate degree programs in the USA and select global universities. It serves as a critical benchmark for colleges to assess your intellectual aptitude, ensuring you are adequately prepared for the academic demands of higher education.\n\nGlobal Recognition & Investment\nWhile the SAT is fundamentally deeply rooted in the US higher education system, its scores are highly respected and accepted by leading universities in Canada, the UK, Australia, and Europe. The exam requires an investment of INR 12,300/-. This is a foundational investment that paves the way toward your international undergraduate aspirations.', 
    metadata: [
      {label:'Cost', value:'INR 12,300/-'}, 
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
    name: 'IELTS', 
    description: 'Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.', 
    fullDescription: 'The International English Language Testing System (IELTS) is the world’s most proven and widely respected English language proficiency examination. Functioning as a global passport for international mobility, it is universally trusted by elite educational institutions, multinational employers, and strict immigration authorities. The IELTS provides a comprehensive and highly accurate assessment of your practical ability to communicate across all fundamental linguistic domains.\n\nExam Format & Structural Overview\nThe examination is rigorously structured into four distinct modules: Listening, Reading, Writing, and Speaking. Depending on your specific objectives, you may opt for the Academic module (for higher education) or the General Training module (for migration and work). The test is offered in both traditional paper-based and modern computer-delivered formats, ensuring maximum accessibility and candidate comfort.\n\nWho Should Take the IELTS?\nThe IELTS is an indispensable requirement for ambitious individuals aiming to study, work, or establish residency in major English-speaking territories. It serves as a mandatory benchmark for university admissions, professional licensing boards, and global visa processing. Securing a high Band Score is a vital prerequisite for unlocking a world of international opportunities.\n\nGlobal Recognition & Investment\nCommanding unparalleled global acceptance, the IELTS is the preferred English proficiency standard in the UK, USA, Australia, Canada, and New Zealand. The examination requires an investment of INR 18,000/-. Achieving a competitive IELTS score is a transformative step toward realizing your global educational and professional ambitions.', 
    metadata: [
      {label:'Cost', value:'INR 18,000/-'}, 
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
    fullDescription: 'The Test of English as a Foreign Language (TOEFL) is an internationally acclaimed benchmark for measuring academic English proficiency. It is overwhelmingly favored by prestigious universities and institutions across North America and beyond. The TOEFL iBT specifically evaluates how well non-native speakers can combine their listening, reading, speaking, and writing skills to perform complex academic tasks in a university environment.\n\nExam Format & Structural Overview\nThe TOEFL is systematically divided into four rigorous sections: Reading, Listening, Speaking, and Writing. Designed specifically to simulate authentic university-level communication, the tasks often require candidates to integrate multiple skills simultaneously—such as reading a passage, listening to a lecture, and then speaking or writing a response. The examination is conducted entirely on a secure, computer-based platform.\n\nWho Should Take the TOEFL?\nThe TOEFL is primarily tailored for international students applying for undergraduate, graduate, or doctoral programs at elite English-speaking institutions. Beyond academia, it is also highly sought after by medical and licensing agencies for professional certification, as well as for specialized visa applications requiring robust proof of advanced English fluency.\n\nGlobal Recognition & Investment\nWhile the TOEFL is the undisputed leader for academic admissions in the USA and Canada, it is also widely accepted in Australia, New Zealand, and across Europe. The examination requires an investment of INR 18,000/-. An exceptional TOEFL score acts as a powerful catalyst, distinguishing your academic profile in highly competitive global applicant pools.', 
    metadata: [
      {label:'Cost', value:'INR 18,000/-'}, 
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
    fullDescription: 'The Pearson Test of English Academic (PTE-A) is a cutting-edge, fully computerized English language proficiency examination. Renowned for its rapid turnaround times and AI-driven, objective scoring algorithms, the PTE-A delivers a highly accurate and entirely unbiased assessment. It has rapidly become a preferred choice for global students and professionals aiming for seamless international mobility.\n\nExam Format & Structural Overview\nThe PTE-A is uniquely structured into three integrated modules: Speaking & Writing (combined), Reading, and Listening. Unlike traditional exams, the PTE heavily utilizes integrated questioning, testing two skills simultaneously (e.g., listening and reading) to accurately mimic real-life academic scenarios. Administered exclusively via a highly secure digital interface, candidates often receive their verified results within a mere 48 hours.\n\nWho Should Take the PTE-A?\nPTE-A is an excellent and highly efficient option for individuals urgently requiring proof of English proficiency for university admissions, professional registrations, or skilled migration pathways. Its rapid result delivery makes it particularly advantageous for candidates facing strict, fast-approaching application deadlines.\n\nGlobal Recognition & Investment\nPTE-A scores are universally trusted by governments and leading academic institutions across the UK, Australia, New Zealand, Canada, and increasingly in the USA. The registration cost is INR 18,900/-. By leveraging advanced AI technology, the PTE-A provides a streamlined, stress-free testing experience that accelerates your journey abroad.', 
    metadata: [
      {label:'Cost', value:'INR 18,900/-'}, 
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
    fullDescription: 'At FETC, we offer the Pearson Versant Test, an advanced, AI-driven examination that provides a remarkably swift and highly accurate assessment of your overall English proficiency.', 
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
    fullDescription: 'At FETC, we offer elite, expert coaching for the PSI exam, delivering a comprehensive and meticulously structured pathway to mastering your English language proficiency. Our specialized preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and deeply detailed performance feedback.', 
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
