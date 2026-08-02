const db = require('./server/db');

async function checkContent() {
  try {
    const res = await db.query('SELECT content FROM pages WHERE slug = $1', ['/']);
    console.log('Page Content:', JSON.stringify(res.rows[0].content, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkContent();
