-- One-Page Corporate Template — PostgreSQL schema for admin-managed content

-- Admin user (single user, password hashed with bcrypt)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site-wide settings (meta, logo, footer)
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT
);

-- Hero slider slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle TEXT,
  sort_order INT DEFAULT 0
);

-- About section (single row)
CREATE TABLE IF NOT EXISTS about_section (
  id SERIAL PRIMARY KEY,
  section_title VARCHAR(255),
  section_subtitle TEXT,
  welcome_heading VARCHAR(255),
  welcome_text TEXT,
  read_more_url VARCHAR(500)
);

-- About featured items (3 items)
CREATE TABLE IF NOT EXISTS about_features (
  id SERIAL PRIMARY KEY,
  icon_class VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  sort_order INT DEFAULT 0
);

-- Expertise progress bars
CREATE TABLE IF NOT EXISTS expertise (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100),
  percent INT CHECK (percent >= 0 AND percent <= 100),
  sort_order INT DEFAULT 0
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  icon_class VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  sort_order INT DEFAULT 0
);

-- Get started CTA (single row)
CREATE TABLE IF NOT EXISTS get_started (
  id SERIAL PRIMARY KEY,
  heading VARCHAR(255),
  subheading VARCHAR(255),
  button_text VARCHAR(100),
  button_url VARCHAR(500)
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  role VARCHAR(255),
  bio TEXT,
  image_url VARCHAR(500),
  facebook_url VARCHAR(500),
  twitter_url VARCHAR(500),
  skype_url VARCHAR(500),
  dribbble_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

-- Fun facts / stats
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  icon_class VARCHAR(100),
  number VARCHAR(50),
  label VARCHAR(255),
  sort_order INT DEFAULT 0
);

-- Portfolio / work items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(500),
  title VARCHAR(255),
  category VARCHAR(100),
  sort_order INT DEFAULT 0
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT,
  author_name VARCHAR(255),
  author_role VARCHAR(255),
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0
);

-- Pricing plans (features stored as JSON array or newline-separated)
CREATE TABLE IF NOT EXISTS pricing_plans (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  price INT,
  features TEXT,
  button_text VARCHAR(100),
  sort_order INT DEFAULT 0
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  excerpt TEXT,
  image_url VARCHAR(500),
  post_date VARCHAR(100),
  comment_count VARCHAR(50),
  link VARCHAR(500),
  sort_order INT DEFAULT 0
);

-- Contact & footer (single row)
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  address TEXT,
  phone VARCHAR(100),
  email VARCHAR(255),
  website VARCHAR(255),
  map_embed_src TEXT
);

-- Footer about & social
CREATE TABLE IF NOT EXISTS footer (
  id SERIAL PRIMARY KEY,
  about_heading VARCHAR(255),
  about_text TEXT,
  facebook_url VARCHAR(500),
  twitter_url VARCHAR(500),
  dribbble_url VARCHAR(500),
  skype_url VARCHAR(500),
  copyright_text VARCHAR(500)
);
