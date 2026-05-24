const router = require('express').Router();
const {
  getAllProgrammes, getProgrammeBySlug, getProgrammesBySchool,
  adminGetAllProgrammes, createProgramme, updateProgramme, deleteProgramme,
} = require('../controllers/programmeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateProgramme } = require('../validators/programmeValidator');
const { uploadProgramme } = require('../middleware/uploadMiddleware');

// ── Public routes ─────────────────────────────────────────────────────────────
// NOTE: /school/:schoolSlug must come BEFORE /:slug to avoid route conflict
router.get('/school/:schoolSlug', getProgrammesBySchool);
router.get('/', getAllProgrammes);
router.get('/:slug', getProgrammeBySlug);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin/all', protect, adminGetAllProgrammes);
router.post('/admin', protect, authorize('super_admin', 'admin'), uploadProgramme, validateProgramme, createProgramme);
router.put('/admin/:id', protect, authorize('super_admin', 'admin'), uploadProgramme, validateProgramme, updateProgramme);
router.delete('/admin/:id', protect, authorize('super_admin', 'admin'), deleteProgramme);

module.exports = router;
