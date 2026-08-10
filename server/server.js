const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const crypto = require('crypto');
const PORT = process.env.PORT || 5000;
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const whatsappService = require('./services/whatsappService');

const runMigrations = async () => {
  try {
    console.log('Running auto-migrations...');
    
    // Create users table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        phone VARCHAR(20),
        bio TEXT,
        profile_image TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Users updates
    await db.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;
    `);

    // Seed default admin if not exists
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

    // Seed default user if not exists
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

    // Doubts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS doubts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'OPEN',
        answer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Posts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content JSONB DEFAULT '{}',
        status TEXT DEFAULT 'DRAFT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Leads table
    await db.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT,
        status VARCHAR(20) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add stage fields to leads table to fully support the 3-stage funnel
    await db.query(`
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS middle_name VARCHAR(255);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS location VARCHAR(100);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255);
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS emergency_contact_relation VARCHAR(100);
    `).catch(() => {}); // Catch in case of syntax or other minor execution errors, but we'll do individual columns below:
    
    // Let's run individual ADD COLUMN statements safely so that failure of one column does not block others:
    const columnsToAdd = [
      ['first_name', 'VARCHAR(255)'],
      ['middle_name', 'VARCHAR(255)'],
      ['last_name', 'VARCHAR(255)'],
      ['dob', 'DATE'],
      ['gender', 'VARCHAR(50)'],
      ['location', 'VARCHAR(100)'],
      ['address', 'TEXT'],
      ['emergency_contact_name', 'VARCHAR(255)'],
      ['emergency_contact_phone', 'VARCHAR(50)'],
      ['emergency_contact_relation', 'VARCHAR(100)'],
      ['service', 'VARCHAR(100)'],
      ['country', 'VARCHAR(255)'],
      ['program', 'VARCHAR(255)'],
      ['visa_rejection', 'VARCHAR(50)'],
      ['travel_history', 'VARCHAR(50)'],
      ['exam_type', 'VARCHAR(100)'],
      ['ebd', 'DATE'],
      ['anyspecificlocation', 'TEXT'],
      ['payment', 'VARCHAR(100)']
    ];

    for (const [col, type] of columnsToAdd) {
      try {
        await db.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS ${col} ${type};`);
      } catch (colErr) {
        console.warn(`Could not add column ${col} to leads:`, colErr.message);
      }
    }

    // Create lead_documents table for premium file status tracking
    await db.query(`
      CREATE TABLE IF NOT EXISTS lead_documents (
        id SERIAL PRIMARY KEY,
        lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (lead_id, document_type)
      );
    `);


    // Tickets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'MEDIUM',
        status VARCHAR(20) DEFAULT 'OPEN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // News Flash table
    await db.query(`
      CREATE TABLE IF NOT EXISTS news_flash (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        link VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'DRAFT',
        seo_title VARCHAR(255),
        seo_description TEXT,
        content JSONB DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Interactive Guides tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS interactive_guides (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS guide_pages (
        id SERIAL PRIMARY KEY,
        guide_id INTEGER REFERENCES interactive_guides(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        page_number INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Partners table
    await db.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        organization_name VARCHAR(255),
        organization_website VARCHAR(255),
        partnership_types JSONB,
        other_type_detail TEXT,
        organization_description TEXT,
        why_partner TEXT,
        preferred_communication VARCHAR(50),
        candidates_sent VARCHAR(100),
        additional_comments TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    // Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        merchant_transaction_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(100),
        course_id VARCHAR(100),
        product_type VARCHAR(100),
        amount INT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        return_url VARCHAR(1000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_url VARCHAR(1000);
    `).catch(() => {});

    // Invoices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_no VARCHAR(100) UNIQUE NOT NULL,
        invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
        payment_method VARCHAR(100) DEFAULT 'Cash',
        upi_ref VARCHAR(255),
        bill_to JSONB NOT NULL,
        items JSONB NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        sgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        cgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_no VARCHAR(100);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT CURRENT_DATE;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'Cash';
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS upi_ref VARCHAR(255);
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS bill_to JSONB DEFAULT '{}';
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0.00;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sgst DECIMAL(10, 2) DEFAULT 0.00;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cgst DECIMAL(10, 2) DEFAULT 0.00;
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0.00;
    `).catch(() => {});

    // Courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        course_id VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'Exam Prep',
        price DECIMAL(10, 2) DEFAULT 0.00,
        duration VARCHAR(100) DEFAULT '4 Weeks',
        level VARCHAR(50) DEFAULT 'Intermediate',
        status VARCHAR(50) DEFAULT 'ACTIVE',
        students_count INT DEFAULT 0,
        thumbnail VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    // News Articles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        source VARCHAR(100) DEFAULT 'FETC News',
        date VARCHAR(50),
        image_url TEXT,
        category VARCHAR(100) DEFAULT 'General',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    // Student Reviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_reviews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        university VARCHAR(255),
        score VARCHAR(50),
        quote TEXT NOT NULL,
        image_url TEXT,
        visa_image TEXT,
        country VARCHAR(100),
        program VARCHAR(100),
        rating INT DEFAULT 5,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    // Mock Tests table
    await db.query(`
      CREATE TABLE IF NOT EXISTS mock_tests (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(50) DEFAULT '₹49',
        status VARCHAR(50) DEFAULT 'Published',
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE mock_tests ADD COLUMN IF NOT EXISTS content TEXT;
      ALTER TABLE mock_tests ADD COLUMN IF NOT EXISTS image_url TEXT;
    `).catch(() => {});

    // Seed default mock tests if table is empty
    try {
      const checkMocks = await db.query('SELECT COUNT(*) FROM mock_tests');
      if (parseInt(checkMocks.rows[0].count) === 0) {
        const defaultMocks = [
          ['SELT (Secure English Language Test)', '₹49', 'Published', 'Official mock exam for UKVI, study, work, and immigration requirements.', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'],
          ['IELTS Academic & General Training', '₹49', 'Published', 'Complete practice tests for Listening, Reading, Writing, and Speaking modules.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60'],
          ['TOEFL iBT Practice', '₹49', 'Published', 'Full-length internet-based tests modeled directly on the ETS syllabus.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'],
          ['PTE Academic Exam Prep', '₹49', 'Published', 'AI-scored simulated exams aligned with official Pearson guidelines.', 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=800&auto=format&fit=crop&q=60'],
          ['SAT Prep Simulators', '₹49', 'Published', 'Adaptive testing pattern mirroring the digital Scholastic Assessment Test.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60'],
          ['GMAT Focus Edition Mock', '₹49', 'Published', 'Quantitative Reasoning, Verbal Reasoning, and Data Insights simulators.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60'],
          ['GRE General Test Simulator', '₹49', 'Published', 'Analytical Writing, Verbal Reasoning, and Quantitative Reasoning sections.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60'],
          ['Pearson Versant Test Simulator', '₹499', 'Published', 'Simulated speaking and writing assessment with auto-scoring metrics.', 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop&q=60']
        ];
        for (const [mTitle, mPrice, mStatus, mContent, mImg] of defaultMocks) {
          await db.query(
            'INSERT INTO mock_tests (title, price, status, content, image_url) VALUES ($1, $2, $3, $4, $5)',
            [mTitle, mPrice, mStatus, mContent, mImg]
          );
        }
        console.log('Default mock tests seeded into DB');
      }
    } catch (seedErr) {
      console.warn('Mock tests seeding warning:', seedErr.message);
    }

    console.log('✅ All migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration error:', err);
  }
};
runMigrations();

app.use(cors({
  origin: '*', // Allow all origins
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log('Body:', req.body);
  }
  next();
});

// Transporter for Email (Configure as needed)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

console.log('Email configured:', process.env.EMAIL_USER ? 'YES' : 'NO');

// Create uploads folder if it doesn't exist (Gracefully handle read-only filesystems like Vercel)
const uploadDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️ Could not create uploads directory (expected on Vercel):', err.message);
}

// Static folder for uploaded images with CORS enabled
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, ngrok-skip-browser-warning');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir));

// Static folder for project assets (fallback)
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'fetc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp)$/i.test(file.originalname)) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed!'));
  }
});

// Photo Upload Routes with graceful error handling
app.post('/api/admin/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });
});

app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  });
});

// Health Check
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'FETC Local Backend with PostgreSQL is running',
    timestamp: new Date().toISOString()
  });
});

// Real Signup Route
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if user already exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, 'USER', phone]
    );

    // Trigger Cheerio AI Workflow for signup
    await triggerCheerioWorkflow({
      name,
      email,
      phone,
      subject: 'New User Signup',
      message: `A new user account was registered with email: ${email} and phone: ${phone || 'N/A'}`
    });

    res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Error creating account' });
  }
});

// Real Auth Route with PostgreSQL
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          created_at: user.created_at,
          profile_image: user.profile_image
        },
        token: "mock-jwt-token-fetc-" + user.id // We will add real JWT later
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server database error' });
  }
});

// User Profile Update Route
app.patch('/api/users/profile/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    let identifierQuery = 'id = $1';
    let identifierParam = parseInt(id);

    if (isNaN(identifierParam) && id.includes('@')) {
      identifierQuery = 'email = $1';
      identifierParam = id;
    } else if (isNaN(identifierParam)) {
      return res.status(400).json({ success: false, message: 'Invalid user identifier' });
    }

    const fields = [];
    const values = [identifierParam]; // $1 is the identifier
    let index = 2;

    const allowedFields = ['name', 'phone', 'bio', 'profile_image', 'profile_details'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields.push(`${field} = $${index}`);
        // If field is profile_details, make sure it's saved as object/JSON string/JSONB
        if (field === 'profile_details') {
          values.push(typeof req.body[field] === 'string' ? req.body[field] : JSON.stringify(req.body[field]));
        } else {
          values.push(req.body[field]);
        }
        index++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const queryText = `UPDATE users SET ${fields.join(', ')} WHERE ${identifierQuery} RETURNING id, name, email, role, phone, bio, created_at, profile_image, profile_details`;

    const result = await db.query(queryText, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET User Profile Route
app.get('/api/users/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let result;
    if (isNaN(parseInt(id)) && id.includes('@')) {
      result = await db.query(
        'SELECT id, name, email, role, phone, bio, created_at, profile_image, profile_details FROM users WHERE email = $1',
        [id]
      );
    } else if (isNaN(parseInt(id))) {
      return res.status(400).json({ success: false, message: 'Invalid user identifier' });
    } else {
      result = await db.query(
        'SELECT id, name, email, role, phone, bio, created_at, profile_image, profile_details FROM users WHERE id = $1',
        [parseInt(id)]
      );
    }
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Error handling for the pool
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// Admin Stats Route
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Total Users
    const totalUsersResult = await db.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Growth Calculation: Today vs Yesterday (last 24h vs previous 24h)
    const recentUsersResult = await db.query(
      "SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours'"
    );
    const previousUsersResult = await db.query(
      "SELECT COUNT(*) FROM users WHERE created_at BETWEEN NOW() - INTERVAL '48 hours' AND NOW() - INTERVAL '24 hours'"
    );

    const recentCount = parseInt(recentUsersResult.rows[0].count);
    const previousCount = parseInt(previousUsersResult.rows[0].count);

    // Calculate growth percentage
    let growth = 0;
    if (previousCount === 0) {
      growth = recentCount > 0 ? 100 : 0; // If yesterday was 0 and today is > 0, it's 100% growth
    } else {
      growth = Math.round(((recentCount - previousCount) / previousCount) * 100);
    }
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        userGrowth: (growth >= 0 ? "+" : "") + growth + "%",
        todaySales: "₹0.00",
        salesGrowth: "0%",
        todayOrders: 0,
        ordersGrowth: "0%"
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// Admin Users List Route
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db.query('SELECT id, name, email, role, phone, status, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users: users.rows });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Admin Invite User Route
app.post('/api/admin/users/invite', async (req, res) => {
  const { name, email, role, phone } = req.body;

  try {
    // 1. Check if user already exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 2. Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Insert user into database
    await db.query(
      'INSERT INTO users (name, email, password, role, phone, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, hashedPassword, role, phone, 'ACTIVE']
    );

    // 4. Send Email
    const mailOptions = {
      from: `"FETC Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to FETC - Your Admin Invitation',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 24px;">
          <h2 style="color: #0f172a;">Welcome to FETC, ${name}!</h2>
          <p style="color: #64748b;">You have been invited to join the FETC administration panel as a <strong>${role}</strong>.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Your temporary credentials:</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #0f172a;">Password: <span style="background: #ffffff; padding: 4px 10px; border: 1px solid #e2e8f0; border-radius: 6px;">${tempPassword}</span></p>
          </div>
          <p style="color: #64748b;">Please log in using your email and this temporary password, then change it immediately from your profile settings.</p>
          <a href="${req.protocol}://${req.get('host')}/login" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">Log In Now</a>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">This is an automated invitation from Foreign English Test Capital (FETC).</p>
        </div>
      `,
    };

    // Attempt to send email but don't fail the whole request if it fails (unless user has configured it)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Invitation email sent successfully to ${email}`);
      } else {
        console.warn(`⚠️ EMAIL_USER/PASS not set. Invitation created, but email not sent. Temp Pass: ${tempPassword}`);
      }
    } catch (mailErr) {
      console.error('❌ Failed to send invitation email:', mailErr.message);
      // We still return success:true because the user was created in the DB
    }

    // Trigger Cheerio AI Workflow for admin user invitation
    await triggerCheerioWorkflow({
      name,
      email,
      phone,
      subject: 'New User Invitation (Admin)',
      message: `Admin invited a user with role: ${role || 'N/A'}`
    });

    res.status(201).json({ success: true, message: 'User invited and account created!' });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ success: false, message: 'Error inviting user' });
  }
});

