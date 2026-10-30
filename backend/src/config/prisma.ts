import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";
import { config } from "./env.js";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.env === "development" ? ["warn", "error"] : ["error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (config.env !== "production") {
  globalThis.prismaGlobal = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("PostgreSQL database connection established successfully.");
    return true;
  } catch (error) {
    logger.error("Failed to connect to PostgreSQL:", { error });
    return false;
  }
}

