# Project Name: One-Page Template

## Description

This project is a responsive, lightweight one-page template designed to showcase [specific type of content, e.g., personal portfolio, product, event]. It's built with HTML, CSS, jQuery, and Bootstrap, making it easily customizable and adaptable to various needs.

## Features

- **Responsive Design**: Ensures that the website looks great on devices of all sizes.
- **Bootstrap Framework**: Utilizes Bootstrap for consistent styling and layout.
- **jQuery Integration**: Enhances the template with interactive elements.

## Getting Started

To get a local copy up and running, follow these simple steps.

- Open index.html file in any browser

### Prerequisites

- A modern web browser.
- Basic knowledge of HTML, CSS, and JavaScript.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/pras75299/One-page-Corporate-Template.git
   ```

## Admin panel + backend (Node.js, Express, PostgreSQL)

You can run the site with a backend so content is stored in PostgreSQL and editable via an admin panel. Changes in the admin reflect on the main page.

### Setup

1. **PostgreSQL**: Create a database and set `DATABASE_URL` in a `.env` file (see `.env.example`).
2. **Schema**: Create tables with  
   `psql $DATABASE_URL -f server/schema.sql`
3. **Seed**: Populate default content and admin user with  
   `npm run seed`  
   Default admin: username `admin`, password `admin123` (or set `ADMIN_PASSWORD` in `.env`).
4. **Run**: `npm install` then `npm start`. Open http://localhost:3000 for the site and http://localhost:3000/admin to log in and edit content.

## Deploy to Netlify (backend + dynamic “index”)

The repo is set up so the **entire backend runs on Netlify** as a serverless function. The site’s home page (“index”) is **not** a static file; it’s rendered from the database on every request, so updates in the admin panel are reflected as soon as someone visits the site.

### Netlify setup

1. **Connect the repo** to Netlify (GitHub/GitLab/Bitbucket).
2. **Build settings** (optional): build command can stay empty or use `echo 'Functions only'`; publish directory = `public`.
3. **Environment variables** (Site settings → Environment variables):
   - `DATABASE_URL` – your PostgreSQL connection string (e.g. from Neon, Supabase, Railway).
   - `SESSION_SECRET` – a long random string for admin sessions.
   - `ADMIN_PASSWORD` – (optional) used when you run `npm run seed`; set before seeding the production DB.
4. **Deploy**. All traffic is redirected to the Express app (see `netlify.toml`). The home page and `/admin` are served by the backend; content comes from the database.

### One-time database setup for production

From your machine (with `DATABASE_URL` in `.env` pointing at the **production** DB):

- `npm run init-db` – create tables  
- `npm run seed` – insert default content and admin user  

After that, the Netlify site will read the same DB; changes in the admin will show up on the next page load.
