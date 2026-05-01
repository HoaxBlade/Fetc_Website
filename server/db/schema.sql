-- FETC Database Schema

-- 1. Users Table
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

-- 2. Doubts Table (Student Support)
CREATE TABLE IF NOT EXISTS doubts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Leads Table (Student Inquiries)
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

-- 3. Universities Table (To be implemented)
-- CREATE TABLE IF NOT EXISTS universities (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     location VARCHAR(255),
--     description TEXT,
--     image_url TEXT,
--     category VARCHAR(100),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- 4. Tickets Table (Support & Enquiries)
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- Nullable for Guest enquiries
    name VARCHAR(255), -- For Guest enquiries
    email VARCHAR(255), -- For Guest enquiries
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Pages Table (CMS)
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,      -- e.g., 'about-us'
    status VARCHAR(20) DEFAULT 'DRAFT',     -- 'PUBLISHED' or 'DRAFT'
    seo_title VARCHAR(255),
    seo_description TEXT,
    content JSONB DEFAULT '{}',             -- Flexible storage for page sections
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. News Flash Table
CREATE TABLE IF NOT EXISTS news_flash (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    link VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}',
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Interactive Guides Table
CREATE TABLE IF NOT EXISTS interactive_guides (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Guide Pages Table
CREATE TABLE IF NOT EXISTS guide_pages (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER REFERENCES interactive_guides(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
