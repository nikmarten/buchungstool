const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Öffentliche Routen
router.post('/register', userController.register);
router.post('/login', userController.login);

// Geschützte Routen
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router; 