const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'ayushranjan',
  host: 'localhost',
  database: 'fetc_db',
  password: '',
  port: 5432,
});

const officeImagesDir = path.join(__dirname, '..', 'public', 'assets', 'office-images');

async function seed() {
  await client.connect();
  console.log('Connected to database');

  try {
    const files = fs.readdirSync(officeImagesDir);
    console.log(`Found ${files.length} images in ${officeImagesDir}`);

    const galleryImages = files
      .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(file => {
        // Create a readable title from filename
        const title = file
          .replace(/\.[^/.]+$/, "") // remove extension
          .split(/[-_ ]+/) // split by separators
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          src: `/assets/office-images/${file}`,
          title: title,
          category: "Infrastructure"
        };
      });

    // Special sorting: keep some recognizable ones at the start
    galleryImages.sort((a, b) => {
      if (a.src.includes('exterior')) return -1;
      if (b.src.includes('exterior')) return 1;
      return 0;
    });

    const galleryContent = {
      images: galleryImages
    };

    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    
    await client.query(query, ['Gallery', '/gallery', JSON.stringify(galleryContent)]);
    console.log(`Seeded: /gallery with ${galleryImages.length} images`);

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
    console.log('Gallery seeding completed!');
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
