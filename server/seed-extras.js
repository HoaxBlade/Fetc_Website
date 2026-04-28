const db = require('./db');

async function seed() {
  console.log('Seeding extra data (Posts, News Flash, Interactive Guides)...');

  // 1. Seed News Flash
  const newsFlashes = [
    { content: "Upcoming Webinar: Study in UK 2026 - Register Now!", link: "/webinar", priority: 10 },
    { content: "New Intake open for USA Universities. Get 50% Scholarship!", link: "/study-abroad/usa", priority: 5 },
    { content: "FETC students achieve record 8.5 Band in IELTS!", link: "/success-stories", priority: 0 }
  ];

  for (const item of newsFlashes) {
    await db.query(
      'INSERT INTO news_flash (content, link, priority) VALUES ($1, $2, $3)',
      [item.content, item.link, item.priority]
    );
  }
  console.log('Seeded News Flash');

  // 2. Seed Posts
  const posts = [
    { title: "Top 10 Universities in the UK for International Students", slug: "/blog/top-10-uk-universities" },
    { title: "How to Prepare for IELTS in 30 Days", slug: "/blog/ielts-prep-guide" },
    { title: "Understanding the New Student Visa Rules for Australia", slug: "/blog/australia-visa-update" }
  ];

  for (const post of posts) {
    await db.query(
      'INSERT INTO posts (title, slug, status) VALUES ($1, $2, $3)',
      [post.title, post.slug, 'PUBLISHED']
    );
  }
  console.log('Seeded Posts');

  // 3. Seed Interactive Guides
  const guides = [
    { title: "UK Student Visa Process", slug: "uk-visa-guide", description: "Step-by-step guide for UK student visa application." },
    { title: "USA Application Journey", slug: "usa-journey", description: "From choosing universities to landing in the US." }
  ];

  for (const guide of guides) {
    const result = await db.query(
      'INSERT INTO interactive_guides (title, slug, description) VALUES ($1, $2, $3) RETURNING id',
      [guide.title, guide.slug, guide.description]
    );
    
    // Add some dummy pages
    const guideId = result.rows[0].id;
    await db.query(
      'INSERT INTO guide_pages (guide_id, image_url, page_number) VALUES ($1, $2, $3)',
      [guideId, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800', 1]
    );
  }
  console.log('Seeded Interactive Guides');

  console.log('Extra seeding completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
