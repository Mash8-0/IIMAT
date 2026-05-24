const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const UPLOAD_DIRS = [
  'uploads/applications',
  'uploads/programmes',
  'uploads/schools',
];
UPLOAD_DIRS.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Allowed MIME types ──────────────────────────────────────────────────────
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  document: ['application/pdf', 'image/jpeg', 'image/png'],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ── Storage factory ─────────────────────────────────────────────────────────
const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, `uploads/${folder}`),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
    },
  });

// ── File filter factory ──────────────────────────────────────────────────────
const makeFilter = (types) => (_req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${types.join(', ')}`), false);
  }
};

// ── Exported uploaders ───────────────────────────────────────────────────────

// For school images
const uploadSchoolImage = multer({
  storage: makeStorage('schools'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: makeFilter(ALLOWED_TYPES.image),
}).single('image');

// For programme images
const uploadProgrammeImage = multer({
  storage: makeStorage('programmes'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: makeFilter(ALLOWED_TYPES.image),
}).single('image');

// For application documents — up to 6 files across named fields
const uploadApplicationDocs = multer({
  storage: makeStorage('applications'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: makeFilter(ALLOWED_TYPES.document),
}).fields([
  { name: 'passport', maxCount: 1 },
  { name: 'academic', maxCount: 3 },
  { name: 'photo', maxCount: 1 },
  { name: 'english_cert', maxCount: 1 },
  { name: 'other', maxCount: 3 },
]);

module.exports = { uploadSchoolImage, uploadProgrammeImage, uploadApplicationDocs };
