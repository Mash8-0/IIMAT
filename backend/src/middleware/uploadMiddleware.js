const { uploadSchoolImage, uploadProgrammeImage, uploadApplicationDocs } = require('../config/multer');

/**
 * Wrap multer callbacks to forward errors to Express error handler.
 */
const handleUpload = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = {
  uploadSchool: handleUpload(uploadSchoolImage),
  uploadProgramme: handleUpload(uploadProgrammeImage),
  uploadApplication: handleUpload(uploadApplicationDocs),
};
