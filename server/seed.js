/**
 * Seed the database with default content from the original index.html.
 * Run: npm run seed (after DATABASE_URL is set and schema is applied)
 */
require('dotenv').config();
const { pool, query } = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = await pool.connect();
  try {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await client.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ('admin', $1) ON CONFLICT (username) DO NOTHING`,
      [passwordHash]
    );

    await client.query(`
      INSERT INTO site_settings (key, value) VALUES
        ('meta_title', 'Corporate Template'),
        ('meta_description', 'One-page corporate template — creative agency, services, team, portfolio, and contact.'),
        ('logo_text', 'Company'),
        ('footer_copyright', '©2017 - All Right Reserved.')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `);

    await client.query('DELETE FROM hero_slides');
    await client.query(`
      INSERT INTO hero_slides (title, subtitle, sort_order) VALUES
        ('We are creative agency', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry\nsimply dummy text of the printing and typesetting industry', 0),
        ('we are creative developer', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry\nsimply dummy text of the printing and typesetting industry', 1),
        ('we do design & development', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry\nsimply dummy text of the printing and typesetting industry', 2)
    `);

    await client.query('DELETE FROM about_section');
    await client.query(`
      INSERT INTO about_section (section_title, section_subtitle, welcome_heading, welcome_text, read_more_url) VALUES
        ('about us', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed ation Lorem ipsum dolor sit amet. Veniam quis notru exercit.',
         'welcome to <span>nastro</span>',
         'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
         '#')
    `);

    await client.query('DELETE FROM about_features');
    await client.query(`
      INSERT INTO about_features (icon_class, title, description, sort_order) VALUES
        ('fa-mobile', 'Fully Responsive', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed ation Lorem ipsum', 0),
        ('fa-code', 'clean code', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed ation Lorem ipsum', 1),
        ('fa-check-square', 'Easy To Customize', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed ation Lorem ipsum', 2)
    `);

    await client.query('DELETE FROM expertise');
    await client.query(`
      INSERT INTO expertise (label, percent, sort_order) VALUES
        ('graphic design', 90, 0),
        ('Web design', 85, 1),
        ('development', 90, 2),
        ('wordpress', 95, 3),
        ('jQuery', 80, 4)
    `);

    await client.query('DELETE FROM services');
    await client.query(`
      INSERT INTO services (icon_class, title, description, sort_order) VALUES
        ('fa-briefcase', 'Web Design', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 0),
        ('fa-briefcase', 'Responsive Design', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 1),
        ('fa-briefcase', 'Marketing', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 2),
        ('fa-briefcase', 'Development', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 3),
        ('fa-briefcase', 'Retina Ready', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 4),
        ('fa-briefcase', 'Seo Ready', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam justo et nibh venenati.', 5)
    `);

    await client.query('DELETE FROM get_started');
    await client.query(`
      INSERT INTO get_started (heading, subheading, button_text, button_url) VALUES
        ('We Are Ready to Help You', 'Get the Best Solution for Your Business', 'Get started', '#home')
    `);

    await client.query('DELETE FROM team_members');
    await client.query(`
      INSERT INTO team_members (name, role, bio, image_url, facebook_url, twitter_url, skype_url, dribbble_url, sort_order) VALUES
        ('John Doe', 'web developer', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'assets/img/team/1.png', '#', '#', '#', '#', 0),
        ('Satya Raman', 'graphic designer', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed.', 'assets/img/team/2.png', '#', '#', '#', '#', 1),
        ('John Doe', 'social marketing', 'Lorem ipsum dolor sit amet consectetur adipisicing elitsed.', 'assets/img/team/3.png', '#', '#', '#', '#', 2)
    `);

    await client.query('DELETE FROM stats');
    await client.query(`
      INSERT INTO stats (icon_class, number, label, sort_order) VALUES
        ('fa-thumbs-o-up', '1200', 'project complete', 0),
        ('fa-users', '600', 'Happy Customer', 1),
        ('fa-clock-o', '800', 'Working Hours', 2),
        ('fa-coffee', '400', 'Cups of Coffee', 3)
    `);

    await client.query('DELETE FROM portfolio_items');
    const workImages = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < workImages.length; i++) {
      await client.query(
        'INSERT INTO portfolio_items (image_url, title, category, sort_order) VALUES ($1, $2, $3, $4)',
        [`assets/img/work/${workImages[i]}.jpg`, 'project name', 'development', i]
      );
    }

    await client.query('DELETE FROM testimonials');
    await client.query(`
      INSERT INTO testimonials (quote, author_name, author_role, image_url, sort_order) VALUES
        ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s.', 'Mark Zuckerberg', 'ceo of facebook', 'assets/img/testimonial/1.jpg', 0),
        ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s.', 'Jack Dorsey', 'ceo of twitter', 'assets/img/testimonial/2.jpg', 1),
        ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s.', 'Sundar Pichai', 'ceo of google', 'assets/img/testimonial/3.jpg', 2)
    `);

    const planFeatures = 'Basic Updates\nBasic Features\nCommunity Support\n10 domain user\nsub-domain support\n10 ftp account';
    await client.query('DELETE FROM pricing_plans');
    await client.query(`
      INSERT INTO pricing_plans (title, price, features, button_text, sort_order) VALUES
        ('starter', 59, $1, 'get started', 0),
        ('premium', 59, $1, 'get started', 1),
        ('ultimate', 59, $1, 'get started', 2)
    `, [planFeatures]);

    await client.query('DELETE FROM blog_posts');
    await client.query(`
      INSERT INTO blog_posts (title, excerpt, image_url, post_date, comment_count, link, sort_order) VALUES
        ('blog post title here', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'assets/img/blog/1.jpg', '12 dec 2016', '30 comment', '#', 0),
        ('blog post title here', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'assets/img/blog/2.jpg', '12 dec 2016', '30 comment', '#', 1),
        ('blog post title here', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'assets/img/blog/3.jpg', '12 dec 2016', '30 comment', '#', 2)
    `);

    await client.query('DELETE FROM contact_info');
    await client.query(`
      INSERT INTO contact_info (address, phone, email, website, map_embed_src) VALUES
        ('New Delhi, Delhi', '+1266-3333-77', 'info@your-mail.com', 'www.sitename.com',
         'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.481719333196!2d77.08605677505368!3d28.495151090306933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19b7b90aaef7%3A0xabe8ba0fd3380c83!2scyberhub!5e0!3m2!1sen!2sin!4v1713441639344!5m2!1sen!2sin')
    `);

    await client.query('DELETE FROM footer');
    await client.query(`
      INSERT INTO footer (about_heading, about_text, facebook_url, twitter_url, dribbble_url, skype_url, copyright_text) VALUES
        ('about <span>nastro</span>', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type', '', '', '', '', '©2017 - All Right Reserved.')
    `);

    console.log('Seed completed. Default admin: username=admin, password=admin123 (or ADMIN_PASSWORD env)');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
