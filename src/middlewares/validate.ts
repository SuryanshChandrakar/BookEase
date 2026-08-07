import type{ NextFunction, Request, Response } from "express";
import type{ ZodSchema } from "zod";
import { badRequest } from "../utils/api-error.js";

//creating a brand new middle ware. req,res ,next


export const validate = (schema: ZodSchema) => 
    (req: Request, _res: Response, next: NextFunction) => {

        //
        const result = schema.safeParse(req.body); 

        if(!result.success) {
            throw badRequest('Validation failed', result.error.issues);
        }

        // if the validation passes
        req.body = result.data;

        //next fxn of this middleware is controller
        next(); // calling controller with the validated data

}