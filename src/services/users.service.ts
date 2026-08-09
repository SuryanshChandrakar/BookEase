import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import { create, findByEmail, getAll, getById, remove, update } from "../repositories/user.repository.js";
import { conflict, notFound } from "../utils/api-error.js";
export async function findAllUsers(){
    const users= await getAll();
    return users;
}

export async function findById(id:number) {
    const user=await getById(id);
    if(!user){
        //error handling done latter
        //throw new Error("user not found");//for stack trace
        throw notFound('User not found');//no stack trace becz of code (can configure.)
    }
    return user;

}


export async function createUser(data: CreateUserDto) {
    // Check if the user already exists or not 
    const existingUser = await findByEmail(data.email);
    if(existingUser) {
        throw conflict('User already exists');
    }

    return create(data);
}

export async function updateUser(id: number, data: UpdateUserDto) {
    const user = await getById(id);
    if (!user) {
        throw notFound('User not found');
    }

    if (data.email && data.email !== user.email) {
        const existingUser = await findByEmail(data.email);
        if (existingUser) {
            throw conflict('User already exists');
        }
    }

    return update(id, data);
}

export async function deleteUser(id: number) {
    const user = await getById(id);
    if (!user) {
        throw notFound('User not found');
    }

    return remove(id);
}