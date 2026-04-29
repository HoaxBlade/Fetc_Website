const db = require('./db');

async function migrate() {
    console.log('Starting migration...');
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS bio TEXT,
            ADD COLUMN IF NOT EXISTS profile_image TEXT;
        `);
        console.log('✅ Migration successful: Added bio and profile_image columns to users table.');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
