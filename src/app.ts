import express, {type Express, type NextFunction} from 'express';
import { userRouter } from './routers/user.router.js';
//import type {Express} from 'express';
const app:Express=express();

function logRequest(req:Request,res:Response,next:NextFunction){
    console.log("URL:",req.url);
    console.log("Execute logRequest Middleware");
    next();
}

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());


//custom routes
app.get("/health",logRequest,(_req,res)=>{
    console.log("Execute health Route");
    res.json({
        status:'ok!',
        timeStamp: new Date().toISOString()
    })
});


//Express router based routes
app.use("/api/users",userRouter);//if the Route starts with /users, userRouter Will handle it.
export {app};