const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
} = require('../controllers/delivery.controller');

router.get('/', getDeliveryZones);
router.post('/', authenticate, requireAdmin, createDeliveryZone);
router.patch('/:id', authenticate, requireAdmin, updateDeliveryZone);
router.delete('/:id', authenticate, requireAdmin, deleteDeliveryZone);

module.exports = router;
