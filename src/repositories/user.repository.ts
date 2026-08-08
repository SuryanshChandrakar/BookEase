import {prisma} from "../config/database.js"
import type { CreateUserDto } from "../dtos/user.dto.js";



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


export async function findByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return user;
}

//it expects data of type createUserDto,this type is created using ZOD Schema prepated in DTO folder.
export async function create(data: CreateUserDto) {
    const user = await prisma.user.create({
        data
    });
    return user;
}