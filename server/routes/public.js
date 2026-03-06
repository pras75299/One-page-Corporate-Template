const express = require('express');
const { getSiteContent } = require('../db');
const router = express.Router();

router.get('/api/content', async (req, res) => {
  try {
    const content = await getSiteContent();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

module.exports = router;
