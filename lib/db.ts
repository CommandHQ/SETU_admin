import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}
export const db = globalThis.prisma || new PrismaClient(); //This line is enough for production, but in development we need to follow these steps to prevent reimporting the Prisma client
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// lib/db.ts

// import { PrismaClient } from "@prisma/client";

// declare global {
//   // Prevent multiple instances of Prisma Client in development
//   // eslint-disable-next-line no-var
//   var db: PrismaClient | undefined;
// }

// export const db =
//   global.db ||
//   new PrismaClient({
//     log: ["query"],
//   });

// if (process.env.NODE_ENV !== "production") global.db = db;