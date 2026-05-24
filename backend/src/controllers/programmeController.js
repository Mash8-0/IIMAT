const prisma = require('../config/db');
const slugify = require('../utils/slugify');
const { success, created, notFound, badRequest } = require('../utils/responseHandler');

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/programmes
const getAllProgrammes = async (req, res, next) => {
  try {
    const { level, search } = req.query;
    const where = { status: 'active' };
    if (level) where.level = level;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const programmes = await prisma.programme.findMany({
      where,
      include: { school: { select: { id: true, title: true, slug: true } } },
      orderBy: { title: 'asc' },
    });
    return success(res, programmes);
  } catch (err) {
    next(err);
  }
};

// GET /api/programmes/:slug
const getProgrammeBySlug = async (req, res, next) => {
  try {
    const programme = await prisma.programme.findUnique({
      where: { slug: req.params.slug },
      include: { school: { select: { id: true, title: true, slug: true } } },
    });
    if (!programme) return notFound(res, 'Programme not found');
    return success(res, programme);
  } catch (err) {
    next(err);
  }
};

// GET /api/programmes/school/:schoolSlug
const getProgrammesBySchool = async (req, res, next) => {
  try {
    const school = await prisma.school.findUnique({ where: { slug: req.params.schoolSlug } });
    if (!school) return notFound(res, 'School not found');

    const programmes = await prisma.programme.findMany({
      where: { schoolId: school.id, status: 'active' },
      orderBy: { title: 'asc' },
    });
    return success(res, { school, programmes });
  } catch (err) {
    next(err);
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

// GET /api/admin/programmes
const adminGetAllProgrammes = async (req, res, next) => {
  try {
    const { schoolId, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (schoolId) where.schoolId = schoolId;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [programmes, total] = await Promise.all([
      prisma.programme.findMany({
        where,
        include: { school: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.programme.count({ where }),
    ]);

    return success(res, programmes, 'Success', 200, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/programmes
const createProgramme = async (req, res, next) => {
  try {
    const { schoolId, title, level, duration, intake, tuitionFee, description, requirements, careerOpportunities, status } = req.body;

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) return badRequest(res, 'School not found');

    const slug = slugify(title);
    const existing = await prisma.programme.findUnique({ where: { slug } });
    if (existing) return badRequest(res, 'A programme with this title already exists');

    const image = req.file ? `/uploads/programmes/${req.file.filename}` : null;

    const programme = await prisma.programme.create({
      data: { schoolId, title, slug, level, duration, intake, tuitionFee, description, requirements, careerOpportunities, image, status: status || 'active' },
      include: { school: { select: { id: true, title: true } } },
    });
    return created(res, programme, 'Programme created successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/programmes/:id
const updateProgramme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.programme.findUnique({ where: { id } });
    if (!existing) return notFound(res, 'Programme not found');

    const { title, ...rest } = req.body;
    const slug = title ? slugify(title) : existing.slug;
    const image = req.file ? `/uploads/programmes/${req.file.filename}` : existing.image;

    const programme = await prisma.programme.update({
      where: { id },
      data: { title, slug, image, ...rest },
      include: { school: { select: { id: true, title: true } } },
    });
    return success(res, programme, 'Programme updated successfully');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/programmes/:id
const deleteProgramme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.programme.findUnique({ where: { id } });
    if (!existing) return notFound(res, 'Programme not found');

    await prisma.programme.delete({ where: { id } });
    return success(res, null, 'Programme deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProgrammes, getProgrammeBySlug, getProgrammesBySchool, adminGetAllProgrammes, createProgramme, updateProgramme, deleteProgramme };
