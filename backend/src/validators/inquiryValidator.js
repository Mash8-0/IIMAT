const { z } = require('zod');

const inquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  interestedProgramme: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().optional(),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

module.exports = { validateInquiry: validate(inquirySchema) };
