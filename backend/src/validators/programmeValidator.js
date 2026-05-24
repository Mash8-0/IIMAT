const { z } = require('zod');

const programmeSchema = z.object({
  schoolId: z.string().min(1, 'School ID is required'),
  title: z.string().min(2, 'Title is required'),
  level: z.string().min(1, 'Level is required'),
  duration: z.string().min(1, 'Duration is required'),
  intake: z.string().min(1, 'Intake is required'),
  tuitionFee: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  careerOpportunities: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
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

module.exports = { validateProgramme: validate(programmeSchema) };
