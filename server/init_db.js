const db = require('./db');
const bcrypt = require('bcrypt');

const initDb = async () => {
  try {
    // Read and Execute Schema
    const fs = require('fs');
    const path = require('path');
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await db.query(schema);
    console.log('Database schema applied successfully');

    // Insert Default Admin if not exists
    const adminEmail = 'fetc2026@gmail.com';
    const checkAdmin = await db.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (checkAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin@12345', 10);
      await db.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', adminEmail, hashedPassword, 'ADMIN', '9033347209']
      );
      console.log('Default Admin user created');
    }

    // Insert Default User if not exists
    const userEmail = 'user2026@gmail.com';
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [userEmail]);

    if (checkUser.rows.length === 0) {
      const hashedUserPassword = await bcrypt.hash('user@12345..', 10);
      await db.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)',
        ['Test User', userEmail, hashedUserPassword, 'USER', '9876543210']
      );
      console.log('Default Test User created');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initDb();
