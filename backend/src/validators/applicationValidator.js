const { z } = require('zod');

const applicationSchema = z.object({
  studentName: z.string().min(2, 'Student name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  passportNo: z.string().min(3, 'Passport number is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date of birth'),
  selectedProgramme: z.string().min(1, 'Please select a programme'),
  academicQualification: z.string().min(2, 'Academic qualification is required'),
  englishQualification: z.string().optional(),
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

module.exports = { validateApplication: validate(applicationSchema) };
