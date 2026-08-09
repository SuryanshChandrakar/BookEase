import { Router } from "express";
import { createUser, deleteUser, findAllUsers, findById, updateUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../dtos/user.dto.js";

export const userRouter:Router=Router();//router object
//in this userRouter you can configure your routes
//we will see router after /api/user 
//if there is nothing then we call the below fxn,
userRouter.get('/',findAllUsers);
userRouter.get('/:id',findById); 
//yaha se controllet and service dono ko call lag sakti hai
//but ham controller ko kerenge(in some project controller and routers could be merged).
userRouter.post('/',validate(createUserSchema),createUser);
userRouter.patch('/:id', validate(updateUserSchema), updateUser);
userRouter.delete('/:id', deleteUser);