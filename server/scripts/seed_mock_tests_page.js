const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fetc_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const DEFAULT_MOCK_TESTS = [
  {
    title: "SELT (Secure English Language Test)",
    content: "Official mock exam for UKVI, study, work, and immigration requirements.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "IELTS Academic & General Training",
    content: "Complete practice tests for Listening, Reading, Writing, and Speaking modules.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "TOEFL iBT Practice",
    content: "Full-length internet-based tests modeled directly on the ETS syllabus.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "PTE Academic Exam Prep",
    content: "AI-scored simulated exams aligned with official Pearson guidelines.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "SAT Prep Simulators",
    content: "Adaptive testing pattern mirroring the digital Scholastic Assessment Test.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "GMAT Focus Edition Mock",
    content: "Quantitative Reasoning, Verbal Reasoning, and Data Insights simulators.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "GRE General Test Simulator",
    content: "Analytical Writing, Verbal Reasoning, and Quantitative Reasoning sections.",
    price: "INR 49",
    image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Pearson Versant Test Simulator",
    content: "Simulated speaking and writing assessment with auto-scoring metrics.",
    price: "INR 499",
    image_url: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=60"
  }
];

async function seedMockTestsPage() {
  try {
    await pool.query("SET client_encoding = 'UTF8'");

    // 1. Ensure pages table entry for /mock-tests
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) DEFAULT 'PUBLISHED',
        content JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const pageCheck = await pool.query("SELECT * FROM pages WHERE slug = '/mock-tests' OR slug = '/mock'");
    if (pageCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO pages (title, slug, status, content)
        VALUES ($1, $2, $3, $4)
      `, [
        'Practice Mock Exams & Tests',
        '/mock-tests',
        'PUBLISHED',
        JSON.stringify({
          hero: {
            badge: "Practice & Succeed",
            titleMain: "Practice Mock Exams & Tests",
            subtitle: "Gain the confidence needed to clear your foreign educational and language requirements. Fully timed, high-accuracy simulator environments."
          },
          mockTestsList: DEFAULT_MOCK_TESTS
        })
      ]);
      console.log('✅ Created /mock-tests page in pages table.');
    } else {
      console.log('ℹ️ /mock-tests page already exists in pages table.');
    }

    // 2. Ensure mock_tests table entries
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mock_tests (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(50) DEFAULT 'INR 49',
        status VARCHAR(50) DEFAULT 'Published',
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const testsCheck = await pool.query("SELECT COUNT(*) FROM mock_tests");
    if (parseInt(testsCheck.rows[0].count) === 0) {
      for (const t of DEFAULT_MOCK_TESTS) {
        await pool.query(`
          INSERT INTO mock_tests (title, price, status, content, image_url)
          VALUES ($1, $2, $3, $4, $5)
        `, [t.title, t.price, 'Published', t.content, t.image_url]);
      }
      console.log('✅ Seeded 8 mock tests into mock_tests table.');
    } else {
      console.log(`ℹ️ mock_tests table already contains ${testsCheck.rows[0].count} entries.`);
    }
  } catch (err) {
    console.error('Error seeding mock tests page:', err);
  } finally {
    pool.end();
  }
}

seedMockTestsPage();
