const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const generateToken = require('../utils/generateToken');
const { success, created, badRequest, unauthorized } = require('../utils/responseHandler');

// POST /api/auth/register
// Only super_admin can create new users (enforced at route level)
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest(res, 'Email already registered');

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'staff' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return created(res, user, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return unauthorized(res, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return unauthorized(res, 'Invalid email or password');

    const token = generateToken({ id: user.id, role: user.role });

    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
