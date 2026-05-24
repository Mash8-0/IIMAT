const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// POST /api/auth/register  — only super_admin can create new users
router.post('/register', protect, authorize('super_admin'), validateRegister, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
