# One-Page Corporate Template — Improvements & Branching Plan

**Status:** Part 1 (improvements) applied. Part 2 (React/Next.js branching) removed in favour of Admin Panel + Backend.

- **Part 1** is committed on `master`: typos, SEO meta, a11y (alt text, main, scroll-to-top), Netlify Forms, CSS variables, preloader timeout, MixItUp removed, Font Awesome CDN.
- **Admin + Backend (new):** Node.js, Express, PostgreSQL backend with an admin panel so users can update site content; changes reflect on the main page (see Part 3 below).

---

## Part 1: Code Review & Improvements

### 1. Fix typos and consistency
- **HTML**: `smoth-scroll` → `smooth-scroll` (throughout).
- **HTML**: "Responsive Desgin" → "Responsive Design" (Services section).
- **CSS** (`style.css` ~line 519): `text-transform: lowarecase` → `lowercase`.
- **HTML**: Favicon link says `type="image/png"` but href is `favicon.ico` — use one format and fix path if `assets/img/` is used.

### 2. Missing or broken assets
The following are referenced but not present in the repo (or may be in `.gitignore`):

- `assets/css/font-awesome.min.css`
- `assets/js/owl.carousel.min.js`
- `assets/js/jquery.magnific-popup.min.js`
- `assets/img/` (favicon, team, work, blog, testimonial, bg slides)
- `assets/php/contact.php`

**Actions:** Add these files to the repo, or switch to CDN for JS/CSS (e.g. Font Awesome, Owl Carousel, Magnific Popup) and ensure all image paths exist. Add a placeholder or serverless endpoint for the contact form if you keep `contact.php`.

### 3. JavaScript: MixItUp and work section
- `scripts.js` calls `$(".work-inner").mixItUp({...})` with `target: ".mix"` and `filter: ".filter"`.
- In `index.html`, the filter buttons are commented out and work items use classes like `design`, `development`, `print`, `video` — not `mix`. So MixItUp either never runs correctly or requires a script that’s not included.

**Options:**  
- Remove the MixItUp block from `scripts.js` and keep the work grid as static, or  
- Add the MixItUp library, uncomment the filter list, and add the `mix` class (and keep filter classes) to each work item so filtering works.

### 4. Accessibility (a11y)
- Add `alt` text to all images (e.g. team, work, blog, testimonial) instead of empty `alt=""`.
- Ensure carousel controls and “scroll to top” are focusable and have clear labels (you already have `aria-label` on carousel; keep it and ensure no focus traps).
- Section headings are in order; keep one `<h1>` per page (e.g. “we are creative agency” or site title) and use `<h2>` for section titles.
- Footer/header links: use `href="#"` only where needed; consider `role="button"` and `tabindex="0"` for non-link actions, or real URLs.

### 5. SEO and meta
- Add `<meta name="description" content="...">` and optional Open Graph / Twitter meta tags for sharing.
- Prefer one clear `<h1>` and semantic sections (`<header>`, `<main>`, `<section>`, `<footer>`); structure is already mostly good.

### 6. Performance
- Consider `loading="lazy"` for below-the-fold images (work, blog, team, testimonial).
- Preload critical fonts if you rely on them for above-the-fold text.
- You already use CDN for Bootstrap and jQuery; ensure Owl, Magnific Popup, and Font Awesome are either bundled or loaded from a single CDN to limit requests.

### 7. Contact form
- Form posts to `assets/php/contact.php`. On static Netlify hosting, PHP won’t run.
- Options: Netlify Forms (add `netlify` or `data-netlify="true"` to the form and name fields), or a serverless function (e.g. Netlify Function) that sends email or stores submissions.

### 8. Security and validation
- Keep server-side validation (or serverless validation) for contact form; add client-side validation for better UX (e.g. required fields, email format).
- No need to change anything else for a static site if you don’t store secrets in the repo.

### 9. Semantic and markup
- “great in touch” (contact heading) → e.g. “Get in touch”.
- Footer “great-started” button text → e.g. “Get started”.
- Consider wrapping the main content (between header and footer) in `<main>`.

### 10. CSS / UX
- `.plan-month span` has a typo (`lowarecase` → `lowercase`).
- Consider CSS variables for brand color (e.g. `#23d175`) so React/Next versions can theme easily.
- Preloader: ensure it hides even if `load` never fires (e.g. timeout fallback) so the page doesn’t stay blank on slow networks.

---

## Part 3: Admin Panel + Backend (PostgreSQL, Node.js, Express)

Goal: allow content updates through an **admin panel**; the main page reflects data stored in **PostgreSQL**, served by a **Node.js + Express** backend. No React or Next.js — admin UI is server-rendered (e.g. EJS) or plain HTML/JS.

### Stack
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Admin UI:** Server-rendered pages (EJS) or static HTML + fetch to API; simple login (session) to protect admin routes
- **Public site:** Home page rendered from DB (EJS template) so edits in admin immediately show on the main page

### Features
- **Admin panel:** Login; edit site meta (title, description, logo); hero slides; about section and features; expertise bars; services; team members; stats (fun facts); portfolio items; testimonials; pricing plans; blog posts; contact info and footer.
- **API:** Public `GET /api/content` (or inline in render) for all site content; protected `GET/PUT/POST` for admin to update each section.
- **Reflect on index:** The main route (e.g. `GET /`) renders the same layout as the current `index.html` but with data from the database, so any change in admin is visible on the next load.

### Deployment note
- The static `index.html` can remain in the repo for reference or fallback; production can run the Express server and use the DB-driven page as the home page.
- Netlify (static) would no longer serve the dynamic home page unless you use Netlify Functions or deploy the Node app elsewhere (e.g. Railway, Render, VPS).

### (Removed) React/Next.js template idea
- The previous plan to add **template-react** and **template-nextjs** branches has been removed. You may delete those branches from the repo if they exist and are no longer needed.


