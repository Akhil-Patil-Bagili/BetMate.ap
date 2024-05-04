// src/prismaClient.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;



// async function deleteAllData() {
//   await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`; // Adjust "Match" with your actual table name
//   // Add similar statements for other tables if needed
// }

// module.exports = { prisma, deleteAllData };

