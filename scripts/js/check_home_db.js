const db = require('./server/db');

async function checkHome() {
  try {
    const res = await db.query('SELECT * FROM pages WHERE slug = $1', ['home']);
    if (res.rows.length === 0) {
      console.log('No home page found in database!');
    } else {
      console.log('Home Page Data:', JSON.stringify(res.rows[0], null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkHome();