// Admin Update User Route
app.patch('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;
  
  try {
    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role) WHERE id = $5 RETURNING id, name, email, role, phone, status, created_at',
      [name, email, phone, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0], message: 'User updated successfully' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

// Admin Delete User Route
app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Optional: Add check to prevent deleting yourself if auth is set up
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

// Admin Leads List Route
app.get('/api/admin/leads', async (req, res) => {
  try {
    const leads = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ success: true, leads: leads.rows });
  } catch (err) {
    console.error('Fetch leads error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Update Lead Status
app.patch('/api/admin/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json({ success: true, lead: result.rows[0] });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Delete Lead
app.delete('/api/admin/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM leads WHERE id = $1', [id]);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Start of Three-Stage Lead Funnel API (/api/v1/lead) ---

// Utility functions to map camelCase (frontend) and snake_case (database)
const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  const n = {};
  Object.keys(obj).forEach(k => {
    // Map database ID key to _id for frontend compatibility
    const ck = k === 'id' ? '_id' : k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    n[ck] = snakeToCamel(obj[k]);
  });
  return n;
};

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  const n = {};
  Object.keys(obj).forEach(k => {
    // Map _id from frontend back to id for DB queries
    const sk = k === '_id' ? 'id' : k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    n[sk] = camelToSnake(obj[k]);
  });
  return n;
};

const triggerCheerioWorkflow = async (lead) => {
  const triggerUrl = process.env.CHEERIO_TRIGGER_URL;
  const apiKey = process.env.API_KEY;

  if (!triggerUrl) {
    console.warn('[Cheerio AI] Warning: CHEERIO_TRIGGER_URL is not configured in .env file.');
    return;
  }

  try {
    const payload = {
      name: lead.name || 'Unnamed Lead',
      email: lead.email || '',
      phone: lead.phone || '',
      subject: lead.subject || 'New Web Enquiry',
      message: lead.message || ''
    };

    console.log('[Cheerio AI] Triggering workflow automation with payload:', payload);

    const headers = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(triggerUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      console.error(`[Cheerio AI] HTTP Error response (${response.status}): ${responseText}`);
    } else {
      console.log('[Cheerio AI] Workflow triggered successfully.');
    }
  } catch (err) {
    console.error('[Cheerio AI] Error triggering workflow:', err);
  }
};

// GET /api/v1/lead/allleads - Get all leads with their documents populated
app.get('/api/v1/lead/allleads', async (req, res) => {
  try {
    const leadsRes = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
    const leads = leadsRes.rows;
    
    // For each lead, fetch their documents
    const populatedLeads = [];
    for (const lead of leads) {
      const docsRes = await db.query('SELECT * FROM lead_documents WHERE lead_id = $1', [lead.id]);
      const docs = docsRes.rows;
      
      const docMap = {};
      docs.forEach(doc => {
        docMap[doc.document_type] = doc.file_path;
      });

      const formattedLead = {
        ...lead,
        ...docMap,
        documents: docs
      };
      
      populatedLeads.push(snakeToCamel(formattedLead));
    }
    
    res.json({ success: true, leads: populatedLeads });
  } catch (err) {
    console.error('Fetch all leads v1 error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching leads' });
  }
});

// GET /api/v1/lead/:id - Get a single lead with their documents
app.get('/api/v1/lead/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const leadRes = await db.query('SELECT * FROM leads WHERE id = $1', [parseInt(id)]);
    if (leadRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    const lead = leadRes.rows[0];

    // If first_name is empty but name exists, derive first_name/middle_name/last_name
    if ((!lead.first_name || !lead.first_name.trim()) && lead.name && lead.name.trim()) {
      const parts = lead.name.trim().split(/\s+/);
      if (parts.length === 1) {
        lead.first_name = parts[0];
      } else if (parts.length === 2) {
        lead.first_name = parts[0];
        lead.last_name = parts[1];
      } else if (parts.length >= 3) {
        lead.first_name = parts[0];
        lead.middle_name = parts.slice(1, -1).join(' ');
        lead.last_name = parts[parts.length - 1];
      }
    }

    const docsRes = await db.query('SELECT * FROM lead_documents WHERE lead_id = $1', [lead.id]);
    const docs = docsRes.rows;
    
    const docMap = {};
    docs.forEach(doc => {
      docMap[doc.document_type] = doc.file_path;
    });

    const formattedLead = {
      ...lead,
      ...docMap,
      documents: docs
    };
    
    res.json(snakeToCamel(formattedLead));
  } catch (err) {
    console.error('Fetch single lead v1 error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching lead' });
  }
});

