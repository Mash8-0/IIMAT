const router = require('express').Router();
const {
  createInquiry, getAllInquiries, getInquiryById, updateInquiryStatus, deleteInquiry,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateInquiry } = require('../validators/inquiryValidator');

// POST /api/inquiries  — public contact form
router.post('/', validateInquiry, createInquiry);

// Admin routes
router.get('/admin', protect, getAllInquiries);
router.get('/admin/:id', protect, getInquiryById);
router.put('/admin/:id/status', protect, authorize('super_admin', 'admin', 'staff'), updateInquiryStatus);
router.delete('/admin/:id', protect, authorize('super_admin', 'admin'), deleteInquiry);

module.exports = router;
