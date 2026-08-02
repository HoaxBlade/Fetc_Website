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

// Helper function to escape CSV cell values containing commas, quotes, or newlines
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '';
  let str = val.toString().trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

async function exportLeads() {
  console.log('Connecting to PostgreSQL database to fetch leads...');
  try {
    const res = await pool.query('SELECT * FROM leads ORDER BY id ASC');
    const leads = res.rows;
    console.log(`Successfully fetched ${leads.length} leads.`);

    if (leads.length === 0) {
      console.log('No leads found in database.');
      await pool.end();
      return;
    }

    // CSV Headers matching the expectation of the new lead list uploader:
    const headers = [
      'First Name',
      'Last Name',
      'Gender',
      'Email',
      'Phone',
      'Service',
      'Location',
      'Address',
      'Status',
      'Date'
    ];

    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      // Split the single 'name' field into First Name and Last Name
      const nameParts = (lead.name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Unnamed';
      const lastName = nameParts.slice(1).join(' ') || '';

      const csvRow = [
        escapeCSV(firstName),
        escapeCSV(lastName),
        escapeCSV('Unknown'),
        escapeCSV(lead.email),
        escapeCSV(lead.phone),
        escapeCSV(lead.subject || lead.message || 'General Enquiry'),
        escapeCSV('Unknown'),
        escapeCSV('Unknown'),
        escapeCSV(lead.status || 'NEW'),
        escapeCSV(lead.created_at ? new Date(lead.created_at).toISOString() : '')
      ];

      csvRows.push(csvRow.join(','));
    }

    const exportPath = path.join(__dirname, 'leads_export.csv');
    fs.writeFileSync(exportPath, csvRows.join('\n'), 'utf-8');
    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: Created lead export CSV file!`);
    console.log(`📂 Location: ${exportPath}`);
    console.log('======================================================');
    console.log('You can now open this file or upload it directly');
    console.log('into your new Lead Management admin panel.');
  } catch (error) {
    console.error('An error occurred during export:', error);
  } finally {
    await pool.end();
  }
}

exportLeads();