// GET /api/v1/lead/email/:email - Get a single lead by email with their documents
app.get('/api/v1/lead/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const leadRes = await db.query('SELECT * FROM leads WHERE email = $1', [email]);
    if (leadRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    const lead = leadRes.rows[0];

    if ((!lead.first_name || !lead.first_name.trim()) && lead.name && lead.name.trim()) {
      const parts = lead.name.trim().split(/\s+/);
      if (parts.length === 1) {
        lead.first_name = parts[0];
      } else if (parts.length === 2) {
        lead.first_name = parts[0];
        lead.last_name = parts[1];
      } else if (parts.length >= 3) {
        lead.first_name = parts[0];
        lead.middle_name = parts.slice(1, -1).join(' ');
        lead.last_name = parts[parts.length - 1];
      }
    }

    const docsRes = await db.query('SELECT * FROM lead_documents WHERE lead_id = $1', [lead.id]);
    const docs = docsRes.rows;
    
    const docMap = {};
    docs.forEach(doc => {
      docMap[doc.document_type] = doc.file_path;
    });

    const formattedLead = {
      ...lead,
      ...docMap,
      documents: docs
    };
    
    res.json(snakeToCamel(formattedLead));
  } catch (err) {
    console.error('Fetch single lead by email error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching lead by email' });
  }
});

// POST /api/v1/lead/create - Create new lead
app.post('/api/v1/lead/create', async (req, res) => {
  try {
    const rawBody = req.body;
    console.log("RAW BODY RECEIVED:", rawBody);
    const body = camelToSnake(rawBody);
    console.log("SNAKE BODY:", body);

    // Legacy support: concatenate name if missing but first/last exist
    let legacyName = body.name || '';
    if (!legacyName && (body.first_name || body.last_name)) {
      legacyName = `${body.first_name || ''} ${body.last_name || ''}`.trim();
    }
    if (!legacyName) legacyName = 'Unnamed Lead';
    body.name = legacyName;

    const columns = [
      'name', 'email', 'phone', 'first_name', 'middle_name', 'last_name', 
      'dob', 'gender', 'location', 'address', 'emergency_contact_name', 
      'emergency_contact_phone', 'emergency_contact_relation', 'service', 
      'country', 'program', 'visa_rejection', 'travel_history', 'exam_type', 
      'ebd', 'anyspecificlocation', 'payment', 'status'
    ];

    const vals = [];
    const placeholders = [];
    let idx = 1;

    columns.forEach(col => {
      let val = body[col];
      // Normalize empty strings to null or defaults
      if (val === '') val = null;
      if (col === 'status' && !val) val = 'NEW';
      vals.push(val);
      placeholders.push(`$${idx}`);
      idx++;
    });

    const query = `
      INSERT INTO leads (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await db.query(query, vals);
    const newLead = result.rows[0];

    // If documents are included in the body, insert them
    const docKeys = Object.keys(rawBody).filter(k => 
      !['firstName', 'middleName', 'lastName', 'dob', 'gender', 'email', 
        'phone', 'location', 'address', 'emergencyContactName', 
        'emergencyContactPhone', 'emergencyContactRelation', 'service', 
        'country', 'program', 'visaRejection', 'travelHistory', 'examType', 
        'ebd', 'anyspecificlocation', 'payment', 'status', 'id', '_id', 'stage', 'isFinal', 'isFinalized'].includes(k) 
      && typeof rawBody[k] === 'string' && rawBody[k].startsWith('http')
    );

    for (const docKey of docKeys) {
      const fileUrl = rawBody[docKey];
      const fileName = fileUrl.split('/').pop() || 'uploaded-file';
      await db.query(`
        INSERT INTO lead_documents (lead_id, file_name, file_path, document_type, status)
        VALUES ($1, $2, $3, $4, 'Pending')
        ON CONFLICT (lead_id, document_type) 
        DO UPDATE SET file_name = EXCLUDED.file_name, file_path = EXCLUDED.file_path, status = 'Pending', updated_at = CURRENT_TIMESTAMP
      `, [newLead.id, fileName, fileUrl, docKey]);
    }

    // Return the new lead populated with documents
    const docsRes = await db.query('SELECT * FROM lead_documents WHERE lead_id = $1', [newLead.id]);
    const docs = docsRes.rows;
    
    const docMap = {};
    docs.forEach(doc => {
      docMap[doc.document_type] = doc.file_path;
    });

    const finalLead = {
      ...newLead,
      ...docMap,
      documents: docs
    };

    // Trigger Cheerio AI Workflow (except for Career Assessment)
    if (newLead.subject !== 'Career Assessment Inquiry') {
      await triggerCheerioWorkflow(newLead);
    }

    // Send email notification to info@fetc.in
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Compile document links
        let docsHtml = '';
        if (docs.length > 0) {
          docsHtml = docs.map(doc => {
            const label = doc.document_type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return `<li><strong>${label}:</strong> <a href="${doc.file_path}">${doc.file_name}</a></li>`;
          }).join('');
        } else {
          docsHtml = '<li>No documents uploaded.</li>';
        }

        const mailOptions = {
          from: `"FETC System" <${process.env.EMAIL_USER}>`,
          to: 'info@fetc.in',
          subject: `New Lead Registration: ${finalLead.name || 'Unnamed'}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Lead Submitted</h2>
              
              <h3 style="color: #1e293b; margin-top: 20px;">1. General Details</h3>
              <ul style="color: #334155; line-height: 1.6;">
                <li><strong>Name:</strong> ${finalLead.name || 'N/A'}</li>
                <li><strong>Email:</strong> ${finalLead.email || 'N/A'}</li>
                <li><strong>Phone:</strong> ${finalLead.phone || 'N/A'}</li>
                <li><strong>Date of Birth:</strong> ${finalLead.dob ? new Date(finalLead.dob).toLocaleDateString() : 'N/A'}</li>
                <li><strong>Gender:</strong> ${finalLead.gender || 'N/A'}</li>
                <li><strong>Location:</strong> ${finalLead.location || 'N/A'}</li>
                <li><strong>Address:</strong> ${finalLead.address || 'N/A'}</li>
                <li><strong>Emergency Contact Name:</strong> ${finalLead.emergency_contact_name || 'N/A'}</li>
                <li><strong>Emergency Contact Relation:</strong> ${finalLead.emergency_contact_relation || 'N/A'}</li>
                <li><strong>Emergency Contact Phone:</strong> ${finalLead.emergency_contact_phone || 'N/A'}</li>
              </ul>
              
              <h3 style="color: #1e293b; margin-top: 20px;">2. Test Scores</h3>
              <ul style="color: #334155; line-height: 1.6;">
                <li><strong>Exam Type:</strong> ${finalLead.exam_type || 'N/A'}</li>
                <li><strong>Exam Booking Date (EBD):</strong> ${finalLead.ebd ? new Date(finalLead.ebd).toLocaleDateString() : 'N/A'}</li>
                <li><strong>Specific Location Preference:</strong> ${finalLead.anyspecificlocation || 'N/A'}</li>
              </ul>
              
              <h3 style="color: #1e293b; margin-top: 20px;">3. Academics & Enrollment</h3>
              <ul style="color: #334155; line-height: 1.6;">
                <li><strong>Requested Service:</strong> ${finalLead.service || 'N/A'}</li>
                <li><strong>Preferred Country:</strong> ${finalLead.country || 'N/A'}</li>
                <li><strong>Preferred Program:</strong> ${finalLead.program || 'N/A'}</li>
                <li><strong>Visa Rejection History:</strong> ${finalLead.visa_rejection || 'N/A'}</li>
                <li><strong>Travel History:</strong> ${finalLead.travel_history || 'N/A'}</li>
                <li><strong>Payment Method:</strong> ${finalLead.payment || 'N/A'}</li>
              </ul>
              
              <h3 style="color: #1e293b; margin-top: 20px;">4. Academic & Supporting Documents</h3>
              <ul style="color: #334155; line-height: 1.6;">
                ${docsHtml}
              </ul>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">This is an automated notification from Foreign English Test Capital (FETC).</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Lead notification email sent to info@fetc.in`);
      } else {
        console.warn(`⚠️ EMAIL_USER/PASS not set. Lead email notification skipped.`);
      }
    } catch (mailErr) {
      console.error('❌ Failed to send lead notification email:', mailErr.message);
    }

    // Trigger WhatsApp welcome message if phone exists
    if (finalLead.phone) {
      try {
        await whatsappService.sendWelcomeTemplate(finalLead.phone, finalLead.first_name || finalLead.name || 'Student');
      } catch (waErr) {
        console.error('❌ Failed to trigger welcome WhatsApp message:', waErr.message);
      }
    }

    res.status(201).json({ success: true, data: snakeToCamel(finalLead) });
  } catch (err) {
    console.error('Create lead v1 error:', err);
    res.status(500).json({ success: false, message: 'Server error creating lead: ' + err.message });
  }
});

