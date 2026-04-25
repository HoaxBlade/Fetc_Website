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

const countryData = {
  "united-kingdom": {
    name: "United Kingdom",
    image: "/api/placeholder/800/600",
    description: "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
    universities: [
      { name: "QA Universities", link: "https://highereducation.qa.com/", exclusive: true, ranking: "Top Ranked", location: "United Kingdom" },
      { name: "Oxford University", link: "#", exclusive: false, ranking: "World #1", location: "Oxford" }
    ],
  },
  usa: {
    name: "USA",
    image: "/api/placeholder/800/600",
    description: "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
    universities: [
      { name: "Harvard", link: "#", exclusive: true, ranking: "World #2", location: "Cambridge" }
    ],
  },
  canada: {
    name: "Canada",
    image: "/api/placeholder/800/600",
    description: "Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.",
    universities: [
      { name: "University of Toronto", link: "#", exclusive: false, ranking: "Top 20", location: "Toronto" }
    ],
  },
  australia: {
    name: "Australia",
    image: "/api/placeholder/800/600",
    description: "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    universities: [
      { name: "University of Melbourne", link: "#", exclusive: false, ranking: "World #33", location: "Melbourne" }
    ],
  },
  europe: {
    name: "Europe",
    image: "/api/placeholder/800/600",
    description: "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways.",
    universities: [
      { name: "ILA", link: "https://www.ilamilan.com/", exclusive: true, ranking: "Expert Training", location: "Milan" }
    ],
  }
};

async function seed() {
  await client.connect();
  console.log('Connected to database');

  for (const [slug, content] of Object.entries(countryData)) {
    const fullSlug = `/study-abroad/${slug}`;
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
