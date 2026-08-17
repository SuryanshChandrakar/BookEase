import { Connection, Client } from '@temporalio/client'; 
import { TEMPORAL_ADDRESS, TEMPORAL_NAMESPACE } from './env.js';


let client: Client | null = null;
//kind of sigleton //for getting temporal client accross our project 
//through out the server running We will create client object once if the client is created it will return the same object/client If not then only it will create 
export async function getTemporalClient() {
    if(client) return client;

    const connection = await Connection.connect({
        address: TEMPORAL_ADDRESS,
    });

    client = new Client({
        connection,
        namespace: TEMPORAL_NAMESPACE,
    });

    return client;
}

export async function disconnectTemporal() {
    if(client) {
        await client.connection.close();
        client = null;
    }
}