import {app} from './app.js';
import { connectDatabase } from './config/database.js';
import{PORT} from './config/env.js';
//import { getAll } from './repositories/user.repository.js';

async function startServer(){
    await connectDatabase();
    app.listen(PORT,async()=>{
        console.log(`[server]: Running on port ${PORT}`)
        // const user=await getAll();
        // console.log(user);
    });

}

//wheren port is already occupied→generate exception
startServer().catch((err)=>{
    console.error('[Server]: Failed to start',err);
    process.exit(1);
});