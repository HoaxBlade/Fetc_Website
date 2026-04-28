const { Pool } = require('pg');
require('dotenv').config();

// Force SSL bypass for cloud databases (like Supabase)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.Databse_POSTGRES_URL;

// Append sslmode=no-verify if not present in the URL
if (connectionString && !connectionString.includes('sslmode=')) {
  connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=no-verify';
}

const poolConfig = connectionString 
  ? { connectionString } 
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Successfully connected to PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
