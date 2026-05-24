/**
 * Convert a string to a URL-friendly slug.
 * e.g. "School of Health Science" → "school-of-health-science"
 */
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

module.exports = slugify;
