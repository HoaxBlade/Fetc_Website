const db = require('./server/db');

async function checkSlugs() {
  try {
    const res = await db.query('SELECT slug FROM pages');
    console.log('Available Slugs:', res.rows.map(r => r.slug));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkSlugs();
