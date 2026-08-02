const db = require('./server/db');

async function setupPosts() {
  try {
    console.log("Checking for posts table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'DRAFT',
          author VARCHAR(255),
          category VARCHAR(100),
          image_url TEXT,
          excerpt TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Posts table ensured successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up posts table:", err);
    process.exit(1);
  }
}

setupPosts();
