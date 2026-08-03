import type {Request,Response, NextFunction } from "express";

export function errorHandler(err:Error,req:Request,res:Response,next:NextFunction){
    res.json({
        message:"something went wrong",
    })

}