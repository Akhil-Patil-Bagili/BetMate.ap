const prisma = require('./prismaClient');

async function truncateTables() {
  await prisma.$executeRaw`TRUNCATE TABLE "Match" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "MatchBetmate" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "FriendRequest" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "PastBetmate" RESTART IDENTITY CASCADE;`;
  console.log('Tables truncated');
  process.exit(0);
}

truncateTables();
