const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createBloodRequest,
  getAllRequests,
  getRequestById,
  updateBloodRequest,
  patchBloodRequest,
  deleteBloodRequest,
  updateStatus
} = require('../controllers/bloodRequestController');

// Public - View all blood requests
router.get('/', getAllRequests);

// Public - View single request
router.get('/:id', getRequestById);

// Protected - Create new blood request
router.post('/', authMiddleware, createBloodRequest);

// Protected - Update whole object (PUT)
router.put('/:id', authMiddleware, updateBloodRequest);

// Protected - Partial update (PATCH)
router.patch('/:id', authMiddleware, patchBloodRequest);

// Protected - Update only status (approve / reject)
router.patch('/:id/status', authMiddleware, updateStatus);

// Protected - Delete blood request
router.delete('/:id', authMiddleware, deleteBloodRequest);

module.exports = router;
