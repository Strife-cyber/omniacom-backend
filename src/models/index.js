import { PrismaClient } from "../generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL, isDevelopment } from "../config/env.js";

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: isDevelopment ? ["query", "info", "warn", "error"] : ["error"],
  });
}

export const prisma = createPrismaClient();
