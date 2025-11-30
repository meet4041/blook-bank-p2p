const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createBloodRequest,
  getAllRequests,
  getRequestById,
  updateBloodRequest,
  patchBloodRequest,
  deleteBloodRequest,
  updateStatus
} = require('../controllers/bloodRequestController');

// Public — view requests
router.get('/', getAllRequests);
router.get('/:id', getRequestById);

// Authenticated users - CHANGED: Added 'hospital' to allowRoles
router.post('/', authMiddleware, roleMiddleware.allowRoles('user', 'hospital'), createBloodRequest);

router.put('/:id', authMiddleware, roleMiddleware.allowRoles('user', 'admin'), updateBloodRequest);
router.patch('/:id', authMiddleware, roleMiddleware.allowRoles('user', 'admin'), patchBloodRequest);
router.delete('/:id', authMiddleware, roleMiddleware.allowRoles('user', 'admin'), deleteBloodRequest);

// Hospital/Admin — update request status
router.patch('/:id/status', authMiddleware, roleMiddleware.allowRoles('admin', 'hospital'), updateStatus);

module.exports = router;