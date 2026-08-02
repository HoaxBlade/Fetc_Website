const { Client } = require('pg');
require('dotenv').config();

const createDb = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'fetc_db'`);
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE fetc_db');
      console.log('Database fetc_db created');
    } else {
      console.log('Database fetc_db already exists');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

createDb();
