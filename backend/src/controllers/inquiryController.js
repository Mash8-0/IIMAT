const prisma = require('../config/db');
const { success, created, notFound, badRequest } = require('../utils/responseHandler');

// POST /api/inquiries (public)
const createInquiry = async (req, res, next) => {
  try {
    const { fullName, email, phone, interestedProgramme, message, source } = req.body;
    const inquiry = await prisma.inquiry.create({
      data: { fullName, email, phone, interestedProgramme, message, source: source || 'website' },
    });
    return created(res, inquiry, 'Inquiry submitted successfully. We will contact you shortly.');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/inquiries
const getAllInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.inquiry.count({ where }),
    ]);

    return success(res, inquiries, 'Success', 200, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/inquiries/:id
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return notFound(res, 'Inquiry not found');
    return success(res, inquiry);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/inquiries/:id/status
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID = ['new', 'contacted', 'processing', 'completed', 'rejected'];
    if (!VALID.includes(status)) return badRequest(res, `Invalid status. Must be one of: ${VALID.join(', ')}`);

    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return notFound(res, 'Inquiry not found');

    const updated = await prisma.inquiry.update({ where: { id: req.params.id }, data: { status } });
    return success(res, updated, 'Inquiry status updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/inquiries/:id
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
    if (!inquiry) return notFound(res, 'Inquiry not found');
    await prisma.inquiry.delete({ where: { id: req.params.id } });
    return success(res, null, 'Inquiry deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { createInquiry, getAllInquiries, getInquiryById, updateInquiryStatus, deleteInquiry };
