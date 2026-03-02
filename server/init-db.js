/**
 * Create database tables from schema.sql. Loads .env and uses DATABASE_URL.
 * Run: npm run init-db
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

async function init() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Create a .env file with DATABASE_URL.');
    process.exit(1);
  }
  const sqlPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('Schema applied successfully.');
  pool.end();
}

init().catch((err) => {
  console.error('Init failed:', err.message);
  process.exit(1);
});
