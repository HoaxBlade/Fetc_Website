const db = require('./db');
const bcrypt = require('bcrypt');

const initDb = async () => {
  try {
    // Create Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table checked/created');

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
