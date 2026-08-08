const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fetc_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function seedPartner() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        organization_name VARCHAR(255),
        organization_website VARCHAR(255),
        partnership_types JSONB,
        other_type_detail TEXT,
        organization_description TEXT,
        why_partner TEXT,
        preferred_communication VARCHAR(50),
        candidates_sent VARCHAR(100),
        additional_comments TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if Kingshuk Chatterjee already exists
    const check = await pool.query("SELECT * FROM partners WHERE email = 'kingshuk.chatterjee770@gmail.com'");
    if (check.rows.length > 0) {
      console.log('Kingshuk Chatterjee already exists in local DB:', check.rows[0]);
      return;
    }

    const result = await pool.query(`
      INSERT INTO partners (
        full_name, email, phone, organization_name, partnership_types, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [
      'Kingshuk Chatterjee',
      'kingshuk.chatterjee770@gmail.com',
      '09136074394',
      'nvidia',
      JSON.stringify(['Visitor Visa Services', 'Work Permit Services', 'Study Abroad Consultancy', 'English Language Teaching']),
      'pending',
      '2026-08-08 19:20:18'
    ]);

    console.log('✅ Successfully inserted Kingshuk Chatterjee into local DB:', result.rows[0]);
  } catch (err) {
    console.error('Error inserting partner:', err);
  } finally {
    pool.end();
  }
}

seedPartner();
