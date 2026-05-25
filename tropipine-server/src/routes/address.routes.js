const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getAddresses, addAddress, updateAddress, setDefaultAddress, deleteAddress } = require('../controllers/address.controller');

router.get('/', authenticate, getAddresses);
router.post('/', authenticate, addAddress);
router.patch('/:id', authenticate, updateAddress);
router.patch('/:id/default', authenticate, setDefaultAddress);
router.delete('/:id', authenticate, deleteAddress);

module.exports = router;