// PUT /api/v1/lead/:id - Update lead details (camelCase body)
app.put('/api/v1/lead/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rawBody = req.body;
    const body = camelToSnake(rawBody);

    const leadId = parseInt(id);

    // Legacy support: concatenate name if missing but first/last exist
    let legacyName = body.name;
    if (!legacyName && (body.first_name || body.last_name)) {
      legacyName = `${body.first_name || ''} ${body.last_name || ''}`.trim();
    }

    const updateFields = [];
    const vals = [leadId];
    let idx = 2;

    const allowedColumns = [
      'name', 'email', 'phone', 'first_name', 'middle_name', 'last_name', 
      'dob', 'gender', 'location', 'address', 'emergency_contact_name', 
      'emergency_contact_phone', 'emergency_contact_relation', 'service', 
      'country', 'program', 'visa_rejection', 'travel_history', 'exam_type', 
      'ebd', 'anyspecificlocation', 'payment', 'status'
    ];

    allowedColumns.forEach(col => {
      let val = body[col];
      if (col === 'name' && legacyName !== undefined) val = legacyName;
      if (val !== undefined) {
        if (val === '') val = null;
        updateFields.push(`${col} = $${idx}`);
        vals.push(val);
        idx++;
      }
    });

    if (updateFields.length > 0) {
      const query = `
        UPDATE leads 
        SET ${updateFields.join(', ')} 
        WHERE id = $1
      `;
      await db.query(query, vals);
    }

    // Process any file slot updates included in body
    const docKeys = Object.keys(rawBody).filter(k => 
      !['firstName', 'middleName', 'lastName', 'dob', 'gender', 'email', 
        'phone', 'location', 'address', 'emergencyContactName', 
        'emergencyContactPhone', 'emergencyContactRelation', 'service', 
        'country', 'program', 'visaRejection', 'travelHistory', 'examType', 
        'ebd', 'anyspecificlocation', 'payment', 'status', 'id', '_id', 'stage', 'isFinal', 'isFinalized', 'documents'].includes(k) 
      && typeof rawBody[k] === 'string' && rawBody[k].startsWith('http')
    );

    for (const docKey of docKeys) {
      const fileUrl = rawBody[docKey];
      const fileName = fileUrl.split('/').pop() || 'uploaded-file';
      await db.query(`
        INSERT INTO lead_documents (lead_id, file_name, file_path, document_type, status)
        VALUES ($1, $2, $3, $4, 'Pending')
        ON CONFLICT (lead_id, document_type) 
        DO UPDATE SET file_name = EXCLUDED.file_name, file_path = EXCLUDED.file_path, status = 'Pending', updated_at = CURRENT_TIMESTAMP
      `, [leadId, fileName, fileUrl, docKey]);
    }

    // Return the updated lead populated with documents
    const leadRes = await db.query('SELECT * FROM leads WHERE id = $1', [leadId]);
    const updatedLead = leadRes.rows[0];

    const docsRes = await db.query('SELECT * FROM lead_documents WHERE lead_id = $1', [leadId]);
    const docs = docsRes.rows;
    
    const docMap = {};
    docs.forEach(doc => {
      docMap[doc.document_type] = doc.file_path;
    });

    const finalLead = {
      ...updatedLead,
      ...docMap,
      documents: docs
    };

    res.json({ success: true, data: snakeToCamel(finalLead) });
  } catch (err) {
    console.error('Update lead v1 error:', err);
    res.status(500).json({ success: false, message: 'Server error updating lead: ' + err.message });
  }
});

// DELETE /api/v1/lead/:id - Delete lead and all cascading documents
app.delete('/api/v1/lead/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead and associated documents deleted successfully' });
  } catch (err) {
    console.error('Delete lead v1 error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting lead' });
  }
});

// POST /api/v1/lead/single - Dynamic Multer file upload (accepts any file type up to 50MB)
// Setup storage and limits dynamically for leads
const leadMulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'fetc-doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const leadMulterUpload = multer({
  storage: leadMulterStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpeg|jpg|png|webp|gif|mp4|mp3/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Allowed extensions: PDF, JPEG, PNG, WebP, GIF, MP4, MP3!"));
  }
});

app.post('/api/v1/lead/single', leadMulterUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl });
});

// POST /api/v1/lead/upload-bulk - Bulk insert leads with duplicate prevention
app.post('/api/v1/lead/upload-bulk', async (req, res) => {
  const { leads } = req.body;
  if (!Array.isArray(leads)) {
    return res.status(400).json({ success: false, message: 'Invalid bulk data' });
  }

  let createdCount = 0;
  try {
    for (const rawLead of leads) {
      const lead = camelToSnake(rawLead);
      
      // Duplicate check (by email and phone)
      const dupCheck = await db.query(
        'SELECT id FROM leads WHERE (email = $1 AND email != \'\') OR (phone = $2 AND phone != \'\')', 
        [lead.email, lead.phone]
      );
      if (dupCheck.rows.length > 0) {
        continue; // skip duplicate
      }

      // Legacy support name concatenate
      let legacyName = lead.name || '';
      if (!legacyName && (lead.first_name || lead.last_name)) {
        legacyName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
      }
      if (!legacyName) legacyName = 'Unnamed Lead';

      const columns = [
        'name', 'email', 'phone', 'first_name', 'middle_name', 'last_name', 
        'dob', 'gender', 'location', 'address', 'status', 'created_at', 'service'
      ];
      
      const vals = [];
      const placeholders = [];
      let idx = 1;

      columns.forEach(col => {
        let val = lead[col];
        if (val === '') val = null;
        if (col === 'name') val = legacyName;
        if (col === 'status' && !val) val = 'NEW';
        vals.push(val);
        placeholders.push(`$${idx}`);
        idx++;
      });

      await db.query(`
        INSERT INTO leads (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
      `, vals);

      createdCount++;
    }

    res.json({ success: true, created: createdCount });
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(500).json({ success: false, message: 'Server bulk upload error: ' + err.message });
  }
});

// PATCH /api/v1/lead/:leadId/documents/:documentType/status - Admin status update
app.patch('/api/v1/lead/:leadId/documents/:documentType/status', async (req, res) => {
  const { leadId, documentType } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(`
      UPDATE lead_documents 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE lead_id = $2 AND document_type = $3 
      RETURNING *
    `, [status, parseInt(leadId), documentType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, document: snakeToCamel(result.rows[0]) });
  } catch (err) {
    console.error('Update doc status error:', err);
    res.status(500).json({ success: false, message: 'Server error updating document status' });
  }
});

// POST /api/v1/lead/:leadId/documents/:documentType/upload - Direct slot upload and replacement
app.post('/api/v1/lead/:leadId/documents/:documentType/upload', leadMulterUpload.single('file'), async (req, res) => {
  const { leadId, documentType } = req.params;
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const fileName = req.file.originalname;

  try {
    const result = await db.query(`
      INSERT INTO lead_documents (lead_id, file_name, file_path, document_type, status)
      VALUES ($1, $2, $3, $4, 'Pending')
      ON CONFLICT (lead_id, document_type) 
      DO UPDATE SET file_name = EXCLUDED.file_name, file_path = EXCLUDED.file_path, status = 'Pending', updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [parseInt(leadId), fileName, fileUrl, documentType]);

    res.json({ success: true, fileUrl, document: snakeToCamel(result.rows[0]) });
  } catch (err) {
    console.error('Direct slot upload error:', err);
    res.status(500).json({ success: false, message: 'Server error saving uploaded file' });
  }
});

// --- End of Three-Stage Lead Funnel API ---

// Lead Capture Route (Public)
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, subject, message, userId, gender, location } = req.body;
  try {
    // 1. Create Lead
    const leadResult = await db.query(
      'INSERT INTO leads (name, email, phone, subject, message, gender, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, subject, message, gender || null, location || null]
    );

    // 2. Create Ticket (Dual entry as requested)
    await db.query(
      'INSERT INTO tickets (user_id, name, email, subject, message, priority) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId || null, name, email, subject, message, 'HIGH']
    );

    // 3. Trigger Cheerio AI Workflow (except for Career Assessment)
    if (subject !== 'Career Assessment Inquiry') {
      await triggerCheerioWorkflow(leadResult.rows[0]);
    }

    res.json({ success: true, lead: leadResult.rows[0] });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/partners - Save partner form application
app.post('/api/partners', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    organizationName,
    organizationWebsite,
    partnershipTypes,
    otherTypeDetail,
    organizationDescription,
    whyPartner,
    preferredCommunication,
    candidatesSent,
    additionalComments
  } = req.body;

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        organization_name VARCHAR(255),
        organization_website VARCHAR(255),
        partnership_types JSONB,
        other_type_detail TEXT,
        organization_description TEXT,
        why_partner TEXT,
        preferred_communication VARCHAR(50),
        candidates_sent VARCHAR(100),
        additional_comments TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await db.query(
      `INSERT INTO partners (
        full_name, email, phone, organization_name, organization_website,
        partnership_types, other_type_detail, organization_description, why_partner,
        preferred_communication, candidates_sent, additional_comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        fullName,
        email,
        phone,
        organizationName || null,
        organizationWebsite || null,
        JSON.stringify(partnershipTypes || []),
        otherTypeDetail || null,
        organizationDescription || null,
        whyPartner || null,
        preferredCommunication || 'Email',
        candidatesSent || null,
        additionalComments || null
      ]
    );

    res.status(201).json({ success: true, partner: result.rows[0] });
  } catch (err) {
    console.error('Save partner inquiry error:', err);
    res.status(500).json({ success: false, message: 'Database error saving partner application' });
  }
});

// GET /api/partners - Fetch all partners for admin
app.get('/api/partners', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        organization_name VARCHAR(255),
        organization_website VARCHAR(255),
        partnership_types JSONB,
        other_type_detail TEXT,
        organization_description TEXT,
        why_partner TEXT,
        preferred_communication VARCHAR(50),
        candidates_sent VARCHAR(100),
        additional_comments TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const result = await db.query('SELECT * FROM partners ORDER BY created_at DESC');
    res.json({ success: true, partners: result.rows });
  } catch (err) {
    console.error('Fetch partners error:', err);
    res.status(500).json({ success: false, message: 'Database error fetching partners' });
  }
});

