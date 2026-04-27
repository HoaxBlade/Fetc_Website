const { Pool } = require('pg');

// Force-disable SSL certificate validation (Fix for Supabase/Vercel certificate chain error)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

const pool = new Pool(
  (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL)
    ? { 
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL,
        ssl: { rejectUnauthorized: false } 
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
