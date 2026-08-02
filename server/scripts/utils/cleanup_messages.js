const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false } }
    : { user: 'postgres', host: 'localhost', database: 'fetc_db', password: 'postgres', port: 5432 }
);

async function cleanup() {
  console.log('Cleaning up bulk-imported placeholder messages...');

  // Clear "Imported from Excel spreadsheet..." messages
  const r1 = await pool.query(
    "UPDATE leads SET message = NULL WHERE message LIKE 'Imported from Excel spreadsheet%'"
  );
  console.log(`✅ Cleared "Imported from Excel..." message from ${r1.rowCount} leads`);

  // Clear generic "General Inquiry" subjects that came from bulk import
  const r2 = await pool.query(
    "UPDATE leads SET subject = NULL WHERE subject = 'General Inquiry'"
  );
  console.log(`✅ Cleared generic "General Inquiry" subject from ${r2.rowCount} leads`);

  await pool.end();
  console.log('Done! Refresh your Leads Dashboard to see the changes.');
}

cleanup().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
