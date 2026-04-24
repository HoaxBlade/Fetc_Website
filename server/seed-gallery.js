const { Client } = require('pg');

const client = new Client({
  user: 'ayushranjan',
  host: 'localhost',
  database: 'fetc_db',
  password: '',
  port: 5432,
});

const galleryContent = {
  images: [
    { src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1470&auto=format&fit=crop', category: 'Office', title: 'Main Corporate Centre' },
    { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop', category: 'Academic', title: 'State-of-the-Art Testing Lab' },
    { src: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1470&auto=format&fit=crop', category: 'Office', title: 'VIP Conference Room' },
    { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1470&auto=format&fit=crop', category: 'Academic', title: 'Elite Exam Centre' },
    { src: 'https://images.unsplash.com/photo-1554902251-1398c037df3c?q=80&w=1471&auto=format&fit=crop', category: 'Interior', title: 'Modern Workspace' },
    { src: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1471&auto=format&fit=crop', category: 'Office', title: 'Administration Area' },
    { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1471&auto=format&fit=crop', category: 'Meeting', title: 'Collaborative Space' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1470&auto=format&fit=crop', category: 'Office', title: 'Director\'s Cabin' }
  ]
};

async function seed() {
  await client.connect();
  console.log('Connected to database');

  const query = `
    INSERT INTO pages (title, slug, content, status) 
    VALUES ($1, $2, $3, 'PUBLISHED') 
    ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content;
  `;
  
  await client.query(query, ['Gallery', '/gallery', JSON.stringify(galleryContent)]);
  console.log('Gallery seeded successfully!');

  await client.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
