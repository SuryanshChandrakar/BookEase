import express, {type Express} from 'express';

import { eventTypeRouter } from './routers/event-type.router.js';
import { publicEventRouter } from './routers/public-event.router.js';

import { userRouter } from './routers/user.router.js';
import { errorHandler } from './middlewares/error-handler.js';
import { routeNotFound } from './middlewares/route-not-found.js';

import { availabilityRouter } from './routers/availability.router.js';
//import { ApiError } from './utils/api-error.js';
//import type {Express} from 'express';
const app:Express=express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
app.get("/health",(_req,res)=>{
    //using utils class not fxn;
    //throw new ApiError(400,"Bad Request");
    res.json({
        status:'ok!',
        timeStamp: new Date().toISOString()
    })
});

app.use("/api/users",userRouter);//if the Route starts with /users, userRouter Will handle it.

app.use('/api/event-types', eventTypeRouter);
app.use('/api/public', publicEventRouter);

app.use('/api/availability', availabilityRouter);

//this is not error handling middle ware its normal one;
app.use(routeNotFound);

//at the last we mention our error handling middleware
app.use(errorHandler);//engaged so no default error handler will triger all error goes to our error handling middle ware.
export {app};