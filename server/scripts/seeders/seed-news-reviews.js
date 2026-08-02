const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

const newsArticles = [
  {
    headline: "CBSE Mock Test Initiative for 700+ Students",
    description: "FETC organized an English mock test for 700+ Class 11 CBSE students at Radiant International School, Piplod — boosting confidence and subject clarity through real exam practice.",
    image_url: "/assets/news/news1.png",
    source: "Regional Media",
    category: "press_coverage",
    is_featured: true
  },
  {
    headline: "Foreign Innovation Test at Radiant School",
    description: "Covered extensively in regional media, FETC's mock test program at Radiant School showcases 13 years of excellence in preparing students for academic and career success.",
    image_url: "/assets/news/news2.png",
    source: "Regional Media",
    category: "press_coverage",
    is_featured: true
  }
];

const studentReviews = [
  {
    name: "Udit Gangnani",
    achievement: "Fully Funded Scholarship — Data Science, University of Pisa",
    country: "Italy",
    country_flag: "IT",
    image_url: "/assets/reviews/Udit Gangnami.png",
    testimonial: "With dreams of advancing his education, Udit entrusted FETC with his journey. Through dedicated support and guidance, he secured a fully funded scholarship to study Data Science at the prestigious University of Pisa.",
    visa_type: "Student Visa",
    is_featured: true
  },
  {
    name: "Mansi Savani",
    achievement: "USA F1 Visa",
    country: "USA",
    country_flag: "US",
    image_url: "/assets/reviews/Mansi Savani USA F1 Visa.png",
    testimonial: null,
    visa_type: "F1 Visa",
    is_featured: false
  },
  {
    name: "Naitik Patel",
    achievement: "Ireland Student Visa",
    country: "Ireland",
    country_flag: "IE",
    image_url: "/assets/reviews/Naitik Patel Ireland Student Visa.png",
    testimonial: null,
    visa_type: "Student Visa",
    is_featured: false
  },
  {
    name: "Prajal Sonariya",
    achievement: "USA F1 Visa",
    country: "USA",
    country_flag: "US",
    image_url: "/assets/reviews/Prajal Sonariya USA F1 Visa.png",
    testimonial: null,
    visa_type: "F1 Visa",
    is_featured: false
  },
  {
    name: "Prathana Dankhara",
    achievement: "USA F1 Visa",
    country: "USA",
    country_flag: "US",
    image_url: "/assets/reviews/Prathana Dankhara USA F1 visa.png",
    testimonial: null,
    visa_type: "F1 Visa",
    is_featured: false
  },
  {
    name: "Rutvik Tejani",
    achievement: "USA F1 Visa",
    country: "USA",
    country_flag: "US",
    image_url: "/assets/reviews/Rutvik Tejani USA F1 Visa.png",
    testimonial: null,
    visa_type: "F1 Visa",
    is_featured: false
  },
  {
    name: "Samarth Pachchigar",
    achievement: "Spain Student Visa",
    country: "Spain",
    country_flag: "ES",
    image_url: "/assets/reviews/Samarth Pachchigar Spain Student Visa.png",
    testimonial: null,
    visa_type: "Student Visa",
    is_featured: false
  }
];

async function seedNewsAndReviews() {
  console.log('🚀 Starting News & Reviews seeding...\n');

  // ── 1. Create Tables ──────────────────────────────────────
  console.log('📦 Creating tables...');

  await db.query(`
    CREATE TABLE IF NOT EXISTS news_articles (
      id SERIAL PRIMARY KEY,
      headline VARCHAR(500) NOT NULL,
      description TEXT,
      image_url TEXT,
      source VARCHAR(255) DEFAULT 'Regional Media',
      category VARCHAR(100) DEFAULT 'press_coverage',
      is_featured BOOLEAN DEFAULT false,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('  ✅ news_articles table ready');

  await db.query(`
    CREATE TABLE IF NOT EXISTS student_reviews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      achievement VARCHAR(500),
      country VARCHAR(100),
      country_flag VARCHAR(10),
      image_url TEXT,
      testimonial TEXT,
      visa_type VARCHAR(100),
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('  ✅ student_reviews table ready');

  // ── 2. Seed News Articles ──────────────────────────────────
  console.log('\n📰 Seeding news articles...');

  for (const article of newsArticles) {
    const query = `
      INSERT INTO news_articles (headline, description, image_url, source, category, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [
      article.headline,
      article.description,
      article.image_url,
      article.source,
      article.category,
      article.is_featured
    ]);
    console.log(`  ✅ Seeded article: ${article.headline}`);
  }

  // ── 3. Seed Student Reviews ────────────────────────────────
  console.log('\n🎓 Seeding student reviews...');

  for (const review of studentReviews) {
    const query = `
      INSERT INTO student_reviews (name, achievement, country, country_flag, image_url, testimonial, visa_type, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [
      review.name,
      review.achievement,
      review.country,
      review.country_flag,
      review.image_url,
      review.testimonial,
      review.visa_type,
      review.is_featured
    ]);
    console.log(`  ✅ Seeded review: ${review.name} — ${review.achievement}`);
  }

  // ── 4. Verify ──────────────────────────────────────────────
  const newsCount = await db.query('SELECT COUNT(*) FROM news_articles');
  const reviewsCount = await db.query('SELECT COUNT(*) FROM student_reviews');

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   📰 News Articles: ${newsCount.rows[0].count}`);
  console.log(`   🎓 Student Reviews: ${reviewsCount.rows[0].count}`);
}

module.exports = { seedNewsAndReviews };

if (require.main === module) {
  seedNewsAndReviews()
    .then(() => {
      console.log('\n✅ All done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    });
}