// DELETE /api/partners/:id - Delete partner application
app.delete('/api/partners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM partners WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Partner application not found' });
    }
    res.json({ success: true, message: 'Partner application deleted successfully' });
  } catch (err) {
    console.error('Delete partner error:', err);
    res.status(500).json({ success: false, message: 'Database error deleting partner' });
  }
});

// PATCH /api/partners/:id/status - Update partner application status
app.patch('/api/partners/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE partners SET status = $1 WHERE id = $2 RETURNING *',
      [status, parseInt(id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Partner application not found' });
    }
    res.json({ success: true, partner: result.rows[0] });
  } catch (err) {
    console.error('Update partner status error:', err);
    res.status(500).json({ success: false, message: 'Database error updating status' });
  }
});

// Admin Tickets List Route
app.get('/api/admin/tickets', async (req, res) => {
  try {
    // Only fetch tickets that are NOT resolved to keep the dashboard clean
    const tickets = await db.query("SELECT * FROM tickets WHERE status != 'RESOLVED' ORDER BY created_at DESC");
    res.json({ success: true, tickets: tickets.rows });
  } catch (err) {
    console.error('Fetch tickets error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function for sending ticket status emails
const sendTicketStatusEmail = async (studentEmail, studentName, subject, status) => {
  try {
    const statusText = status === 'IN_PROGRESS' ? 'is now being reviewed' : 'has been successfully resolved';
    const statusColor = status === 'IN_PROGRESS' ? '#f59e0b' : '#10b981';
    
    const mailOptions = {
      from: `"FETC Support" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Update on your query: ${subject}`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f8fafc; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; padding: 12px; background-color: #2563eb; border-radius: 12px; margin-bottom: 16px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-1.41 1.41L15.17 8H2V10h13.17l-1.59 1.59L15 13l4-4-4-4z"></path></svg>
            </div>
            <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Support Update</h1>
          </div>
          
          <div style="background-color: white; padding: 32px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hello <strong>${studentName || 'Student'}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              This is to inform you that your query regarding <strong>"${subject}"</strong> 
              <span style="color: ${statusColor}; font-weight: 700;">${statusText}</span> by our expert team.
            </p>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
              <p style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; margin: 0 0 8px 0;">New Status</p>
              <p style="color: ${statusColor}; font-size: 14px; font-weight: 700; margin: 0;">${status.replace('_', ' ')}</p>
            </div>
            
            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
              ${status === 'IN_PROGRESS' 
                ? "Our team is currently analyzing your request. You don't need to take any action; we'll reach out to you if we need more details." 
                : "We have addressed your concerns. If you have any further questions or if the issue persists, please don't hesitate to reply to this email."}
            </p>
            
            <div style="padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Best regards,</p>
              <p style="color: #0f172a; font-size: 15px; font-weight: 700; margin: 4px 0 0 0;">FETC Team</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #94a3b8; font-size: 12px;">© 2026 FETC Education. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${studentEmail} for ticket status: ${status}`);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// PATCH /api/admin/tickets/:id - Update ticket status
app.patch('/api/admin/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = result.rows[0];
    
    if (status === 'IN_PROGRESS' || status === 'RESOLVED') {
      sendTicketStatusEmail(ticket.email, ticket.name, ticket.subject, status);
    }

    res.json({ success: true, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- User Support API ---

// GET /api/users/:userId/tickets - Get tickets for a specific user
app.get('/api/users/:userId/tickets', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json({ success: true, tickets: result.rows });
  } catch (err) {
    console.error('Fetch user tickets error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Doubts API ---

// GET /api/users/:userId/doubts - Get doubts for a user
app.get('/api/users/:userId/doubts', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM doubts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json({ success: true, doubts: result.rows });
  } catch (err) {
    console.error('Fetch user doubts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/doubts - Create a new doubt
app.post('/api/doubts', async (req, res) => {
  const { userId, subject, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO doubts (user_id, subject, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, subject, description]
    );
    const doubt = result.rows[0];

    // Trigger Cheerio AI Workflow with user details
    if (userId) {
      try {
        const userRes = await db.query('SELECT name, email, phone FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length > 0) {
          const user = userRes.rows[0];
          await triggerCheerioWorkflow({
            name: user.name,
            email: user.email,
            phone: user.phone,
            subject: `Doubt Asked: ${subject}`,
            message: description
          });
        }
      } catch (userErr) {
        console.error('Error fetching user for doubt trigger:', userErr);
      }
    }

    res.status(201).json({ success: true, doubt });
  } catch (err) {
    console.error('Create doubt error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: GET all doubts
app.get('/api/admin/doubts', async (req, res) => {
  try {
    // Fetch doubts along with user names if they exist
    const result = await db.query(`
      SELECT d.*, u.name as user_name, u.email as user_email
      FROM doubts d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    res.json({ success: true, doubts: result.rows });
  } catch (err) {
    console.error('Fetch admin doubts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: PATCH answer/status of doubt
app.patch('/api/admin/doubts/:id', async (req, res) => {
  const { id } = req.params;
  const { answer, status } = req.body;
  try {
    const result = await db.query(
      'UPDATE doubts SET answer = COALESCE($1, answer), status = COALESCE($2, status), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [answer, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }
    res.json({ success: true, doubt: result.rows[0] });
  } catch (err) {
    console.error('Update doubt error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Pages Management API ---

// GET /api/admin/pages - List all pages
app.get('/api/admin/pages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pages ORDER BY title ASC');
    res.json({ success: true, pages: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// POST /api/admin/pages - Create new page
app.post('/api/admin/pages', async (req, res) => {
  const { title, slug } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO pages (title, slug, status, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, slug, 'DRAFT', '{}']
    );
    res.json({ success: true, page: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

// PATCH /api/admin/pages/:id - Update page metadata/status
app.patch('/api/admin/pages/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, seo_title, seo_description, content, show_in_nav, nav_visibility } = req.body;
  try {
    const result = await db.query(
      `UPDATE pages 
       SET title = COALESCE($1, title), 
           status = COALESCE($2, status), 
           seo_title = COALESCE($3, seo_title), 
           seo_description = COALESCE($4, seo_description), 
           content = COALESCE($5, content),
           show_in_nav = COALESCE($6, show_in_nav),
           nav_visibility = COALESCE($7, nav_visibility),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 RETURNING *`,
      [title, status, seo_title, seo_description, content, show_in_nav, nav_visibility, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, page: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// DELETE /api/admin/pages/:id - Delete a page from Page Manager
app.delete('/api/admin/pages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM pages WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (err) {
    console.error('Delete page error:', err);
    res.status(500).json({ success: false, message: 'Database error deleting page' });
  }
});

// GET /api/nav-pages - List all pages for navbar/footer
app.get('/api/nav-pages', async (req, res) => {
  const { target } = req.query; // 'navbar' or 'footer'
  try {
    let query = 'SELECT title, slug FROM pages WHERE status = $1 ';
    let params = ['PUBLISHED'];

    if (target === 'navbar') {
      query += "AND (nav_visibility = 'navbar' OR nav_visibility = 'both') ";
    } else if (target === 'footer') {
      query += "AND (nav_visibility = 'footer' OR nav_visibility = 'both') ";
    } else {
      query += "AND (nav_visibility != 'none' OR show_in_nav = true) ";
    }

    query += 'ORDER BY title ASC';
    
    const result = await db.query(query, params);
    res.json({ success: true, pages: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- News Flash API ---

// Public: GET active news flashes
app.get('/api/news-flash', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT content, link FROM news_flash WHERE is_active = true ORDER BY priority DESC, created_at DESC'
    );
    res.json({ success: true, news: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Admin: GET all news flashes
app.get('/api/admin/news-flash', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news_flash ORDER BY created_at DESC');
    res.json({ success: true, news: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Admin: POST create news flash
app.post('/api/admin/news-flash', async (req, res) => {
  const { content, link, is_active, priority } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO news_flash (content, link, is_active, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [content, link, is_active ?? true, priority ?? 0]
    );
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Admin: PATCH update news flash
app.patch('/api/admin/news-flash/:id', async (req, res) => {
  const { id } = req.params;
  const { content, link, is_active, priority } = req.body;
  try {
    const result = await db.query(
      `UPDATE news_flash 
       SET content = COALESCE($1, content), 
           link = COALESCE($2, link), 
           is_active = COALESCE($3, is_active), 
           priority = COALESCE($4, priority),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 RETURNING *`,
      [content, link, is_active, priority, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Admin: DELETE news flash
app.delete('/api/admin/news-flash/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM news_flash WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- Blog Posts Management API ---

// GET /api/admin/posts - List all posts
app.get('/api/admin/posts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json({ success: true, posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// POST /api/admin/posts - Create new post
app.post('/api/admin/posts', async (req, res) => {
  const { title, slug } = req.body;
  try {
    // POST /api/admin/posts - Create new post
    // Note: Migration handled at startup

    const result = await db.query(
      'INSERT INTO posts (title, slug, status, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, slug, 'DRAFT', '{}']
    );
    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

// --- Database Maintenance API ---

// GET /api/admin/db/seed - Run the data seeder
app.get('/api/admin/db/seed', async (req, res) => {
  try {
    const seeder = require('./seed-all-data');
    const result = await seeder.seed(db);
    res.json({ success: true, message: 'Database seeded successfully', result });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Public Pages API ---

// GET /api/pages/* - Fetch public page content by slug
// Using a direct Regex to avoid path-to-regexp version conflicts
app.get(/^\/api\/pages\/(.*)/, async (req, res) => {
  // Capture the full slug from the first regex group
  let fullSlug = '/' + (req.params[0] || '');
  if (fullSlug === '/home' || fullSlug === '/') fullSlug = '/';
  
  try {
    const result = await db.query(
      'SELECT id, title, slug, content, seo_title, seo_description FROM pages WHERE slug = $1 AND status = $2',
      [fullSlug, 'PUBLISHED']
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Page not found or not published' });
    res.json({ success: true, page: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Error handling for the pool
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// -----------------------------------------------------------------------------
// INTERACTIVE GUIDES API
// -----------------------------------------------------------------------------

// Fetch a guide by slug (Public)
app.get('/api/guides/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const guide = await db.query('SELECT * FROM interactive_guides WHERE slug = $1 AND is_active = true', [slug]);
        
        if (guide.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        const pages = await db.query('SELECT * FROM guide_pages WHERE guide_id = $1 ORDER BY page_number ASC', [guide.rows[0].id]);
        
        res.json({
            success: true,
            guide: guide.rows[0],
            pages: pages.rows
        });
    } catch (err) {
        console.error('Error fetching guide:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Get all guides
app.get('/api/admin/guides', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM interactive_guides ORDER BY created_at DESC');
        res.json({ success: true, guides: result.rows });
    } catch (err) {
        console.error('Error fetching all guides:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Create/Update Guide
app.post('/api/admin/guides', async (req, res) => {
    const { id, slug, title, description, is_active } = req.body;
    try {
        if (id) {
            // Update
            const result = await db.query(
                'UPDATE interactive_guides SET slug = $1, title = $2, description = $3, is_active = $4 WHERE id = $5 RETURNING *',
                [slug, title, description, is_active, id]
            );
            res.json({ success: true, guide: result.rows[0] });
        } else {
            // Create
            const result = await db.query(
                'INSERT INTO interactive_guides (slug, title, description) VALUES ($1, $2, $3) RETURNING *',
                [slug, title, description]
            );
            res.json({ success: true, guide: result.rows[0] });
        }
    } catch (err) {
        console.error('Error saving guide:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Manage Guide Pages
app.post('/api/admin/guides/:id/pages', async (req, res) => {
    const { id } = req.params;
    const { pages } = req.body; // Array of { image_url, page_number }

    try {
        // Simple approach: Delete existing and re-insert
        await db.query('DELETE FROM guide_pages WHERE guide_id = $1', [id]);
        
        if (pages && pages.length > 0) {
            for (let page of pages) {
                await db.query(
                    'INSERT INTO guide_pages (guide_id, image_url, page_number) VALUES ($1, $2, $3)',
                    [id, page.image_url, page.page_number]
                );
            }
        }
        
        res.json({ success: true, message: 'Pages updated successfully' });
    } catch (err) {
        console.error('Error managing guide pages:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin: Delete Guide
app.delete('/api/admin/guides/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM interactive_guides WHERE id = $1', [id]);
        res.json({ success: true, message: 'Guide deleted successfully' });
    } catch (err) {
        console.error('Error deleting guide:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- Mock Tests API ---
// Public endpoint for /mock page (User side)
app.get('/api/mock-tests', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mock_tests WHERE status = 'Published' OR status IS NULL ORDER BY id ASC");
    res.json({ success: true, mockTests: result.rows });
  } catch (err) {
    console.error('Fetch public mock tests error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin endpoints
app.get('/api/admin/mock-tests', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mock_tests ORDER BY id ASC');
    res.json({ success: true, mockTests: result.rows });
  } catch (err) {
    console.error('Fetch mock tests error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/admin/mock-tests', async (req, res) => {
  const { title, price, status, content, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO mock_tests (title, price, status, content, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, price || '₹49', status || 'Published', content || null, image_url || null]
    );
    res.status(201).json({ success: true, mockTest: result.rows[0] });
  } catch (err) {
    console.error('Create mock test error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/admin/mock-tests/:id', async (req, res) => {
  const { id } = req.params;
  const { title, price, status, content, image_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE mock_tests 
       SET title = COALESCE($1, title), 
           price = COALESCE($2, price), 
           status = COALESCE($3, status),
           content = COALESCE($4, content),
           image_url = COALESCE($5, image_url)
       WHERE id = $6 RETURNING *`,
      [title, price, status, content, image_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }
    res.json({ success: true, mockTest: result.rows[0] });
  } catch (err) {
    console.error('Update mock test error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/mock-tests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM mock_tests WHERE id = $1', [id]);
    res.json({ success: true, message: 'Mock test deleted' });
  } catch (err) {
    console.error('Delete mock test error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// -----------------------------------------------------------------------------
// PHONEPE PAYMENT GATEWAY API (V2 OAuth Standard)
// -----------------------------------------------------------------------------

let phonepeTokenCache = { token: null, expiresAt: 0 };

async function getPhonePeAccessToken() {
  const now = Date.now();
  if (phonepeTokenCache.token && phonepeTokenCache.expiresAt > now + 60000) {
    return phonepeTokenCache.token;
  }

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const secret = process.env.PHONEPE_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('PHONEPE_CLIENT_ID or PHONEPE_CLIENT_SECRET not configured in .env');
  }

  const authUrl = process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', secret);
  params.append('grant_type', 'client_credentials');

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`PhonePe Auth error (${response.status}): ${text.substring(0, 100)}`);
  }

  if (data.access_token) {
    phonepeTokenCache.token = data.access_token;
    phonepeTokenCache.expiresAt = now + ((data.expires_in || 3600) * 1000);
    return data.access_token;
  }
  throw new Error(data.message || data.error || 'Failed to authenticate with PhonePe');
}

// POST /api/v1/order/initiate-payment - PhonePe Payment Gateway Initiation
app.post('/api/v1/order/initiate-payment', async (req, res) => {
  try {
    const { name, email, phone, courseId, productType, amount, returnUrl } = req.body;

    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const originUrl = returnUrl || req.get('referer');
    const merchantOrderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const paymentAmount = amount !== undefined ? Math.round(parseFloat(amount) * 100) : 100; // Default ₹1 (100 paise)

    // Auto-create orders table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        merchant_transaction_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(100),
        course_id VARCHAR(100),
        product_type VARCHAR(100),
        amount INT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        return_url VARCHAR(1000),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure return_url column exists
    try {
      await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_url VARCHAR(1000)`);
    } catch (e) {}

    await db.query(
      `INSERT INTO orders (merchant_transaction_id, name, email, phone, course_id, product_type, amount, status, return_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING', $8)`,
      [merchantOrderId, name, email, phone || '9999999999', courseId || 'COURSE', productType || 'course', paymentAmount / 100, originUrl]
    );

    const redirectCallbackUrl = `${backendUrl}/api/v1/order/payment-callback?transactionId=${merchantOrderId}${originUrl ? `&originUrl=${encodeURIComponent(originUrl)}` : ''}`;

    // 1. Try V2 OAuth flow if PHONEPE_CLIENT_ID is provided
    if (process.env.PHONEPE_CLIENT_ID && process.env.PHONEPE_CLIENT_SECRET) {
      try {
        const token = await getPhonePeAccessToken();
        const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api.phonepe.com/apis/pg';
        const payload = {
          merchantOrderId,
          amount: paymentAmount,
          expireAfter: 1200,
          paymentFlow: {
            type: 'PG_CHECKOUT',
            message: productType ? `Payment for ${productType}` : 'Payment for Course',
            merchantUrls: {
              redirectUrl: redirectCallbackUrl
            }
          }
        };

        const response = await fetch(`${hostUrl}/checkout/v2/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token}`,
            'accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        console.log('PhonePe V2 API Response:', responseData);

        const redirectUrl = responseData.redirectUrl || responseData.data?.redirectUrl || responseData.data?.instrumentResponse?.redirectInfo?.url;
        if (redirectUrl) {
          return res.json({ success: true, redirectUrl, merchantTransactionId: merchantOrderId, orderId: responseData.orderId });
        }
      } catch (v2Err) {
        console.warn('PhonePe V2 flow failed, falling back to V1 checksum flow:', v2Err.message);
      }
    }

    // 2. PhonePe Standard V1 Host Flow (Salt Key + SHA256 Checksum for QR generation)
    const merchantId = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86';
    const saltKey = process.env.PHONEPE_SALT_KEY || '9643446-0b55-4e0b-b762-a115b22f7c3a';
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    const payload = {
      merchantId: merchantId,
      merchantTransactionId: merchantOrderId,
      merchantUserId: `MUID_${Date.now()}`,
      amount: paymentAmount,
      redirectUrl: redirectCallbackUrl,
      redirectMode: 'REDIRECT',
      callbackUrl: redirectCallbackUrl,
      mobileNumber: phone ? phone.replace(/\D/g, '') : '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const stringToSign = base64Payload + '/pg/v1/pay' + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToSign).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    console.log('Initiating PhonePe V1 Standard Pay at:', `${hostUrl}/pg/v1/pay`);

    const response = await fetch(`${hostUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'accept': 'application/json'
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const responseData = await response.json();
    console.log('PhonePe V1 API Response:', responseData);

    const redirectUrl = responseData.data?.instrumentResponse?.redirectInfo?.url || responseData.data?.redirectUrl || responseData.redirectUrl;

    if (responseData.success && redirectUrl) {
      return res.json({ success: true, redirectUrl, merchantTransactionId: merchantOrderId });
    } else {
      console.error('PhonePe Gateway Error:', responseData);
      const detailMsg = responseData.message || responseData.code || 'Unauthorized merchant credentials';
      return res.status(400).json({
        success: false,
        message: `PhonePe Gateway Error (${responseData.code || '401'}): ${detailMsg}. Please verify PHONEPE_MERCHANT_ID & PHONEPE_SALT_KEY in server/.env`,
        data: responseData
      });
    }
  } catch (err) {
    console.error('Initiate payment error:', err);
    res.status(500).json({ success: false, message: 'Server error initiating payment: ' + err.message });
  }
});

// POST & GET /api/v1/order/payment-callback - PhonePe Callback & Redirect
const handlePaymentCallback = async (req, res) => {
  const transactionId = req.query.transactionId || req.body?.transactionId || req.body?.merchantOrderId;
  const queryOriginUrl = req.query.originUrl || req.body?.originUrl;
  console.log('Payment Callback Received:', transactionId, 'Query:', req.query, 'Body:', req.body);

  let finalStatus = 'PENDING';
  let savedReturnUrl = queryOriginUrl;

  try {
    if (transactionId) {
      // Query saved order in DB
      try {
        const orderRes = await db.query('SELECT return_url, status FROM orders WHERE merchant_transaction_id = $1', [transactionId]);
        if (orderRes.rows.length > 0) {
          if (!savedReturnUrl && orderRes.rows[0].return_url) {
            savedReturnUrl = orderRes.rows[0].return_url;
          }
        }
      } catch (dbErr) {
        console.warn('DB query error on callback:', dbErr.message);
      }

      // Check status via gateway
      try {
        if (process.env.PHONEPE_CLIENT_ID && process.env.PHONEPE_CLIENT_SECRET) {
          const token = await getPhonePeAccessToken();
          const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api.phonepe.com/apis/pg';
          const statusRes = await fetch(`${hostUrl}/checkout/v2/order/${transactionId}/status`, {
            method: 'GET',
            headers: {
              'Authorization': `O-Bearer ${token}`,
              'accept': 'application/json'
            }
          });
          const statusData = await statusRes.json();
          const state = (statusData.state || statusData.code || '').toUpperCase();
          if (state === 'COMPLETED' || state === 'SUCCESS' || state === 'PAYMENT_SUCCESS') {
            finalStatus = 'SUCCESS';
          } else if (state === 'FAILED' || state === 'PAYMENT_ERROR' || state === 'DECLINED' || state === 'CANCELLED') {
            finalStatus = 'FAILED';
          }
        }
      } catch (stErr) {
        console.warn('Callback status check fallback:', stErr.message);
      }

      if (finalStatus === 'PENDING') {
        const code = (req.body?.code || req.query?.code || '').toUpperCase();
        if (code === 'PAYMENT_SUCCESS' || code === 'SUCCESS') {
          finalStatus = 'SUCCESS';
        } else if (code.includes('CANCEL') || code.includes('FAIL') || code.includes('DECLINE') || code.includes('ERROR')) {
          finalStatus = 'FAILED';
        }
      }

      if (finalStatus !== 'PENDING') {
        await db.query(
          'UPDATE orders SET status = $1 WHERE merchant_transaction_id = $2',
          [finalStatus, transactionId]
        );
      }
    }
  } catch (err) {
    console.error('Payment callback handling error:', err);
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const isSuccess = finalStatus === 'SUCCESS';

  if (savedReturnUrl) {
    try {
      const urlObj = new URL(savedReturnUrl, frontendUrl);
      urlObj.searchParams.set('paymentStatus', isSuccess ? 'success' : 'cancelled');
      if (transactionId) urlObj.searchParams.set('tx', transactionId);
      return res.redirect(urlObj.toString());
    } catch (uErr) {
      console.warn('Invalid savedReturnUrl:', savedReturnUrl);
    }
  }

  res.redirect(`${frontendUrl}/my-account?paymentStatus=${isSuccess ? 'success' : 'cancelled'}&tx=${transactionId || ''}`);
};

app.post('/api/v1/order/payment-callback', handlePaymentCallback);
app.get('/api/v1/order/payment-callback', handlePaymentCallback);

// GET /api/v1/order/status/:transactionId - Check PhonePe transaction status
app.get('/api/v1/order/status/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  try {
    const token = await getPhonePeAccessToken();
    const hostUrl = process.env.PHONEPE_HOST_URL || 'https://api.phonepe.com/apis/pg';

    const response = await fetch(`${hostUrl}/checkout/v2/order/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `O-Bearer ${token}`,
        'accept': 'application/json'
      }
    });

    const responseData = await response.json();
    
    const state = (responseData.state || responseData.code || '').toUpperCase();
    if (state === 'COMPLETED' || state === 'SUCCESS') {
      await db.query('UPDATE orders SET status = $1 WHERE merchant_transaction_id = $2', ['SUCCESS', transactionId]);
    } else if (state === 'FAILED') {
      await db.query('UPDATE orders SET status = $1 WHERE merchant_transaction_id = $2', ['FAILED', transactionId]);
    }

    res.json({ success: true, data: responseData });
  } catch (err) {
    console.error('Check status error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/order/user-orders - Fetch orders for logged-in user
app.get('/api/v1/order/user-orders', async (req, res) => {
  const { email, phone } = req.query;
  try {
    // Ensure table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        merchant_transaction_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(100),
        course_id VARCHAR(100),
        product_type VARCHAR(100),
        amount INT NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    let result;
    if (email && phone) {
      result = await db.query(
        'SELECT id, merchant_transaction_id as "transactionId", merchant_transaction_id as "_id", name, email, phone, course_id as "courseId", product_type as "productType", amount, status, created_at as "createdAt" FROM orders WHERE LOWER(email) = LOWER($1) OR phone = $2 ORDER BY id DESC',
        [email, phone]
      );
    } else if (email) {
      result = await db.query(
        'SELECT id, merchant_transaction_id as "transactionId", merchant_transaction_id as "_id", name, email, phone, course_id as "courseId", product_type as "productType", amount, status, created_at as "createdAt" FROM orders WHERE LOWER(email) = LOWER($1) ORDER BY id DESC',
        [email]
      );
    } else if (phone) {
      result = await db.query(
        'SELECT id, merchant_transaction_id as "transactionId", merchant_transaction_id as "_id", name, email, phone, course_id as "courseId", product_type as "productType", amount, status, created_at as "createdAt" FROM orders WHERE phone = $1 ORDER BY id DESC',
        [phone]
      );
    } else {
      result = await db.query(
        'SELECT id, merchant_transaction_id as "transactionId", merchant_transaction_id as "_id", name, email, phone, course_id as "courseId", product_type as "productType", amount, status, created_at as "createdAt" FROM orders ORDER BY id DESC LIMIT 50'
      );
    }

    res.json({
      success: true,
      orders: result.rows,
      transactions: result.rows
    });
  } catch (err) {
    console.error('Fetch user orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user orders', error: err.message });
  }
});

// GET /api/v1/order/all-orders - Admin fetch all orders
app.get('/api/v1/order/all-orders', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, merchant_transaction_id as "transactionId", merchant_transaction_id as "_id", name, email, phone, course_id as "courseId", product_type as "productType", amount, status, created_at as "createdAt" FROM orders ORDER BY id DESC'
    );
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch all orders' });
  }
});

// Helper to ensure invoices table exists
const ensureInvoicesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_no VARCHAR(100) UNIQUE NOT NULL,
      invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
      payment_method VARCHAR(100) DEFAULT 'Cash',
      upi_ref VARCHAR(255),
      bill_to JSONB NOT NULL DEFAULT '{}'::jsonb,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      sgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      cgst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE SEQUENCE IF NOT EXISTS invoices_id_seq;
    ALTER TABLE invoices ALTER COLUMN id TYPE INTEGER USING (CASE WHEN id::text ~ '^[0-9]+$' THEN id::integer ELSE NULL END);
    ALTER TABLE invoices ALTER COLUMN id SET DEFAULT nextval('invoices_id_seq');

    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='client') THEN
        ALTER TABLE invoices ALTER COLUMN client DROP NOT NULL;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='company') THEN
        ALTER TABLE invoices ALTER COLUMN company DROP NOT NULL;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='date') THEN
        ALTER TABLE invoices ALTER COLUMN date DROP NOT NULL;
      END IF;
    END $$;

    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_no VARCHAR(100);
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT CURRENT_DATE;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'Cash';
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS upi_ref VARCHAR(255);
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS bill_to JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0.00;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sgst DECIMAL(10, 2) DEFAULT 0.00;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cgst DECIMAL(10, 2) DEFAULT 0.00;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2) DEFAULT 0.00;
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invoices_invoice_no_key') THEN
        ALTER TABLE invoices ADD CONSTRAINT invoices_invoice_no_key UNIQUE (invoice_no);
      END IF;
    END $$;
  `).catch(() => {});
};

// GET next invoice number
app.get(['/api/v1/invoice/next-no', '/api/admin/invoices/next-no'], async (req, res) => {
  try {
    await ensureInvoicesTable();
    const result = await db.query(`SELECT invoice_no FROM invoices WHERE invoice_no IS NOT NULL ORDER BY created_at DESC LIMIT 1`);
    let nextNum = 1;
    if (result.rows.length > 0 && result.rows[0].invoice_no) {
      const match = result.rows[0].invoice_no.match(/(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const formattedInvoiceNo = `INV-${String(nextNum).padStart(3, '0')}`;
    res.json({ success: true, invoiceNo: formattedInvoiceNo });
  } catch (err) {
    console.error('Fetch next invoice no error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch next invoice number' });
  }
});

// GET all invoices
app.get(['/api/v1/invoice/all', '/api/admin/invoices'], async (req, res) => {
  try {
    await ensureInvoicesTable();
    const { search } = req.query;
    let query = `SELECT * FROM invoices ORDER BY id DESC`;
    let queryParams = [];

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = `
        SELECT * FROM invoices 
        WHERE invoice_no ILIKE $1 
           OR bill_to->>'clientName' ILIKE $1 
           OR bill_to->>'companyName' ILIKE $1 
        ORDER BY id DESC
      `;
      queryParams = [searchTerm];
    }

    const result = await db.query(query, queryParams);
    
    // Map rows to match frontend schema expected fields
    const invoices = result.rows.map(row => ({
      id: row.id,
      invoiceNo: row.invoice_no,
      invoiceDate: row.invoice_date,
      paymentMethod: row.payment_method,
      upiRef: row.upi_ref,
      billTo: typeof row.bill_to === 'string' ? JSON.parse(row.bill_to) : row.bill_to,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      subtotal: parseFloat(row.subtotal),
      sgst: parseFloat(row.sgst),
      cgst: parseFloat(row.cgst),
      total: parseFloat(row.total),
      createdAt: row.created_at
    }));

    res.json({ success: true, invoices });
  } catch (err) {
    console.error('Fetch invoices error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
});

// GET single invoice
app.get(['/api/v1/invoice/:invoiceNo', '/api/admin/invoices/:invoiceNo'], async (req, res) => {
  try {
    await ensureInvoicesTable();
    const { invoiceNo } = req.params;
    const result = await db.query(`SELECT * FROM invoices WHERE invoice_no = $1`, [invoiceNo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const row = result.rows[0];
    const invoice = {
      id: row.id,
      invoiceNo: row.invoice_no,
      invoiceDate: row.invoice_date,
      paymentMethod: row.payment_method,
      upiRef: row.upi_ref,
      billTo: typeof row.bill_to === 'string' ? JSON.parse(row.bill_to) : row.bill_to,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      subtotal: parseFloat(row.subtotal),
      sgst: parseFloat(row.sgst),
      cgst: parseFloat(row.cgst),
      total: parseFloat(row.total),
      createdAt: row.created_at
    };

    res.json({ success: true, invoice });
  } catch (err) {
    console.error('Fetch invoice error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch invoice details' });
  }
});

// POST create invoice
app.post(['/api/v1/invoice/create', '/api/admin/invoices'], async (req, res) => {
  try {
    await ensureInvoicesTable();
    
    // Parse body parameters (supports JSON or multipart form fields)
    let body = req.body;
    if (typeof body.billTo === 'string') {
      try { body.billTo = JSON.parse(body.billTo); } catch(e){}
    }
    if (typeof body.items === 'string') {
      try { body.items = JSON.parse(body.items); } catch(e){}
    }

    const {
      invoiceNo,
      invoiceDate,
      paymentMethod,
      upiRef,
      billTo,
      items,
      subtotal,
      sgst,
      cgst,
      total
    } = body;

    if (!invoiceNo) {
      return res.status(400).json({ success: false, message: 'Invoice number is required' });
    }

    const query = `
      INSERT INTO invoices (invoice_no, invoice_date, payment_method, upi_ref, bill_to, items, subtotal, sgst, cgst, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (invoice_no) DO UPDATE SET
        invoice_date = EXCLUDED.invoice_date,
        payment_method = EXCLUDED.payment_method,
        upi_ref = EXCLUDED.upi_ref,
        bill_to = EXCLUDED.bill_to,
        items = EXCLUDED.items,
        subtotal = EXCLUDED.subtotal,
        sgst = EXCLUDED.sgst,
        cgst = EXCLUDED.cgst,
        total = EXCLUDED.total
      RETURNING *
    `;

    const values = [
      invoiceNo,
      invoiceDate || new Date().toISOString().split('T')[0],
      paymentMethod || 'Cash',
      upiRef || '',
      JSON.stringify(billTo || {}),
      JSON.stringify(items || []),
      parseFloat(subtotal || 0),
      parseFloat(sgst || 0),
      parseFloat(cgst || 0),
      parseFloat(total || 0)
    ];

    const result = await db.query(query, values);
    res.json({ success: true, message: 'Invoice saved successfully', invoice: result.rows[0] });
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to save invoice' });
  }
});

// DELETE invoice
app.delete(['/api/v1/invoice/:invoiceNo', '/api/admin/invoices/:invoiceNo'], async (req, res) => {
  try {
    await ensureInvoicesTable();
    const { invoiceNo } = req.params;
    await db.query(`DELETE FROM invoices WHERE invoice_no = $1`, [invoiceNo]);
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Delete invoice error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
});

// Helper to ensure courses table exists & seeds default courses
const ensureCoursesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      course_id VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'Exam Prep',
      price DECIMAL(10, 2) DEFAULT 0.00,
      duration VARCHAR(100) DEFAULT '4 Weeks',
      level VARCHAR(50) DEFAULT 'Intermediate',
      status VARCHAR(50) DEFAULT 'ACTIVE',
      students_count INT DEFAULT 0,
      thumbnail VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const countResult = await db.query(`SELECT COUNT(*) FROM courses`);
  if (parseInt(countResult.rows[0].count) === 0) {
    const initialCourses = [
      ['IELTS_MASTERCLASS', 'IELTS Academic Masterclass', 'Comprehensive 8-week IELTS training with live mock feedback.', 'Language Exam', 14999, '8 Weeks', 'All Levels', 'ACTIVE', 48],
      ['TOEFL_IBT_PREP', 'TOEFL iBT Intensive Training', 'Complete speaking, writing, and listening practice with experts.', 'Language Exam', 12999, '6 Weeks', 'Intermediate', 'ACTIVE', 32],
      ['PTE_ACADEMIC', 'PTE Academic FastTrack', 'AI-assisted scoring practice and strategies for high bands.', 'Language Exam', 9999, '4 Weeks', 'Intermediate', 'ACTIVE', 27],
      ['GRE_QUANT_VERBAL', 'GRE Quant & Verbal Success', 'High-score strategy drills, practice tests, and math refresher.', 'Graduate Exam', 18999, '10 Weeks', 'Advanced', 'ACTIVE', 54],
      ['GMAT_FOCUS_EDITION', 'GMAT Focus Edition Training', 'Data insights, problem-solving, and verbal reasoning mastery.', 'Graduate Exam', 21999, '12 Weeks', 'Advanced', 'ACTIVE', 19],
      ['SAT_DIGITAL_PREP', 'SAT Digital Preparation Course', 'Module-based adaptive prep for high school study abroad applicants.', 'Undergrad Exam', 11999, '6 Weeks', 'Beginner', 'ACTIVE', 41]
    ];

    for (const c of initialCourses) {
      await db.query(`
        INSERT INTO courses (course_id, title, description, category, price, duration, level, status, students_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (course_id) DO NOTHING
      `, c);
    }
  }
};

// GET all courses
app.get(['/api/v1/course/all', '/api/admin/courses'], async (req, res) => {
  try {
    await ensureCoursesTable();
    const { search, category } = req.query;
    let query = `SELECT * FROM courses ORDER BY id ASC`;
    let queryParams = [];

    if (search && search.trim()) {
      query = `SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1 OR course_id ILIKE $1 ORDER BY id ASC`;
      queryParams = [`%${search.trim()}%`];
    }

    const result = await db.query(query, queryParams);
    const courses = result.rows.map(row => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      description: row.description,
      category: row.category,
      price: parseFloat(row.price),
      duration: row.duration,
      level: row.level,
      status: row.status,
      studentsCount: row.students_count,
      createdAt: row.created_at
    }));

    res.json({ success: true, courses, total: courses.length });
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
});

// POST create or update course
app.post(['/api/v1/course/create', '/api/admin/courses'], async (req, res) => {
  try {
    await ensureCoursesTable();
    const { courseId, title, description, category, price, duration, level, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const slugId = courseId || title.toUpperCase().replace(/[^A_Z0-9]/g, '_');

    const query = `
      INSERT INTO courses (course_id, title, description, category, price, duration, level, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (course_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        price = EXCLUDED.price,
        duration = EXCLUDED.duration,
        level = EXCLUDED.level,
        status = EXCLUDED.status
      RETURNING *
    `;

    const values = [
      slugId,
      title,
      description || '',
      category || 'General',
      parseFloat(price || 0),
      duration || '4 Weeks',
      level || 'All Levels',
      status || 'ACTIVE'
    ];

    const result = await db.query(query, values);
    res.json({ success: true, message: 'Course saved successfully', course: result.rows[0] });
  } catch (err) {
    console.error('Save course error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to save course' });
  }
});

// DELETE course
app.delete(['/api/v1/course/:id', '/api/admin/courses/:id'], async (req, res) => {
  try {
    await ensureCoursesTable();
    const { id } = req.params;
    await db.query(`DELETE FROM courses WHERE id = $1 OR course_id = $1`, [id]);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
});

// Export the app for Vercel serverless functions
module.exports = app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}
