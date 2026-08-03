import express, {type Express} from 'express';
import { userRouter } from './routers/user.router.js';
import { errorHandler } from './middlewares/error-handler.js';
//import type {Express} from 'express';
const app:Express=express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
app.get("/health",(_req,res)=>{
    res.json({
        status:'ok!',
        timeStamp: new Date().toISOString()
    })
});

app.use("/api/users",userRouter);//if the Route starts with /users, userRouter Will handle it.

//at the last we mention our error handling middleware
app.use(errorHandler);
export {app};