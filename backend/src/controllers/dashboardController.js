const prisma = require('../config/db');
const { success } = require('../utils/responseHandler');

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [
      totalSchools,
      totalProgrammes,
      totalInquiries,
      totalApplications,
      newInquiries,
      pendingApplications,
      admittedStudents,
      recentInquiries,
      recentApplications,
    ] = await Promise.all([
      prisma.school.count(),
      prisma.programme.count(),
      prisma.inquiry.count(),
      prisma.application.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.application.count({ where: { applicationStatus: { in: ['submitted', 'under_review'] } } }),
      prisma.application.count({ where: { applicationStatus: 'admitted' } }),
      prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, studentName: true, selectedProgramme: true, applicationStatus: true, createdAt: true },
      }),
    ]);

    return success(res, {
      summary: {
        totalSchools,
        totalProgrammes,
        totalInquiries,
        totalApplications,
        newInquiries,
        pendingApplications,
        admittedStudents,
      },
      recentInquiries,
      recentApplications,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
