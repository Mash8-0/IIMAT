const router = require('express').Router();
const {
  createApplication, getAllApplications, getApplicationById,
  updateApplicationStatus, updateRemarks, deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateApplication } = require('../validators/applicationValidator');
const { uploadApplication } = require('../middleware/uploadMiddleware');

// POST /api/applications  — public application form
router.post('/', uploadApplication, validateApplication, createApplication);

// Admin routes
router.get('/admin', protect, getAllApplications);
router.get('/admin/:id', protect, getApplicationById);
router.put('/admin/:id/status', protect, authorize('super_admin', 'admin', 'staff'), updateApplicationStatus);
router.put('/admin/:id/remarks', protect, authorize('super_admin', 'admin', 'staff'), updateRemarks);
router.delete('/admin/:id', protect, authorize('super_admin', 'admin'), deleteApplication);

module.exports = router;
