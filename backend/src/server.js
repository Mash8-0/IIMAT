require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

// Change PORT in .env if needed (default: 5000)
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 IIMAT API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
