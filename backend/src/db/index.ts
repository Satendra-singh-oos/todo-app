import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log(` Db Connected `);
  } catch (error) {
    console.log("Unable To connect with db", error);
    process.exit(1);
  }
};

export default connectDb;
