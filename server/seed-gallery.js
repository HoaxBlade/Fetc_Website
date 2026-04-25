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

const galleryImages = [
  { src: "/assets/office-images/exterior-roongta-vesu.jpeg", title: "Vesu Centre Exterior", category: "Infrastructure" },
  { src: "/assets/office-images/exterior-varachha-prime.jpeg", title: "Varachha Centre Exterior", category: "Infrastructure" },
  { src: "/assets/office-images/testing-lab.jpg", title: "Advanced Testing Lab", category: "Facilities" },
  { src: "/assets/office-images/vip-conference.jpg", title: "Conference Room", category: "Collaboration" },
  { src: "/assets/office-images/vip-exam-centre.jpg", title: "VIP Exam Centre", category: "Facilities" },
  { src: "/assets/office-images/waiting-area-washroom.jpeg", title: "Waiting Lounge", category: "Facilities" },
  { src: "/assets/office-images/directors-cabin.jpeg", title: "Director's Cabin", category: "Office" },
  { src: "/assets/office-images/signage.jpeg", title: "FETC Main Signage", category: "Branding" },
  { src: "/assets/office-images/admin-pc.jpeg", title: "Admin Operations", category: "Facilities" },
  { src: "/assets/office-images/biggest-centre.jpeg", title: "Main Hall", category: "Infrastructure" },
  { src: "/assets/office-images/p1.jpeg", title: "Office View 1", category: "Interior" },
  { src: "/assets/office-images/p2.jpeg", title: "Office View 2", category: "Interior" },
  { src: "/assets/office-images/p3.jpeg", title: "Office View 3", category: "Interior" },
  { src: "/assets/office-images/p4.jpeg", title: "Office View 4", category: "Interior" },
  { src: "/assets/office-images/p5.jpeg", title: "Office View 5", category: "Interior" },
  { src: "/assets/office-images/p6.jpeg", title: "Office View 6", category: "Interior" },
  { src: "/assets/office-images/p7.jpeg", title: "Office View 7", category: "Interior" },
  { src: "/assets/office-images/p8.jpeg", title: "Office View 8", category: "Interior" },
  { src: "/assets/office-images/p9.jpeg", title: "Office View 9", category: "Interior" },
  { src: "/assets/office-images/p10.jpeg", title: "Office View 10", category: "Interior" },
  { src: "/assets/office-images/p11.jpeg", title: "Office View 11", category: "Interior" },
  { src: "/assets/office-images/p12.jpeg", title: "Office View 12", category: "Interior" },
  { src: "/assets/office-images/p13.jpeg", title: "Office View 13", category: "Interior" },
  { src: "/assets/office-images/p14.jpeg", title: "Office View 14", category: "Interior" },
  { src: "/assets/office-images/p15.jpeg", title: "Office View 15", category: "Interior" },
  { src: "/assets/office-images/_DSC1619.JPG", title: "Centre Session", category: "Events" },
  { src: "/assets/office-images/_DSC1638.JPG", title: "Interactive Session", category: "Events" },
  { src: "/assets/office-images/IMG_2426.JPG", title: "Main Building", category: "Infrastructure" },
  { src: "/assets/office-images/ext.2.jpeg", title: "Building Exterior", category: "Infrastructure" }
];

async function seed() {
  await client.connect();
  console.log('Connected to database');

  const galleryContent = {
    images: galleryImages
  };

  const query = `
    INSERT INTO pages (title, slug, content, status) 
    VALUES ($1, $2, $3, 'PUBLISHED') 
    ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
  `;
  
  await client.query(query, ['Gallery', '/gallery', JSON.stringify(galleryContent)]);
  console.log('Seeded: /gallery with 29 images');

  await client.end();
  console.log('Gallery seeding completed!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
