import {prisma} from "../config/database.js"

export async function getAll() {
    //inside prisma object you have all models access
    const user=await prisma.user.findMany();
    return user;
}

export async function getById(id:number){
    const user=await prisma.user.findUnique({
        where:{
            id
        }
    });
    return user;
}