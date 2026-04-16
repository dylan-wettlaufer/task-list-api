import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
// Local SQLite database used for this assignment.
const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db",
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["query"],
  });

// Prevent creating extra PrismaClient instances during hot reload in dev.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
