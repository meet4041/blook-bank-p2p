const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  patchDonor,
  deleteDonor
} = require('../controllers/donorController');

// Public - Get all donors
router.get('/', getAllDonors);

// Public - Get donor by ID
router.get('/:id', getDonorById);

// Protected - Create donor
router.post('/', authMiddleware, createDonor);

// Protected - Update donor (PUT)
router.put('/:id', authMiddleware, updateDonor);

// Protected - Patch donor
router.patch('/:id', authMiddleware, patchDonor);

// Protected - Delete donor
router.delete('/:id', authMiddleware, deleteDonor);

module.exports = router;
