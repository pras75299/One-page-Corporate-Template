const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

async function getSiteContent() {
  const [
    settingsRows,
    heroRows,
    aboutSectionRows,
    aboutFeaturesRows,
    expertiseRows,
    servicesRows,
    getStartedRows,
    teamRows,
    statsRows,
    portfolioRows,
    testimonialsRows,
    pricingRows,
    blogRows,
    contactRows,
    footerRows,
  ] = await Promise.all([
    query('SELECT key, value FROM site_settings'),
    query('SELECT id, title, subtitle, sort_order FROM hero_slides ORDER BY sort_order, id'),
    query('SELECT * FROM about_section LIMIT 1'),
    query('SELECT id, icon_class, title, description, sort_order FROM about_features ORDER BY sort_order, id'),
    query('SELECT id, label, percent, sort_order FROM expertise ORDER BY sort_order, id'),
    query('SELECT id, icon_class, title, description, sort_order FROM services ORDER BY sort_order, id'),
    query('SELECT * FROM get_started LIMIT 1'),
    query('SELECT * FROM team_members ORDER BY sort_order, id'),
    query('SELECT id, icon_class, number, label, sort_order FROM stats ORDER BY sort_order, id'),
    query('SELECT id, image_url, title, category, sort_order FROM portfolio_items ORDER BY sort_order, id'),
    query('SELECT id, quote, author_name, author_role, image_url, sort_order FROM testimonials ORDER BY sort_order, id'),
    query('SELECT id, title, price, features, button_text, sort_order FROM pricing_plans ORDER BY sort_order, id'),
    query('SELECT id, title, excerpt, image_url, post_date, comment_count, link, sort_order FROM blog_posts ORDER BY sort_order, id'),
    query('SELECT * FROM contact_info LIMIT 1'),
    query('SELECT * FROM footer LIMIT 1'),
  ]);

  const settings = {};
  (settingsRows.rows || []).forEach((r) => { settings[r.key] = r.value; });

  return {
    site: settings,
    heroSlides: heroRows.rows || [],
    aboutSection: aboutSectionRows.rows[0] || null,
    aboutFeatures: aboutFeaturesRows.rows || [],
    expertise: expertiseRows.rows || [],
    services: servicesRows.rows || [],
    getStarted: getStartedRows.rows[0] || null,
    teamMembers: teamRows.rows || [],
    stats: statsRows.rows || [],
    portfolio: portfolioRows.rows || [],
    testimonials: testimonialsRows.rows || [],
    pricingPlans: pricingRows.rows || [],
    blogPosts: blogRows.rows || [],
    contactInfo: contactRows.rows[0] || null,
    footer: footerRows.rows[0] || null,
  };
}

module.exports = { pool, query, getSiteContent };
