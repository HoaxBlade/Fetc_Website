const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Middleware
app.use(cors());
app.use(express.json());

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

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Static folder for uploaded images
app.use('/uploads', express.static(uploadDir));

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images are allowed!"));
  }
});

// Photo Upload Route
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  // Return the URL to the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
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
          role: user.role
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

    res.status(201).json({ success: true, message: 'User invited and account created!' });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ success: false, message: 'Error inviting user' });
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

// Lead Capture Route (Public)
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, subject, message, userId } = req.body;
  try {
    // 1. Create Lead
    const leadResult = await db.query(
      'INSERT INTO leads (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject, message]
    );

    // 2. Create Ticket (Dual entry as requested)
    await db.query(
      'INSERT INTO tickets (user_id, name, email, subject, message, priority) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId || null, name, email, subject, message, 'HIGH']
    );

    res.json({ success: true, lead: leadResult.rows[0] });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin Tickets List Route
app.get('/api/admin/tickets', async (req, res) => {
  try {
    const tickets = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json({ success: true, tickets: tickets.rows });
  } catch (err) {
    console.error('Fetch tickets error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/admin/tickets/:id - Update ticket status
app.patch('/api/admin/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
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

// PATCH /api/admin/pages/:id - Update page metadata/status
app.patch('/api/admin/pages/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, seo_title, seo_description, content } = req.body;
  try {
    const result = await db.query(
      `UPDATE pages 
       SET title = COALESCE($1, title), 
           status = COALESCE($2, status), 
           seo_title = COALESCE($3, seo_title), 
           seo_description = COALESCE($4, seo_description), 
           content = COALESCE($5, content),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING *`,
      [title, status, seo_title, seo_description, content ? JSON.stringify(content) : null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, page: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
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

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', err);
  }
});
