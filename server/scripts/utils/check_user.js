const db = require('../../db');

async function checkUser() {
  try {
    const result = await db.query("SELECT id, name, email, role, phone, bio, profile_image FROM users WHERE email = 'ranjanayush881@gmail.com'");
    console.log("User record in DB:", result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("Database query failed:", err);
    process.exit(1);
  }
}

checkUser();
