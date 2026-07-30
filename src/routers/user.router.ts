import { Router } from "express";
import { findAllUsers } from "../controllers/user.controller.js";

export const userRouter:Router=Router();//router object
//in this userRouter you can configure your routes
//we will see router after /api/user 
//if there is nothing then we call the below fxn,
userRouter.get('/',findAllUsers);