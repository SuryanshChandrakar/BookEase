import type{ Request,Response } from "express";
import { findAllUsers as findAllUsersService,findById as findByIdService ,createUser as createUserService } from "../services/users.service.js";
import { sendSuccess } from "../utils/api-response.js";
export async function findAllUsers(_req:Request,res:Response){
    const response=await findAllUsersService();
    sendSuccess(res,response);
}
export async function findById(req:Request,res:Response){
    const {id}=req.params;//to access request params //req.query to acess query params ? ke baad vale// req.body
    const response=await findByIdService(Number(id)); 
    //res.json(response);
    sendSuccess(res,response);

}

export async function createUser(req: Request, res: Response) {
    const newUser = await createUserService(req.body);
    sendSuccess(res, newUser, 201, 'User created successfully');
}