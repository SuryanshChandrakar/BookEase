import {prisma} from "../config/database.js"

export async function getAll() {
    //inside prisma object you have all models access
    const user=await prisma.user.findMany();
    return user;
}