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

const aboutContent = {
  hero: {
    title: "Our",
    titleHighlight: "Story",
    description: "A legacy of excellence in global education, built on the foundation of empowering students to achieve their international dreams."
  },
  directorsNote: {
    quote: "With over 27 years of experience in the education and training industry, my journey has been of passion, growth, and transformation.",
    content: "Throughout my career, I have been committed to empowering individuals with the skills, confidence, and global opportunities they deserve.\nMy expertise lies in Strategic Planning, Public Speaking, Training, Staff Development, and Educational Leadership."
  },
  visionSection: {
    badge: "Our Purpose",
    titlePrefix: "The FETC",
    titleHighlight: "Vision",
    values: [
      {
        icon: "Target",
        title: "Global Reach",
        desc: "Established in 2024 to provide a wide variety of English examinations worldwide.",
        color: "from-blue-500 to-indigo-500"
      },
      {
        icon: "Lightbulb",
        title: "Innovation",
        desc: "Implementing state-of-the-art testing and training methodologies for modern learners.",
        color: "from-amber-400 to-orange-500"
      },
      {
        icon: "Compass",
        title: "Guidance",
        desc: "A dream project under Gina Abroad dedicated to steering students toward success.",
        color: "from-teal-400 to-emerald-500"
      }
    ]
  },
  officeShowcase: {
    badge: "Workspace Culture",
    title: "Empowering Minds in a Global Environment",
    description: "Our state-of-the-art facilities are designed to foster learning, innovation, and professional excellence.",
    images: [
      "/assets/office-images/exterior-roongta-vesu.jpeg",
      "/assets/office-images/directors-cabin.jpeg",
      "/assets/office-images/testing-lab.jpg",
      "/assets/office-images/vip-conference.jpg"
    ]
  }
};

async function seed() {
  await client.connect();
  const slug = '/about/company-profile';
  const query = `
    INSERT INTO pages (title, slug, content, status) 
    VALUES ($1, $2, $3, 'PUBLISHED') 
    ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
  `;
  await client.query(query, ['Company Profile', slug, JSON.stringify(aboutContent)]);
  console.log(`Seeded: ${slug}`);
  await client.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
