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
