import { Router } from "express";
import { findAllUsers, findById } from "../controllers/user.controller.js";

export const userRouter:Router=Router();//router object
//in this userRouter you can configure your routes
//we will see router after /api/user 
//if there is nothing then we call the below fxn,
userRouter.get('/',findAllUsers);
userRouter.get('/:id',findById); 
//yaha se controllet and service dono ko call lag sakti hai
//but ham controller ko kerenge(in some project controller and routers could be merged).