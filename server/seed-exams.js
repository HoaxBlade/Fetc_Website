const { Client } = require('pg');

const client = new Client({
  user: 'ayushranjan',
  host: 'localhost',
  database: 'fetc_db',
  password: '',
  port: 5432,
});

const exams = {
  psi: { 
    name: 'PSI', 
    description: 'Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.', 
    fullDescription: 'At FETC, we offer expert coaching for the PSI exam, providing a comprehensive and structured path to mastering your English proficiency. Our preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and detailed performance feedback.', 
    metadata: [
      {label:'Cost', value:'Approx. ₹17,000'}, 
      {label:'Frequency', value:'Flexible'}, 
      {label:'Duration', value:'Up to 2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Assessments'}, 
      {highlight:'100%', label:'Rapid Results'}
    ] 
  },
  'idp-for-ielts': { 
    name: 'IDP for IELTS', 
    description: 'Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.', 
    fullDescription: 'At FETC, we provide specialized IDP IELTS coaching designed to rigorously elevate your English skills across Speaking, Writing, Reading, and Listening. Recognized globally by leading universities and major employers.', 
    metadata: [
      {label:'Cost', value:'Approx. ₹16,250'}, 
      {label:'Frequency', value:'Weekly'}, 
      {label:'Duration', value:'2 Hrs 45 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Comprehensive Assessment'}, 
      {highlight:'100%', label:'Success Rate'}
    ] 
  },
  toefl: { 
    name: 'TOEFL', 
    description: 'Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.', 
    fullDescription: 'At FETC, we offer a deeply focused TOEFL training curriculum designed to accurately assess and improve your academic English communication.', 
    metadata: [
      {label:'Cost', value:'Approx. ₹16,900'}, 
      {label:'Frequency', value:'60+ times/year'}, 
      {label:'Duration', value:'1 Hr 56 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'100%', label:'Rapid Results'}, 
      {highlight:'500+', label:'Elite Mentors'}
    ] 
  },
  pte: { 
    name: 'PTE', 
    description: 'Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.', 
    fullDescription: 'At FETC, we deliver advanced preparation for the PTE (Pearson Test of English), leveraging modern techniques to provide a swift and accurate boost.', 
    metadata: [
      {label:'Cost', value:'Approx. ₹17,000'}, 
      {label:'Frequency', value:'Almost Daily'}, 
      {label:'Duration', value:'2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'AI-Driven', label:'Pattern Mastery'}, 
      {highlight:'Instant', label:'Scoring'}
    ] 
  },
  'pearson-versant': { 
    name: 'Pearson Versant Test', 
    description: 'Fast and accurate assessment of English proficiency across all key areas.', 
    fullDescription: 'At FETC, we offer the Pearson Versant Test, a leading exam that provides a swift and accurate assessment of your English proficiency.', 
    metadata: [
      {label:'Cost', value:'Approx. ₹4,000'}, 
      {label:'Frequency', value:'On-demand'}, 
      {label:'Duration', value:'15-50 Mins'}, 
      {label:'Validity', value:'Inst. Dependant'}
    ], 
    features: [
      {highlight:'Real-time', label:'Feedback'}, 
      {highlight:'Global', label:'Recognition'}
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
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;
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
