const prisma = require('../config/db');
const { success, created, notFound, badRequest } = require('../utils/responseHandler');

const APPLICATION_STATUSES = [
  'submitted', 'under_review', 'offer_letter_processing',
  'offer_letter_issued', 'admitted', 'rejected',
];

// POST /api/applications (public)
const createApplication = async (req, res, next) => {
  try {
    const {
      studentName, email, phone, passportNo, nationality,
      dateOfBirth, selectedProgramme, academicQualification, englishQualification,
    } = req.body;

    // Build document records from multer fields
    const docs = [];
    const fields = req.files || {};
    for (const [fieldName, fileArr] of Object.entries(fields)) {
      for (const file of fileArr) {
        docs.push({
          documentType: fieldName,   // passport | academic | photo | english_cert | other
          fileName: file.originalname,
          filePath: `/uploads/applications/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
        });
      }
    }

    const application = await prisma.application.create({
      data: {
        studentName, email, phone, passportNo, nationality,
        dateOfBirth: new Date(dateOfBirth),
        selectedProgramme, academicQualification, englishQualification,
        documents: { create: docs },
      },
      include: { documents: true },
    });

    return created(res, application, 'Application submitted successfully. We will review and contact you.');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/applications
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.applicationStatus = status;
    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { passportNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { documents: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.application.count({ where }),
    ]);

    return success(res, applications, 'Success', 200, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { documents: true },
    });
    if (!application) return notFound(res, 'Application not found');
    return success(res, application);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return badRequest(res, `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`);
    }

    const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!existing) return notFound(res, 'Application not found');

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { applicationStatus: status },
    });
    return success(res, updated, 'Application status updated');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/applications/:id/remarks
const updateRemarks = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!existing) return notFound(res, 'Application not found');

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { remarks },
    });
    return success(res, updated, 'Remarks updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const existing = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!existing) return notFound(res, 'Application not found');
    await prisma.application.delete({ where: { id: req.params.id } });
    return success(res, null, 'Application deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  updateRemarks,
  deleteApplication,
};
