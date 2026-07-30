
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from './env.js';

const adapter = new PrismaPg({
    connectionString: DATABASE_URL
});

// this is prisma object i.e prisma client object.
export const prisma = new PrismaClient({
    adapter
});


export async function connectDatabase() {
    try {
        await prisma.$connect(); 
        console.log('[Database]: Connected successfully');
    } catch (error) {
        console.error('[Database]: Failed to connect', error);
        process.exit(1);
    }
}