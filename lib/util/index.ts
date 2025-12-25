import { Prisma, PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query", "info", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;

export const prisma = prismaClient;
