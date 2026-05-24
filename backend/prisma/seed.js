// ─────────────────────────────────────────────────────────────────────────────
// Seed file — IIMAT College
// Run: node prisma/seed.js
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ── Default admin credentials ─────────────────────────────────────────────────
// Change these before deploying to production!
const ADMIN_EMAIL = 'admin@iimat.edu.my';
const ADMIN_PASSWORD = 'Admin@12345';
const ADMIN_NAME = 'IIMAT Super Admin';

// ── School seed data ──────────────────────────────────────────────────────────
const schools = [
  {
    title: 'School of Science & Technology',
    slug: 'school-of-science-and-technology',
    description: 'Offering cutting-edge programmes in computing, engineering, and applied sciences. Equip yourself with technical skills demanded by the modern industry.',
    icon: 'fa-microchip',
  },
  {
    title: 'School of Science & Economics',
    slug: 'school-of-science-and-economics',
    description: 'Bridging the gap between business and science. Our programmes prepare students for careers in finance, economics, and management.',
    icon: 'fa-chart-line',
  },
  {
    title: 'School of Health Science',
    slug: 'school-of-health-science',
    description: 'Train for a rewarding career in healthcare. Our MQA-accredited programmes cover nursing, pharmacy, and allied health disciplines.',
    icon: 'fa-heartbeat',
  },
  {
    title: 'School of Hospitality',
    slug: 'school-of-hospitality',
    description: 'Excel in tourism, hotel management, and culinary arts. Our industry-linked programmes open doors to global hospitality careers.',
    icon: 'fa-concierge-bell',
  },
  {
    title: 'Foundation of Health Science',
    slug: 'foundation-of-health-science',
    description: 'A solid foundation programme designed to prepare students for degree-level health science studies.',
    icon: 'fa-flask',
  },
  {
    title: 'Malaysia Skills Certificate (SKM)',
    slug: 'malaysia-skills-certificate-skm',
    description: 'Nationally recognised vocational qualifications under the Malaysian Skills Qualification Framework (MSKQF).',
    icon: 'fa-certificate',
  },
  {
    title: 'APEL-C (Accreditation of Prior Experiential Learning)',
    slug: 'apel-c',
    description: 'A pathway for working adults to gain entry into diploma or degree programmes based on their work experience and prior learning.',
    icon: 'fa-user-graduate',
  },
];

// ── Programme seed data ───────────────────────────────────────────────────────
const programmes = [
  // School of Science & Technology
  {
    schoolSlug: 'school-of-science-and-technology',
    title: 'Diploma in Information Technology',
    slug: 'diploma-in-information-technology',
    level: 'Diploma',
    duration: '2.5 Years',
    intake: 'March, July, November',
    tuitionFee: 'RM 18,000',
    description: 'A comprehensive diploma covering software development, networking, database management, and cybersecurity fundamentals.',
    requirements: 'SPM with minimum 3 credits including Mathematics and any Science subject.',
    careerOpportunities: 'Software Developer, IT Support Specialist, Network Administrator, Systems Analyst.',
  },
  {
    schoolSlug: 'school-of-science-and-technology',
    title: 'Diploma in Computer Science',
    slug: 'diploma-in-computer-science',
    level: 'Diploma',
    duration: '2.5 Years',
    intake: 'March, July, November',
    tuitionFee: 'RM 19,000',
    description: 'Covers programming, algorithms, data structures, artificial intelligence, and software engineering principles.',
    requirements: 'SPM with minimum 3 credits including Mathematics.',
    careerOpportunities: 'Programmer, Data Analyst, AI Developer, Software Engineer.',
  },
  // School of Health Science
  {
    schoolSlug: 'school-of-health-science',
    title: 'Diploma in Nursing',
    slug: 'diploma-in-nursing',
    level: 'Diploma',
    duration: '3 Years',
    intake: 'March, July',
    tuitionFee: 'RM 35,000',
    description: 'An MQA-accredited nursing programme providing clinical training, patient care, and healthcare management skills.',
    requirements: 'SPM with minimum 5 credits including Biology, Chemistry, and a Language.',
    careerOpportunities: 'Registered Nurse, Ward Manager, Community Health Nurse, Healthcare Coordinator.',
  },
  {
    schoolSlug: 'school-of-health-science',
    title: 'Diploma in Medical Laboratory Technology',
    slug: 'diploma-in-medical-laboratory-technology',
    level: 'Diploma',
    duration: '2.5 Years',
    intake: 'March, July',
    tuitionFee: 'RM 28,000',
    description: 'Trains students in laboratory procedures, diagnostics, and biomedical science techniques.',
    requirements: 'SPM with minimum 3 credits including Biology and Chemistry.',
    careerOpportunities: 'Medical Lab Technologist, Clinical Scientist, Pathology Assistant.',
  },
  // School of Hospitality
  {
    schoolSlug: 'school-of-hospitality',
    title: 'Diploma in Hotel Management',
    slug: 'diploma-in-hotel-management',
    level: 'Diploma',
    duration: '2.5 Years',
    intake: 'March, July, November',
    tuitionFee: 'RM 22,000',
    description: 'Covers hotel operations, food & beverage management, front office, and hospitality leadership.',
    requirements: 'SPM with minimum 3 credits.',
    careerOpportunities: 'Hotel Manager, Front Office Executive, F&B Manager, Events Coordinator.',
  },
  // School of Science & Economics
  {
    schoolSlug: 'school-of-science-and-economics',
    title: 'Diploma in Business Administration',
    slug: 'diploma-in-business-administration',
    level: 'Diploma',
    duration: '2.5 Years',
    intake: 'March, July, November',
    tuitionFee: 'RM 17,000',
    description: 'Provides core business skills in management, marketing, finance, and entrepreneurship.',
    requirements: 'SPM with minimum 3 credits.',
    careerOpportunities: 'Business Executive, Marketing Officer, Entrepreneur, HR Assistant.',
  },
  // Foundation
  {
    schoolSlug: 'foundation-of-health-science',
    title: 'Foundation in Health Science',
    slug: 'foundation-in-health-science',
    level: 'Foundation',
    duration: '1 Year',
    intake: 'March, July, November',
    tuitionFee: 'RM 12,000',
    description: 'A preparatory programme for SPM leavers intending to pursue diploma or degree programmes in health-related fields.',
    requirements: 'SPM with minimum 5 subjects passed, including Biology or Chemistry.',
    careerOpportunities: 'Pathway to Diploma in Nursing, Medical Lab Technology, Pharmacy, and more.',
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...');

  // Create super admin
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'super_admin',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create schools
  const schoolMap = {};
  for (const s of schools) {
    const school = await prisma.school.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, status: 'active' },
    });
    schoolMap[s.slug] = school.id;
    console.log(`✅ School: ${school.title}`);
  }

  // Create programmes
  for (const p of programmes) {
    const { schoolSlug, ...data } = p;
    const schoolId = schoolMap[schoolSlug];
    if (!schoolId) {
      console.warn(`⚠️  School not found for slug: ${schoolSlug}`);
      continue;
    }
    await prisma.programme.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, schoolId, status: 'active' },
    });
    console.log(`✅ Programme: ${data.title}`);
  }

  console.log('\n🎉 Seed completed!');
  console.log(`\n📋 Default Admin Login:`);
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
