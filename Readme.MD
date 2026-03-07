# One-Page Corporate Template

A responsive one-page corporate/agency template with an **admin panel** and **PostgreSQL** backend. Content (hero, team, portfolio, testimonials, blog, etc.) is stored in the database and editable via the admin; the same app runs locally or on **Netlify** as a serverless function.

## Features

- **Responsive design** – Bootstrap 3, works on all screen sizes
- **Database-driven content** – Hero slides, team, work, testimonials, blog, pricing, contact
- **Admin panel** – Edit all content at `/admin` (login required)
- **Static assets** – Images, CSS, and JS served from `/assets` (CDN on Netlify)
- **Netlify-ready** – Full backend runs as a serverless function; images and assets served from the publish directory

## Tech stack

- **Frontend:** HTML (EJS), Bootstrap 5, jQuery, Owl Carousel, Magnific Popup
- **Backend:** Node.js, Express, EJS, express-session
- **Database:** PostgreSQL
- **Deploy:** Netlify (Functions + static publish)

---

## Local setup

Follow these steps to run the project on your machine.

### Prerequisites

- **Node.js** 18 or later
- **PostgreSQL** (local install or a hosted DB e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))

### 1. Clone and install

```bash
git clone https://github.com/pras75299/One-page-Corporate-Template.git
cd One-page-Corporate-Template
npm install
```

### 2. Environment variables

Copy the example env file and edit it:

```bash
cp .env.example .env
```

Edit `.env` and set:


| Variable         | Description                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/corporate_template`) |
| `SESSION_SECRET` | Random string for admin sessions (use a long random value in production)                           |
| `ADMIN_PASSWORD` | Password for the admin user (used when you run the seed; set before seeding)                       |


Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/corporate_template
SESSION_SECRET=your-secret-key-change-in-production
ADMIN_PASSWORD=your-secure-password
```

### 3. Database setup

Create the schema and seed default content (and the admin user):

```bash
npm run init-db    # Creates tables
npm run seed       # Inserts default content + admin user (uses ADMIN_PASSWORD from .env)
```

### 4. Run the app

```bash
npm start
```

- **Site:** [http://localhost:3000](http://localhost:3000)  
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (login: `admin` / password from `ADMIN_PASSWORD`)

---

## Running without the backend (static only)

You can open the static `index.html` in a browser for a quick look. It uses hardcoded content and relative asset paths; for full content editing and production-like behavior, use the Node/Express setup above.

---

## Deploy to Netlify

The repo is configured so the **entire backend runs as a Netlify serverless function**. The home page is rendered from the database on each request; the admin panel is at `/admin`. **Images and other assets** (`/assets/`*) are served from the publish directory so they load quickly from the CDN.

### Netlify build settings

- **Build command:** `cp -r assets public/assets`  
(This copies images, CSS, and JS into the publish directory so Netlify can serve them at `/assets/`*.)
- **Publish directory:** `public`
- **Functions directory:** `netlify/functions`

### Environment variables (Netlify UI)

In **Site settings → Environment variables**, add:


| Variable         | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string for your **production** database                                 |
| `SESSION_SECRET` | Long random string for admin sessions                                                         |
| `ADMIN_PASSWORD` | Optional; only needed if you seed the production DB (set before running seed against that DB) |


### One-time production database setup

From your machine, point `.env` at the **production** database (the same `DATABASE_URL` as in Netlify), then run:

```bash
npm run init-db    # Create tables
npm run seed       # Insert default content and admin user
```

After that, the Netlify site will use that database; changes in the admin will appear on the next page load.

### How it works on Netlify

- **Redirects** (in `netlify.toml`): Requests to `/assets/`* are served from the publish directory (images, CSS, JS). All other routes go to the Express app via `/.netlify/functions/server`.
- **Images:** Stored under `assets/img/` (team, work, testimonials, blog, etc.). The build copies them into `public/assets/` so they are available at `/assets/img/...`. The app also normalizes image URLs (with or without a leading slash) so they work everywhere.

---

## Scripts


| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm start`       | Run the Express server (default port 3000)        |
| `npm run init-db` | Create PostgreSQL tables from `server/schema.sql` |
| `npm run seed`    | Seed default content and create admin user        |


---

## Project structure (relevant parts)

```
├── app.js                 # Express app (routes, static, views)
├── server.js              # Local entry (starts app on a port)
├── server/
│   ├── schema.sql         # DB schema
│   ├── seed.js            # Seed data + admin user
│   ├── db.js              # DB connection + getSiteContent()
│   ├── routes/            # public + admin routes
│   └── ...
├── views/                 # EJS templates (home, admin, partials)
├── assets/                # Images, CSS, JS (copied to public/assets on Netlify build)
│   ├── img/
│   ├── css/
│   └── js/
├── public/                # Netlify publish dir (assets copied here during build)
├── netlify/
│   └── functions/
│       └── server.js      # Netlify function entry (wraps app)
└── netlify.toml           # Build + redirects (assets first, then function)
```

---

## License

Use and modify as needed for your project.