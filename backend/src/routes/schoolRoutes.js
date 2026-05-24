const router = require('express').Router();
const {
  getAllSchools, getSchoolBySlug,
  adminGetAllSchools, createSchool, updateSchool, deleteSchool,
} = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateSchool } = require('../validators/schoolValidator');
const { uploadSchool } = require('../middleware/uploadMiddleware');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getAllSchools);
router.get('/:slug', getSchoolBySlug);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin/all', protect, adminGetAllSchools);
router.post('/admin', protect, authorize('super_admin', 'admin'), uploadSchool, validateSchool, createSchool);
router.put('/admin/:id', protect, authorize('super_admin', 'admin'), uploadSchool, validateSchool, updateSchool);
router.delete('/admin/:id', protect, authorize('super_admin', 'admin'), deleteSchool);

module.exports = router;
