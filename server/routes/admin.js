const express = require('express');
const bcrypt = require('bcryptjs');
const { pool, query, getSiteContent } = require('../db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

const upsertSetting = async (key, value) => {
  await query(
    'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    [key, value]
  );
};

router.post('/api/admin/login', express.json(), async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const r = await query('SELECT id, password_hash FROM admin_users WHERE username = $1', [username]);
    const user = r.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.admin = true;
    req.session.adminUserId = user.id;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {});
  res.json({ success: true });
});

router.get('/api/admin/content', requireAdmin, async (req, res) => {
  try {
    const content = await getSiteContent();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

router.put('/api/admin/site', requireAdmin, express.json(), async (req, res) => {
  const { metaTitle, metaDescription, logoText, footerCopyright } = req.body || {};
  try {
    if (metaTitle != null) await upsertSetting('meta_title', metaTitle);
    if (metaDescription != null) await upsertSetting('meta_description', metaDescription);
    if (logoText != null) await upsertSetting('logo_text', logoText);
    if (footerCopyright != null) await upsertSetting('footer_copyright', footerCopyright);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/api/admin/hero', requireAdmin, express.json(), async (req, res) => {
  const { slides } = req.body || {};
  if (!Array.isArray(slides)) return res.status(400).json({ error: 'slides array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM hero_slides');
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      await client.query(
        'INSERT INTO hero_slides (title, subtitle, sort_order) VALUES ($1, $2, $3)',
        [s.title || '', s.subtitle || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/about', requireAdmin, express.json(), async (req, res) => {
  const { sectionTitle, sectionSubtitle, welcomeHeading, welcomeText, readMoreUrl } = req.body || {};
  try {
    const r = await query('SELECT id FROM about_section LIMIT 1');
    if (r.rows.length === 0) {
      await query(
        'INSERT INTO about_section (section_title, section_subtitle, welcome_heading, welcome_text, read_more_url) VALUES ($1, $2, $3, $4, $5)',
        [sectionTitle || '', sectionSubtitle || '', welcomeHeading || '', welcomeText || '', readMoreUrl || '']
      );
    } else {
      await query(
        'UPDATE about_section SET section_title = $1, section_subtitle = $2, welcome_heading = $3, welcome_text = $4, read_more_url = $5 WHERE id = $6',
        [sectionTitle ?? '', sectionSubtitle ?? '', welcomeHeading ?? '', welcomeText ?? '', readMoreUrl ?? '', r.rows[0].id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/api/admin/about-features', requireAdmin, express.json(), async (req, res) => {
  const { features } = req.body || {};
  if (!Array.isArray(features)) return res.status(400).json({ error: 'features array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM about_features');
    for (let i = 0; i < features.length; i++) {
      const f = features[i];
      await client.query(
        'INSERT INTO about_features (icon_class, title, description, sort_order) VALUES ($1, $2, $3, $4)',
        [f.icon_class || '', f.title || '', f.description || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/expertise', requireAdmin, express.json(), async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM expertise');
    for (let i = 0; i < items.length; i++) {
      const e = items[i];
      await client.query(
        'INSERT INTO expertise (label, percent, sort_order) VALUES ($1, $2, $3)',
        [e.label || '', Math.min(100, Math.max(0, parseInt(e.percent, 10) || 0)), i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/services', requireAdmin, express.json(), async (req, res) => {
  const { services } = req.body || {};
  if (!Array.isArray(services)) return res.status(400).json({ error: 'services array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM services');
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await client.query(
        'INSERT INTO services (icon_class, title, description, sort_order) VALUES ($1, $2, $3, $4)',
        [s.icon_class || '', s.title || '', s.description || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/get-started', requireAdmin, express.json(), async (req, res) => {
  const { heading, subheading, buttonText, buttonUrl } = req.body || {};
  try {
    const r = await query('SELECT id FROM get_started LIMIT 1');
    if (r.rows.length === 0) {
      await query(
        'INSERT INTO get_started (heading, subheading, button_text, button_url) VALUES ($1, $2, $3, $4)',
        [heading || '', subheading || '', buttonText || '', buttonUrl || '#home']
      );
    } else {
      await query(
        'UPDATE get_started SET heading = $1, subheading = $2, button_text = $3, button_url = $4 WHERE id = $5',
        [heading || '', subheading || '', buttonText || '', buttonUrl || '#home', r.rows[0].id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/api/admin/team', requireAdmin, express.json(), async (req, res) => {
  const { members } = req.body || {};
  if (!Array.isArray(members)) return res.status(400).json({ error: 'members array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM team_members');
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      await client.query(
        `INSERT INTO team_members (name, role, bio, image_url, facebook_url, twitter_url, skype_url, dribbble_url, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [m.name || '', m.role || '', m.bio || '', m.image_url || '', m.facebook_url || '', m.twitter_url || '', m.skype_url || '', m.dribbble_url || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/stats', requireAdmin, express.json(), async (req, res) => {
  const { stats } = req.body || {};
  if (!Array.isArray(stats)) return res.status(400).json({ error: 'stats array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM stats');
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      await client.query(
        'INSERT INTO stats (icon_class, number, label, sort_order) VALUES ($1, $2, $3, $4)',
        [s.icon_class || '', s.number || '', s.label || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/portfolio', requireAdmin, express.json(), async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM portfolio_items');
    for (let i = 0; i < items.length; i++) {
      const p = items[i];
      await client.query(
        'INSERT INTO portfolio_items (image_url, title, category, sort_order) VALUES ($1, $2, $3, $4)',
        [p.image_url || '', p.title || '', p.category || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/testimonials', requireAdmin, express.json(), async (req, res) => {
  const { testimonials } = req.body || {};
  if (!Array.isArray(testimonials)) return res.status(400).json({ error: 'testimonials array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM testimonials');
    for (let i = 0; i < testimonials.length; i++) {
      const t = testimonials[i];
      await client.query(
        'INSERT INTO testimonials (quote, author_name, author_role, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [t.quote || '', t.author_name || '', t.author_role || '', t.image_url || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/pricing', requireAdmin, express.json(), async (req, res) => {
  const { plans } = req.body || {};
  if (!Array.isArray(plans)) return res.status(400).json({ error: 'plans array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM pricing_plans');
    for (let i = 0; i < plans.length; i++) {
      const p = plans[i];
      const features = typeof p.features === 'string' ? p.features : (Array.isArray(p.features) ? p.features.join('\n') : '');
      await client.query(
        'INSERT INTO pricing_plans (title, price, features, button_text, sort_order) VALUES ($1, $2, $3, $4, $5)',
        [p.title || '', parseInt(p.price, 10) || 0, features, p.button_text || 'get started', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/blog', requireAdmin, express.json(), async (req, res) => {
  const { posts } = req.body || {};
  if (!Array.isArray(posts)) return res.status(400).json({ error: 'posts array required' });
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM blog_posts');
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      await client.query(
        'INSERT INTO blog_posts (title, excerpt, image_url, post_date, comment_count, link, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.title || '', p.excerpt || '', p.image_url || '', p.post_date || '', p.comment_count || '', p.link || '', i]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  } finally {
    client.release();
  }
});

router.put('/api/admin/contact', requireAdmin, express.json(), async (req, res) => {
  const { address, phone, email, website, map_embed_src } = req.body || {};
  try {
    const r = await query('SELECT id FROM contact_info LIMIT 1');
    if (r.rows.length === 0) {
      await query(
        'INSERT INTO contact_info (address, phone, email, website, map_embed_src) VALUES ($1, $2, $3, $4, $5)',
        [address || '', phone || '', email || '', website || '', map_embed_src || '']
      );
    } else {
      await query(
        'UPDATE contact_info SET address = $1, phone = $2, email = $3, website = $4, map_embed_src = $5 WHERE id = $6',
        [address || '', phone || '', email || '', website || '', map_embed_src || '', r.rows[0].id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.put('/api/admin/footer', requireAdmin, express.json(), async (req, res) => {
  const { about_heading, about_text, facebook_url, twitter_url, dribbble_url, skype_url, copyright_text } = req.body || {};
  try {
    const r = await query('SELECT id FROM footer LIMIT 1');
    if (r.rows.length === 0) {
      await query(
        'INSERT INTO footer (about_heading, about_text, facebook_url, twitter_url, dribbble_url, skype_url, copyright_text) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [about_heading || '', about_text || '', facebook_url || '', twitter_url || '', dribbble_url || '', skype_url || '', copyright_text || '']
      );
    } else {
      await query(
        'UPDATE footer SET about_heading = $1, about_text = $2, facebook_url = $3, twitter_url = $4, dribbble_url = $5, skype_url = $6, copyright_text = $7 WHERE id = $8',
        [about_heading || '', about_text || '', facebook_url || '', twitter_url || '', dribbble_url || '', skype_url || '', copyright_text || '', r.rows[0].id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
