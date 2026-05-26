const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { submitMessage, listMessages, markRead } = require('../controllers/contact.controller');

router.post('/', submitMessage);
router.get('/', authenticate, requireAdmin, listMessages);
router.patch('/:id/read', authenticate, requireAdmin, markRead);

module.exports = router;
