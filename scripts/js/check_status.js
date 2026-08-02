const db = require('./server/db');

async function checkStatus() {
  try {
    const res = await db.query('SELECT slug, status FROM pages WHERE slug = $1', ['/']);
    console.log('Page Info:', res.rows[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkStatus();
