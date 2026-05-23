require('dotenv/config');

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function connect() {
  try {
    await pool.connect();
    // optional: test a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected');
  } catch (err) {
    console.warn('Database connection warning:', err.message);
  }
}

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    await pool.end();
  } finally {
    process.exit(0);
  }
});

module.exports = { prisma, pool, connect };
