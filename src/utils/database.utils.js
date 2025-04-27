import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // singleton object of PrismaClient

export default prisma;
