import { getAll, getById } from "../repositories/user.repository.js";
export async function findAllUsers(){
    const users= await getAll();
    return users;
}

export async function findById(id:number) {
    const user=await getById(id);
    if(!user){
        //error handling done latter
        throw new Error("user not found");
    }
    return user;

}