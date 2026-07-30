import express, {type Express} from 'express';
import { userRouter } from './routers/user.router.js';
//import type {Express} from 'express';
const app:Express=express();

app.get("/health",(_req,res)=>{
    res.json({
        status:'ok!',
        timeStamp: new Date().toISOString()
    })
});

app.use("/api/users",userRouter);//if the Route starts with /users, userRouter Will handle it.
export {app};