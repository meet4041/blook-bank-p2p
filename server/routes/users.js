const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware'); 
const roleMiddleware = require('../middleware/roleMiddleware'); 
const { getAllUsers, getAllHospitals, deleteUser } = require('../controllers/userController');

router.use(authMiddleware);
router.use(roleMiddleware.allowRoles('admin'));
router.get('/users', getAllUsers);
router.get('/hospitals', getAllHospitals);
router.delete('/:id', deleteUser);

module.exports = router;