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
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          created_at: user.created_at
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
  const { name, phone, bio, profile_image } = req.body;
  
  try {
    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), bio = COALESCE($3, bio), profile_image = COALESCE($4, profile_image) WHERE id = $5 RETURNING id, name, email, role, phone, bio, created_at, profile_image',
      [name, phone, bio, profile_image, id]
    );
    
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
    const result = await db.query(
      'SELECT id, name, email, role, phone, bio, created_at, profile_image FROM users WHERE id = $1',
      [id]
    );
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
    
    // Trigger email notification if status is IN_PROGRESS or RESOLVED
    if (status === 'IN_PROGRESS' || status === 'RESOLVED') {
      // Fire and forget email sending
      sendTicketStatusEmail(ticket.email, ticket.name, ticket.subject, status);
    }

    res.json({ success: true, ticket });
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
    // Ensure table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content JSONB DEFAULT '{}',
        status TEXT DEFAULT 'DRAFT',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', err);
  }
});
