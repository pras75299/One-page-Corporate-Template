# One-Page Corporate Template — Improvements & Branching Plan

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

## Part 2: Branching Plan (Keep Netlify Unchanged)

Goal: keep the **current static site on Netlify exactly as is**, and add **React** and **Next.js** versions on separate branches so they don’t affect the live site.

### Assumptions
- Netlify is connected to this repo and deploys **one branch** (typically `master` or `main`).
- You want that branch to remain the existing HTML/CSS/JS template.

### Branch strategy

| Branch        | Purpose                    | Deploy / use                         |
|---------------|----------------------------|--------------------------------------|
| `master`      | Current static template    | Netlify production (leave as is)    |
| `template-react` | React (e.g. CRA or Vite) | Optional: Netlify branch deploy or local |
| `template-nextjs` | Next.js template        | Optional: Netlify branch deploy or Vercel |

### Step-by-step

1. **Leave `master` untouched for production**
   - Do not merge React or Next.js code into `master` unless you later decide to replace the static site.
   - Netlify continues to build and publish from `master` (or whatever branch you have set now).

2. **Create the React template branch**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b template-react
   ```
   - In `template-react`: create a new React app (e.g. `npx create-react-app .` in a subfolder like `react-app/`, or use Vite in `react-app/`) and rebuild the same layout/sections with React components.
   - Do **not** delete or overwrite the root `index.html` and `assets/` if you want to keep the static version in the same repo; keep the React app in a subfolder (e.g. `react-app/`) or build the React app so its build output is in a subfolder (e.g. `dist/` or `build/` inside `react-app/`).
   - Optional: add a `README` in `template-react` explaining how to run and build the React version.

3. **Create the Next.js template branch**
   ```bash
   git checkout master
   git checkout -b template-nextjs
   ```
   - In `template-nextjs`: create a Next.js app (e.g. `npx create-next-app@latest .` again in a subfolder like `next-app/` to avoid clashing with existing files) and replicate the same one-page layout with Next.js components.
   - Same idea: keep the original `index.html` and `assets/` at repo root if you want the option to compare or keep static version in the same branch.

4. **Netlify configuration**
   - In Netlify: **Site settings → Build & deploy → Continuous deployment → Branch to deploy**: keep this set to `master` (or your current production branch). Do **not** change it to `template-react` or `template-nextjs` unless you want those to be the live site.
   - Optional: use **Netlify branch deploys** so that pushes to `template-react` or `template-nextjs` generate preview URLs (e.g. `template-react--yoursite.netlify.app`). That way you can test without affecting the main site.

5. **Optional: deploy React/Next elsewhere**
   - You can deploy the React build from `template-react` to another Netlify site, or to Vercel/other host.
   - Next.js from `template-nextjs` is a good fit for Vercel; you can connect the same repo and set “Production branch” to `template-nextjs` for a separate Next.js site.

### Summary

- **Existing template and Netlify:** Stay on `master`; no branch or deploy changes required.
- **React version:** New branch `template-react`, React app in a subfolder; merge to `master` only if you later want to replace the static site.
- **Next.js version:** New branch `template-nextjs`, Next.js app in a subfolder; same idea.
- **No impact on current site:** As long as Netlify keeps deploying `master` and you don’t merge the new stacks into `master`, the live site stays exactly as it is.

If you tell me whether you prefer the React and Next apps in subfolders (e.g. `react-app/`, `next-app/`) or a full replacement of the root in those branches, I can outline the exact folder structure and Netlify build settings for each.
