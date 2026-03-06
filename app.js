require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const { getSiteContent } = require('./server/db');
const publicRoutes = require('./server/routes/public');
const adminRoutes = require('./server/routes/admin');

const app = express();

// Strip Netlify function path so "/" and "/admin" etc. match correctly (fixes "Cannot GET /")
app.use((req, res, next) => {
  const prefix = '/.netlify/functions/server';
  if (req.path === prefix || req.path.startsWith(prefix + '/')) {
    req.url = (req.path === prefix ? '/' : req.path.slice(prefix.length)) || '/';
  }
  next();
});

// On Netlify, the function runs from netlify/functions/ so __dirname points there; views/assets are at repo root
const rootDir = /netlify[/\\]functions/.test(__dirname)
  ? path.resolve(__dirname, '..', '..')
  : __dirname;

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'corporate-template-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use(express.static(path.join(rootDir, 'public')));

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

const homeHandler = async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return res.status(500).send('Site content unavailable. Set DATABASE_URL in Netlify environment variables.');
    }
    const content = await getSiteContent();
    res.render('home', content);
  } catch (err) {
    console.error('getSiteContent failed:', err.message);
    res.status(500).send(
      'Site content unavailable. Set DATABASE_URL in env, then run (against that DB): npm run init-db && npm run seed. Check function logs for details.'
    );
  }
};
app.get('/', homeHandler);
app.get('', homeHandler); // Netlify sometimes forwards with path ""

module.exports = app;
