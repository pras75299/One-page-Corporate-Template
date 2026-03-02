require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const { getSiteContent } = require('./server/db');
const publicRoutes = require('./server/routes/public');
const adminRoutes = require('./server/routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'corporate-template-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(publicRoutes);
app.use(adminRoutes);

app.get('/admin/login', (req, res) => {
  if (req.session && req.session.admin) return res.redirect('/admin');
  res.render('admin/login');
});

app.get('/admin', (req, res, next) => {
  if (!req.session || !req.session.admin) return res.redirect('/admin/login');
  next();
}, async (req, res) => {
  try {
    const content = await getSiteContent();
    res.render('admin/dashboard', { content });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load admin');
  }
});

app.get('/', async (req, res) => {
  try {
    const content = await getSiteContent();
    res.render('home', content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Site content unavailable. Run npm run seed after setting up the database.');
  }
});

module.exports = app;
