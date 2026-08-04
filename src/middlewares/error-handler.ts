import type {Request,Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { NODE_ENV } from "../config/env.js";
export function errorHandler(err:Error,req:Request,res:Response,next:NextFunction){
    //if this err is an instance of apiError then i will handle in more manual way;
    //if not i will just return a general error;
    if(err instanceof ApiError) {
    //preapre a body which i will return 
        const body: Record<string, unknown> = {
            success: false,//request sucede or not
            message: err.message,
        }

        if(err.details) body.details = err.details;//optional if yes attach it to body first then body to res obj
        res.status(err.statusCode).json(body);//attach json then this body
        return;
    }
     //show error in terminal;   
    console.error('[error]', err);

    const body: Record<string, unknown> = {
        success: false,
        message: "Something went wrong",
    }
//showing stack trace only if we are in dev mode or test mode  not in production.
    if(NODE_ENV === 'development') body.details = err.stack;//attach to body in details -> stack trace 
    res.status(500).json(body);

}