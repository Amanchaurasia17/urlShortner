const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation');
const {
  shortenUrl,
  getUrlDetails,
  getAllUrls,
  deleteUrl,
  updateUrl
} = require('../controllers/url.controller');

// POST /api/url/shorten - Create short URL
router.post('/shorten', validate('createUrl'), shortenUrl);

// GET /api/url/:shortCode - Get URL details
router.get('/:shortCode', getUrlDetails);

// GET /api/url - Get all URLs (paginated)
router.get('/', getAllUrls);

// DELETE /api/url/:shortCode - Delete URL
router.delete('/:shortCode', deleteUrl);

// PUT /api/url/:shortCode - Update URL
router.put('/:shortCode', validate('updateUrl'), updateUrl);

module.exports = router;
