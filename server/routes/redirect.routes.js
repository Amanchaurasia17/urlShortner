const express = require('express');
const router = express.Router();
const { redirectToOriginal } = require('../controllers/redirect.controller');

// GET /:shortCode - Redirect to original URL
router.get('/:shortCode', redirectToOriginal);

module.exports = router;
