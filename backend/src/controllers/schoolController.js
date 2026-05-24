const prisma = require('../config/db');
const slugify = require('../utils/slugify');
const { success, created, notFound, badRequest } = require('../utils/responseHandler');

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/schools
const getAllSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      where: { status: 'active' },
      include: { _count: { select: { programmes: true } } },
      orderBy: { title: 'asc' },
    });
    return success(res, schools);
  } catch (err) {
    next(err);
  }
};

// GET /api/schools/:slug
const getSchoolBySlug = async (req, res, next) => {
  try {
    const school = await prisma.school.findUnique({
      where: { slug: req.params.slug },
      include: {
        programmes: { where: { status: 'active' }, orderBy: { title: 'asc' } },
        _count: { select: { programmes: true } },
      },
    });
    if (!school) return notFound(res, 'School not found');
    return success(res, school);
  } catch (err) {
    next(err);
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

// GET /api/admin/schools (all, including inactive)
const adminGetAllSchools = async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      include: { _count: { select: { programmes: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, schools);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/schools
const createSchool = async (req, res, next) => {
  try {
    const { title, description, icon, status } = req.body;
    const slug = slugify(title);

    const existing = await prisma.school.findUnique({ where: { slug } });
    if (existing) return badRequest(res, 'A school with this title already exists');

    // File upload path from multer (if image was uploaded)
    const image = req.file ? `/uploads/schools/${req.file.filename}` : null;

    const school = await prisma.school.create({
      data: { title, slug, description, icon, image, status: status || 'active' },
    });
    return created(res, school, 'School created successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/schools/:id
const updateSchool = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, icon, status } = req.body;

    const existing = await prisma.school.findUnique({ where: { id } });
    if (!existing) return notFound(res, 'School not found');

    const slug = title ? slugify(title) : existing.slug;
    const image = req.file ? `/uploads/schools/${req.file.filename}` : existing.image;

    const school = await prisma.school.update({
      where: { id },
      data: { title, slug, description, icon, image, status },
    });
    return success(res, school, 'School updated successfully');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/schools/:id
const deleteSchool = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.school.findUnique({ where: { id } });
    if (!existing) return notFound(res, 'School not found');

    await prisma.school.delete({ where: { id } });
    return success(res, null, 'School deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSchools, getSchoolBySlug, adminGetAllSchools, createSchool, updateSchool, deleteSchool };
