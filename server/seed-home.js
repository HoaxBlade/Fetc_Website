const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/fetc_db'
});

const homeContent = {
  "hero": {
    "badge": "🚀 Your Global Career Starts Here",
    "titleMain": "The Ultimate Gateway to",
    "titleHighlight": "Global Education",
    "subtitle": "Expert guidance for Study Abroad, IELTS preparation, and professional career assessment to help you cross borders and build your dream future.",
    "buttonText": "Start Your Journey"
  },
  "trustBar": {
    "message": "Trusted by 100+ Global Universities & Education Partners"
  },
  "studyAbroad": {
    "title": "Global Study Abroad",
    "description": "Unlock world-class education at leading universities across the UK, USA, Canada, and Australia with our end-to-end guidance.",
    "badgeText": "International Opportunities",
    "linkText": "Explore Destinations",
    "stats": [
      {"label": "UNIVERSITIES", "value": "100+"},
      {"label": "VISA SUCCESS", "value": "98%"},
      {"label": "COUNTRIES", "value": "10+"}
    ],
    "floatingTags": ["United Kingdom", "USA", "Canada", "Australia"]
  },
  "examTraining": {
    "title": "IELTS & English Mastery",
    "description": "Achieve your dream band score with our specialized IELTS preparation and English proficiency training modules.",
    "badgeText": "Language Excellence",
    "linkText": "View Training Programs",
    "stats": [
      {"label": "EXPERT MENTORS", "value": "50+"},
      {"label": "BAND IMPROVEMENT", "value": "2.0+"},
      {"label": "MOCK TESTS", "value": "100+"}
    ],
    "floatingTags": ["IELTS Academic", "PTE", "Specialized Speaking", "Writing Mastery"]
  },
  "careerAssessment": {
    "title": "Advanced Career Insights",
    "description": "Discover your true potential with our scientifically driven career assessment and professional counseling services.",
    "badgeText": "Strategic Growth",
    "linkText": "Get Assessed",
    "stats": [
      {"label": "STUDENTS GUIDED", "value": "1500+"},
      {"label": "CAREER PATHS", "value": "45+"},
      {"label": "ACCURACY", "value": "95%"}
    ],
    "floatingTags": ["Career Mapping", "Psychometric Tests", "Industry Expert Advice"]
  },
  "features": {
    "sectionTitle": "Built for Excellence",
    "sectionSubtitle": "Every metric is a promise we deliver on. Here's what sets us apart from every other consultancy.",
    "items": [
      {"title": "Expert 1-on-1 Mentors", "metric": "50+", "label": "Elite Mentors"},
      {"title": "98% Visa Success", "metric": "98%", "label": "Approval Rate"},
      {"title": "100% Result Boost", "metric": "2+", "label": "Band Increase"},
      {"title": "10+ Destinations", "metric": "10+", "label": "Countries"}
    ]
  }
};

async function seed() {
  try {
    await pool.query(
      "UPDATE pages SET content = $1 WHERE slug = '/';",
      [JSON.stringify(homeContent)]
    );
    console.log("✅ Home Page content seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
