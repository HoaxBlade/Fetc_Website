const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Force-disable SSL certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL;

const pool = new Pool(
  connectionString
    ? { 
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } 
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'fetc_db',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
      }
);

async function run() {
  console.log('Connecting to PostgreSQL database to import leads...');
  const jsonPath = path.join(__dirname, '..', 'src', 'leads_temp.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File not found at ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const leads = JSON.parse(rawData);
  console.log(`Found ${leads.length} leads in JSON file. Starting import...`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const lead of leads) {
    const firstName = (lead['First Name'] || '').toString().trim();
    const lastName = (lead['Last Name'] || '').toString().trim();
    const name = `${firstName} ${lastName}`.trim() || 'Unnamed';
    const email = (lead['Email'] || '').toString().trim().toLowerCase();
    const phone = (lead['Phone'] || '').toString().trim();
    const service = (lead['Service'] || '').toString().trim();
    const location = (lead['Location'] || '').toString().trim();
    const address = (lead['Address'] || '').toString().trim();
    const gender = (lead['Gender'] || '').toString().trim();
    
    // Status clean mapping
    let status = (lead['Status'] || '').toString().trim().toUpperCase();
    if (!['NEW', 'CONTACTED', 'CLOSED'].includes(status)) {
      status = 'NEW';
    }

    // Parse date safely
    let createdAt = new Date();
    if (lead['Date']) {
      const parsedDate = new Date(lead['Date']);
      if (!isNaN(parsedDate)) {
        createdAt = parsedDate;
      }
    }

    if (!email && !phone) {
      console.log(`Skipping invalid lead with no email and no phone: ${name}`);
      skippedCount++;
      continue;
    }

    try {
      // Check if lead already exists
      const checkRes = await pool.query(
        'SELECT id FROM leads WHERE (email = $1 AND email <> \'\') OR (phone = $2 AND phone <> \'\') LIMIT 1',
        [email, phone]
      );

      if (checkRes.rows.length > 0) {
        skippedCount++;
        continue;
      }

      // Insert lead
      await pool.query(
        `INSERT INTO leads (
          name, email, phone, subject, message, status, created_at,
          first_name, last_name, gender, location, address, service
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          name,
          email,
          phone,
          service || 'General Inquiry',
          `Imported from Excel spreadsheet - Service: ${service}`,
          status,
          createdAt,
          firstName,
          lastName,
          gender,
          location,
          address,
          service
        ]
      );
      insertedCount++;
    } catch (err) {
      console.error(`Failed to insert lead: ${name}. Error:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log(`🎉 IMPORT COMPLETE!`);
  console.log(`✅ Successfully Inserted: ${insertedCount} leads`);
  console.log(`⏭️ Skipped/Duplicates: ${skippedCount} leads`);
  console.log('======================================================');

  // Clean up the temp JSON file
  try {
    fs.unlinkSync(jsonPath);
    console.log(`Cleaned up temporary file: ${jsonPath}`);
  } catch (err) {
    console.warn(`Could not delete temp file:`, err.message);
  }

  await pool.end();
}

run().catch(err => {
  console.error('Fatal error running import:', err);
});
